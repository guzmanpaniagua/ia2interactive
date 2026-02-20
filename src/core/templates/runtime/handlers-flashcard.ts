export function getFlashcardHandlerJs(): string {
  return `
  document.addEventListener('click', function(e) {
    var flashcard = e.target.closest('.flashcard');
    if (flashcard) {
      var flipped = flashcard.dataset.flipped === 'true';
      flashcard.dataset.flipped = flipped ? 'false' : 'true';
      flashcard.classList.toggle('flipped');
      var front = flashcard.querySelector('.flashcard-front');
      var back = flashcard.querySelector('.flashcard-back');
      if (front) front.setAttribute('aria-hidden', flipped ? 'false' : 'true');
      if (back) back.setAttribute('aria-hidden', flipped ? 'true' : 'false');
      if (!flipped) {
        var card = flashcard.closest('.question-card');
        if (card) {
          var buttons = card.querySelector('.flashcard-buttons');
          if (buttons) buttons.style.display = 'flex';
        }
      }
      return;
    }

    var knewBtn = e.target.closest('.flashcard-buttons button');
    if (knewBtn) {
      var card = knewBtn.closest('.question-card');
      if (!card || card.dataset.answered === 'true') return;
      var knew = knewBtn.dataset.knew === 'true';
      var buttons = card.querySelector('.flashcard-buttons');
      if (buttons) {
        buttons.querySelectorAll('button').forEach(function(b) { b.disabled = true; });
      }
      var idx = parseInt(card.dataset.index, 10);
      showExplanation(idx);
      onAnswer(card, knew);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var flashcard = e.target.closest('.flashcard');
      if (flashcard) {
        e.preventDefault();
        flashcard.click();
      }
    }
  });
`;
}
