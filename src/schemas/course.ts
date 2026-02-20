import type { Chapter, ChapterRef } from './chapter.js';

export interface CourseConfig {
  title: string;
  description?: string;
  author?: string;
  version?: string;
  language?: string;
  theme?: string;
  chapters: ChapterRef[];
}

export interface Course {
  config: CourseConfig;
  chapters: Chapter[];
  basePath: string;
}
