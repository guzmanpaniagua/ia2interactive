type: single-choice
difficulty: medium

## ¿Qué ocurre cuando un Deny explícito y un Allow explícito se aplican a la misma acción?

- [ ] El Allow gana porque fue creado después
- [ ] Se genera un error de conflicto
- [x] El Deny explícito siempre gana
- [ ] Depende del orden de las políticas

> **Explicación:** En IAM, un Deny explícito siempre tiene prioridad sobre cualquier Allow. Esta es una regla fundamental de la evaluación de permisos.
