// quiz-layout.ts
export function getQuizLayoutStyles(): string {
  return `
/* ===== Quiz Page ===== */
.quiz-container { max-width: 900px; }
.quiz-title { font-size: 2rem; margin-bottom: 1rem; }

.score-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.score-bar #score-display {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-text);
  white-space: nowrap;
}

.score-bar .progress-bar {
  flex: 1; height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.score-bar .progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  width: 0%;
  transition: width 0.5s ease;
}

.questions-list { display: flex; flex-direction: column; gap: 1.5rem; }

/* ===== Stepper ===== */
.question-step { display: none; }
.question-step.active {
  display: block;
  animation: slideIn 0.4s ease;
}

.question-nav { display: flex; justify-content: flex-end; margin-top: 1rem; }

.question-nav .btn-next {
  display: none;
  background: var(--color-primary); color: white;
  padding: 0.6rem 1.5rem; border-radius: 8px; border: none;
  font-size: 0.95rem; font-weight: 500; cursor: pointer;
  transition: all var(--transition);
}
.question-nav .btn-next:hover { background: var(--color-primary-dark); }
.question-nav .btn-next.visible { display: inline-block; }

/* ===== Quiz Results ===== */
.quiz-results {
  display: none; text-align: center; padding: 3rem 2rem;
  background: var(--color-surface); border-radius: var(--radius);
  box-shadow: var(--shadow-lg); animation: fadeIn 0.5s ease;
}
.quiz-results.visible { display: block; }
.quiz-results h2 { font-size: 1.8rem; margin-bottom: 1.5rem; }

.results-score { font-size: 4rem; font-weight: 800; margin-bottom: 0.5rem; }
.results-score.excellent { color: var(--color-success); }
.results-score.good { color: var(--color-warning); }
.results-score.poor { color: var(--color-error); }

.results-message { font-size: 1.2rem; color: var(--color-text-muted); margin-bottom: 2rem; }
.results-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
`;
}
