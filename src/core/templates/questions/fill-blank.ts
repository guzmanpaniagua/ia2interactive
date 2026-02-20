import type { FillInTheBlankQuestion } from '../../../schemas/index.js';
import { escapeHtml } from '../helpers.js';

export function renderFillBlankQuestion(q: FillInTheBlankQuestion, index: number): string {
  const answer = q.answer || '';

  return '<div class="question-card fill-card" data-index="' + index + '" data-type="fill-in-the-blank" data-answered="false" role="region" aria-label="Pregunta ' + q.number + '">'
    + '<div class="question-header">'
    + '<span class="question-badge badge-' + q.difficulty + '" aria-label="Dificultad: ' + q.difficulty + '">' + q.difficulty + '</span>'
    + '<span class="question-number">Pregunta ' + q.number + '</span>'
    + '</div>'
    + '<p class="question-prompt" id="prompt-' + index + '">' + escapeHtml(q.prompt) + '</p>'
    + '<div class="fill-input-group" role="form" aria-labelledby="prompt-' + index + '">'
    + '<input type="text" class="fill-input" data-correct="' + escapeHtml(answer) + '" placeholder="Escribe tu respuesta..." aria-label="Tu respuesta" />'
    + '<button class="btn btn-check" onclick="checkFillAnswer(this, ' + index + ')" aria-label="Comprobar respuesta">Comprobar</button>'
    + '</div>'
    + '<div class="fill-feedback" id="fill-feedback-' + index + '" role="alert" aria-live="assertive"></div>'
    + (q.explanation ? '<div class="question-explanation" id="explanation-' + index + '" role="alert" aria-live="polite">' + escapeHtml(q.explanation) + '</div>' : '')
    + '</div>';
}
