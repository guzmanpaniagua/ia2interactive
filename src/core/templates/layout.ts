import type { CourseConfig, Chapter } from '../../schemas/index.js';
import { escapeHtml } from './helpers.js';

export function layout(
  config: CourseConfig,
  title: string,
  bodyContent: string,
  chapters: Chapter[],
  activeSlug?: string,
): string {
  const sidebarItems = chapters
    .map((ch) => {
      let links = '';
      const isChapterActive = ch.slug === activeSlug;
      const isQuizActive = (ch.slug + '-quiz') === activeSlug;
      const isAnyActive = isChapterActive || isQuizActive;

      if (ch.contentHtml) {
        const cls = isChapterActive ? ' class="active"' : '';
        links += '<a href="' + ch.slug + '.html"' + cls + '>\u{1F4C4} ' + escapeHtml(ch.title) + '</a>';
      }
      if (ch.quiz) {
        const cls = isQuizActive ? ' class="active"' : '';
        links += '<a href="' + ch.slug + '-quiz.html"' + cls + '>\u{1F9E0} Quiz: ' + escapeHtml(ch.title) + '</a>';
      }
      if (!ch.contentHtml && !ch.quiz) {
        links = '<a href="' + ch.slug + '.html">' + escapeHtml(ch.title) + '</a>';
      }

      const liCls = isAnyActive ? ' class="current-chapter"' : '';
      return '<li data-chapter="' + ch.slug + '"' + liCls + '>' + links + '</li>';
    })
    .join('\n');

  const totalChapters = chapters.length;
  const lang = config.language || 'es';
  const pageTitle = escapeHtml(title) + ' \u2014 ' + escapeHtml(config.title);
  const courseTitle = escapeHtml(config.title);

  const lines = [
    '<!DOCTYPE html>',
    '<html lang="' + lang + '">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>' + pageTitle + '</title>',
    '  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">',
    '  <link rel="stylesheet" href="assets/styles.css">',
    '</head>',
    '<body>',
    '  <button class="mobile-menu-btn" aria-label="Abrir men\u00FA">\u2630</button>',
    '  <nav class="sidebar" id="sidebar">',
    '    <div class="sidebar-header">',
    '      <h2><a href="index.html">' + courseTitle + '</a></h2>',
    '      <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Cerrar men\u00FA">\u2715</button>',
    '    </div>',
    '    <ul class="sidebar-nav">',
    '      ' + sidebarItems,
    '    </ul>',
    '    <div class="sidebar-progress">',
    '      <div class="progress-bar"><div class="progress-fill" id="sidebar-progress-fill"></div></div>',
    '      <span class="progress-text" id="sidebar-progress-text">0 / ' + totalChapters + ' completados</span>',
    '    </div>',
    '  </nav>',
    '  <main class="content">',
    '    ' + bodyContent,
    '  </main>',
    '  <script src="assets/runtime.js"></script>',
    '</body>',
    '</html>',
  ];

  return lines.join('\n');
}