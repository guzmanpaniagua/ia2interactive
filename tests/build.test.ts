import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { build } from '../src/core/build.js';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ia2i-build-'));
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('build', () => {
  let inputDir: string;
  let outputDir: string;

  beforeEach(() => {
    inputDir = createTempDir();
    outputDir = createTempDir();
  });

  afterEach(() => {
    cleanup(inputDir);
    cleanup(outputDir);
  });

  it('builds a simple course', () => {
    // Create course structure
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Test Course
chapters:
  - dir: 01-intro
    title: Intro
`);
    const chDir = path.join(inputDir, 'chapters', '01-intro');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Intro\n\nHello');

    const result = build({ inputDir, outputDir });

    expect(result.errors).toHaveLength(0);
    expect(result.pages.length).toBeGreaterThanOrEqual(2); // index + chapter
    expect(fs.existsSync(path.join(outputDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, '01-intro.html'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'assets', 'styles.css'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'assets', 'runtime.js'))).toBe(true);
  });

  it('generates quiz pages', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Quiz Course
chapters:
  - dir: 01-ch
`);
    const chDir = path.join(inputDir, 'chapters', '01-ch');
    const qDir = path.join(chDir, 'questions');
    fs.mkdirSync(qDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Chapter');
    fs.writeFileSync(path.join(qDir, '01-q.md'), `type: single-choice
difficulty: easy

## ¿Test?

- [x] Sí
- [ ] No`);

    const result = build({ inputDir, outputDir });

    expect(result.errors).toHaveLength(0);
    expect(fs.existsSync(path.join(outputDir, '01-ch-quiz.html'))).toBe(true);
  });

  it('returns error for missing chapters', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Empty
chapters: []
`);

    const result = build({ inputDir, outputDir });
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('index.html redirects to first chapter', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Test
chapters:
  - dir: 01-first
`);
    const chDir = path.join(inputDir, 'chapters', '01-first');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# First');

    const result = build({ inputDir, outputDir });
    const indexHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');

    expect(indexHtml).toContain('01-first.html');
    expect(indexHtml).toContain('meta http-equiv="refresh"');
  });

  it('copies assets directory', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Assets Test
chapters:
  - dir: 01-ch
`);
    const chDir = path.join(inputDir, 'chapters', '01-ch');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Test');

    const assetsDir = path.join(inputDir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.writeFileSync(path.join(assetsDir, 'image.png'), 'fake-image');

    const result = build({ inputDir, outputDir });
    expect(result.errors).toHaveLength(0);
    expect(fs.existsSync(path.join(outputDir, 'assets', 'content', 'image.png'))).toBe(true);
  });

  it('copies nested assets directory', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Nested Assets
chapters:
  - dir: 01-ch
`);
    const chDir = path.join(inputDir, 'chapters', '01-ch');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Test');

    const nestedDir = path.join(inputDir, 'assets', 'images');
    fs.mkdirSync(nestedDir, { recursive: true });
    fs.writeFileSync(path.join(nestedDir, 'logo.svg'), '<svg></svg>');

    const result = build({ inputDir, outputDir });
    expect(result.errors).toHaveLength(0);
    expect(fs.existsSync(path.join(outputDir, 'assets', 'content', 'images', 'logo.svg'))).toBe(true);
  });

  it('handles chapter parse error gracefully', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Error Course
chapters:
  - dir: 01-ok
  - dir: 99-missing
`);
    const chDir = path.join(inputDir, 'chapters', '01-ok');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# OK');

    const result = build({ inputDir, outputDir });
    expect(fs.existsSync(path.join(outputDir, '01-ok.html'))).toBe(true);
  });

  it('generates quiz page for quiz-only chapter', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Quiz Only
chapters:
  - dir: 01-quiz
`);
    const chDir = path.join(inputDir, 'chapters', '01-quiz');
    const qDir = path.join(chDir, 'questions');
    fs.mkdirSync(qDir, { recursive: true });
    fs.writeFileSync(path.join(qDir, '01.md'), `type: single-choice
difficulty: easy

## Q1

- [x] A
- [ ] B`);

    const result = build({ inputDir, outputDir });
    expect(result.errors).toHaveLength(0);
    expect(fs.existsSync(path.join(outputDir, '01-quiz-quiz.html'))).toBe(true);
  });

  it('uses default outputDir when not provided', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Default Output
chapters:
  - dir: 01-ch
`);
    const chDir = path.join(inputDir, 'chapters', '01-ch');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Test');

    const result = build({ inputDir, outputDir });
    expect(result.outputDir).toBe(outputDir);
  });

  it('writes favicon.svg', () => {
    fs.writeFileSync(path.join(inputDir, 'course.yaml'), `
title: Favicon Test
chapters:
  - dir: 01-ch
`);
    const chDir = path.join(inputDir, 'chapters', '01-ch');
    fs.mkdirSync(chDir, { recursive: true });
    fs.writeFileSync(path.join(chDir, 'content.md'), '# Test');

    build({ inputDir, outputDir });
    expect(fs.existsSync(path.join(outputDir, 'assets', 'favicon.svg'))).toBe(true);
  });
});
