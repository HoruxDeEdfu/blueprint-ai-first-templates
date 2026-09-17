# Capa 2 — Backend: plantillas bilingües

Los emails y notificaciones que el sistema envía. Es la capa que más se olvida porque no se ve en la pantalla de quien desarrolla.

> El ejemplo usa **Prisma** y un servicio con inyección de dependencias porque es el stack donde nació la skill. Sustituye los nombres; el modelo y la regla de resolución no cambian.

## Modelo

Una plantilla es un registro con **su texto por idioma** (asunto y cuerpo) más una declaración de las variables que acepta.

```prisma
model NotificationTemplate {
  id          String   @id @default(uuid())
  code        String   @unique            // ej: "record.approved"
  channel     String                      // email | sms | in_app
  subject_es  String?
  subject_en  String?
  body_es     String                      // Handlebars, MJML o el motor que uses
  body_en     String
  variables   Json                        // {{variables}} aceptadas, con tipo y obligatoriedad
  is_system   Boolean  @default(true)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}
```

Las plantillas base son **globales** (no pertenecen a una organización). Si las organizaciones pueden personalizar branding o texto, va en una tabla de overrides aparte: la base no se edita.

## Resolución por destinatario

**La regla que más se rompe:** la notificación se renderiza en el idioma del **destinatario**, nunca en el del actor que disparó la acción.

```ts
@Injectable()
export class NotificationService implements NotificationServicePort {
  async send(recipientUserId: string, templateCode: string, variables: Record<string, unknown>) {
    const user = await this.userRepo.findByIdOrFail(recipientUserId);
    const template = await this.templateRepo.findByCode(templateCode);
    const locale = user.locale ?? DEFAULT_LOCALE;

    const subject = locale === 'en' ? template.subject_en : template.subject_es;
    const body = locale === 'en' ? template.body_en : template.body_es;

    await this.mailer.send({
      to: user.email,
      subject: render(subject ?? '', variables),
      html: render(body, variables),
    });
  }
}
```

El idioma pertenece a quien lee, no a quien actúa. Si quien aprueba usa la interfaz en inglés y el destinatario eligió español, el email sale en español.

Los documentos generados (PDF, Excel) se emiten en el idioma de **quien los solicita**: ahí el solicitante es el lector.

## Variables

Cada plantilla declara qué variables acepta, con tipo y obligatoriedad:

```json
{
  "record_name":   { "type": "string", "required": true },
  "reviewer_name": { "type": "string", "required": true },
  "link":          { "type": "string", "required": true }
}
```

Al guardar una plantilla, validar en las dos direcciones: toda variable referenciada en el cuerpo existe en la declaración, y toda variable declarada se usa. Una variable sin declarar llega vacía al email en producción y nadie lo ve hasta que un cliente lo reporta.

## Branding

Si el email lleva logo y color de la organización, se resuelven desde la organización **del destinatario**, no desde la del actor. Mezclarlos es el error espejo del idioma, y aparece en el mismo lugar: cuando un usuario de plataforma actúa sobre datos de otra organización.

## Reglas

- **Ambos idiomas obligatorios** (`body_es` + `body_en`). Un test que recorra las plantillas y falle si falta uno.
- Las variables del cuerpo y las declaradas coinciden en las dos direcciones.
- El asunto es obligatorio para `email`; opcional para `in_app` y `sms`.
- El texto de las plantillas pasa por la skill `ux-writer` (registro externo si el destinatario no tiene cuenta).
