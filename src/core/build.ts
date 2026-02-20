import fs from 'node:fs';
import path from 'node:path';
import type { BuildOptions, BuildResult, PageOutput, Chapter, CourseConfig, QuizData } from '../schemas/index.js';
import { parseCourseConfig, parseChapter } from './parser.js';
import { generateChapterPage, generateQuizPage } from './generator.js';
import { getStyles } from './templates/styles.js';
import { getRuntimeJs } from './templates/runtime.js';

export function build(options: BuildOptions): BuildResult {
  const { inputDir } = options;
  const outputDir = options.outputDir || path.join(process.cwd(), 'dist');
  const pages: PageOutput[] = [];
  const assets: string[] = [];
  const errors: string[] = [];

  // Clean and create output dir
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'assets'), { recursive: true });

  // Parse course config
  let config: CourseConfig;
  try {
    config = parseCourseConfig(inputDir);
  } catch (err) {
    errors.push(`Error parsing course config: ${(err as Error).message}`);
    return { outputDir, pages, assets, errors };
  }

  if (config.chapters.length === 0) {
    errors.push('No chapters found in course directory');
    return { outputDir, pages, assets, errors };
  }

  // Parse all chapters
  const chapters: Chapter[] = [];
  for (const ref of config.chapters) {
    try {
      const chapter = parseChapter(inputDir, ref);
      chapters.push(chapter);
    } catch (err) {
      errors.push(`Error parsing chapter "${ref.dir}": ${(err as Error).message}`);
    }
  }

  if (chapters.length === 0) {
    errors.push('No chapters could be parsed successfully');
    return { outputDir, pages, assets, errors };
  }

  // Write CSS
  const cssPath = path.join(outputDir, 'assets', 'styles.css');
  fs.writeFileSync(cssPath, getStyles());
  assets.push('assets/styles.css');

  // Write runtime JS
  const jsPath = path.join(outputDir, 'assets', 'runtime.js');
  fs.writeFileSync(jsPath, getRuntimeJs());
  assets.push('assets/runtime.js');

  // Write favicon
  const faviconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧠</text></svg>';
  fs.writeFileSync(path.join(outputDir, 'assets', 'favicon.svg'), faviconSvg);
  assets.push('assets/favicon.svg');

  // Generate index page — redirect to first chapter
  const firstChapter = chapters[0];
  const firstPage = firstChapter.contentHtml
    ? firstChapter.slug + '.html'
    : firstChapter.slug + '-quiz.html';
  const indexHtml = '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=' + firstPage + '"></head><body></body></html>';
  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
  pages.push({ filename: 'index.html', html: indexHtml });

  // Generate chapter and quiz pages
  for (const chapter of chapters) {
    if (chapter.contentHtml) {
      const contentHtml = generateChapterPage(chapter, chapters, config);
      fs.writeFileSync(path.join(outputDir, `${chapter.slug}.html`), contentHtml);
      pages.push({ filename: `${chapter.slug}.html`, html: contentHtml });
    }

    if (chapter.quiz) {
      const quizData: QuizData = {
        title: chapter.quiz.title,
        chapterSlug: chapter.slug,
        questions: chapter.quiz.questions,
      };
      const quizHtml = generateQuizPage(quizData, config, chapters);
      const quizPath = path.join(outputDir, `${chapter.slug}-quiz.html`);
      fs.writeFileSync(quizPath, quizHtml);
      pages.push({ filename: `${chapter.slug}-quiz.html`, html: quizHtml });
    }
  }

  // Copy assets directory if exists
  const assetsDir = path.join(inputDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    copyDir(assetsDir, path.join(outputDir, 'assets', 'content'), assets);
  }

  return { outputDir, pages, assets, errors };
}

function copyDir(src: string, dest: string, assets: string[]) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, assets);
    } else {
      fs.copyFileSync(srcPath, destPath);
      assets.push(path.relative(dest, destPath));
    }
  }
}
