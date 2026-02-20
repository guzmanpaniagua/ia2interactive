import yaml from 'js-yaml';
import type {
  Quiz,
  Question,
  QuestionType,
  Difficulty,
  Option,
  DragPair,
  RawQuiz,
  RawQuestion,
} from '../schemas/index.js';
import { QUESTION_TYPES, DIFFICULTIES, ENGINE_VERSION } from '../schemas/index.js';

function isValidType(t: string): t is QuestionType {
  return (QUESTION_TYPES as readonly string[]).includes(t);
}

function isValidDifficulty(d: string): d is Difficulty {
  return (DIFFICULTIES as readonly string[]).includes(d);
}

function parseQuestion(raw: RawQuestion, num: number): Question {
  if (!isValidType(raw.type)) {
    throw new Error(`Invalid question type: ${raw.type}`);
  }

  const difficulty: Difficulty = raw.difficulty && isValidDifficulty(raw.difficulty)
    ? raw.difficulty
    : 'medium';

  const base = {
    number: num,
    difficulty,
    prompt: raw.text,
    explanation: raw.explanation ?? '',
  };

  switch (raw.type) {
    case 'single-choice':
    case 'multiple-choice':
    case 'true-false': {
      const options: Option[] = (raw.options ?? []).map((o) => ({
        text: o.text,
        correct: o.correct ?? false,
      }));
      if (raw.type === 'true-false' && options.length === 0) {
        return {
          ...base,
          type: 'true-false',
          options: [
            { text: 'Verdadero', correct: true },
            { text: 'Falso', correct: false },
          ],
        };
      }
      return { ...base, type: raw.type, options };
    }
    case 'drag-and-drop': {
      const pairs: DragPair[] = (raw.pairs ?? []).map((p) => ({
        concept: p.concept,
        definition: p.definition,
      }));
      return { ...base, type: 'drag-and-drop', pairs };
    }
    case 'flashcard': {
      const options: Option[] = (raw.options ?? []).map((o) => ({
        text: o.text,
        correct: o.correct ?? false,
      }));
      return { ...base, type: 'flashcard', options };
    }
    case 'fill-in-the-blank':
      return { ...base, type: 'fill-in-the-blank', answer: '' };
    default:
      throw new Error(`Unsupported question type: ${raw.type}`);
  }
}

export function parseQuiz(yamlContent: string, fallbackTitle?: string): Quiz {
  const raw = yaml.load(yamlContent) as RawQuiz;
  if (!raw || !raw.questions) {
    throw new Error('Invalid quiz YAML: missing questions');
  }

  const questions: Question[] = raw.questions.map((q, i) => parseQuestion(q, i + 1));

  return {
    title: raw.title ?? fallbackTitle ?? 'Quiz',
    engineVersion: ENGINE_VERSION,
    questions,
  };
}

export function parseQuizMarkdown(md: string): Quiz {
  const lines = md.split('\n');
  let title = '';
  let engineVersion = '1.0.0';
  const questions: Question[] = [];

  let curNumber = 0;
  let curType: QuestionType = 'single-choice';
  let curDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
  let curPrompt = '';
  let curOptions: Array<{ text: string; correct: boolean }> = [];
  let curPairs: Array<{ concept: string; definition: string }> = [];
  let curExplanation = '';
  let inQuestion = false;
  let inTable = false;

  const flushQuestion = () => {
    if (inQuestion && curPrompt) {
      const base = {
        number: curNumber || questions.length + 1,
        difficulty: curDifficulty as 'easy' | 'medium' | 'hard',
        prompt: curPrompt.trim(),
        explanation: curExplanation.trim() || undefined,
      };

      switch (curType) {
        case 'single-choice':
          questions.push({ ...base, type: 'single-choice', options: curOptions });
          break;
        case 'multiple-choice':
          questions.push({ ...base, type: 'multiple-choice', options: curOptions });
          break;
        case 'true-false':
          questions.push({ ...base, type: 'true-false', options: curOptions });
          break;
        case 'drag-and-drop':
          questions.push({ ...base, type: 'drag-and-drop', pairs: curPairs });
          break;
        case 'flashcard':
          questions.push({ ...base, type: 'flashcard', options: curOptions });
          break;
        case 'fill-in-the-blank':
          questions.push({ ...base, type: 'fill-in-the-blank', answer: '' });
          break;
      }
    }
    curNumber = 0;
    curType = 'single-choice';
    curDifficulty = 'easy';
    curPrompt = '';
    curOptions = [];
    curPairs = [];
    curExplanation = '';
    inQuestion = false;
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      title = trimmed.replace(/^#\s+/, '').replace(/^Quiz:\s*/i, '');
      continue;
    }

    if (trimmed.startsWith('engine_version:')) {
      engineVersion = trimmed.replace('engine_version:', '').trim();
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushQuestion();
      const heading = trimmed.replace(/^##\s+/, '');
      const num = parseInt(heading.match(/\d+/)?.[0] || '0', 10);
      curNumber = num || questions.length + 1;
      curPrompt = heading.replace(/^\d+\.\s*/, '');
      inQuestion = true;
      continue;
    }

    if (!inQuestion) continue;

    if (trimmed.startsWith('type:')) {
      curType = trimmed.replace('type:', '').trim() as QuestionType;
      continue;
    }
    if (trimmed.startsWith('difficulty:')) {
      curDifficulty = trimmed.replace('difficulty:', '').trim() as 'easy' | 'medium' | 'hard';
      continue;
    }

    if (trimmed.startsWith('> **Explicación:**') || trimmed.startsWith('> **Explanation:**')) {
      curExplanation = trimmed.replace(/^>\s*\*\*[^*]+\*\*\s*/, '');
      continue;
    }
    if (trimmed.startsWith('>') && curExplanation) {
      curExplanation += ' ' + trimmed.replace(/^>\s*/, '');
      continue;
    }

    const optMatch = trimmed.match(/^-\s+\[([ xX])\]\s+(.+)$/);
    if (optMatch) {
      curOptions.push({
        text: optMatch[2].trim(),
        correct: optMatch[1].toLowerCase() === 'x',
      });
      continue;
    }

    const pairMatch = trimmed.match(/^-\s+(.+?)\s*::\s*(.+)$/);
    if (pairMatch && curType === 'drag-and-drop') {
      curPairs.push({ concept: pairMatch[1].trim(), definition: pairMatch[2].trim() });
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());

      if (cells.every((c) => /^[-:]+$/.test(c))) {
        inTable = true;
        continue;
      }

      if (!inTable) continue;

      if (cells.length >= 2) {
        curPairs.push({ concept: cells[0], definition: cells[1] });
      }
      continue;
    } else {
      inTable = false;
    }

    if (trimmed && !curPrompt) {
      curPrompt = trimmed;
    } else if (trimmed && curPrompt && !curOptions.length && !curPairs.length && !trimmed.startsWith('type:') && !trimmed.startsWith('difficulty:')) {
      curPrompt += '\n' + trimmed;
    }
  }

  flushQuestion();

  return { title, engineVersion, questions };
}

export function parseSingleQuestionMarkdown(md: string, number: number): Question {
  const lines = md.split('\n');
  let type: QuestionType = 'single-choice';
  let typeFound = false;
  let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  let prompt = '';
  const options: Array<{ text: string; correct: boolean }> = [];
  const pairs: Array<{ concept: string; definition: string }> = [];
  let explanation = '';
  let answer = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('<!--') || trimmed === '') continue;

    if (trimmed.startsWith('type:')) {
      const rawType = trimmed.replace('type:', '').trim();
      if (!isValidType(rawType)) {
        throw new Error(
          `Pregunta ${number}: tipo "${rawType}" no válido. ` +
          `Tipos soportados: ${QUESTION_TYPES.join(', ')}`
        );
      }
      type = rawType;
      typeFound = true;
      continue;
    }
    if (trimmed.startsWith('difficulty:')) {
      const rawDiff = trimmed.replace('difficulty:', '').trim();
      if (!isValidDifficulty(rawDiff)) {
        throw new Error(
          `Pregunta ${number}: dificultad "${rawDiff}" no válida. ` +
          `Valores soportados: ${DIFFICULTIES.join(', ')}`
        );
      }
      difficulty = rawDiff;
      continue;
    }
    if (trimmed.startsWith('answer:')) {
      answer = trimmed.replace('answer:', '').trim();
      continue;
    }

    if (trimmed.startsWith('## ')) {
      prompt = trimmed.replace(/^##\s+/, '');
      continue;
    }

    if (trimmed.startsWith('> **Explicación:**') || trimmed.startsWith('> **Explanation:**')) {
      explanation = trimmed.replace(/^>\s*\*\*[^*]+\*\*\s*/, '');
      continue;
    }
    if (trimmed.startsWith('>') && explanation) {
      explanation += ' ' + trimmed.replace(/^>\s*/, '');
      continue;
    }

    const optMatch = trimmed.match(/^-\s+\[([ xX])\]\s+(.+)$/);
    if (optMatch) {
      options.push({
        text: optMatch[2].trim(),
        correct: optMatch[1].toLowerCase() === 'x',
      });
      continue;
    }

    const pairMatch = trimmed.match(/^-\s+(.+?)\s*::\s*(.+)$/);
    if (pairMatch && type === 'drag-and-drop') {
      pairs.push({ concept: pairMatch[1].trim(), definition: pairMatch[2].trim() });
      continue;
    }
  }

  // Validaciones post-parse
  if (!typeFound) {
    throw new Error(
      `Pregunta ${number}: falta el campo "type:". ` +
      `Añade una línea como: type: single-choice`
    );
  }

  if (!prompt) {
    throw new Error(
      `Pregunta ${number} (${type}): falta el enunciado. ` +
      `Añade una línea como: ## ¿Tu pregunta?`
    );
  }

  if ((type === 'single-choice' || type === 'multiple-choice') && options.length === 0) {
    throw new Error(
      `Pregunta ${number} (${type}): no tiene opciones. ` +
      `Añade opciones como: - [x] Correcta / - [ ] Incorrecta`
    );
  }

  if (type === 'single-choice' && options.filter(o => o.correct).length !== 1) {
    throw new Error(
      `Pregunta ${number} (single-choice): debe tener exactamente 1 opción correcta, ` +
      `tiene ${options.filter(o => o.correct).length}`
    );
  }

  if (type === 'multiple-choice' && options.filter(o => o.correct).length < 1) {
    throw new Error(
      `Pregunta ${number} (multiple-choice): debe tener al menos 1 opción correcta`
    );
  }

  if (type === 'true-false' && options.length !== 2) {
    throw new Error(
      `Pregunta ${number} (true-false): debe tener exactamente 2 opciones (Verdadero/Falso), ` +
      `tiene ${options.length}`
    );
  }

  if (type === 'fill-in-the-blank' && !answer) {
    throw new Error(
      `Pregunta ${number} (fill-in-the-blank): falta el campo "answer:". ` +
      `Añade una línea como: answer: respuesta`
    );
  }

  if (type === 'drag-and-drop' && pairs.length < 2) {
    throw new Error(
      `Pregunta ${number} (drag-and-drop): necesita al menos 2 pares, ` +
      `tiene ${pairs.length}. Usa formato: - Concepto :: Definición`
    );
  }

  // Return discriminated type
  const base = {
    number,
    difficulty,
    prompt: prompt.trim(),
    explanation: explanation.trim() || undefined,
  };

  switch (type) {
    case 'single-choice':
      return { ...base, type: 'single-choice', options };
    case 'multiple-choice':
      return { ...base, type: 'multiple-choice', options };
    case 'true-false':
      return { ...base, type: 'true-false', options };
    case 'drag-and-drop':
      return { ...base, type: 'drag-and-drop', pairs };
    case 'flashcard':
      return { ...base, type: 'flashcard', options };
    case 'fill-in-the-blank':
      return { ...base, type: 'fill-in-the-blank', answer };
    default:
      throw new Error(`Pregunta ${number}: tipo "${type}" no soportado`);
  }
}
