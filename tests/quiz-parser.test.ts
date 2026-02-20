import { describe, it, expect } from 'vitest';
import { parseSingleQuestionMarkdown, parseQuizMarkdown, parseQuiz } from '../src/core/quiz-parser.js';
import type { SingleChoiceQuestion, MultipleChoiceQuestion, TrueFalseQuestion, FillInTheBlankQuestion, DragAndDropQuestion, FlashcardQuestion } from '../src/schemas/index.js';

describe('parseSingleQuestionMarkdown', () => {
  it('parses single-choice question', () => {
    const md = `type: single-choice
difficulty: easy

## ¿Qué es IAM?

- [ ] Almacenamiento
- [x] Control de acceso
- [ ] Bases de datos

> **Explicación:** IAM controla el acceso.`;

    const q = parseSingleQuestionMarkdown(md, 1) as SingleChoiceQuestion;
    expect(q.type).toBe('single-choice');
    expect(q.difficulty).toBe('easy');
    expect(q.prompt).toBe('¿Qué es IAM?');
    expect(q.options).toHaveLength(3);
    expect(q.options[0].correct).toBe(false);
    expect(q.options[1].correct).toBe(true);
    expect(q.options[1].text).toBe('Control de acceso');
    expect(q.explanation).toContain('IAM controla');
  });

  it('parses multiple-choice question', () => {
    const md = `type: multiple-choice
difficulty: medium

## Selecciona los componentes de IAM

- [x] Usuarios
- [x] Grupos
- [ ] Subredes
- [x] Roles

> **Explicación:** Usuarios, Grupos y Roles son componentes de IAM.`;

    const q = parseSingleQuestionMarkdown(md, 2) as MultipleChoiceQuestion;
    expect(q.type).toBe('multiple-choice');
    expect(q.options).toHaveLength(4);
    expect(q.options.filter(o => o.correct)).toHaveLength(3);
  });

  it('parses true-false question', () => {
    const md = `type: true-false
difficulty: easy

## ¿IAM es global?

- [x] Verdadero: IAM es global
- [ ] Falso: IAM es regional

> **Explicación:** IAM es global.`;

    const q = parseSingleQuestionMarkdown(md, 3) as TrueFalseQuestion;
    expect(q.type).toBe('true-false');
    expect(q.options).toHaveLength(2);
    expect(q.options[0].correct).toBe(true);
    expect(q.options[0].text).toContain('Verdadero');
  });

  it('parses fill-in-the-blank question', () => {
    const md = `type: fill-in-the-blank
difficulty: easy

## Principio de ______ privilegio

answer: mínimo

> **Explicación:** Mínimo privilegio.`;

    const q = parseSingleQuestionMarkdown(md, 4) as FillInTheBlankQuestion;
    expect(q.type).toBe('fill-in-the-blank');
    expect(q.answer).toBe('mínimo');
    expect(q.prompt).toContain('______');
  });

  it('parses drag-and-drop question', () => {
    const md = `type: drag-and-drop
difficulty: medium

## Relaciona conceptos

- Usuario :: Persona que usa AWS
- Grupo :: Colección de usuarios
- Rol :: Permisos temporales

> **Explicación:** Cada componente tiene su función.`;

    const q = parseSingleQuestionMarkdown(md, 5) as DragAndDropQuestion;
    expect(q.type).toBe('drag-and-drop');
    expect(q.pairs).toHaveLength(3);
    expect(q.pairs[0].concept).toBe('Usuario');
    expect(q.pairs[0].definition).toBe('Persona que usa AWS');
  });

  it('parses flashcard question', () => {
    const md = `type: flashcard
difficulty: easy

## ¿Qué es el usuario root?

- [x] Tiene acceso completo a todos los recursos de AWS.

> **Explicación:** El root es la identidad con máximos privilegios.`;

    const q = parseSingleQuestionMarkdown(md, 6) as FlashcardQuestion;
    expect(q.type).toBe('flashcard');
    expect(q.prompt).toBe('¿Qué es el usuario root?');
    expect(q.options).toHaveLength(1);
    expect(q.options[0].correct).toBe(true);
  });

  it('assigns correct number', () => {
    const md = `type: single-choice
difficulty: easy

## Pregunta

- [x] Correcta`;

    const q = parseSingleQuestionMarkdown(md, 42);
    expect(q.number).toBe(42);
  });
});

describe('parseQuizMarkdown', () => {
  it('parses a full quiz file', () => {
    const md = `# Quiz: Test Quiz
engine_version: 1.0.0

## 1. Primera pregunta
type: single-choice
difficulty: easy

- [ ] Incorrecta
- [x] Correcta

> **Explicación:** Es correcta.

## 2. Segunda pregunta
type: true-false
difficulty: medium

- [x] Verdadero: Es verdad
- [ ] Falso: No es verdad

> **Explicación:** Es verdad.`;

    const quiz = parseQuizMarkdown(md);
    expect(quiz.title).toBe('Test Quiz');
    expect(quiz.engineVersion).toBe('1.0.0');
    expect(quiz.questions).toHaveLength(2);
    expect(quiz.questions[0].type).toBe('single-choice');
    expect(quiz.questions[1].type).toBe('true-false');
  });

  it('extracts title without Quiz: prefix', () => {
    const md = `# Quiz: Mi Quiz Especial
engine_version: 1.0.0

## 1. Pregunta
type: single-choice
difficulty: easy

- [x] Sí`;

    const quiz = parseQuizMarkdown(md);
    expect(quiz.title).toBe('Mi Quiz Especial');
  });

  it('handles quiz with no questions gracefully', () => {
    const md = `# Quiz: Vacío
engine_version: 1.0.0`;

    const quiz = parseQuizMarkdown(md);
    expect(quiz.questions).toHaveLength(0);
  });

  it('parses drag-and-drop with table format', () => {
    const md = `# Quiz: Table Quiz

## 1. Relaciona
type: drag-and-drop
difficulty: easy

| Concepto | Definición |
|----------|-----------|
| A | Alpha |
| B | Beta |

> **Explicación:** Tabla.`;

    const quiz = parseQuizMarkdown(md);
    expect(quiz.questions).toHaveLength(1);
    expect(quiz.questions[0].type).toBe('drag-and-drop');
    const q = quiz.questions[0] as DragAndDropQuestion;
    expect(q.pairs).toHaveLength(2);
    expect(q.pairs[0].concept).toBe('A');
  });

  it('parses fill-in-the-blank in quiz markdown', () => {
    const md = `# Quiz: Fill Quiz

## 1. Completa ______
type: fill-in-the-blank
difficulty: easy

> **Explicación:** Completar.`;

    const quiz = parseQuizMarkdown(md);
    expect(quiz.questions).toHaveLength(1);
    expect(quiz.questions[0].type).toBe('fill-in-the-blank');
  });

  it('parses flashcard in quiz markdown', () => {
    const md = `# Quiz: Flash Quiz

## 1. ¿Qué es?
type: flashcard
difficulty: easy

- [x] La respuesta

> **Explicación:** Detalle.`;

    const quiz = parseQuizMarkdown(md);
    expect(quiz.questions).toHaveLength(1);
    expect(quiz.questions[0].type).toBe('flashcard');
  });

  it('parses drag-and-drop with :: format in quiz markdown', () => {
    const md = `# Quiz: Drag Quiz

## 1. Relaciona
type: drag-and-drop
difficulty: medium

- A :: Alpha
- B :: Beta

> **Explicación:** Done.`;

    const quiz = parseQuizMarkdown(md);
    const q = quiz.questions[0] as DragAndDropQuestion;
    expect(q.pairs).toHaveLength(2);
  });

  it('parses multi-line explanation', () => {
    const md = `# Quiz: Explain

## 1. Q
type: single-choice
difficulty: easy

- [x] A

> **Explicación:** Primera línea.
> Segunda línea.`;

    const quiz = parseQuizMarkdown(md);
    expect(quiz.questions[0].explanation).toContain('Primera línea');
    expect(quiz.questions[0].explanation).toContain('Segunda línea');
  });
});

describe('parseQuiz (YAML)', () => {
  it('parses YAML quiz with single-choice', () => {
    const yamlContent = `
title: YAML Quiz
questions:
  - type: single-choice
    difficulty: easy
    text: "¿Qué es AWS?"
    options:
      - text: Cloud
        correct: true
      - text: Database
        correct: false
    explanation: AWS es cloud.
`;
    const quiz = parseQuiz(yamlContent);
    expect(quiz.title).toBe('YAML Quiz');
    expect(quiz.questions).toHaveLength(1);
    expect(quiz.questions[0].type).toBe('single-choice');
  });

  it('parses YAML quiz with multiple types', () => {
    const yamlContent = `
title: Multi Type
questions:
  - type: true-false
    text: "¿Es verdad?"
    options:
      - text: Verdadero
        correct: true
      - text: Falso
        correct: false
  - type: drag-and-drop
    text: Relaciona
    pairs:
      - concept: A
        definition: B
      - concept: C
        definition: D
  - type: fill-in-the-blank
    text: Completa
  - type: flashcard
    text: Flash
    options:
      - text: Answer
        correct: true
`;
    const quiz = parseQuiz(yamlContent);
    expect(quiz.questions).toHaveLength(4);
    expect(quiz.questions[0].type).toBe('true-false');
    expect(quiz.questions[1].type).toBe('drag-and-drop');
    expect(quiz.questions[2].type).toBe('fill-in-the-blank');
    expect(quiz.questions[3].type).toBe('flashcard');
  });

  it('uses fallback title', () => {
    const yamlContent = `
questions:
  - type: single-choice
    text: Q
    options:
      - text: A
        correct: true
`;
    const quiz = parseQuiz(yamlContent, 'Fallback Title');
    expect(quiz.title).toBe('Fallback Title');
  });

  it('defaults difficulty to medium', () => {
    const yamlContent = `
questions:
  - type: single-choice
    text: Q
    options:
      - text: A
        correct: true
`;
    const quiz = parseQuiz(yamlContent);
    expect(quiz.questions[0].difficulty).toBe('medium');
  });

  it('throws on invalid YAML quiz', () => {
    expect(() => parseQuiz('not_valid: true')).toThrow('missing questions');
  });

  it('throws on invalid question type in YAML', () => {
    const yamlContent = `
questions:
  - type: invalid-type
    text: Q
`;
    expect(() => parseQuiz(yamlContent)).toThrow('Invalid question type');
  });

  it('generates true-false options when empty', () => {
    const yamlContent = `
questions:
  - type: true-false
    text: "¿Es verdad?"
`;
    const quiz = parseQuiz(yamlContent);
    const q = quiz.questions[0] as TrueFalseQuestion;
    expect(q.options).toHaveLength(2);
    expect(q.options[0].text).toBe('Verdadero');
    expect(q.options[1].text).toBe('Falso');
  });
});

describe('validation errors', () => {
  it('throws on invalid type', () => {
    const md = `type: mega-quiz
difficulty: easy

## Pregunta

- [x] Sí`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('tipo "mega-quiz" no válido');
  });

  it('throws on invalid difficulty', () => {
    const md = `type: single-choice
difficulty: extreme

## Pregunta

- [x] Sí`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('dificultad "extreme" no válida');
  });

  it('throws when type is missing', () => {
    const md = `difficulty: easy

## Pregunta

- [x] Sí`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('falta el campo "type:"');
  });

  it('throws when prompt is missing', () => {
    const md = `type: single-choice
difficulty: easy

- [x] Sí`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('falta el enunciado');
  });

  it('throws when single-choice has no correct option', () => {
    const md = `type: single-choice
difficulty: easy

## Pregunta

- [ ] A
- [ ] B`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('exactamente 1 opción correcta');
  });

  it('throws when single-choice has multiple correct', () => {
    const md = `type: single-choice
difficulty: easy

## Pregunta

- [x] A
- [x] B`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('exactamente 1 opción correcta');
  });

  it('throws when true-false has wrong number of options', () => {
    const md = `type: true-false
difficulty: easy

## Pregunta

- [x] Verdadero`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('exactamente 2 opciones');
  });

  it('throws when fill-in-the-blank has no answer', () => {
    const md = `type: fill-in-the-blank
difficulty: easy

## Principio de ______ privilegio`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('falta el campo "answer:"');
  });

  it('throws when drag-and-drop has less than 2 pairs', () => {
    const md = `type: drag-and-drop
difficulty: easy

## Relaciona

- Solo :: Un par`;

    expect(() => parseSingleQuestionMarkdown(md, 1))
      .toThrow('al menos 2 pares');
  });
});
