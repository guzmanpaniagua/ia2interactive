export function getQuizMultipleChoiceStyles(): string {
  return `
/* ===== Multiple Choice ===== */
.options-group { display: flex; flex-direction: column; gap: 0.5rem; }

.option-label {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px; cursor: pointer;
  transition: all var(--transition);
}

.option-label:hover { border-color: var(--color-primary); background: #f5f3ff; }

.option-input { width: 18px; height: 18px; accent-color: var(--color-primary); flex-shrink: 0; }
.option-text { flex: 1; }
.option-icon { font-size: 1.2rem; opacity: 0; transition: opacity var(--transition); }

.option-label.selected { border-color: var(--color-primary); background: #eef2ff; }
.option-label.correct { border-color: var(--color-success); background: #d1fae5; }
.option-label.correct .option-icon { opacity: 1; }
.option-label.incorrect { border-color: var(--color-error); background: #fee2e2; }
.option-label.incorrect .option-icon { opacity: 1; }
`;
}
