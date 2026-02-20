# Code Review #1 — Revisión arquitectónica

**Fecha:** febrero  2026
**Versión:** 1.0.0
**Revisado por:** Arquitecto JS/TS

---

## Resumen

El proyecto tiene buena base: estructura clara, tipos bien definidos, separación de responsabilidades razonable. Hay problemas de consistencia, código muerto y oportunidades de simplificación.

**Calificación general: 7/10** — Sólido para un MVP, necesita pulido antes de publicar.

---

## 🔴 Críticos — Arreglar antes de publicar

### 1. `choice.ts` es código muerto
`src/core/templates/questions/choice.ts` no se usa en ningún sitio. `multiple-choice.ts` hace lo mismo. Eliminar.

```bash
rm src/core/templates/questions/choice.ts
```

### 2. `questions/index.ts` sin contenido útil
Verificar si exporta algo. Si está vacío o solo re-exporta, eliminarlo — los imports directos ya funcionan.

### 3. `index-page.ts` ya no se usa
Desde que `build.ts` genera un redirect como `index.html`, `generateIndexPage` no se llama nunca en el build. Sin embargo se exporta desde `generator.ts`, `core/index.ts` y `src/index.ts`. Decisión:
- **Opción A:** Eliminarlo completamente (y sus exports)
- **Opción B:** Dejarlo como API pública para quien quiera usarlo programáticamente

**Recomendación:** Opción B, pero documentar que no se usa en el build por defecto.

### 4. `escapeHtml` duplicada [DONE - 2025-06-25]
Eliminada de `markdown.ts`. Solo queda en `templates/helpers.ts`.

### 5. Regex de `normalizeAnswer` en runtime tiene bug [DONE - 2025-06-25]
Cambiado `\\s+` por `/ +/g` para evitar problemas de escape en el template string.

---

## 🟡 Importantes — Mejorar calidad

### 6. `parser.ts` es demasiado largo y complejo [DONE - 2025-06-25]
Refactorizado:
- Extraída `resolveChapterPaths()` con 4 estrategias claras
- Extraídas `readContent()`, `readQuestions()`, `readQuiz()`, `deriveTitle()`
- `parseChapter()` reducido a 6 líneas

### 7. Templates mezclan concatenación y template literals
- `multiple-choice.ts`, `true-false.ts`, `fill-blank.ts`, `drag-drop.ts` → usan concatenación con `+`
- `flashcard.ts`, `choice.ts` → usan template literals con backticks

**Sugerencia:** Unificar todo a concatenación con `+` (ya que es la convención dominante y evita problemas de indentación en el HTML generado).

### 8. `flashcard.ts` no tiene `question-prompt` class
El runtime busca `.question-prompt` para el resumen post-quiz, pero flashcard usa `<p>` directo dentro de `.flashcard-front`. Añadir la clase para consistencia.

### 9. `quiz-page.ts` no tiene `<p class="question-prompt">` visible
El prompt está dentro de cada question template. Si en el futuro se quiere mostrar un resumen, cada template debería tener un `.question-prompt` consistente.

[DONE - 2025-06-25] Todos los templates ya incluyen `<p class="question-prompt">`.

### 10. Sin validación en `build.ts` si `chapters[]` queda vacío tras parseo [DONE - 2025-06-25]
Añadido guard después del loop de parseo. Si ningún chapter se parsea, retorna con error.

---

## 🟢 Sugerencias — Nice to have

### 11. Los estilos de dark mode están dispersos [DONE - 2025-06-25]
Centralizado en `styles/dark-mode.ts`. Eliminados bloques `@media (prefers-color-scheme: dark)` de `base.ts`, `chapter.ts`, `quiz-layout.ts` y `quiz-card.ts`.

### 12. No hay tipo discriminado para `Question` [DONE - 2025-06-25]
Refactorizado a union type discriminado. Cada variante tiene solo los campos obligatorios para su tipo:
- `SingleChoiceQuestion`, `MultipleChoiceQuestion`, `TrueFalseQuestion`, `FlashcardQuestion` → `options: Option[]`
- `DragAndDropQuestion` → `pairs: DragPair[]`
- `FillInTheBlankQuestion` → `answer: string`

### 13. `runtime.ts` es un archivo de 300+ líneas
Todo el JS del navegador está en un solo string. Es difícil de mantener y debuggear. Considerar:
- Separar en funciones más pequeñas dentro del mismo string
- O generar desde varios módulos y concatenar en build

[DONE - 2025-06-25] Modularizado en 8 archivos bajo `src/core/templates/runtime/`:
- `shuffle.ts` — utilidad de shuffle
- `sidebar.ts` — toggle sidebar
- `progress.ts` — tracking localStorage
- `stepper.ts` — quiz stepper y resultados
- `handlers-choice.ts` — single/multiple choice y true/false
- `handlers-fill.ts` — fill-in-the-blank
- `handlers-drag.ts` — drag & drop (mouse + touch)
- `handlers-flashcard.ts` — flashcard flip
- `index.ts` — orquestador que concatena todos

### 14. `constants.ts` no se ha visto pero debería tener los tipos
Verificar que `QUESTION_TYPES` incluye `'flashcard'`:
```typescript
export const QUESTION_TYPES = [
  'single-choice', 'multiple-choice', 'true-false',
  'drag-and-drop', 'flashcard', 'fill-in-the-blank'
] as const;
```

### 15. No hay `pre code` con clase de lenguaje en dark mode
`marked` genera `<code class="language-javascript">` pero no hay CSS específico por lenguaje. No es urgente, pero es una oportunidad para syntax highlighting básico en el futuro.

### 16. `Course` type en schemas no se usa
`Course` (con `basePath`) solo lo usaba `renderer.ts` y `loader.ts` que ya eliminamos. Considerar eliminarlo o usarlo en `build.ts`.

### 17. `inlineMarkdown` en `markdown.ts` es código muerto [DONE - 2025-06-25]
Ya eliminado al migrar a `marked`. `markdown.ts` solo exporta `markdownToHtml`.

### 18. Sin `aria-` labels en quiz
Las preguntas no tienen roles ARIA. Para accesibilidad:
- `role="radiogroup"` en opciones single-choice
- `aria-label` en botones de flashcard
- `role="alert"` en feedback de fill-in-the-blank

[DONE - 2025-06-25] Añadidos atributos ARIA a todos los templates:
- `role="region"` con `aria-label` en cada question-card
- `role="radiogroup"` / `role="group"` en opciones
- `role="alert"` con `aria-live` en feedback y explicaciones
- `aria-label` en botones, inputs y flashcards
- `aria-hidden` dinámico en flashcard flip y stepper
- Soporte de teclado (Enter/Space) para flashcards
- `role="progressbar"` con `aria-valuenow` en barra de progreso

---

## 📊 Resumen de acciones

| Prioridad | # | Acción | Esfuerzo | Estado |
|-----------|---|--------|----------|--------|
| 🔴 | 1 | Eliminar `choice.ts` | 1 min | ✅ Done |
| 🔴 | 2 | Limpiar `questions/index.ts` | 1 min | ✅ Done |
| 🔴 | 3 | `index-page.ts` sin usar | — | ⏭️ Skip |
| 🔴 | 4 | Eliminar `escapeHtml` duplicada | 2 min | ✅ Done |
| 🔴 | 5 | Fix regex `normalizeAnswer` | 5 min | ✅ Done |
| 🔴 | 10 | Guard `chapters.length === 0` | 2 min | ✅ Done |
| 🟡 | 6 | Refactorizar `parser.ts` | 30 min | ✅ Done |
| 🟡 | 7 | Unificar templates a concatenación | 15 min | ✅ Done |
| 🟡 | 8 | Añadir `.question-prompt` a flashcard | 5 min | ✅ Done |
| 🟡 | 9 | `.question-prompt` consistente en templates | 5 min | ✅ Done |
| 🟢 | 11 | Centralizar dark mode | 30 min | ✅ Done |
| 🟢 | 12 | Union types discriminados | 1 hora | ✅ Done |
| 🟢 | 13 | Modularizar runtime | 1 hora | ✅ Done |
| 🟢 | 17 | Eliminar `inlineMarkdown` | 1 min | ✅ Done |
| 🟢 | 18 | Accesibilidad ARIA | 30 min | ✅ Done |
