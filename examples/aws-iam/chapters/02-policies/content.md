# Políticas y permisos

Las políticas de IAM son documentos JSON que definen qué acciones están permitidas o denegadas sobre qué recursos.

## Estructura de una política

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mi-bucket/*"
    }
  ]
}
```

Cada política contiene uno o más **Statements** con estos elementos:

- **Effect:** `Allow` o `Deny` — indica si se permite o deniega la acción.
- **Action:** La acción o acciones de AWS que se aplican (ej: `s3:GetObject`).
- **Resource:** El ARN del recurso al que aplica la política.
- **Condition** (opcional): Condiciones adicionales para la evaluación.

## Tipos de políticas

- **Administradas por AWS:** Predefinidas por Amazon, cubren casos de uso comunes.
- **Administradas por el cliente:** Creadas y gestionadas por ti en tu cuenta.
- **Inline:** Integradas directamente en un usuario, grupo o rol específico.

## Evaluación de permisos

AWS evalúa todas las políticas aplicables siguiendo estas reglas:

1. Por defecto, todas las solicitudes son **denegadas** (denegación implícita).
2. Un **Allow** explícito sobrescribe la denegación implícita.
3. Un **Deny** explícito **siempre gana** sobre cualquier Allow.

> Recuerda: una denegación explícita siempre tiene prioridad. Si una política dice Deny, no importa cuántos Allow existan.

## ARN (Amazon Resource Name)

Los ARN identifican de forma única los recursos de AWS:

```
arn:aws:servicio:region:cuenta:recurso
```

Ejemplos:
- `arn:aws:s3:::mi-bucket` — un bucket de S3
- `arn:aws:iam::123456789012:user/juan` — un usuario IAM
- `arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0` — una instancia EC2
