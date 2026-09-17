# Capa 1 — Frontend

Los strings de la interfaz: dónde viven, cómo se consumen, cómo se formatean fechas y números.

> El ejemplo usa **next-intl** sobre Next.js con App Router porque es el stack donde nació la skill. Sustituye los nombres de librería por los de tu stack; la estructura y las reglas no cambian.

## Estructura

```
apps/web/
├── app/[locale]/…          → rutas con segmento de idioma
├── messages/
│   ├── es.json
│   └── en.json
├── middleware.ts           → enrutamiento por idioma (+ guard de auth si lo hay)
└── i18n.ts                 → configuración: locales, idioma por defecto, carga de mensajes
```

## Locales

Un idioma por defecto explícito (`es`) y la lista cerrada de soportados (`es`, `en`). El locale activo se infiere del path y se resuelve en el middleware. La preferencia del usuario persiste en su perfil (`User.locale`), no en una cookie suelta: una cookie se pierde al cambiar de dispositivo.

## Archivo de mensajes

Organizado en **namespaces por feature**, no un archivo plano.

```json
// messages/es.json
{
  "records": {
    "list": {
      "title": "Registros",
      "searchPlaceholder": "Buscar por nombre o documento",
      "empty": "Aún no hay registros"
    },
    "createButton": "Nuevo registro"
  }
}
```

La estructura es **idéntica** en todos los idiomas. Una clave que falta en uno produce un warning en desarrollo; conviene convertirlo en un test que falle (ver §Paridad de la skill).

## Uso

```tsx
import { useTranslations, useFormatter } from 'next-intl';

export function RecordsList({ items, createdAt }: Props) {
  const t = useTranslations('records.list');
  const format = useFormatter();

  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('itemsCount', { count: items.length })}</p>
      <time>{format.dateTime(createdAt, { dateStyle: 'medium' })}</time>
    </>
  );
}
```

### Pluralización ICU

El plural no se resuelve con un `if` en el componente: lo resuelve el mensaje.

```json
"itemsCount": "{count, plural, =0 {Sin resultados} one {# registro} other {# registros}}"
```

### Cambio de idioma

```tsx
const pathname = usePathname();
const router = useRouter();
const changeLocale = (locale: 'es' | 'en') => {
  router.replace(pathname, { locale });
};
```

Al cambiar, persistir la preferencia en el perfil del usuario, no solo en la URL.

## Middleware

El middleware combina dos cosas que suelen escribirse por separado y chocan: el enrutamiento por idioma (`createMiddleware({ locales, defaultLocale, localePrefix: 'always' })`) y el guard de autenticación de las rutas privadas. Si son dos middlewares, el orden importa: primero el idioma, para que la redirección al login conserve el locale.

## Reglas

- **Todo string visible pasa por `t()`.** Cero hardcodeados. Es el check S-06 de `ux-audit`.
- **Fechas, números y monedas se formatean con la librería** (`useFormatter`), nunca con `toLocaleString()` sin locale: usa el del navegador, no el del usuario.
- **Los datos dinámicos llegan ya resueltos del backend.** Si un catálogo tiene etiqueta por idioma en la base de datos (Capa 3), el componente recibe `label: string`, no las dos columnas; no se elige en el cliente.
- **La clave es código.** Se nombra por lo que es (`records.list.empty`), no por lo que dice; el texto cambia, la clave no.
