import type { FlashcardQuestion } from '../../../schemas/index.js';
import { escapeHtml } from '../helpers.js';

export function renderFlashcardQuestion(q: FlashcardQuestion, index: number): string {
  const answer = q.options.find((o) => o.correct)?.text || q.explanation || '';

  return '<div class="question-card flashcard-card" data-index="' + index + '" data-type="flashcard" data-answered="false" role="region" aria-label="Pregunta ' + q.number + '">'
    + '<div class="question-header">'
    + '<span class="question-badge badge-' + q.difficulty + '" aria-label="Dificultad: ' + q.difficulty + '">' + q.difficulty + '</span>'
    + '<span class="question-number">Pregunta ' + q.number + '</span>'
    + '</div>'
    + '<p class="question-prompt" style="display:none">' + escapeHtml(q.prompt) + '</p>'
    + '<div class="flashcard" data-flipped="false" role="button" tabindex="0" aria-label="Tarjeta: ' + escapeHtml(q.prompt) + '. Pulsa para voltear.">'
    + '<div class="flashcard-inner">'
    + '<div class="flashcard-front" aria-hidden="false">'
    + '<p>' + escapeHtml(q.prompt) + '</p>'
    + '<span class="flashcard-hint" aria-hidden="true">Toca para voltear</span>'
    + '</div>'
    + '<div class="flashcard-back" aria-hidden="true">'
    + '<p>' + escapeHtml(answer) + '</p>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '<div class="flashcard-buttons" style="display:none" role="group" aria-label="¿Sabías la respuesta?">'
    + '<button class="btn btn-false" data-knew="false" aria-label="No lo sabía">No lo sab\u00EDa</button>'
    + '<button class="btn btn-true" data-knew="true" aria-label="Lo sabía">Lo sab\u00EDa</button>'
    + '</div>'
    + (q.explanation ? '<div class="question-explanation" id="explanation-' + index + '" role="alert" aria-live="polite">' + escapeHtml(q.explanation) + '</div>' : '')
    + '</div>';
}
