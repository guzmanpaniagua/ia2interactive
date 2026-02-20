import { describe, it, expect } from 'vitest';
import { generateQuizPage } from '../src/core/templates/quiz-page.js';
import type { QuizData, CourseConfig, Chapter } from '../src/schemas/index.js';

const config: CourseConfig = {
  title: 'Test Course',
  description: 'Desc',
  author: 'Author',
  language: 'es',
  chapters: [],
};

describe('generateQuizPage', () => {
  it('renders quiz with single-choice question', () => {
    const quiz: QuizData = {
      title: 'Quiz Test',
      chapterSlug: '01-intro',
      questions: [{
        type: 'single-choice',
        number: 1,
        difficulty: 'easy',
        prompt: '¿Test?',
        options: [
          { text: 'Sí', correct: true },
          { text: 'No', correct: false },
        ],
      }],
    };
    const html = generateQuizPage(quiz, config);
    expect(html).toContain('Quiz Test');
    expect(html).toContain('¿Test?');
    expect(html).toContain('Pregunta 1 de 1');
    expect(html).toContain('quiz-results');
    expect(html).toContain('Ver resultados');
    expect(html).toContain('role="progressbar"');
  });

  it('renders multiple questions with next buttons', () => {
    const quiz: QuizData = {
      title: 'Multi Quiz',
      chapterSlug: '01-ch',
      questions: [
        { type: 'single-choice', number: 1, difficulty: 'easy', prompt: 'Q1', options: [{ text: 'A', correct: true }] },
        { type: 'true-false', number: 2, difficulty: 'medium', prompt: 'Q2', options: [{ text: 'Verdadero', correct: true }, { text: 'Falso', correct: false }] },
      ],
    };
    const html = generateQuizPage(quiz, config);
    expect(html).toContain('Siguiente');
    expect(html).toContain('Ver resultados');
    expect(html).toContain('Pregunta 1 de 2');
  });

  it('renders next chapter link when chapters provided', () => {
    const chapters: Chapter[] = [
      { dir: '01-intro', slug: '01-intro', title: 'Intro', content: 'Hi', contentHtml: '<p>Hi</p>', quiz: null },
      { dir: '02-next', slug: '02-next', title: 'Next', content: 'Next', contentHtml: '<p>Next</p>', quiz: null },
    ];
    const quiz: QuizData = {
      title: 'Quiz',
      chapterSlug: '01-intro',
      questions: [{ type: 'single-choice', number: 1, difficulty: 'easy', prompt: 'Q', options: [{ text: 'A', correct: true }] }],
    };
    const html = generateQuizPage(quiz, config, chapters);
    expect(html).toContain('02-next.html');
    expect(html).toContain('Siguiente cap');
  });

  it('renders next chapter quiz link when chapter has no content', () => {
    const chapters: Chapter[] = [
      { dir: '01-intro', slug: '01-intro', title: 'Intro', content: 'Hi', contentHtml: '<p>Hi</p>', quiz: null },
      { dir: '02-next', slug: '02-next', title: 'Next', content: '', contentHtml: '', quiz: null },
    ];
    const quiz: QuizData = {
      title: 'Quiz',
      chapterSlug: '01-intro',
      questions: [{ type: 'single-choice', number: 1, difficulty: 'easy', prompt: 'Q', options: [{ text: 'A', correct: true }] }],
    };
    const html = generateQuizPage(quiz, config, chapters);
    expect(html).toContain('02-next-quiz.html');
  });

  it('renders no next link for last chapter', () => {
    const chapters: Chapter[] = [
      { dir: '01-only', slug: '01-only', title: 'Only', content: 'Hi', contentHtml: '<p>Hi</p>', quiz: null },
    ];
    const quiz: QuizData = {
      title: 'Quiz',
      chapterSlug: '01-only',
      questions: [{ type: 'single-choice', number: 1, difficulty: 'easy', prompt: 'Q', options: [{ text: 'A', correct: true }] }],
    };
    const html = generateQuizPage(quiz, config, chapters);
    expect(html).not.toContain('Siguiente cap');
  });

  it('renders all question types', () => {
    const quiz: QuizData = {
      title: 'All Types',
      chapterSlug: '01-ch',
      questions: [
        { type: 'single-choice', number: 1, difficulty: 'easy', prompt: 'SC', options: [{ text: 'A', correct: true }] },
        { type: 'multiple-choice', number: 2, difficulty: 'medium', prompt: 'MC', options: [{ text: 'A', correct: true }, { text: 'B', correct: true }] },
        { type: 'true-false', number: 3, difficulty: 'easy', prompt: 'TF', options: [{ text: 'Verdadero', correct: true }, { text: 'Falso', correct: false }] },
        { type: 'fill-in-the-blank', number: 4, difficulty: 'hard', prompt: 'Fill', answer: 'test' },
        { type: 'drag-and-drop', number: 5, difficulty: 'medium', prompt: 'Drag', pairs: [{ concept: 'A', definition: 'B' }, { concept: 'C', definition: 'D' }] },
        { type: 'flashcard', number: 6, difficulty: 'easy', prompt: 'Flash', options: [{ text: 'Answer', correct: true }] },
      ],
    };
    const html = generateQuizPage(quiz, config);
    expect(html).toContain('data-type="single-choice"');
    expect(html).toContain('data-type="multiple-choice"');
    expect(html).toContain('data-type="true-false"');
    expect(html).toContain('data-type="fill-in-the-blank"');
    expect(html).toContain('data-type="drag-and-drop"');
    expect(html).toContain('data-type="flashcard"');
    expect(html).toContain('Pregunta 1 de 6');
  });
});
