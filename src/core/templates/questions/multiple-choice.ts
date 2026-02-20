import type { SingleChoiceQuestion, MultipleChoiceQuestion } from '../../../schemas/index.js';
import { escapeHtml } from '../helpers.js';

export function renderMultipleChoiceQuestion(q: SingleChoiceQuestion | MultipleChoiceQuestion, index: number): string {
  const isMultiple = q.type === 'multiple-choice';
  const inputType = isMultiple ? 'checkbox' : 'radio';

  const optionsHtml = q.options
    .map(
      (o, i) => '<label class="option-label" data-correct="' + o.correct + '" data-index="' + i + '"'
        + (isMultiple ? '' : ' onclick="checkMCAnswer(event, ' + index + ')"')
        + '>'
        + '<input type="' + inputType + '" class="option-input" name="q' + index + '" value="' + i + '" />'
        + '<span class="option-text">' + escapeHtml(o.text) + '</span>'
        + '<span class="option-icon"></span>'
        + '</label>'
    )
    .join('');

  const checkBtn = isMultiple
    ? '<button class="btn btn-check" onclick="checkMultipleChoice(' + index + ')">Comprobar</button>'
    : '';

  return '<div class="question-card mc-card" data-index="' + index + '" data-type="' + q.type + '" data-answered="false">'
    + '<div class="question-header">'
    + '<span class="question-badge badge-' + q.difficulty + '">' + q.difficulty + '</span>'
    + '<span class="question-number">Pregunta ' + q.number + '</span>'
    + '</div>'
    + '<p class="question-prompt">' + escapeHtml(q.prompt) + '</p>'
    + '<div class="options-group">'
    + optionsHtml
    + '</div>'
    + checkBtn
    + (q.explanation ? '<div class="question-explanation" id="explanation-' + index + '">' + escapeHtml(q.explanation) + '</div>' : '')
    + '</div>';
}
