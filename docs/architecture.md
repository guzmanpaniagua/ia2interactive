# Arquitectura

    ia2interactive/
    ├── src/
    │   ├── cli.ts                     # Entry point CLI
    │   ├── index.ts                   # Entry point librería
    │   ├── schemas/                   # Tipos e interfaces
    │   └── core/                      # Motor principal
    │       ├── build.ts               # Orquestador del build
    │       ├── parser.ts              # Parsea course.yaml + chapters
    │       ├── quiz-parser.ts         # Parsea preguntas Markdown
    │       ├── markdown.ts            # Markdown → HTML (marked)
    │       └── templates/
    │           ├── layout.ts          # Shell HTML con sidebar
    │           ├── chapter-page.ts    # Contenido + CTA quiz
    │           ├── quiz-page.ts       # Stepper + resultados
    │           ├── runtime.ts         # JS del navegador
    │           ├── questions/         # Templates por tipo
    │           └── styles/            # CSS por responsabilidad
    ├── tests/                         # Tests con vitest
    ├── examples/aws-iam/              # Curso de ejemplo
    ├── docs/                          # Documentación
    ├── lib/                           # tsc output (gitignored)
    └── dist/                          # curso output (gitignored)

## Flujo de build

| Comando | Descripción |
|---------|-------------|
| npm run build | tsc: src/ → lib/ |
| npm start | build + genera ejemplo + serve |
| npm test | vitest |
| npm run deploy | GitHub Pages |

## Pipeline de datos

    course.yaml
        │
        ▼
    parseCourseConfig()  →  CourseConfig
        │
        ▼
    parseChapter()       →  Chapter
        ├── content.md        → markdownToHtml()    → HTML
        └── questions/*.md    → parseSingleQuestion() → Question[]
        │
        ▼
    Templates
        ├── layout()              → Shell con sidebar + progreso
        ├── generateChapterPage() → Contenido + CTA quiz
        └── generateQuizPage()    → Stepper + resultados
        │
        ▼
    build()  →  dist/
        ├── index.html           (redirect al primer capítulo)
        ├── {slug}.html          (páginas de contenido)
        ├── {slug}-quiz.html     (páginas de quiz)
        └── assets/              (CSS, JS, favicon)

## Características del runtime

- **Stepper** — una pregunta a la vez con animación slide-in
- **Shuffle** — baraja opciones en cada intento
- **Progress** — guarda resultados en localStorage
- **Touch** — drag-and-drop funcional en móvil
- **Normalización** — fill-in-the-blank tolera acentos y mayúsculas
- **Modo oscuro** — automático según preferencia del sistema
