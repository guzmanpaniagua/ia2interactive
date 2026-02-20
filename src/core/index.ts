// Los tipos se importan directamente desde @ia2interactive/schemas
// Este módulo exporta solo la lógica de core
export { parseCourseConfig, parseChapter, parseQuizMarkdown } from './parser.js';
export { parseQuiz, parseSingleQuestionMarkdown } from './quiz-parser.js';
export { markdownToHtml } from './markdown.js';
export { build } from './build.js';
export { generateIndexPage } from './templates/index-page.js';
export { generateChapterPage } from './templates/chapter-page.js';
export { generateQuizPage } from './templates/quiz-page.js';
