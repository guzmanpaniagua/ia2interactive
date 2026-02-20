export function getBaseStyles(): string {
  return `
/* ===== Reset & Variables ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --sidebar-width: 280px;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --transition: 0.2s ease;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  min-height: 100vh;
}

a { color: var(--color-primary); text-decoration: none; }
a:hover { text-decoration: underline; }

/* ===== Buttons ===== */
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  text-align: center;
}

.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-dark); color: white; text-decoration: none; }

.btn-secondary { background: var(--color-bg); color: var(--color-text); border: 1px solid var(--color-border); }
.btn-secondary:hover { background: var(--color-border); text-decoration: none; }

.btn-check { background: var(--color-primary); color: white; margin-top: 1rem; padding: 0.5rem 1.25rem; border-radius: 8px; border: none; font-size: 0.9rem; cursor: pointer; }
.btn-check:hover { background: var(--color-primary-dark); }
.btn-check:disabled { opacity: 0.5; cursor: not-allowed; }

.back-link {
  display: inline-block;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  transition: color var(--transition);
}
.back-link:hover { color: var(--color-primary); text-decoration: none; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
`;
}
