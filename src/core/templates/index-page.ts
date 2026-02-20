import type { CourseConfig, Chapter } from '../../schemas/index.js';
import { escapeHtml } from './helpers.js';

export function generateIndexPage(config: CourseConfig, chapters: Chapter[]): string {
  const chapterCards = chapters
    .map((ch, i) => {
      const contentLink = ch.contentHtml ? `${ch.slug}.html` : null;
      const quizLink = ch.quiz ? `${ch.slug}-quiz.html` : null;
      const mainLink = contentLink || quizLink || '#';

      return `
      <div class="chapter-card" data-chapter="${ch.slug}">
        <div class="chapter-number">${i + 1}</div>
        <div class="chapter-info">
          <h3><a href="${mainLink}">${escapeHtml(ch.title)}</a></h3>
          <div class="chapter-actions">
            ${contentLink ? `<a href="${contentLink}" class="btn btn-secondary">📄 Contenido</a>` : ''}
            ${quizLink ? `<a href="${quizLink}" class="btn btn-primary">🧠 Quiz (${ch.quiz!.questions.length} preguntas)</a>` : ''}
          </div>
        </div>
        <div class="chapter-status" id="status-${ch.slug}">⬜</div>
      </div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${config.language || 'es'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(config.title)}</title>
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body>
  <div class="index-container">
    <header class="hero">
      <h1>${escapeHtml(config.title)}</h1>
      ${config.description ? `<p class="hero-description">${escapeHtml(config.description)}</p>` : ''}
      ${config.author ? `<p class="hero-author">Por ${escapeHtml(config.author)}</p>` : ''}
    </header>
    <section class="chapters-grid">
      ${chapterCards}
    </section>
  </div>
  <script src="assets/runtime.js"></script>
</body>
</html>`;
}
