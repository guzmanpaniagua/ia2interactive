# Visión del proyecto

Con la IA una persona puede aprender cualquier tema o tecnología: le puedes preguntar el temario adecuado a tu nivel, pedirle que te haga preguntas, contestarlas y hacerte exámenes.

Pero el 99% de las personas no lo van a hacer.

**La idea del proyecto es facilitar a personas sin conocimientos técnicos avanzados pasar del contenido generado por IA a algo web funcional, interactivo y profesional.**

## Problema que resuelve

El contenido de preguntas/respuestas generado por IA es plano y aburrido. Vivimos en el mundo de la interactividad (swipe, drag & drop, gamificación...).

**Pipeline:**

```
Preguntas y respuestas de la IA → Markdown → CLI build → Experiencia web interactiva
```

## Competencia y diferenciación

| Plataforma | Limitaciones |
|---|---|
| **Moodle** | Pesado, requiere servidor, setup complejo |
| **Google Codelabs** | Atado a su nube, necesitas claves, generador en Go, preguntas no interactivas, propietario |

**IA2Interactive** es:
- 100% opensource (MIT)
- Genera sitios estáticos (zero backend)
- Preguntas interactivas con múltiples experiencias (drag & drop, quiz, fill-in-the-blank, flashcards...)
- Input en Markdown (fácil de generar con cualquier IA)
- Sin dependencias de nube
