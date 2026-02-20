# Buenas prácticas de seguridad en IAM

Seguir las buenas prácticas de IAM es fundamental para mantener segura tu cuenta de AWS.

## 1. Proteger la cuenta root

- **No uses la cuenta root** para tareas diarias.
- Activa **MFA (Multi-Factor Authentication)** en la cuenta root.
- Crea un usuario IAM con permisos de administrador para el día a día.

## 2. Principio de mínimo privilegio

- Otorga solo los permisos **estrictamente necesarios**.
- Revisa y ajusta los permisos periódicamente.
- Usa **IAM Access Analyzer** para identificar permisos no utilizados.

## 3. Usar grupos para asignar permisos

- Nunca asignes políticas directamente a usuarios individuales.
- Crea **grupos** basados en funciones (Desarrolladores, Administradores, Auditores).
- Asigna las políticas a los grupos y añade usuarios a los grupos correspondientes.

## 4. Políticas de contraseñas

Configura una política de contraseñas que exija:

- Longitud mínima de **12 caracteres**
- Combinación de mayúsculas, minúsculas, números y símbolos
- Rotación de contraseñas cada **90 días**
- Prevención de reutilización de contraseñas anteriores

## 5. Usar roles en lugar de credenciales

- Para aplicaciones en EC2, usa **roles de instancia** en lugar de access keys.
- Para acceso entre cuentas, usa **roles de confianza (cross-account roles)**.
- Rota las **access keys** regularmente si es imprescindible usarlas.

## 6. Activar MFA

- Activa MFA en **todos los usuarios** con acceso a la consola.
- Usa dispositivos MFA **virtuales** (Google Authenticator, Authy) o **hardware** (YubiKey).
- Considera exigir MFA para operaciones sensibles mediante condiciones en las políticas.

## 7. Monitoreo y auditoría

- Activa **AWS CloudTrail** para registrar todas las llamadas a la API.
- Revisa los reportes de **IAM Credential Report** periódicamente.
- Configura alertas en **CloudWatch** para actividades sospechosas.

> La seguridad en AWS es una responsabilidad compartida: AWS protege la infraestructura, tú proteges la configuración de tu cuenta.
