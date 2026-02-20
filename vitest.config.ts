import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/cli.ts',
        'src/index.ts',
        'src/core/index.ts',
        'src/core/loader.ts',
        'src/core/renderer.ts',
        'src/core/builder.ts',
        'src/core/templates/runtime/**',
        'src/core/templates/questions/index.ts',
        'src/core/templates/questions/choice.ts',
        'src/core/templates/index-page.ts',
        'src/schemas/build.ts',
        'src/schemas/chapter.ts',
        'src/schemas/course.ts',
        'src/schemas/quiz.ts',
        'scripts/**',
      ],
    },
  },
});
