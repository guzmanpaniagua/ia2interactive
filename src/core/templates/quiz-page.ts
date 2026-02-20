import type { Question, QuizData, CourseConfig, Chapter } from '../../schemas/index.js';
import { renderMultipleChoiceQuestion } from './questions/multiple-choice.js';
import { renderTrueFalseQuestion } from './questions/true-false.js';
import { renderFillBlankQuestion } from './questions/fill-blank.js';
import { renderDragDropQuestion } from './questions/drag-drop.js';
import { renderFlashcardQuestion } from './questions/flashcard.js';
import { escapeHtml } from './helpers.js';
import { layout } from './layout.js';

function renderQuestionInner(q: Question, index: number): string {
  switch (q.type) {
    case 'single-choice':
    case 'multiple-choice':
      return renderMultipleChoiceQuestion(q, index);
    case 'true-false':
      return renderTrueFalseQuestion(q, index);
    case 'fill-in-the-blank':
      return renderFillBlankQuestion(q, index);
    case 'drag-and-drop':
      return renderDragDropQuestion(q, index);
    case 'flashcard':
      return renderFlashcardQuestion(q, index);
    default:
      return '<div class="question-card">Tipo no soportado</div>';
  }
}

function renderQuestion(q: Question, index: number, total: number): string {
  var inner = renderQuestionInner(q, index);
  var btnLabel = index < total - 1 ? 'Siguiente \u2192' : 'Ver resultados';

  return '<div class="question-step" data-step="' + index + '">'
    + inner
    + '<div class="question-nav">'
    + '<button class="btn-next" onclick="goToNext(' + index + ')">' + btnLabel + '</button>'
    + '</div>'
    + '</div>';
}

export function generateQuizPage(quiz: QuizData, config: CourseConfig, allChapters?: Chapter[]): string {
  const total = quiz.questions.length;
  const questionsHtml = quiz.questions.map(function(q, i) { return renderQuestion(q, i, total); }).join('\n');
  const chapters = allChapters || [];

  // Find next chapter for results
  const chapterIdx = chapters.findIndex(function(c) { return c.slug === quiz.chapterSlug; });
  const nextChapter = chapterIdx >= 0 && chapterIdx < chapters.length - 1 ? chapters[chapterIdx + 1] : null;
  const nextLink = nextChapter
    ? '<a href="' + (nextChapter.contentHtml ? nextChapter.slug + '.html' : nextChapter.slug + '-quiz.html') + '" class="btn btn-primary">Siguiente cap\u00EDtulo \u2192</a>'
    : '';

  const bodyContent = '<div class="quiz-container">'
    + '<h1 class="quiz-title">' + escapeHtml(quiz.title) + '</h1>'
    + '<div class="score-bar" role="navigation" aria-label="Progreso del quiz">'
    + '<span id="score-display" aria-live="polite">Pregunta 1 de ' + total + '</span>'
    + '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Progreso"><div class="progress-fill" id="quiz-progress-fill"></div></div>'
    + '</div>'
    + '<div class="questions-list" data-total="' + total + '" data-slug="' + quiz.chapterSlug + '">'
    + questionsHtml
    + '</div>'
    + '<div class="quiz-results" id="quiz-results" aria-hidden="true" role="region" aria-label="Resultados del quiz">'
    + '<h2>\u{1F3C6} Quiz completado</h2>'
    + '<div class="results-score" id="results-score" aria-live="polite"></div>'
    + '<p class="results-message" id="results-message" aria-live="polite"></p>'
    + '<div class="results-actions">'
    + '<button class="btn btn-secondary" onclick="location.reload()" aria-label="Repetir quiz">\u{1F504} Repetir quiz</button>'
    + '<a href="' + quiz.chapterSlug + '.html" class="btn btn-secondary" aria-label="Volver al cap\u00EDtulo">\u2190 Volver al cap\u00EDtulo</a>'
    + nextLink
    + '</div>'
    + '</div>'
    + '</div>';

  return layout(config, 'Quiz: ' + quiz.title, bodyContent, chapters, quiz.chapterSlug + '-quiz');
}
