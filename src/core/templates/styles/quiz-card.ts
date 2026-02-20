export function getQuizCardStyles(): string {
  return `
/* ===== Question Card ===== */
.question-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.question-card[data-answered="true"] .btn-check { display: none; }
.question-card[data-answered="true"] .option-label { pointer-events: none; }
.question-card[data-answered="true"] .tf-btn { pointer-events: none; }

.question-card.correct {
  border-color: var(--color-success);
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
}

.question-card.incorrect {
  border-color: var(--color-error);
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
}

.question-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }

.question-badge {
  padding: 0.2rem 0.6rem; border-radius: 999px;
  font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
}

.badge-easy { background: #d1fae5; color: #065f46; }
.badge-medium { background: #fef3c7; color: #92400e; }
.badge-hard { background: #fee2e2; color: #991b1b; }

.question-number { font-weight: 600; color: var(--color-text-muted); }
.question-prompt { font-size: 1.05rem; margin-bottom: 1rem; white-space: pre-line; }

/* ===== Explanation ===== */
.question-explanation {
  display: none; margin-top: 1rem; padding: 1rem;
  background: #fffbeb;
  border-left: 4px solid var(--color-warning);
  border-radius: 0 8px 8px 0;
  animation: fadeIn 0.3s ease;
}
`;
}
