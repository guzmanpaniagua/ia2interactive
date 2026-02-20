import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseCourseConfig, parseChapter } from '../src/core/parser.js';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ia2i-test-'));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('parseCourseConfig', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = createTempDir(); });
  afterEach(() => { cleanup(tmpDir); });

  it('parses course.yaml', () => {
    fs.writeFileSync(path.join(tmpDir, 'course.yaml'), `
title: Test Course
description: A test
author: Tester
language: es
chapters:
  - dir: 01-intro
    title: Intro
`);
    const config = parseCourseConfig(tmpDir);
    expect(config.title).toBe('Test Course');
    expect(config.description).toBe('A test');
    expect(config.author).toBe('Tester');
    expect(config.chapters).toHaveLength(1);
    expect(config.chapters[0].dir).toBe('01-intro');
  });

  it('parses course.yml', () => {
    fs.writeFileSync(path.join(tmpDir, 'course.yml'), `
title: YML Course
chapters:
  - dir: ch1
`);
    const config = parseCourseConfig(tmpDir);
    expect(config.title).toBe('YML Course');
  });

  it('auto-discovers chapters from chapters/ dir', () => {
    fs.mkdirSync(path.join(tmpDir, 'chapters', '01-first'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'chapters', '02-second'), { recursive: true });

    const config = parseCourseConfig(tmpDir);
    expect(config.chapters).toHaveLength(2);
    expect(config.chapters[0].dir).toBe('01-first');
    expect(config.chapters[1].dir).toBe('02-second');
  });

  it('uses directory name as title when no config', () => {
    fs.mkdirSync(path.join(tmpDir, 'chapters', '01-test'), { recursive: true });
    const config = parseCourseConfig(tmpDir);
    expect(config.title).toBe(path.basename(tmpDir));
  });

  it('parses sections format with quiz', () => {
    fs.writeFileSync(path.join(tmpDir, 'course.yaml'), `
title: Sections Course
sections:
  - id: intro
    title: Intro
    file: intro.md
  - id: intro-quiz
    title: Quiz Intro
    file: intro.quiz.md
    type: quiz
`);
    const config = parseCourseConfig(tmpDir);
    expect(config.chapters).toHaveLength(1);
    expect(config.chapters[0].dir).toBe('intro');
    expect(config.chapters[0].quizFile).toBe('intro.quiz.md');
  });

  it('parses sections with standalone quiz (no parent)', () => {
    fs.writeFileSync(path.join(tmpDir, 'course.yaml'), `
title: Quiz Only
sections:
  - id: standalone
    title: Standalone Quiz
    file: standalone.quiz.md
    type: quiz
`);
    const config = parseCourseConfig(tmpDir);
    expect(config.chapters).toHaveLength(1);
    expect(config.chapters[0].quizFile).toBe('standalone.quiz.md');
  });

  it('parses chapters as string array', () => {
    fs.writeFileSync(path.join(tmpDir, 'course.yaml'), `
title: String Chapters
chapters:
  - 01-intro
  - 02-basics
`);
    const config = parseCourseConfig(tmpDir);
    expect(config.chapters).toHaveLength(2);
    expect(config.chapters[0].dir).toBe('01-intro');
    expect(config.chapters[1].dir).toBe('02-basics');
  });

  it('auto-discovers from numbered dirs in root when no chapters/ dir', () => {
    fs.mkdirSync(path.join(tmpDir, '01-first'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, '02-second'), { recursive: true });

    const config = parseCourseConfig(tmpDir);
    expect(config.chapters).toHaveLength(2);
    expect(config.chapters[0].dir).toBe('01-first');
  });

  it('uses config data with auto-discover', () => {
    fs.writeFileSync(path.join(tmpDir, 'course.yaml'), `
title: My Course
description: A course
author: Me
language: en
chapters: []
`);
    fs.mkdirSync(path.join(tmpDir, 'chapters', '01-ch'), { recursive: true });

    const config = parseCourseConfig(tmpDir);
    expect(config.title).toBe('My Course');
    expect(config.description).toBe('A course');
    expect(config.author).toBe('Me');
    expect(config.language).toBe('en');
    expect(config.chapters).toHaveLength(1);
  });
});

describe('parseChapter', () => {
  let tmpDir: string;

  beforeEach(() => { tmpDir = createTempDir(); });
  afterEach(() => { cleanup(tmpDir); });

  it('parses chapter with content.md', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-intro');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Intro\n\nHello world');

    const chapter = parseChapter(tmpDir, { dir: '01-intro', title: 'Intro' });
    expect(chapter.slug).toBe('01-intro');
    expect(chapter.title).toBe('Intro');
    expect(chapter.contentHtml).toContain('<h1>Intro</h1>');
    expect(chapter.contentHtml).toContain('Hello world');
  });

  it('parses chapter with questions/', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-test');
    const qDir = path.join(chDir, 'questions');
    fs.mkdirSync(qDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Test');
    fs.writeFileSync(path.join(qDir, '01-q.md'), `type: single-choice
difficulty: easy

## ¿Test?

- [x] Sí
- [ ] No

> **Explicación:** Sí.`);

    const chapter = parseChapter(tmpDir, { dir: '01-test' });
    expect(chapter.quiz).not.toBeNull();
    expect(chapter.quiz!.questions).toHaveLength(1);
    expect(chapter.quiz!.questions[0].type).toBe('single-choice');
  });

  it('generates slug from dir name', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-My Chapter');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Test');

    const chapter = parseChapter(tmpDir, { dir: '01-My Chapter' });
    expect(chapter.slug).toBe('01-my-chapter');
  });

  it('derives title from dir when not provided', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-intro-to-iam');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Test');

    const chapter = parseChapter(tmpDir, { dir: '01-intro-to-iam' });
    expect(chapter.title).toBe('Intro to iam');
  });

  it('parses chapter from direct dir (not in chapters/)', () => {
    const chDir = path.join(tmpDir, '01-direct');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Direct');

    const chapter = parseChapter(tmpDir, { dir: '01-direct' });
    expect(chapter.contentHtml).toContain('Direct');
  });

  it('parses chapter from ref.file', () => {
    fs.writeFileSync(path.join(tmpDir, 'intro.md'), '# From File');

    const chapter = parseChapter(tmpDir, { dir: 'intro', file: 'intro.md' });
    expect(chapter.contentHtml).toContain('From File');
  });

  it('parses chapter from loose .md file', () => {
    fs.writeFileSync(path.join(tmpDir, '01-loose.md'), '# Loose');

    const chapter = parseChapter(tmpDir, { dir: '01-loose' });
    expect(chapter.contentHtml).toContain('Loose');
  });

  it('parses chapter with quiz.md', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-quizch');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# With Quiz');
    fs.writeFileSync(path.join(chDir, 'quiz.md'), `# Quiz: Test
engine_version: 1.0.0

## 1. Pregunta
type: single-choice
difficulty: easy

- [x] Sí
- [ ] No`);

    const chapter = parseChapter(tmpDir, { dir: '01-quizch' });
    expect(chapter.quiz).not.toBeNull();
    expect(chapter.quiz!.title).toBe('Test');
  });

  it('prefers questions/ dir over quiz.md', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-both');
    const qDir = path.join(chDir, 'questions');
    fs.mkdirSync(qDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Both');
    fs.writeFileSync(path.join(qDir, '01.md'), `type: single-choice
difficulty: easy

## Q1

- [x] A
- [ ] B`);
    fs.writeFileSync(path.join(chDir, 'quiz.md'), `# Quiz: Ignored

## 1. Ignored
type: single-choice
difficulty: easy

- [x] X`);

    const chapter = parseChapter(tmpDir, { dir: '01-both', title: 'Both' });
    expect(chapter.quiz).not.toBeNull();
    expect(chapter.quiz!.title).toBe('Quiz: Both');
  });

  it('derives title from quiz when no ref.title', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-notitle');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'quiz.md'), `# Quiz: Derived Title

## 1. Q
type: single-choice
difficulty: easy

- [x] A`);

    const chapter = parseChapter(tmpDir, { dir: '01-notitle' });
    expect(chapter.title).toBe('Derived Title');
  });

  it('returns empty content when no content.md', () => {
    const chDir = path.join(tmpDir, 'chapters', '01-nocontent');
    fs.mkdirSync(chDir, { recursive: true });

    const chapter = parseChapter(tmpDir, { dir: '01-nocontent' });
    expect(chapter.content).toBe('');
    expect(chapter.contentHtml).toBe('');
  });

  it('parses ref with quizFile', () => {
    fs.writeFileSync(path.join(tmpDir, 'myquiz.quiz.md'), `# Quiz: Ref Quiz

## 1. Q
type: single-choice
difficulty: easy

- [x] Yes`);

    const chapter = parseChapter(tmpDir, { dir: 'myref', file: 'myquiz.quiz.md', quizFile: 'myquiz.quiz.md' });
    expect(chapter.quiz).not.toBeNull();
  });
});
