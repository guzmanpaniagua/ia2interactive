export function getFillHandlerJs(): string {
  return `
  function normalizeAnswer(str) {
    return (str || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
      .replace(/ +/g, ' ');
  }

  window.checkFillAnswer = function(button, idx) {
    var card = document.querySelector('.question-card[data-index="' + idx + '"]');
    if (!card || card.dataset.answered === 'true') return;
    var input = card.querySelector('.fill-input');
    var correct = input.dataset.correct;
    var answer = (input.value || '').trim();
    var isCorrect = normalizeAnswer(answer) === normalizeAnswer(correct);
    var feedback = document.getElementById('fill-feedback-' + idx);
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className = 'fill-feedback ' + (isCorrect ? 'correct' : 'incorrect');
      feedback.textContent = isCorrect
        ? '\\u2705 \\u00a1Correcto!'
        : '\\u274c Incorrecto. La respuesta era: ' + correct;
    }
    input.disabled = true;
    button.disabled = true;
    showExplanation(idx);
    onAnswer(card, isCorrect);
  };
`;
}
