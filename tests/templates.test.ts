import { describe, it, expect } from 'vitest';
import { renderMultipleChoiceQuestion } from '../src/core/templates/questions/multiple-choice.js';
import { renderTrueFalseQuestion } from '../src/core/templates/questions/true-false.js';
import { renderFillBlankQuestion } from '../src/core/templates/questions/fill-blank.js';
import { renderDragDropQuestion } from '../src/core/templates/questions/drag-drop.js';
import { renderFlashcardQuestion } from '../src/core/templates/questions/flashcard.js';
import type {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillInTheBlankQuestion,
  DragAndDropQuestion,
  FlashcardQuestion,
} from '../src/schemas/index.js';

describe('renderMultipleChoiceQuestion', () => {
  it('renders single-choice with radio buttons', () => {
    const q: SingleChoiceQuestion = {
      type: 'single-choice',
      number: 1,
      difficulty: 'easy',
      prompt: '¿Qué es AWS?',
      options: [
        { text: 'Cloud', correct: true },
        { text: 'Database', correct: false },
      ],
    };
    const html = renderMultipleChoiceQuestion(q, 0);
    expect(html).toContain('type="radio"');
    expect(html).toContain('¿Qué es AWS?');
    expect(html).toContain('Cloud');
    expect(html).toContain('Database');
    expect(html).toContain('data-type="single-choice"');
    expect(html).toContain('badge-easy');
    expect(html).toContain('Pregunta 1');
  });

  it('renders multiple-choice with checkboxes and check button', () => {
    const q: MultipleChoiceQuestion = {
      type: 'multiple-choice',
      number: 2,
      difficulty: 'medium',
      prompt: 'Selecciona todos',
      options: [
        { text: 'A', correct: true },
        { text: 'B', correct: true },
        { text: 'C', correct: false },
      ],
      explanation: 'A y B son correctas',
    };
    const html = renderMultipleChoiceQuestion(q, 1);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checkMultipleChoice');
    expect(html).toContain('data-type="multiple-choice"');
    expect(html).toContain('A y B son correctas');
  });

  it('renders without explanation when not provided', () => {
    const q: SingleChoiceQuestion = {
      type: 'single-choice',
      number: 1,
      difficulty: 'easy',
      prompt: 'Test',
      options: [{ text: 'A', correct: true }],
    };
    const html = renderMultipleChoiceQuestion(q, 0);
    expect(html).not.toContain('question-explanation');
  });
});

describe('renderTrueFalseQuestion', () => {
  it('renders true/false buttons', () => {
    const q: TrueFalseQuestion = {
      type: 'true-false',
      number: 1,
      difficulty: 'easy',
      prompt: '¿IAM es global?',
      options: [
        { text: 'Verdadero: IAM es global', correct: true },
        { text: 'Falso: IAM es regional', correct: false },
      ],
    };
    const html = renderTrueFalseQuestion(q, 0);
    expect(html).toContain('tf-btn');
    expect(html).toContain('data-type="true-false"');
    expect(html).toContain('¿IAM es global?');
    expect(html).toContain('data-correct="Verdadero"');
  });

  it('renders with explanation', () => {
    const q: TrueFalseQuestion = {
      type: 'true-false',
      number: 2,
      difficulty: 'medium',
      prompt: 'Test',
      options: [
        { text: 'Verdadero', correct: false },
        { text: 'Falso', correct: true },
      ],
      explanation: 'Es falso',
    };
    const html = renderTrueFalseQuestion(q, 1);
    expect(html).toContain('Es falso');
    expect(html).toContain('data-correct="Falso"');
  });
});

describe('renderFillBlankQuestion', () => {
  it('renders input and check button', () => {
    const q: FillInTheBlankQuestion = {
      type: 'fill-in-the-blank',
      number: 1,
      difficulty: 'easy',
      prompt: 'Principio de ______ privilegio',
      answer: 'mínimo',
    };
    const html = renderFillBlankQuestion(q, 0);
    expect(html).toContain('fill-input');
    expect(html).toContain('data-correct="mínimo"');
    expect(html).toContain('checkFillAnswer');
    expect(html).toContain('data-type="fill-in-the-blank"');
    expect(html).toContain('role="form"');
    expect(html).toContain('aria-live="assertive"');
  });

  it('renders with explanation', () => {
    const q: FillInTheBlankQuestion = {
      type: 'fill-in-the-blank',
      number: 2,
      difficulty: 'hard',
      prompt: 'Test',
      answer: 'respuesta',
      explanation: 'Porque sí',
    };
    const html = renderFillBlankQuestion(q, 1);
    expect(html).toContain('Porque sí');
    expect(html).toContain('badge-hard');
  });
});

describe('renderDragDropQuestion', () => {
  it('renders drag concepts and drop zones', () => {
    const q: DragAndDropQuestion = {
      type: 'drag-and-drop',
      number: 1,
      difficulty: 'medium',
      prompt: 'Relaciona',
      pairs: [
        { concept: 'Usuario', definition: 'Persona' },
        { concept: 'Grupo', definition: 'Colección' },
      ],
    };
    const html = renderDragDropQuestion(q, 0);
    expect(html).toContain('drag-concept');
    expect(html).toContain('drop-zone');
    expect(html).toContain('Usuario');
    expect(html).toContain('Persona');
    expect(html).toContain('Grupo');
    expect(html).toContain('Colección');
    expect(html).toContain('data-type="drag-and-drop"');
    expect(html).toContain('draggable="true"');
    expect(html).toContain('checkDragAnswer');
    expect(html).toContain('role="list"');
  });

  it('renders with explanation', () => {
    const q: DragAndDropQuestion = {
      type: 'drag-and-drop',
      number: 2,
      difficulty: 'easy',
      prompt: 'Test',
      pairs: [
        { concept: 'A', definition: 'B' },
        { concept: 'C', definition: 'D' },
      ],
      explanation: 'Explicación drag',
    };
    const html = renderDragDropQuestion(q, 1);
    expect(html).toContain('Explicación drag');
  });
});

describe('renderFlashcardQuestion', () => {
  it('renders flashcard with front and back', () => {
    const q: FlashcardQuestion = {
      type: 'flashcard',
      number: 1,
      difficulty: 'easy',
      prompt: '¿Qué es IAM?',
      options: [{ text: 'Control de acceso', correct: true }],
    };
    const html = renderFlashcardQuestion(q, 0);
    expect(html).toContain('flashcard-front');
    expect(html).toContain('flashcard-back');
    expect(html).toContain('¿Qué es IAM?');
    expect(html).toContain('Control de acceso');
    expect(html).toContain('data-type="flashcard"');
    expect(html).toContain('Toca para voltear');
    expect(html).toContain('No lo sab');
    expect(html).toContain('Lo sab');
    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
  });

  it('falls back to explanation when no correct option', () => {
    const q: FlashcardQuestion = {
      type: 'flashcard',
      number: 2,
      difficulty: 'medium',
      prompt: 'Pregunta',
      options: [],
      explanation: 'La respuesta es esta',
    };
    const html = renderFlashcardQuestion(q, 1);
    expect(html).toContain('La respuesta es esta');
  });

  it('renders with explanation section', () => {
    const q: FlashcardQuestion = {
      type: 'flashcard',
      number: 3,
      difficulty: 'hard',
      prompt: 'Test',
      options: [{ text: 'Answer', correct: true }],
      explanation: 'Detalle extra',
    };
    const html = renderFlashcardQuestion(q, 2);
    expect(html).toContain('question-explanation');
    expect(html).toContain('Detalle extra');
    expect(html).toContain('badge-hard');
  });
});
