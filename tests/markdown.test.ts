import { describe, it, expect } from 'vitest';
import { markdownToHtml } from '../src/core/markdown.js';

describe('markdownToHtml', () => {
  it('converts headings', () => {
    const html = markdownToHtml('# Hello');
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('converts paragraphs', () => {
    const html = markdownToHtml('Some text');
    expect(html).toContain('<p>Some text</p>');
  });

  it('converts bold text', () => {
    const html = markdownToHtml('**bold**');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('converts inline code', () => {
    const html = markdownToHtml('Use `npm install`');
    expect(html).toContain('<code>npm install</code>');
  });

  it('converts unordered lists', () => {
    const html = markdownToHtml('- item 1\n- item 2');
    expect(html).toContain('<li>item 1</li>');
    expect(html).toContain('<li>item 2</li>');
  });

  it('converts code blocks', () => {
    const html = markdownToHtml('```js\nconsole.log("hi");\n```');
    expect(html).toContain('<code');
    expect(html).toContain('console.log');
  });

  it('converts tables', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |';
    const html = markdownToHtml(md);
    expect(html).toContain('<table>');
    expect(html).toContain('<td>1</td>');
  });

  it('converts blockquotes', () => {
    const html = markdownToHtml('> Important note');
    expect(html).toContain('<blockquote>');
    expect(html).toContain('Important note');
  });

  it('converts links', () => {
    const html = markdownToHtml('[click](https://example.com)');
    expect(html).toContain('<a href="https://example.com">click</a>');
  });
});
