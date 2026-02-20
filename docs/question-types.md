# Tipos de pregunta

IA2Interactive soporta 6 tipos de pregunta. Cada pregunta va en un archivo `.md` individual dentro de `questions/`.

## Single-choice

```markdown
type: single-choice
difficulty: easy

## ¿Qué es AWS IAM?

- [ ] Un servicio de almacenamiento
- [x] Un servicio para controlar el acceso
- [ ] Un servicio de bases de datos

> **Explicación:** IAM permite gestionar el acceso...
```

## Multiple-choice

```markdown
type: multiple-choice
difficulty: medium

## Selecciona todos los componentes de IAM

- [x] Usuarios
- [x] Grupos
- [x] Roles
- [ ] Subredes

> **Explicación:** Los componentes principales son...
```

## True-false

```markdown
type: true-false
difficulty: easy

## ¿IAM es un servicio global?

- [x] Verdadero: IAM es un servicio global disponible en todas las regiones
- [ ] Falso: IAM es un servicio regional limitado a una zona

> **Explicación:** IAM es global...
```

## Fill-in-the-blank

```markdown
type: fill-in-the-blank
difficulty: easy

## Principio de ______ privilegio

answer: mínimo

> **Explicación:** IAM sigue el principio de mínimo privilegio...
```

## Drag-and-drop

```markdown
type: drag-and-drop
difficulty: medium

## Relaciona cada concepto con su definición

- Usuario :: Persona o aplicación que interactúa con AWS
- Grupo :: Colección de usuarios con los mismos permisos
- Rol :: Identidad con permisos temporales

> **Explicación:** Cada componente cumple una función específica...
```

## Flashcard

```markdown
type: flashcard
difficulty: easy

## ¿Qué características tiene el usuario root?

- [x] Tiene acceso completo a todos los recursos. Se recomienda protegerlo con MFA.

> **Explicación:** El usuario root es la identidad con máximos privilegios...
```

## Referencia de campos

| Campo | Obligatorio | Valores |
|-------|-------------|---------|
| `type` | ✅ | `single-choice`, `multiple-choice`, `true-false`, `fill-in-the-blank`, `drag-and-drop`, `flashcard` |
| `difficulty` | ✅ | `easy`, `medium`, `hard` |
| `## Enunciado` | ✅ | Texto de la pregunta |
| `- [ ] / - [x]` | Para choice/tf/flashcard | Opciones de respuesta |
| `answer:` | Solo fill-in-the-blank | Respuesta correcta |
| `- A :: B` | Solo drag-and-drop | Pares concepto-definición |
| `> **Explicación:**` | Opcional | Explicación tras responder |
