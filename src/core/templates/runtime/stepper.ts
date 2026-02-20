export function getStepperJs(): string {
  return `
  var list = document.querySelector('.questions-list');
  var totalQ = list ? parseInt(list.dataset.total, 10) : 0;
  var slug = list ? list.dataset.slug : '';
  var currentQ = 0;
  var score = 0;
  var steps = list ? list.querySelectorAll('.question-step') : [];
  var shuffled = {};

  function shuffleStep(idx) {
    if (shuffled[idx]) return;
    shuffled[idx] = true;
    var step = steps[idx];
    if (!step) return;
    var card = step.querySelector('.question-card');
    if (!card) return;
    var type = card.dataset.type;

    if (type === 'single-choice' || type === 'multiple-choice') {
      shuffleChildren(card.querySelector('.options-group'));
    } else if (type === 'drag-and-drop') {
      shuffleChildren(card.querySelector('.drag-concepts'));
    }
  }

  function showStep(idx) {
    steps.forEach(function(s, i) {
      s.classList.toggle('active', i === idx);
      s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
    });
    currentQ = idx;
    shuffleStep(idx);
    var display = document.getElementById('score-display');
    if (display) display.textContent = 'Pregunta ' + (idx + 1) + ' de ' + totalQ;
    var pct = totalQ > 0 ? ((idx + 1) / totalQ) * 100 : 0;
    var fill = document.getElementById('quiz-progress-fill');
    if (fill) {
      fill.style.width = pct + '%';
      fill.parentElement.setAttribute('aria-valuenow', Math.round(pct));
    }
  }

  if (steps.length > 0) showStep(0);

  function showNextButton(idx) {
    var step = steps[idx];
    if (!step) return;
    var btn = step.querySelector('.btn-next');
    if (btn) { btn.classList.add('visible'); btn.focus(); }
  }

  window.goToNext = function(idx) {
    if (idx < totalQ - 1) {
      showStep(idx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showResults();
    }
  };

  function showResults() {
    steps.forEach(function(s) { s.classList.remove('active'); s.setAttribute('aria-hidden', 'true'); });
    var scoreBar = document.querySelector('.score-bar');
    if (scoreBar) scoreBar.style.display = 'none';

    var results = document.getElementById('quiz-results');
    if (results) {
      results.classList.add('visible');
      results.setAttribute('aria-hidden', 'false');
      var pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
      var scoreEl = document.getElementById('results-score');
      var msgEl = document.getElementById('results-message');
      if (scoreEl) {
        scoreEl.textContent = score + ' / ' + totalQ + ' (' + pct + '%)';
        scoreEl.className = 'results-score ' + (pct >= 80 ? 'excellent' : pct >= 50 ? 'good' : 'poor');
      }
      if (msgEl) {
        if (pct >= 80) msgEl.textContent = '\\u00a1Excelente! Dominas este tema.';
        else if (pct >= 50) msgEl.textContent = 'Buen trabajo, pero puedes mejorar.';
        else msgEl.textContent = 'Necesitas repasar este tema. \\u00a1Int\\u00e9ntalo de nuevo!';
      }
    }
    if (slug) markChapterComplete(slug, score, totalQ);
  }

  function onAnswer(card, isCorrect) {
    if (isCorrect) score++;
    card.dataset.answered = 'true';
    card.classList.add(isCorrect ? 'correct' : 'incorrect');
    var label = card.getAttribute('aria-label') || '';
    card.setAttribute('aria-label', label + ' - ' + (isCorrect ? 'Correcto' : 'Incorrecto'));
    showNextButton(currentQ);
  }

  function showExplanation(idx) {
    var expl = document.getElementById('explanation-' + idx);
    if (expl) expl.style.display = 'block';
  }
`;
}
