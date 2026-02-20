# ¿Qué es AWS IAM?

**AWS Identity and Access Management (IAM)** es un servicio global que te permite controlar de forma segura el acceso a los recursos de AWS.

## Conceptos clave

- **Usuarios:** Representan personas o aplicaciones que interactúan con AWS. Cada usuario tiene credenciales únicas.
- **Grupos:** Colecciones de usuarios que comparten los mismos permisos. Simplifican la gestión de acceso.
- **Roles:** Identidades con permisos temporales, usadas por servicios de AWS o usuarios federados.
- **Políticas (Policies):** Documentos JSON que definen permisos específicos sobre recursos.

## ¿Cómo funciona?

Cuando un usuario o servicio realiza una solicitud a AWS, IAM evalúa las políticas asociadas para determinar si la acción está permitida o denegada.

1. El **principal** (usuario, rol o servicio) envía una solicitud.
2. AWS evalúa todas las **políticas** aplicables.
3. Si existe un **Allow** y no hay un **Deny explícito**, la acción se permite.
4. Si no hay ninguna política que lo permita, se **deniega por defecto**.

## Características importantes

- IAM es un servicio **global** — no está asociado a ninguna región específica.
- El usuario **root** tiene acceso completo a todos los recursos de la cuenta.
- IAM sigue el **principio de mínimo privilegio**: cada entidad solo debe tener los permisos estrictamente necesarios.

> IAM no tiene costo adicional. Solo pagas por los recursos de AWS que tus usuarios consuman.
