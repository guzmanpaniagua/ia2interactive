export function getQuizTrueFalseStyles(): string {
  return `
/* ===== True/False ===== */
.tf-options { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem; }

.tf-btn {
  padding: 0.85rem 1rem;
  font-size: 0.95rem; font-weight: 500;
  border: 2px solid var(--color-border);
  border-radius: 8px; cursor: pointer;
  transition: all var(--transition);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: left;
  line-height: 1.4;
}

.tf-btn:hover { border-color: var(--color-primary); background: #f5f3ff; }
.tf-btn.correct { border-color: var(--color-success); background: #d1fae5; color: #065f46; }
.tf-btn.incorrect { border-color: var(--color-error); background: #fee2e2; color: #991b1b; }
`;
}
