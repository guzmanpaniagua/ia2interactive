export function getIndexPageStyles(): string {
  return `
/* ===== Index Page Container ===== */
.index-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ===== Hero ===== */
.hero {
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.hero h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
.hero-description { font-size: 1.15rem; color: var(--color-text-muted); margin-bottom: 0.5rem; }
.hero-author { font-size: 0.95rem; color: var(--color-text-muted); }

/* ===== Chapter Cards ===== */
.chapters-grid { display: flex; flex-direction: column; gap: 1rem; }

.chapter-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow);
  transition: box-shadow var(--transition), transform var(--transition);
}

.chapter-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }

.chapter-number {
  width: 40px; height: 40px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.chapter-info { flex: 1; }
.chapter-info h3 { margin-bottom: 0.5rem; }
.chapter-info h3 a { color: var(--color-text); }

.chapter-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.chapter-status { font-size: 1.3rem; flex-shrink: 0; }
`;
}
