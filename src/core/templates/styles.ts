import { getBaseStyles } from './styles/base.js';
import { getLayoutStyles } from './styles/layout.js';
import { getIndexPageStyles } from './styles/index-page.js';
import { getChapterStyles } from './styles/chapter.js';
import { getQuizStyles } from './styles/quiz.js';
import { getResponsiveStyles } from './styles/responsive.js';
import { getDarkModeStyles } from './styles/dark-mode.js';

export function getStyles(): string {
  return [
    getBaseStyles(),
    getLayoutStyles(),
    getIndexPageStyles(),
    getChapterStyles(),
    getQuizStyles(),
    getResponsiveStyles(),
    getDarkModeStyles(),
  ].join('\n');
}
