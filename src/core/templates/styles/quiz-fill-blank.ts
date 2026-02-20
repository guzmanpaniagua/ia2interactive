export function getQuizFillBlankStyles(): string {
  return `
/* ===== Fill in the Blank ===== */
.fill-input-group { display: flex; gap: 0.75rem; align-items: center; margin-top: 0.5rem; }

.fill-input {
  flex: 1; padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px; font-size: 1rem;
  transition: border-color var(--transition);
}

.fill-input:focus { outline: none; border-color: var(--color-primary); }

.fill-feedback {
  display: none; margin-top: 0.75rem;
  padding: 0.75rem 1rem; border-radius: 8px; font-weight: 500;
}

.fill-feedback.correct { background: #d1fae5; color: #065f46; border: 1px solid var(--color-success); }
.fill-feedback.incorrect { background: #fee2e2; color: #991b1b; border: 1px solid var(--color-error); }
`;
}
