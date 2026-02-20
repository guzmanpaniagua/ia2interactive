import { getShuffleJs } from './shuffle.js';
import { getSidebarJs } from './sidebar.js';
import { getProgressJs } from './progress.js';
import { getStepperJs } from './stepper.js';
import { getChoiceHandlersJs } from './handlers-choice.js';
import { getFillHandlerJs } from './handlers-fill.js';
import { getDragHandlerJs } from './handlers-drag.js';
import { getFlashcardHandlerJs } from './handlers-flashcard.js';

export function getRuntimeJs(): string {
  return `
(function() {
  'use strict';
${getShuffleJs()}
${getSidebarJs()}
${getProgressJs()}
${getStepperJs()}
${getChoiceHandlersJs()}
${getFillHandlerJs()}
${getDragHandlerJs()}
${getFlashcardHandlerJs()}
})();
`;
}
