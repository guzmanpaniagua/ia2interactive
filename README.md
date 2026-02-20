# IA2Interactive

> Convierte contenido generado por IA en experiencias web interactivas de aprendizaje.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ¿Qué es?

**IA2Interactive** transforma contenido educativo en Markdown en sitios web estáticos con quizzes interactivos. Perfecto para convertir la salida de ChatGPT, Claude o Gemini en una experiencia de aprendizaje profesional.

```
Contenido de IA → Markdown → ia2interactive build → Web interactiva 🎉
```

### Demo

![Quiz example](https://via.placeholder.com/800x400?text=Quiz+Interactivo)

---

## ✨ Características

- 🎯 **6 tipos de pregunta**: single-choice, multiple-choice, true-false, fill-in-the-blank, drag-and-drop, flashcard
- 📱 **Responsive** — funciona en móvil, tablet y desktop
- 🖱️ **Drag & drop táctil** — soporte completo para dispositivos táctiles
- 📊 **Progreso** — tracking con localStorage, barra de progreso en sidebar
- 🔀 **Shuffle** — las opciones se barajan en cada intento
- ✍️ **Tolerante** — fill-in-the-blank acepta variaciones de acentos, mayúsculas y espacios
- 📝 **Markdown completo** — tablas, código, blockquotes, imágenes...
- 🚀 **Zero backend** — genera HTML estático, despliega en cualquier hosting
- 🤖 **IA-ready** — prompts incluidos para generar contenido con cualquier IA

---

## 🚀 Quickstart

### Instalación

```bash
git clone https://github.com/tu-usuario/ia2interactive.git
cd ia2interactive
npm install
npm run build
```

### Crear tu primer curso

```bash
mkdir -p mi-curso/chapters/01-intro/questions
```

**mi-curso/course.yaml:**
```yaml
title: Mi Primer Curso
description: Un curso de ejemplo
author: Tu Nombre
language: es

chapters:
  - dir: 01-intro
    title: Introducción
```

**mi-curso/chapters/01-intro/content.md:**
```markdown
# Introducción

Este es el contenido de tu primer capítulo.

## Conceptos clave

- **Concepto 1:** Descripción...
- **Concepto 2:** Descripción...
```

**mi-curso/chapters/01-intro/questions/01-pregunta.md:**
```markdown
type: single-choice
difficulty: easy

## ¿Cuál es el concepto más importante?

- [ ] Opción incorrecta
- [x] Opción correcta
- [ ] Otra incorrecta

> **Explicación:** La opción correcta es la mejor porque...
```

### Build y preview

```bash
node lib/cli.js build mi-curso
npx serve dist
```

O con el ejemplo incluido:

```bash
npm start
```

---

## 📁 Estructura de un curso

```
mi-curso/
├── course.yaml                    # Configuración del curso
├── chapters/
│   ├── 01-intro/
│   │   ├── content.md             # Contenido del capítulo
│   │   └── questions/             # Preguntas individuales
│   │       ├── 01-single.md
│   │       ├── 02-multiple.md
│   │       ├── 03-true-false.md
│   │       ├── 04-drag-drop.md
│   │       ├── 05-fill-blank.md
│   │       └── 06-flashcard.md
│   └── 02-otro-tema/
│       ├── content.md
│       └── questions/
└── assets/                        # Imágenes opcionales
```

---

## 🧩 Tipos de pregunta

### Single-choice
```markdown
type: single-choice
difficulty: easy

## ¿Pregunta?

- [ ] Incorrecta
- [x] Correcta
- [ ] Incorrecta

> **Explicación:** texto...
```

### Multiple-choice
```markdown
type: multiple-choice
difficulty: medium

## Selecciona todas las correctas

- [x] Correcta 1
- [ ] Incorrecta
- [x] Correcta 2

> **Explicación:** texto...
```

### True-false
```markdown
type: true-false
difficulty: easy

## ¿Afirmación?

- [x] Verdadero: explicación
- [ ] Falso: explicación

> **Explicación:** texto...
```

### Drag-and-drop
```markdown
type: drag-and-drop
difficulty: medium

## Relaciona cada concepto

- Concepto A :: Definición A
- Concepto B :: Definición B

> **Explicación:** texto...
```

### Flashcard
```markdown
type: flashcard
difficulty: easy

## ¿Pregunta conceptual?

- [x] Respuesta que aparece al voltear la tarjeta.

> **Explicación:** texto...
```

### Fill-in-the-blank
```markdown
type: fill-in-the-blank
difficulty: easy

## Completa: Principio de ______ privilegio

answer: mínimo

> **Explicación:** texto...
```

---

## 🤖 Generar contenido con IA

Incluimos prompts listos para usar con ChatGPT, Claude, Gemini, etc. Ver [docs/ai-prompts.md](docs/ai-prompts.md).

Ejemplo rápido — pega esto en tu IA favorita:

```text
Genera un capítulo completo sobre "Introducción a Docker" para IA2Interactive.
Necesito: content.md + 6 preguntas (una de cada tipo: single-choice,
multiple-choice, true-false, drag-and-drop, fill-in-the-blank, flashcard).
Cada pregunta en archivo separado con: type, difficulty, ## enunciado,
opciones y > **Explicación:**
```

---

## 🛠️ Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compila TypeScript → `lib/` |
| `npm start` | Build + genera ejemplo + serve en localhost |
| `npm test` | Ejecuta tests con vitest |
| `npm run dev` | Watch mode para desarrollo |
| `npm run deploy` | Despliega en GitHub Pages |

---

## 📖 Documentación

- [Visión del proyecto](docs/vision.md)
- [Arquitectura](docs/architecture.md)
- [Formato de entrada](docs/input-format.md)
- [Tipos de pregunta](docs/question-types.md)
- [Prompts para IA](docs/ai-prompts.md)
- [Roadmap](docs/roadmap.md)

---

## 🗺️ Roadmap

- ✅ **Fase 0** — MVP: 6 tipos de pregunta, CLI, templates responsive, progress tracking
- ✅ **Fase 0.5** — Pulido: touch support, validación, tests, markdown completo
- 🔲 **Fase 1** — Motor swipe, animaciones, temas, temporizador
- 🔲 **Fase 2** — Syntax highlighting, imágenes, vídeos, hints
- 🔲 **Fase 3** — Gamificación, badges, dashboard, modo repaso
- 🔲 **Fase 4** — PWA, SCORM, GitHub Actions, webapp
- 🔲 **Fase 5** — Generación con IA integrada

Ver [roadmap completo](docs/roadmap.md).

---

## 📄 Licencia

[MIT](LICENSE)
