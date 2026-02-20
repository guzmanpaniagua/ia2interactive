import { describe, it, expect } from 'vitest';
import { generateChapterPage } from '../src/core/templates/chapter-page.js';
import type { Chapter, CourseConfig } from '../src/schemas/index.js';

const config: CourseConfig = {
  title: 'Test Course',
  description: 'Desc',
  author: 'Author',
  language: 'es',
  chapters: [],
};

describe('generateChapterPage', () => {
  it('renders chapter content', () => {
    const chapter: Chapter = {
      dir: '01-intro',
      slug: '01-intro',
      title: 'Intro',
      content: '# Hello\n\nWorld',
      contentHtml: '<h1>Hello</h1><p>World</p>',
      quiz: null,
    };
    const html = generateChapterPage(chapter, [], config);
    expect(html).toContain('<h1>Hello</h1>');
    expect(html).toContain('World');
    expect(html).toContain('Intro');
  });

  it('renders quiz link when quiz exists', () => {
    const chapter: Chapter = {
      dir: '01-ch',
      slug: '01-ch',
      title: 'Chapter',
      content: 'Content',
      contentHtml: '<p>Content</p>',
      quiz: { title: 'Quiz', engineVersion: '1.0.0', questions: [] },
    };
    const html = generateChapterPage(chapter, [], config);
    expect(html).toContain('01-ch-quiz.html');
  });

  it('renders no quiz link when quiz is null', () => {
    const chapter: Chapter = {
      dir: '01-ch',
      slug: '01-ch',
      title: 'Chapter',
      content: 'Content',
      contentHtml: '<p>Content</p>',
      quiz: null,
    };
    const html = generateChapterPage(chapter, [], config);
    expect(html).not.toContain('-quiz.html');
  });

  it('renders sidebar with chapters', () => {
    const chapters: Chapter[] = [
      { dir: '01-a', slug: '01-a', title: 'A', content: 'A', contentHtml: '<p>A</p>', quiz: null },
      { dir: '02-b', slug: '02-b', title: 'B', content: 'B', contentHtml: '<p>B</p>', quiz: null },
    ];
    const chapter = chapters[0];
    const html = generateChapterPage(chapter, chapters, config);
    expect(html).toContain('01-a');
    expect(html).toContain('02-b');
  });

  it('renders prev/next navigation', () => {
    const chapters: Chapter[] = [
      { dir: '01-a', slug: '01-a', title: 'A', content: 'A', contentHtml: '<p>A</p>', quiz: null },
      { dir: '02-b', slug: '02-b', title: 'B', content: 'B', contentHtml: '<p>B</p>', quiz: null },
      { dir: '03-c', slug: '03-c', title: 'C', content: 'C', contentHtml: '<p>C</p>', quiz: null },
    ];
    const html = generateChapterPage(chapters[1], chapters, config);
    expect(html).toContain('01-a.html');
    expect(html).toContain('03-c.html');
  });
});
