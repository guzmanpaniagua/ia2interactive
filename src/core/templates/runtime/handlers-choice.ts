export function getChoiceHandlersJs(): string {
  return `
  // ===== Single Choice =====
  window.checkMCAnswer = function(event, idx) {
    var label = event.target.closest('.option-label');
    if (!label) return;
    var card = document.querySelector('.question-card[data-index="' + idx + '"]');
    if (!card || card.dataset.answered === 'true') return;
    var isCorrect = label.dataset.correct === 'true';
    label.classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
      var cl = card.querySelector('.option-label[data-correct="true"]');
      if (cl) cl.classList.add('correct');
    }
    showExplanation(idx);
    onAnswer(card, isCorrect);
  };

  // ===== Multiple Choice =====
  window.checkMultipleChoice = function(idx) {
    var card = document.querySelector('.question-card[data-index="' + idx + '"]');
    if (!card || card.dataset.answered === 'true') return;
    var labels = card.querySelectorAll('.option-label');
    var allCorrect = true;
    labels.forEach(function(lbl) {
      var input = lbl.querySelector('input');
      var checked = input && input.checked;
      var shouldBe = lbl.dataset.correct === 'true';
      if (checked && shouldBe) lbl.classList.add('correct');
      else if (checked && !shouldBe) { lbl.classList.add('incorrect'); allCorrect = false; }
      else if (!checked && shouldBe) { lbl.classList.add('correct'); allCorrect = false; }
    });
    showExplanation(idx);
    onAnswer(card, allCorrect);
  };

  // ===== True/False =====
  window.checkTFAnswer = function(event, idx) {
    var btn = event.target.closest('.tf-btn');
    if (!btn) return;
    var card = document.querySelector('.question-card[data-index="' + idx + '"]');
    if (!card || card.dataset.answered === 'true') return;
    var opts = card.querySelector('.tf-options');
    var correct = opts.dataset.correct;
    var isCorrect = btn.dataset.value === correct;
    btn.classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
      var cb = opts.querySelector('[data-value="' + correct + '"]');
      if (cb) cb.classList.add('correct');
    }
    showExplanation(idx);
    onAnswer(card, isCorrect);
  };
`;
}
