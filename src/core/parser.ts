import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { CourseConfig, Chapter, ChapterRef } from '../schemas/index.js';
import { markdownToHtml } from './markdown.js';
import { parseQuizMarkdown, parseSingleQuestionMarkdown } from './quiz-parser.js';

export { parseQuizMarkdown } from './quiz-parser.js';

// ─── parseCourseConfig (sin cambios) ───

export function parseCourseConfig(inputDir: string): CourseConfig {
  const yamlPath = path.join(inputDir, 'course.yaml');
  const ymlPath = path.join(inputDir, 'course.yml');
  let configPath = yamlPath;
  if (!fs.existsSync(yamlPath)) {
    if (fs.existsSync(ymlPath)) {
      configPath = ymlPath;
    } else {
      return autoDiscoverCourse(inputDir);
    }
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  const data = yaml.load(raw) as Record<string, unknown>;

  const chapters: ChapterRef[] = [];

  if (Array.isArray(data.chapters)) {
    for (const ch of data.chapters) {
      if (typeof ch === 'string') {
        chapters.push({ dir: ch });
      } else if (ch && typeof ch === 'object' && 'dir' in ch) {
        chapters.push(ch as ChapterRef);
      }
    }
  }

  if (chapters.length === 0 && Array.isArray(data.sections)) {
    parseSections(data.sections as Array<{ id: string; title: string; file: string; type?: string }>, chapters);
  }

  if (chapters.length === 0) {
    return autoDiscoverCourse(inputDir, data);
  }

  return {
    title: (data.title as string) || path.basename(inputDir),
    description: data.description as string | undefined,
    author: data.author as string | undefined,
    language: (data.language as string) || 'es',
    theme: (data.theme as string) || 'default',
    chapters,
  };
}

function parseSections(
  sections: Array<{ id: string; title: string; file: string; type?: string }>,
  chapters: ChapterRef[],
): void {
  const contentSections: Array<{
    id: string;
    title: string;
    file: string;
    quizFile?: string;
  }> = [];

  for (const section of sections) {
    if (section.type === 'quiz') {
      const quizFileBase = section.file.replace('.quiz.md', '');
      const parent = contentSections.find(
        (cs) => cs.file === quizFileBase + '.md' || cs.file === quizFileBase,
      );
      if (parent) {
        parent.quizFile = section.file;
      } else {
        contentSections.push({
          id: section.id,
          title: section.title,
          file: section.file,
          quizFile: section.file,
        });
      }
    } else {
      contentSections.push({
        id: section.id,
        title: section.title,
        file: section.file,
      });
    }
  }

  for (const cs of contentSections) {
    chapters.push({
      dir: cs.id,
      title: cs.title,
      file: cs.file,
      quizFile: cs.quizFile,
    });
  }
}

function autoDiscoverCourse(inputDir: string, data?: Record<string, unknown>): CourseConfig {
  const chapters: ChapterRef[] = [];

  const chaptersDir = path.join(inputDir, 'chapters');
  if (fs.existsSync(chaptersDir) && fs.statSync(chaptersDir).isDirectory()) {
    const dirs = fs.readdirSync(chaptersDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const d of dirs) {
      chapters.push({ dir: d.name });
    }
  }

  if (chapters.length === 0) {
    const entries = fs.readdirSync(inputDir, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory() && /^\d+/.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const d of dirs) {
      chapters.push({ dir: d.name });
    }
  }

  return {
    title: (data?.title as string) || path.basename(inputDir),
    description: data?.description as string | undefined,
    author: data?.author as string | undefined,
    language: (data?.language as string) || 'es',
    theme: (data?.theme as string) || 'default',
    chapters,
  };
}

// ─── Resolución de rutas ───

interface ChapterPaths {
  contentPath: string | null;
  questionsDir: string | null;
  quizPath: string | null;
}

function fileIfExists(p: string): string | null {
  return fs.existsSync(p) ? p : null;
}

function dirIfExists(p: string): string | null {
  return fs.existsSync(p) && fs.statSync(p).isDirectory() ? p : null;
}

function resolveChapterPaths(inputDir: string, ref: ChapterRef): ChapterPaths {
  // Estrategia 1: chapters/{dir}/
  const chaptersSubdir = path.join(inputDir, 'chapters', ref.dir);
  if (dirIfExists(chaptersSubdir)) {
    return {
      contentPath: fileIfExists(path.join(chaptersSubdir, 'content.md')),
      questionsDir: dirIfExists(path.join(chaptersSubdir, 'questions')),
      quizPath: fileIfExists(path.join(chaptersSubdir, 'quiz.md')),
    };
  }

  // Estrategia 2: {dir}/ directo
  const directDir = path.join(inputDir, ref.dir);
  if (dirIfExists(directDir)) {
    return {
      contentPath: fileIfExists(path.join(directDir, 'content.md')),
      questionsDir: dirIfExists(path.join(directDir, 'questions')),
      quizPath: fileIfExists(path.join(directDir, 'quiz.md')),
    };
  }

  // Estrategia 3: ref.file apunta a un .md suelto
  if (ref.file) {
    const quizFile = ref.quizFile || ref.file.replace('.md', '.quiz.md');
    return {
      contentPath: ref.file.endsWith('.quiz.md') ? null : fileIfExists(path.join(inputDir, ref.file)),
      questionsDir: null,
      quizPath: fileIfExists(path.join(inputDir, quizFile)),
    };
  }

  // Estrategia 4: {dir}.md suelto
  return {
    contentPath: fileIfExists(path.join(inputDir, ref.dir + '.md')),
    questionsDir: null,
    quizPath: fileIfExists(path.join(inputDir, ref.dir + '.quiz.md')),
  };
}

// ─── parseChapter ───

function readContent(contentPath: string | null): { content: string; contentHtml: string } {
  if (!contentPath) return { content: '', contentHtml: '' };
  const content = fs.readFileSync(contentPath, 'utf-8');
  return { content, contentHtml: markdownToHtml(content) };
}

function readQuestions(questionsDir: string | null, chapterTitle?: string) {
  if (!questionsDir) return null;
  const files = fs.readdirSync(questionsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
  if (files.length === 0) return null;

  const questions = files.map((f, i) => {
    const raw = fs.readFileSync(path.join(questionsDir, f), 'utf-8');
    return parseSingleQuestionMarkdown(raw, i + 1);
  });

  return {
    title: chapterTitle ? 'Quiz: ' + chapterTitle : 'Quiz',
    engineVersion: '1.0.0',
    questions,
  };
}

function readQuiz(quizPath: string | null) {
  if (!quizPath) return null;
  return parseQuizMarkdown(fs.readFileSync(quizPath, 'utf-8'));
}

function deriveTitle(ref: ChapterRef, quiz: { title: string } | null): string {
  if (ref.title) return ref.title;
  if (quiz) return quiz.title;
  const raw = ref.dir.replace(/^\d+-?/, '').replace(/-/g, ' ') || ref.dir;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function parseChapter(inputDir: string, ref: ChapterRef): Chapter {
  const slug = ref.dir.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const paths = resolveChapterPaths(inputDir, ref);

  const { content, contentHtml } = readContent(paths.contentPath);
  const quiz = readQuestions(paths.questionsDir, ref.title) || readQuiz(paths.quizPath);
  const title = deriveTitle(ref, quiz);

  return { dir: ref.dir, slug, title, content, contentHtml, quiz };
}
