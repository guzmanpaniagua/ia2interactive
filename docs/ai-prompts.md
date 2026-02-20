# Prompts para generar contenido con IA

Estos prompts están diseñados para que la IA (ChatGPT, Claude, Gemini, etc.) genere directamente ficheros compatibles con IA2Interactive.

Los prompts siguen el orden de los tipos definidos en el motor: `single-choice`, `multiple-choice`, `true-false`, `drag-and-drop`, `flashcard`, `fill-in-the-blank`, más un prompt para contenido y otro para generar un capítulo completo.

---

## Prompt 1 — Single-choice

> Genera preguntas de selección única.

```text
Genera preguntas tipo single-choice en formato Markdown para IA2Interactive sobre "[TU TEMA]".

Reglas estrictas del formato:
- La primera línea debe ser: # Quiz: [Título del quiz]
- La segunda línea debe ser: engine_version: 1.0.0
- Cada pregunta empieza con ## Pregunta N
- Debajo del título van los metadatos, uno por línea:
  - type: single-choice
  - difficulty: easy | medium | hard
- Después una línea en blanco y el enunciado de la pregunta
- Las opciones van como lista Markdown:
  - Incorrecta: - [ ] texto
  - Correcta: - [x] texto (solo UNA correcta)
- Al final de cada pregunta: > **Explicación:** texto
- Genera 10 preguntas variando dificultad
- No añadas nada fuera de este formato

Ejemplo:

## Pregunta 1
type: single-choice
difficulty: easy

¿Qué es X?

- [ ] Opción incorrecta
- [x] Opción correcta
- [ ] Otra incorrecta

> **Explicación:** X es... porque...
```

---

## Prompt 2 — Multiple-choice

> Genera preguntas de selección múltiple (varias respuestas correctas).

```text
Genera preguntas tipo multiple-choice en formato Markdown para IA2Interactive sobre "[TU TEMA]".

Reglas estrictas del formato:
- La primera línea debe ser: # Quiz: [Título del quiz]
- La segunda línea debe ser: engine_version: 1.0.0
- Cada pregunta empieza con ## Pregunta N
- Metadatos:
  - type: multiple-choice
  - difficulty: easy | medium | hard
- El enunciado debe indicar "Selecciona todas las opciones correctas"
- Las opciones van como lista Markdown:
  - Incorrecta: - [ ] texto
  - Correcta: - [x] texto (VARIAS correctas)
- Cada pregunta debe tener entre 2 y 4 opciones correctas y al menos 2 incorrectas
- Al final: > **Explicación:** texto
- Genera 10 preguntas variando dificultad

Ejemplo:

## Pregunta 1
type: multiple-choice
difficulty: medium

Selecciona todos los componentes principales de IAM

- [x] Usuarios
- [x] Grupos
- [x] Roles
- [ ] Subredes
- [ ] Instancias EC2

> **Explicación:** Los componentes principales son Usuarios, Grupos y Roles...
```

---

## Prompt 3 — True-false

> Genera preguntas de verdadero o falso con texto explicativo en cada opción.

```text
Genera preguntas tipo true-false en formato Markdown para IA2Interactive sobre "[TU TEMA]".

Reglas estrictas del formato:
- La primera línea debe ser: # Quiz: [Título]
- La segunda línea debe ser: engine_version: 1.0.0
- Cada pregunta empieza con ## Pregunta N
- Metadatos:
  - type: true-false
  - difficulty: easy | medium | hard
- El enunciado es una afirmación clara
- Solo dos opciones con texto descriptivo obligatorio:
  - - [x] Verdadero: [explicación de por qué es verdadero]
  - - [ ] Falso: [explicación de por qué sería falso]
  o bien al revés si la afirmación es falsa
- IMPORTANTE: Incluye texto descriptivo después de "Verdadero:" y "Falso:", no solo la palabra
- Al final: > **Explicación:** texto
- Genera 10 preguntas, equilibrando verdaderas y falsas

Ejemplo:

## Pregunta 1
type: true-false
difficulty: easy

¿IAM es un servicio global?

- [x] Verdadero: IAM es un servicio global disponible en todas las regiones
- [ ] Falso: IAM es un servicio regional limitado a una zona

> **Explicación:** IAM es un servicio global de AWS...
```

---

## Prompt 4 — Drag-and-drop

> Genera preguntas de arrastrar y soltar conceptos con sus definiciones.

```text
Genera preguntas tipo drag-and-drop en formato Markdown para IA2Interactive sobre "[TU TEMA]".

Reglas estrictas del formato:
- La primera línea debe ser: # Quiz: [Título]
- La segunda línea debe ser: engine_version: 1.0.0
- Cada pregunta empieza con ## Pregunta N
- Metadatos:
  - type: drag-and-drop
  - difficulty: easy | medium | hard
- El enunciado indica "Relaciona cada concepto con su definición"
- Los pares se definen con formato: - Concepto :: Definición
- Cada par en una línea separada
- Genera entre 3 y 6 pares por pregunta
- Al final: > **Explicación:** texto
- Genera 5 preguntas

Ejemplo:

## Pregunta 1
type: drag-and-drop
difficulty: medium

Relaciona cada concepto con su definición

- A :: Definición de A
- B :: Definición de B
- C :: Definición de C

> **Explicación:** A es..., B es..., C es...
```

---

## Prompt 5 — Flashcard

> Genera preguntas tipo tarjeta de memoria (voltear para ver la respuesta).

```text
Genera preguntas tipo flashcard en formato Markdown para IA2Interactive sobre "[TU TEMA]".

Reglas estrictas del formato:
- La primera línea debe ser: # Quiz: [Título]
- La segunda línea debe ser: engine_version: 1.0.0
- Cada pregunta empieza con ## Pregunta N
- Metadatos:
  - type: flashcard
  - difficulty: easy | medium | hard
- El enunciado es una pregunta conceptual (aparece en el frente de la tarjeta)
- La respuesta va como opción correcta: - [x] Texto detallado (aparece al voltear)
- La respuesta debe ser completa y explicativa (2-3 frases)
- Al final: > **Explicación:** texto adicional
- Genera 10 preguntas variando dificultad

Ejemplo:

## Pregunta 1
type: flashcard
difficulty: easy

¿Qué características tiene el usuario root de AWS?

- [x] Tiene acceso completo a todos los recursos y servicios de la cuenta. Se crea automáticamente al abrir la cuenta. Se recomienda protegerlo con MFA y no usarlo para tareas diarias.

> **Explicación:** El usuario root es la identidad con máximos privilegios en la cuenta...
```

---

## Prompt 6 — Fill-in-the-blank

> Genera preguntas de completar el hueco.

```text
Genera preguntas tipo fill-in-the-blank en formato Markdown para IA2Interactive sobre "[TU TEMA]".

Reglas estrictas del formato:
- La primera línea debe ser: # Quiz: [Título]
- La segunda línea debe ser: engine_version: 1.0.0
- Cada pregunta empieza con ## Pregunta N
- Metadatos:
  - type: fill-in-the-blank
  - difficulty: easy | medium | hard
- El enunciado contiene un hueco marcado con ______ (6 guiones bajos)
- Debajo del enunciado: answer: [respuesta correcta]
- La respuesta debe ser UNA sola palabra o término corto
- Al final: > **Explicación:** texto
- Genera 10 preguntas variando dificultad

Ejemplo:

## Pregunta 1
type: fill-in-the-blank
difficulty: easy

¿Qué principio de seguridad sigue IAM? Principio de ______ privilegio

answer: mínimo

> **Explicación:** IAM sigue el principio de mínimo privilegio...
```

---

## Prompt 7 — Contenido (content.md)

> Genera el contenido explicativo de un capítulo.

```text
Genera contenido educativo en formato Markdown sobre "[TU TEMA]" para IA2Interactive.

Reglas del formato:
- Título principal con #
- Secciones con ##
- Subsecciones con ### si es necesario
- Usa negrita (**texto**) para conceptos clave
- Usa listas con - para enumerar elementos
- Incluye ejemplos de código si aplica (con bloques ```)
- Incluye al menos un blockquote (>) con un dato importante o consejo
- Extensión: 500-800 palabras
- Tono didáctico, claro y conciso
- No incluyas preguntas, solo contenido explicativo

Ejemplo de estructura:

# Título del tema

**Descripción breve** del tema y por qué es importante.

## Sección 1

Explicación del primer concepto...

- **Elemento 1:** descripción
- **Elemento 2:** descripción

## Sección 2

Explicación del segundo concepto...

> Dato importante o consejo práctico.
```

---

## Prompt 8 — Capítulo completo (contenido + preguntas)

> Genera un capítulo completo sobre "[TU TEMA]" para IA2Interactive.

Necesito 7 ficheros separados:

FICHERO 1 — content.md:
- Contenido educativo en Markdown (500-800 palabras)
- Título con #, secciones con ##
- Explicaciones claras con negritas y listas

FICHERO 2 — questions/01-nombre.md:
- type: single-choice
- Una pregunta de opción única

FICHERO 3 — questions/02-nombre.md:
- type: multiple-choice
- Una pregunta de selección múltiple

FICHERO 4 — questions/03-nombre.md:
- type: true-false
- Una pregunta de verdadero/falso con texto en cada opción

FICHERO 5 — questions/04-nombre.md:
- type: drag-and-drop
- Una pregunta de arrastrar y soltar con 3-5 pares

FICHERO 6 — questions/05-nombre.md:
- type: flashcard
- Una pregunta tipo tarjeta de memoria

FICHERO 7 — questions/06-nombre.md:
- Una pregunta de completar el hueco con answer:

Todas las preguntas deben:
- Cubrir conceptos clave del contenido
- Incluir difficulty (variar entre easy, medium, hard)
- Incluir > **Explicación:** al final

Separa claramente cada fichero indicando su nombre.
```
