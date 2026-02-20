// base.ts
export function getDarkModeStyles(): string {
  return `
/* ===== Dark Mode ===== */
@media (prefers-color-scheme: dark) {
  /* ─── Variables ─── */
  :root {
    --color-bg: #0f172a;
    --color-surface: #1e293b;
    --color-text: #e2e8f0;
    --color-text-muted: #94a3b8;
    --color-border: #334155;
    --color-primary: #818cf8;
    --color-primary-dark: #6366f1;
    --shadow: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.3);
  }

  /* ─── Buttons ─── */
  .btn-secondary { background: var(--color-surface); color: var(--color-text); border-color: var(--color-border); }
  .btn-secondary:hover { background: var(--color-border); }

  /* ─── Chapter Content ─── */
  .chapter-content p code,
  .chapter-content li code,
  .chapter-content td code {
    background: #334155;
    color: #f472b6;
    border-color: #475569;
  }

  .chapter-content blockquote {
    background: #1e293b;
    border-color: var(--color-primary);
    color: var(--color-text-muted);
  }

  .chapter-content thead { background: var(--color-primary); }
  .chapter-content tbody tr:hover { background: #1e293b; }
  .chapter-content tbody tr:nth-child(even) { background: #1a2332; }
  .chapter-content td { border-color: var(--color-border); }

  /* ─── Quiz CTA ─── */
  .quiz-cta {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    border-color: var(--color-primary);
  }
  .quiz-cta-content p { color: var(--color-text-muted); }

  /* ─── Quiz Layout ─── */
  .quiz-results { background: var(--color-surface); }
  .score-bar #score-display { color: var(--color-text); }

  /* ─── Quiz Cards ─── */
  .badge-easy { background: #065f46; color: #6ee7b7; }
  .badge-medium { background: #92400e; color: #fcd34d; }
  .badge-hard { background: #991b1b; color: #fca5a5; }

  .question-explanation {
    background: #1c1917;
    border-color: var(--color-warning);
    color: var(--color-text);
  }

  /* ─── Sidebar ─── */
  .sidebar { background: #0f172a; border-color: var(--color-border); }
  .sidebar-header a { color: var(--color-text); }
  .sidebar-nav a { color: var(--color-text-muted); }
  .sidebar-nav a:hover,
  .sidebar-nav a.active { color: var(--color-primary); }
  .sidebar-nav li.current-chapter { background: rgba(129, 140, 248, 0.1); }
}
`;
}
