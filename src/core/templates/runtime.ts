export function getRuntimeJs(): string {
  return `
(function() {
  'use strict';

  // ===== Shuffle utility =====
  function shuffleChildren(container) {
    if (!container) return;
    var items = Array.from(container.children);
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      container.appendChild(items[j]);
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    // Re-append all in new order
    items.forEach(function(el) { container.appendChild(el); });
  }

  // ===== Sidebar Toggle =====
  var sidebar = document.getElementById('sidebar');
  var sidebarToggle = document.getElementById('sidebar-toggle');
  var mobileBtn = document.querySelector('.mobile-menu-btn');

  function toggleSidebar() { if (sidebar) sidebar.classList.toggle('open'); }
  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
  if (mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);

  document.addEventListener('click', function(e) {
    if (sidebar && sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        (!mobileBtn || !mobileBtn.contains(e.target))) {
      sidebar.classList.remove('open');
    }
  });

  // ===== Progress Tracking =====
  var STORAGE_KEY = 'ia2i_progress';

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e) { return {}; }
  }

  function saveProgress(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function markChapterComplete(slug, sc, tot) {
    var progress = getProgress();
    var pct = tot > 0 ? Math.round((sc / tot) * 100) : 0;
    progress[slug] = { completed: true, score: pct, date: new Date().toISOString() };
    saveProgress(progress);
    updateAllProgress();
  }

  function updateAllProgress() {
    var progress = getProgress();
    document.querySelectorAll('.chapter-status').forEach(function(el) {
      var s = el.id.replace('status-', '');
      if (progress[s] && progress[s].completed) {
        var sc = progress[s].score;
        el.textContent = sc >= 80 ? '\\u2705' : sc >= 50 ? '\\ud83d\\udd36' : '\\u274c';
      }
    });
    var items = document.querySelectorAll('.sidebar-nav li[data-chapter]');
    if (items.length > 0) {
      var done = 0;
      items.forEach(function(li) {
        if (getProgress()[li.dataset.chapter] && getProgress()[li.dataset.chapter].completed) done++;
      });
      var t = items.length;
      var fill = document.getElementById('sidebar-progress-fill');
      var text = document.getElementById('sidebar-progress-text');
      if (fill) fill.style.width = (t > 0 ? Math.round((done / t) * 100) : 0) + '%';
      if (text) text.textContent = done + ' / ' + t + ' completados';
    }
  }

  updateAllProgress();

  // ===== Quiz Stepper =====
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
    // true-false: no shuffle
  }

  function showStep(idx) {
    steps.forEach(function(s, i) { s.classList.toggle('active', i === idx); });
    currentQ = idx;
    shuffleStep(idx);
    var display = document.getElementById('score-display');
    if (display) display.textContent = 'Pregunta ' + (idx + 1) + ' de ' + totalQ;
    var pct = totalQ > 0 ? ((idx + 1) / totalQ) * 100 : 0;
    var fill = document.getElementById('quiz-progress-fill');
    if (fill) fill.style.width = pct + '%';
  }

  if (steps.length > 0) showStep(0);

  function showNextButton(idx) {
    var step = steps[idx];
    if (!step) return;
    var btn = step.querySelector('.btn-next');
    if (btn) btn.classList.add('visible');
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
    steps.forEach(function(s) { s.classList.remove('active'); });
    var scoreBar = document.querySelector('.score-bar');
    if (scoreBar) scoreBar.style.display = 'none';

    var results = document.getElementById('quiz-results');
    if (results) {
      results.classList.add('visible');
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
    showNextButton(currentQ);
  }

  function showExplanation(idx) {
    var expl = document.getElementById('explanation-' + idx);
    if (expl) expl.style.display = 'block';
  }

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

  // ===== Normalize utility =====
  function normalizeAnswer(str) {
    return (str || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ +/g, ' ');
  }

  // ===== Fill in the Blank =====
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

  // ===== Drag & Drop =====
  var draggedEl = null;

  document.addEventListener('dragstart', function(e) {
    if (e.target.classList && e.target.classList.contains('drag-concept')) {
      draggedEl = e.target;
      e.target.classList.add('dragging');
    }
  });

  document.addEventListener('dragend', function(e) {
    if (e.target.classList && e.target.classList.contains('drag-concept')) {
      e.target.classList.remove('dragging');
      draggedEl = null;
    }
  });

  document.addEventListener('dragover', function(e) {
    var zone = e.target.closest('.drop-zone');
    if (zone) { e.preventDefault(); zone.classList.add('drag-over'); }
  });

  document.addEventListener('dragleave', function(e) {
    var zone = e.target.closest('.drop-zone');
    if (zone) zone.classList.remove('drag-over');
  });

  document.addEventListener('drop', function(e) {
    var zone = e.target.closest('.drop-zone');
    if (zone && draggedEl) {
      e.preventDefault();
      zone.classList.remove('drag-over');
      var slot = zone.querySelector('.drop-slot');
      if (slot) {
        var existing = slot.querySelector('.drag-concept');
        if (existing) {
          var concepts = draggedEl.closest('.drag-container').querySelector('.drag-concepts');
          existing.classList.remove('placed');
          concepts.appendChild(existing);
        }
        slot.appendChild(draggedEl);
        draggedEl.classList.add('placed');
        draggedEl.classList.remove('dragging');
      }
    }
  });

  // ===== Touch Support for Drag & Drop =====
  var touchDragged = null;
  var touchClone = null;
  var touchOffsetX = 0;
  var touchOffsetY = 0;

  document.addEventListener('touchstart', function(e) {
    var concept = e.target.closest('.drag-concept');
    if (!concept || concept.classList.contains('placed')) return;
    touchDragged = concept;
    var rect = concept.getBoundingClientRect();
    var touch = e.touches[0];
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    touchClone = concept.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.zIndex = '9999';
    touchClone.style.width = rect.width + 'px';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.opacity = '0.85';
    touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';
    document.body.appendChild(touchClone);

    concept.classList.add('dragging');
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!touchDragged || !touchClone) return;
    e.preventDefault();
    var touch = e.touches[0];
    touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';

    // Highlight drop zone under finger
    var elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    document.querySelectorAll('.drop-zone').forEach(function(z) { z.classList.remove('drag-over'); });
    if (elUnder) {
      var zone = elUnder.closest('.drop-zone');
      if (zone) zone.classList.add('drag-over');
    }
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    if (!touchDragged) return;
    var touch = e.changedTouches[0];
    if (touchClone) {
      touchClone.remove();
      touchClone = null;
    }
    touchDragged.classList.remove('dragging');

    var elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elUnder) {
      var zone = elUnder.closest('.drop-zone');
      if (zone) {
        zone.classList.remove('drag-over');
        var slot = zone.querySelector('.drop-slot');
        if (slot) {
          var existing = slot.querySelector('.drag-concept');
          if (existing) {
            var concepts = touchDragged.closest('.drag-container').querySelector('.drag-concepts');
            existing.classList.remove('placed');
            concepts.appendChild(existing);
          }
          slot.appendChild(touchDragged);
          touchDragged.classList.add('placed');
        }
      }
    }
    touchDragged = null;
  });

  window.checkDragAnswer = function(event, idx) {
    var card = document.querySelector('.question-card[data-index="' + idx + '"]');
    if (!card || card.dataset.answered === 'true') return;
    var zones = card.querySelectorAll('.drop-zone');
    var allCorrect = true;
    zones.forEach(function(zone) {
      var expected = zone.dataset.pair;
      var slot = zone.querySelector('.drop-slot');
      var placed = slot ? slot.querySelector('.drag-concept') : null;
      var actual = placed ? placed.dataset.pair : null;
      if (actual === expected) zone.classList.add('matched-correct');
      else { zone.classList.add('matched-incorrect'); allCorrect = false; }
    });
    showExplanation(idx);
    onAnswer(card, allCorrect);
  };

  // ===== Flashcard =====
  document.addEventListener('click', function(e) {
    var flashcard = e.target.closest('.flashcard');
    if (flashcard) {
      var flipped = flashcard.dataset.flipped === 'true';
      flashcard.dataset.flipped = flipped ? 'false' : 'true';
      flashcard.classList.toggle('flipped');
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

})();
`;
}