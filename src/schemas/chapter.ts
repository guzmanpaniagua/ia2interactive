import type { Quiz } from './quiz.js';

export interface ChapterMeta {
  slug: string;
  order: number;
  title: string;
}

export interface Chapter {
  dir: string;
  slug: string;
  title: string;
  content: string;
  contentHtml: string;
  quiz: Quiz | null;
}

export interface ChapterRef {
  dir: string;
  title?: string;
  file?: string;
  quizFile?: string;
}
