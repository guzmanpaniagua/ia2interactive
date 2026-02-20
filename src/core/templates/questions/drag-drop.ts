import type { DragAndDropQuestion } from '../../../schemas/index.js';
import { escapeHtml } from '../helpers.js';

export function renderDragDropQuestion(q: DragAndDropQuestion, index: number): string {
  const pairs = q.pairs || [];

  const concepts = pairs.map((p, i) =>
    '<div class="drag-concept" draggable="true" data-pair="' + i + '" role="listitem" aria-label="Arrastrar: ' + escapeHtml(p.concept) + '" tabindex="0">'
    + escapeHtml(p.concept)
    + '</div>'
  ).join('');

  const zones = pairs.map((p, i) =>
    '<div class="drop-zone" data-pair="' + i + '" role="listitem" aria-label="Soltar aquí para: ' + escapeHtml(p.definition) + '">'
    + '<span class="drop-text">' + escapeHtml(p.definition) + '</span>'
    + '<div class="drop-slot" aria-dropeffect="move"></div>'
    + '</div>'
  ).join('');

  return '<div class="question-card drag-card" data-index="' + index + '" data-type="drag-and-drop" data-answered="false" role="region" aria-label="Pregunta ' + q.number + '">'
    + '<div class="question-header">'
    + '<span class="question-badge badge-' + q.difficulty + '" aria-label="Dificultad: ' + q.difficulty + '">' + q.difficulty + '</span>'
    + '<span class="question-number">Pregunta ' + q.number + '</span>'
    + '</div>'
    + '<p class="question-prompt" id="prompt-' + index + '">' + escapeHtml(q.prompt) + '</p>'
    + '<div class="drag-container" aria-labelledby="prompt-' + index + '">'
    + '<div class="drag-concepts" role="list" aria-label="Conceptos para arrastrar">' + concepts + '</div>'
    + '<div class="drop-zones" role="list" aria-label="Zonas de destino">' + zones + '</div>'
    + '</div>'
    + '<button class="btn btn-check" onclick="checkDragAnswer(event, ' + index + ')" aria-label="Comprobar respuesta">Comprobar</button>'
    + (q.explanation ? '<div class="question-explanation" id="explanation-' + index + '" role="alert" aria-live="polite">' + escapeHtml(q.explanation) + '</div>' : '')
    + '</div>';
}
