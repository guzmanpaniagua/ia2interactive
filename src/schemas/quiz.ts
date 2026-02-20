import type { DIFFICULTIES } from './constants.js';

export type Difficulty = (typeof DIFFICULTIES)[number];

export type QuestionType =
  | 'single-choice'
  | 'multiple-choice'
  | 'true-false'
  | 'drag-and-drop'
  | 'flashcard'
  | 'fill-in-the-blank';

export interface Option {
  text: string;
  correct: boolean;
}

export type ChoiceOption = Option;

export interface DragPair {
  concept: string;
  definition: string;
}

// ─── Base fields shared by all question types ───

interface QuestionBase {
  number: number;
  difficulty: Difficulty;
  prompt: string;
  explanation?: string;
}

// ─── Discriminated union variants ───

export interface SingleChoiceQuestion extends QuestionBase {
  type: 'single-choice';
  options: Option[];
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice';
  options: Option[];
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true-false';
  options: Option[];
}

export interface DragAndDropQuestion extends QuestionBase {
  type: 'drag-and-drop';
  pairs: DragPair[];
}

export interface FlashcardQuestion extends QuestionBase {
  type: 'flashcard';
  options: Option[];
}

export interface FillInTheBlankQuestion extends QuestionBase {
  type: 'fill-in-the-blank';
  answer: string;
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | DragAndDropQuestion
  | FlashcardQuestion
  | FillInTheBlankQuestion;

// ─── Quiz containers ───

export interface Quiz {
  title: string;
  engineVersion: string;
  questions: Question[];
}

export interface QuizData {
  title: string;
  chapterSlug: string;
  questions: Question[];
}

// ─── Raw types for YAML/Markdown parsing ───

export interface RawOption {
  text: string;
  correct?: boolean;
}

export interface RawPair {
  concept: string;
  definition: string;
}

export interface RawQuestion {
  type: string;
  difficulty?: string;
  text: string;
  explanation?: string;
  options?: RawOption[];
  pairs?: RawPair[];
}

export interface RawQuiz {
  title?: string;
  questions?: RawQuestion[];
}
