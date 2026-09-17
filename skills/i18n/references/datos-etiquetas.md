# Capa 3 — Datos: etiquetas por idioma

Los catálogos y configuraciones que el usuario ve nombrados: roles, estados, niveles, severidades, tipos de documento, campos de formulario configurables. Es la capa que rompe la demo: la interfaz está impecable en inglés y el estado del registro se muestra como `PENDING_REVIEW`.

> El ejemplo usa **Prisma** y **Zod** porque es el stack donde nació la skill. Sustituye los nombres; la convención de columnas y la regla de resolución no cambian.

## Regla

Todo dato dinámico o configurable que se muestra al usuario lleva **una columna por idioma**, y todas son obligatorias (`String`, no `String?`):

```prisma
model WorkflowState {
  id        String @id @default(uuid())
  code      String            // identificador técnico: nunca se traduce ni se muestra
  label_es  String
  label_en  String
  // …
}
```

Modelos que típicamente llevan el patrón: roles, estados y transiciones de workflow, niveles de riesgo o prioridad, severidades y categorías de alerta, tipos de documento, campos de formulario configurables (`label_*`, `help_text_*`, `placeholder_*`), catálogos externos. Los mensajes de un guard o una regla que el usuario lee llevan `message_es` / `message_en`: es el mismo patrón con otro nombre.

## Seed y validación

Los catálogos iniciales pueblan **todos** los idiomas. Un schema compartido lo exige donde se crean o editan:

```ts
export const LabelBilingualSchema = z.object({
  label_es: z.string().min(1),
  label_en: z.string().min(1),
});
```

Una etiqueta faltante en el seed es un bug que solo aparece al cambiar de idioma: es decir, casi nunca en desarrollo y siempre en la demo. Por eso el schema rechaza cadenas vacías, y por eso el formulario de configuración exige los dos idiomas aunque la organización trabaje en uno.

## Resolución

**El backend resuelve la etiqueta y entrega el texto ya resuelto.** El frontend recibe `label: string`, no las dos columnas.

```ts
export function resolveLabel(
  entity: { label_es: string; label_en: string },
  locale: 'es' | 'en',
): string {
  return locale === 'en' ? entity.label_en : entity.label_es;
}
```

Si el frontend tuviera un mapa de traducciones de datos dinámicos, se desincronizaría el día que alguien agregue un estado por configuración: el backend lo conoce, el mapa del cliente no. Resolver en un solo lugar también simplifica la caché: la respuesta ya está en el idioma del usuario.

## Configuraciones que crea la organización

Cuando una organización crea o edita una entidad con etiquetas (un campo de formulario, una regla propia), el formulario exige todos los idiomas con el schema compartido. Si no tiene traducción para alguno, se admite un marcador visible (`[EN pendiente]`), pero el campo sigue siendo obligatorio: la política es «nunca una cadena vacía», porque una cadena vacía se muestra como nada y nadie la reporta.

## Excepciones

- **`code`** (el identificador técnico) nunca se traduce ni se muestra.
- Una **descripción interna** (notas de administración) puede ser monolingüe si no la ve ningún usuario externo.
- Los **mensajes al usuario final** (errores, tooltips, textos de interfaz) van por la Capa 1, no por la base de datos: son de la interfaz, no del dato.
