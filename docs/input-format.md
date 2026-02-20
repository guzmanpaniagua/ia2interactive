# Formato de entrada

## Estructura de un curso

```
mi-curso/
├── course.yaml
├── chapters/
│   ├── 01-intro/
│   │   ├── content.md
│   │   └── questions/
│   │       ├── 01-que-es.md           (single-choice)
│   │       ├── 02-verdadero-falso.md  (true-false)
│   │       ├── 03-componentes.md      (multiple-choice)
│   │       ├── 04-drag-drop.md        (drag-and-drop)
│   │       ├── 05-completar.md        (fill-in-the-blank)
│   │       └── 06-flashcard.md        (flashcard)
│   └── 02-otro-tema/
│       ├── content.md
│       └── questions/
└── assets/                            # Imágenes opcionales
```

## course.yaml

```yaml
title: Introducción a AWS IAM
description: Aprende los conceptos fundamentales de AWS IAM.
author: IA2Interactive
language: es

chapters:
  - dir: 01-intro
    title: ¿Qué es IAM?
  - dir: 02-policies
    title: Políticas y permisos
```

## Contenido (`content.md`)

Markdown estándar:

```markdown
# ¿Qué es AWS IAM?

**AWS Identity and Access Management (IAM)** es un servicio global...

## Conceptos clave

- **Usuarios:** Representan personas o aplicaciones...
- **Grupos:** Colecciones de usuarios...
```

## Preguntas (`questions/`)

Cada pregunta en su propio archivo `.md`. Ver [Tipos de pregunta](./question-types.md) para el formato de cada tipo.
