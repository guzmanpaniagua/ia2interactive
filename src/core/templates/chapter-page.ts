import type { CourseConfig, Chapter } from '../../schemas/index.js';
import { escapeHtml } from './helpers.js';
import { layout } from './layout.js';

export function generateChapterPage(chapter: Chapter, allChapters: Chapter[], config: CourseConfig): string {
  const idx = allChapters.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? allChapters[idx - 1] : null;
  const next = idx < allChapters.length - 1 ? allChapters[idx + 1] : null;

  let nav = '<nav class="chapter-nav">';
  if (prev) {
    const prevHref = prev.contentHtml ? prev.slug + '.html' : prev.slug + '-quiz.html';
    nav += '<a href="' + prevHref + '" class="btn btn-secondary">\u2190 ' + escapeHtml(prev.title) + '</a>';
  } else {
    nav += '<span></span>';
  }
  if (chapter.quiz) {
    nav += '<a href="' + chapter.slug + '-quiz.html" class="btn btn-primary">\u{1F9E0} Quiz</a>';
  }
  if (next) {
    const nextHref = next.contentHtml ? next.slug + '.html' : next.slug + '-quiz.html';
    nav += '<a href="' + nextHref + '" class="btn btn-secondary">' + escapeHtml(next.title) + ' \u2192</a>';
  } else {
    nav += '<span></span>';
  }
  nav += '</nav>';

  let quizCta = '';
  if (chapter.quiz) {
    const qCount = chapter.quiz.questions.length;
    quizCta = '<div class="quiz-cta">'
      + '<div class="quiz-cta-content">'
      + '<span class="quiz-cta-icon">\u{1F9E0}</span>'
      + '<div>'
      + '<strong>\u00BFListo para poner a prueba lo aprendido?</strong>'
      + '<p>' + qCount + ' preguntas sobre este cap\u00EDtulo</p>'
      + '</div>'
      + '</div>'
      + '<a href="' + chapter.slug + '-quiz.html" class="btn btn-primary">Empezar quiz \u2192</a>'
      + '</div>';
  }

  const bodyContent = '<article class="chapter-content">'
    + (chapter.contentHtml || chapter.content)
    + '</article>'
    + quizCta
    + nav;

  return layout(config, chapter.title, bodyContent, allChapters, chapter.slug);
}
