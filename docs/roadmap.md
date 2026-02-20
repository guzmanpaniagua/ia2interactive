# Roadmap

## Fase 0 — Fundación (MVP)
- [x] Tipos TypeScript para 6 tipos de pregunta
- [x] Parser Markdown quiz → JSON (fichero único y preguntas individuales)
- [x] Runtime JS: quiz stepper, feedback, resultados, progress tracking
- [x] CLI: `node lib/cli.js build ./mi-curso` → `dist/`
- [x] Template HTML responsive con sidebar y navegación
- [x] 6 tipos: single-choice, multiple-choice, true-false, fill-in-the-blank, drag-and-drop, flashcard
- [x] Shuffle de opciones en runtime
- [x] Progress tracking con localStorage
- [x] Arquitectura simplificada (sin monorepo)
- [x] Markdown completo con `marked` para contenido

## Fase 0.5 — Pulir y estabilizar
- [x] Touch support para drag-and-drop (móvil)
- [x] Estilos para tablas y bloques de código en contenido
- [x] Tests básicos (quiz-parser, parser, build)
- [x] Validación de input (error claro si `type:` inválido)
- [x] Fill-in-the-blank tolerante a acentos, mayúsculas y espacios
- [x] Sidebar marca capítulo actual en página de quiz
- [x] Flashcard altura fija (no salta al voltear)
- [x] README.md para GitHub/npm
- [x] Favicon
- [x] .npmignore
- [x] Modo oscuro automático (prefers-color-scheme)
- [x] Animación de transición entre preguntas
- [x] CLI output mejorado con colores y resumen
- [x] CTA al quiz desde el contenido del capítulo
- [ ] Publicar en npm + GitHub

## Fase 1 — Experiencias interactivas
- [ ] Motor swipe (estilo Tinder para verdadero/falso)
- [ ] Animaciones de transición entre preguntas
- [ ] Modo oscuro / temas configurables (`theme` en course.yaml)
- [ ] Sonidos opcionales de feedback
- [ ] Temporizador opcional por pregunta

## Fase 2 — Contenido enriquecido
- [ ] Markdown avanzado (tablas, blockquotes, listas ordenadas)
- [ ] Syntax highlighting para código
- [ ] Imágenes en preguntas y explicaciones
- [ ] Vídeos embebidos
- [ ] Hints progresivos

## Fase 3 — Gamificación y analítica
- [ ] Sistema de puntos por pregunta
- [ ] Badges y logros
- [ ] Dashboard de resultados global
- [ ] Modo repaso (preguntas mezcladas de todos los capítulos)
- [ ] Exportar resultados a JSON/CSV

## Fase 4 — Distribución
- [ ] PWA (offline con service worker)
- [ ] Exportar a SCORM/xAPI para LMS
- [ ] GitHub Action para deploy automático
- [ ] Webapp: subir Markdown y generar curso sin CLI

## Fase 5 — IA integrada
- [ ] `ia2interactive generate <tema>` para generar cursos con IA
- [ ] Generación adaptativa: más preguntas sobre temas fallados
- [ ] Traducción automática de cursos
