export function getDragHandlerJs(): string {
  return `
  // ===== Drag & Drop (mouse) =====
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

  // ===== Drag & Drop (touch) =====
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
`;
}
