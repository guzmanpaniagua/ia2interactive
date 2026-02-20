export function getChapterStyles(): string {
  return `
/* ===== Chapter Page ===== */
.chapter-header { margin-bottom: 2rem; }
.chapter-header .back-link { margin-bottom: 1rem; }
.chapter-title { font-size: 2rem; margin-bottom: 0.5rem; }

/* ===== Chapter Content ===== */
.chapter-content h1 { font-size: 2rem; margin-bottom: 1.5rem; }
.chapter-content h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
.chapter-content h3 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
.chapter-content p { margin-bottom: 1rem; }
.chapter-content ul, .chapter-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
.chapter-content li { margin-bottom: 0.25rem; }
.chapter-content pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 1.5rem 0;
  font-size: 0.88rem;
  line-height: 1.6;
  border: 1px solid #1e293b;
  position: relative;
}
.chapter-content code { font-family: 'Fira Code', 'Consolas', 'Monaco', monospace; }
.chapter-content p code,
.chapter-content li code,
.chapter-content td code {
  background: #f1f5f9;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.88em;
  color: #e11d48;
  border: 1px solid #e2e8f0;
}
.chapter-content blockquote {
  border-left: 4px solid var(--color-primary);
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  background: #eef2ff;
  border-radius: 0 8px 8px 0;
  color: var(--color-text-muted);
}

/* ===== Tables ===== */
.chapter-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.95rem;
  overflow-x: auto;
  display: block;
}

.chapter-content thead {
  background: var(--color-primary, #4f46e5);
  color: white;
}

.chapter-content th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}

.chapter-content td {
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.chapter-content tbody tr:hover {
  background: #f8fafc;
}

.chapter-content tbody tr:nth-child(even) {
  background: #f1f5f9;
}

/* ===== Images ===== */
.chapter-content img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  margin: 1rem 0;
}

/* ===== Horizontal Rule ===== */
.chapter-content hr {
  border: none;
  border-top: 2px solid var(--color-border, #e2e8f0);
  margin: 2rem 0;
}

/* ===== Chapter Navigation ===== */
.chapter-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-prev, .nav-next, .nav-quiz {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all var(--transition);
}

/* ===== Quiz CTA ===== */
.quiz-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: 2px solid var(--color-primary, #4f46e5);
  border-radius: var(--radius, 12px);
  flex-wrap: wrap;
}

.quiz-cta-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quiz-cta-icon {
  font-size: 2rem;
}

.quiz-cta-content p {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: var(--color-text-muted, #64748b);
}

.quiz-cta .btn-primary {
  white-space: nowrap;
  flex-shrink: 0;
}
`;
}
