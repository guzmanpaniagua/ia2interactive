export function getQuizFlashcardStyles(): string {
  return `
/* ===== Flashcard ===== */
.flashcard {
  perspective: 1000px;
  cursor: pointer;
  margin: 1rem 0;
}

.flashcard-inner {
  position: relative;
  width: 100%;
  min-height: 250px;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.flashcard.flipped .flashcard-inner,
.flashcard[data-flipped="true"] .flashcard-inner {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  width: 100%;
  min-height: 250px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: var(--radius, 12px);
  text-align: center;
  box-sizing: border-box;
}

/* Front visible, back hidden — both in flow but only one visible */
.flashcard-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.flashcard-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
}

.flashcard-front p {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.flashcard-hint {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: auto;
}

.flashcard-back p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.flashcard-buttons {
  display: none;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.flashcard-buttons .btn-true {
  background: var(--color-success, #10b981);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.flashcard-buttons .btn-false {
  background: var(--color-error, #ef4444);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.flashcard-buttons .btn-true:hover,
.flashcard-buttons .btn-false:hover { opacity: 0.9; }

.flashcard-buttons button:disabled { opacity: 0.5; cursor: not-allowed; }
`;
}
