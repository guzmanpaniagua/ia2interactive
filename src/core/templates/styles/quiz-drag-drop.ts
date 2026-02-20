export function getQuizDragDropStyles(): string {
  return `
/* ===== Drag & Drop ===== */
.drag-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1rem 0; }
.drag-concepts { display: flex; flex-direction: column; gap: 0.5rem; }

.drag-concept {
  padding: 0.75rem 1rem;
  background: var(--color-primary); color: white;
  border-radius: 8px; cursor: grab;
  font-weight: 500; transition: all var(--transition);
  user-select: none;
}

.drag-concept:active { cursor: grabbing; transform: scale(1.05); box-shadow: var(--shadow-lg); }
.drag-concept.dragging { opacity: 0.5; }
.drag-concept.placed { opacity: 0.4; pointer-events: none; }

.drop-zones { display: flex; flex-direction: column; gap: 0.5rem; }

.drop-zone {
  padding: 0.75rem 1rem; background: #f8fafc;
  border: 2px dashed var(--color-border);
  border-radius: 8px; min-height: 50px;
  display: flex; flex-direction: column; gap: 0.35rem;
  transition: all var(--transition);
}

.drop-zone.drag-over { border-color: var(--color-primary); background: #eef2ff; }
.drop-zone.matched-correct { border-color: var(--color-success); border-style: solid; background: #d1fae5; }
.drop-zone.matched-incorrect { border-color: var(--color-error); border-style: solid; background: #fee2e2; }

.drop-text { font-size: 0.9rem; color: var(--color-text-muted); }
.drop-slot { min-height: 30px; display: flex; align-items: center; }
.drop-slot .drag-concept { margin: 0; cursor: pointer; font-size: 0.85rem; padding: 0.4rem 0.75rem; opacity: 1; pointer-events: auto; background: var(--color-primary); color: white; }

/* ===== Flashcard ===== */
.flashcard { perspective: 1000px; min-height: 200px; cursor: pointer; margin: 1rem 0; }

.flashcard-inner {
  position: relative; width: 100%; min-height: 200px;
  transition: transform 0.6s ease; transform-style: preserve-3d;
}

.flashcard[data-flipped="true"] .flashcard-inner { transform: rotateY(180deg); }

.flashcard-front, .flashcard-back {
  position: absolute; inset: 0; backface-visibility: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem; border-radius: var(--radius); text-align: center;
}

.flashcard-front { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.flashcard-front p { font-size: 1.2rem; }
.flashcard-hint { font-size: 0.8rem; opacity: 0.7; margin-top: 1rem; }

.flashcard-back { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; transform: rotateY(180deg); }
.flashcard-back p { font-size: 1.1rem; }
.flashcard-buttons { display: flex; gap: 1rem; margin-top: 0.5rem; }
`;
}
