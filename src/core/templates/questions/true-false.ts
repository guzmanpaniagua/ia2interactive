import type { TrueFalseQuestion } from '../../../schemas/index.js';
import { escapeHtml } from '../helpers.js';

export function renderTrueFalseQuestion(q: TrueFalseQuestion, index: number): string {
  const correctOption = q.options.find((o) => o.correct);
  const correctText = correctOption?.text || '';
  const correctValue = correctText.startsWith('Verdadero') ? 'Verdadero' : 'Falso';

  // Build buttons with full option text
  const buttonsHtml = q.options
    .map((o) => {
      const value = o.text.startsWith('Verdadero') ? 'Verdadero' : 'Falso';
      const icon = value === 'Verdadero' ? '\u2705' : '\u274C';
      return '<button class="tf-btn" data-value="' + value + '">'
        + icon + ' ' + escapeHtml(o.text)
        + '</button>';
    })
    .join('');

  return '<div class="question-card tf-card" data-index="' + index + '" data-type="true-false" data-answered="false">'
    + '<div class="question-header">'
    + '<span class="question-badge badge-' + q.difficulty + '">' + q.difficulty + '</span>'
    + '<span class="question-number">Pregunta ' + q.number + '</span>'
    + '</div>'
    + '<p class="question-prompt">' + escapeHtml(q.prompt) + '</p>'
    + '<div class="tf-options" data-correct="' + escapeHtml(correctValue) + '" onclick="checkTFAnswer(event, ' + index + ')">'
    + buttonsHtml
    + '</div>'
    + (q.explanation ? '<div class="question-explanation" id="explanation-' + index + '">' + escapeHtml(q.explanation) + '</div>' : '')
    + '</div>';
}
