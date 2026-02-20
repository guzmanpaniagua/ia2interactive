// ─── Schemas ───
export type {
  Course, CourseConfig,
  Chapter, ChapterMeta, ChapterRef,
  Quiz, QuizData, Question, QuestionType, Difficulty,
  Option, ChoiceOption, DragPair,
  RawQuiz, RawQuestion, RawOption, RawPair,
  BuildResult, PageOutput, BuildOptions,
} from './schemas/index.js';
export { QUESTION_TYPES, DIFFICULTIES, ENGINE_VERSION } from './schemas/index.js';

// ─── Core ───
export { parseCourseConfig, parseChapter, parseQuizMarkdown } from './core/parser.js';
export { parseQuiz, parseSingleQuestionMarkdown } from './core/quiz-parser.js';
export { markdownToHtml } from './core/markdown.js';
export { build } from './core/build.js';
export { generateIndexPage } from './core/templates/index-page.js';
export { generateChapterPage } from './core/templates/chapter-page.js';
export { generateQuizPage } from './core/templates/quiz-page.js';
