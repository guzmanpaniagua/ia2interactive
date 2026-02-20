import { getQuizLayoutStyles } from './quiz-layout.js';
import { getQuizCardStyles } from './quiz-card.js';
import { getQuizMultipleChoiceStyles } from './quiz-multiple-choice.js';
import { getQuizTrueFalseStyles } from './quiz-true-false.js';
import { getQuizFillBlankStyles } from './quiz-fill-blank.js';
import { getQuizDragDropStyles } from './quiz-drag-drop.js';
import { getQuizFlashcardStyles } from './quiz-flashcard.js';

export function getQuizStyles(): string {
  return [
    getQuizLayoutStyles(),
    getQuizCardStyles(),
    getQuizMultipleChoiceStyles(),
    getQuizTrueFalseStyles(),
    getQuizFillBlankStyles(),
    getQuizDragDropStyles(),
    getQuizFlashcardStyles(),
  ].join('\n');
}
