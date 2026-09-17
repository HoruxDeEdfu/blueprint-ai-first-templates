# GUIA_DISENO.md — Template reutilizable

> Este template define la estructura recomendada para la guía de diseño de un proyecto
> construido con AI coding agents. Está extraído de la GUIA_DISENO.md de Virso
> (1134 líneas co-creadas con Claude Code durante 5 fases de implementación).
>
> **Principio:** Este documento es EVOLUTIVO. No se escribe completo al inicio.
> Se empieza con las secciones obligatorias y crece conforme se implementa.
> Cada sesión de implementación puede agregar gotchas, componentes, o patrones nuevos.
>
> **Relación con otros documentos:**
> - `UX_PATTERNS_PROTOCOL.md` = principios agnósticos (Capa 1, no cambia entre proyectos)
> - `GUIA_DISENO.md` = especificaciones de proyecto (Capa 2, este documento, único por proyecto)

---

## Cómo usar este template

1. Copiar como `docs/GUIA_DISENO.md` en tu proyecto
2. Llenar las secciones marcadas como **[OBLIGATORIO]** antes de la primera sesión de implementación de UI
3. Las secciones **[CRECE CON EL PROYECTO]** se van llenando conforme se implementa
4. Las secciones **[OPCIONAL]** se agregan si el proyecto las necesita
5. Eliminar toda la guía de uso y los comentarios `<!-- -->` cuando el documento esté en uso

---

## Índice

1. [Paleta de colores](#1-paleta-de-colores) — OBLIGATORIO
2. [Tipografía](#2-tipografía) — OBLIGATORIO
3. [Espaciado y bordes](#3-espaciado-y-bordes) — OBLIGATORIO
4. [Sistema de temas](#4-sistema-de-temas) — OBLIGATORIO si hay dark mode
5. [Layout principal](#5-layout-principal) — OBLIGATORIO
6. [Componentes UI](#6-componentes-ui) — CRECE CON EL PROYECTO
7. [Patrones de página](#7-patrones-de-página) — CRECE CON EL PROYECTO
8. [Animaciones y motion](#8-animaciones-y-motion) — OPCIONAL
9. [Iconografía](#9-iconografía) — OBLIGATORIO
10. [Accesibilidad](#10-accesibilidad) — OBLIGATORIO
11. [Internacionalización](#11-internacionalización) — OPCIONAL
12. [Gotchas del framework CSS](#12-gotchas-del-framework-css) — CRECE CON EL PROYECTO
13. [Responsive design](#13-responsive-design) — OBLIGATORIO
14. [Estructura de archivos UI](#14-estructura-de-archivos-ui) — OBLIGATORIO
15. [Efectos visuales especiales](#15-efectos-visuales-especiales) — OPCIONAL
16. [Checklist para nuevas funcionalidades](#16-checklist-para-nuevas-funcionalidades) — OBLIGATORIO

---

## Principio fundamental

<!-- Definir la regla #1 de diseño del proyecto. Ejemplos: -->
<!-- "Todo color debe vivir en tokens del tema." -->
<!-- "Mobile first. Si no funciona en 390px, no se shippea." -->
<!-- "Accesibilidad WCAG AA no es opcional." -->

**{Tu principio fundamental de diseño aquí.}**

---

## 1. Paleta de colores [OBLIGATORIO]

<!-- Esta sección define los colores del proyecto como tokens semánticos.
     La regla más importante: NUNCA usar clases de color del framework directamente.
     Solo tokens semánticos. -->

### 1.1 Colores principales

| Rol | Valor | Uso |
|-----|-------|-----|
| **Primary** | `{valor}` | CTAs, active states, highlights |
| **Primary Foreground** | `{valor}` | Texto sobre fondo primary |
| **Destructive** | `{valor}` | Acciones destructivas |
| **Destructive Foreground** | `{valor}` | Texto sobre fondo destructive |

<!-- Agregar más roles según necesidad: secondary, accent, sidebar, etc. -->

### 1.2 Reglas de contraste

<!-- Documentar cualquier color que tenga problemas de contraste y su solución.
     Ejemplo de Virso: el amarillo primary (#FFFC31) tiene ratio 1.09:1 contra blanco,
     por eso se creó un token --color-primary-text con un dorado más oscuro. -->

- {Color problemático}: ratio {X:1} contra {fondo}. Solución: {token alternativo}
- **Regla:** `{clase para texto de marca}` para texto legible, NUNCA `{clase primary}` sobre fondos claros

### 1.3 Tokens del tema

```css
/* Copiar los tokens CSS de tu proyecto aquí.
   Esto es la referencia definitiva para la AI. */

/* Light theme */
--color-primary: {valor};
--color-background: {valor};
--color-foreground: {valor};
--color-card: {valor};
--color-card-foreground: {valor};
--color-muted: {valor};
--color-muted-foreground: {valor};
--color-border: {valor};
/* ... */

/* Dark theme (si aplica) */
/* ... */
```

### 1.4 Tokens semánticos de estado [CRECE CON EL PROYECTO]

<!-- Agregar conforme el proyecto define estados, severidades, o categorías con color. -->

| Token | Uso | Light | Dark |
|-------|-----|-------|------|
| `{--color-status-x}` | {descripción} | `{valor}` | `{valor}` |

### 1.5 Fondos semánticos (transparencias) [CRECE CON EL PROYECTO]

<!-- Patrón para badges, botones interactivos, y containers con color semántico.
     Usar transparencias sobre un color base para que funcione con glass/blur. -->

| Contexto | Background | Border | Hover |
|----------|-----------|--------|-------|
| Badges | `bg-{color}/8` | `border-{color}/15` | — |
| Botones | `bg-{color}/10` | `border-{color}/20` | `hover:bg-{color}/15` |
| Containers | `bg-{color}/8` | `border-{color}/15` | — |

---

## 2. Tipografía [OBLIGATORIO]

### 2.1 Font stacks

```css
--font-sans: {fuente body}, ui-sans-serif, system-ui, sans-serif;
--font-heading: {fuente headings}, {fallback};
/* --font-mono: {fuente mono}; /* si aplica */
```

<!-- Documentar cómo se cargan: next/font, @font-face, CDN, etc. -->

### 2.2 Escala tipográfica

| Nivel | Clases | Uso |
|-------|--------|-----|
| H1 | `{clases}` | {dónde se usa} |
| H2 | `{clases}` | {dónde se usa} |
| H3 | `{clases}` | {dónde se usa} |
| Body | `{clases}` | Texto general |
| Caption | `{clases}` | Fechas, hints, metadatos |
| Label | `{clases}` | Labels de formularios |

### 2.3 Reglas

- {Fuente} en todos los headings y títulos
- Nunca `{peso prohibido}` (ej: font-thin, font-light)
- {Otras reglas tipográficas del proyecto}

---

## 3. Espaciado y bordes [OBLIGATORIO]

### 3.1 Border radius

| Token | Valor | Uso |
|-------|-------|-----|
| `{sm}` | {valor} | Badges, chips |
| `{md}` | {valor} | Buttons, inputs |
| `{lg}` | {valor} | Cards, dialogs |
| `{xl}` | {valor} | Containers grandes |

**Patrón:** `{radio grande}` para containers, `{radio pequeño}` para controles internos.

### 3.2 Sombras

```css
--shadow-card: {valor light};  /* light */
--shadow-card: {valor dark};   /* dark (si aplica) */
```

<!-- Hover en cards, sombras especiales, etc. -->

### 3.3 Espaciado común

| Contexto | Valor |
|----------|-------|
| Padding de página | {valor} |
| Gap entre cards | {valor} |
| Padding interno de card | {valor} |
| Margin entre secciones | {valor} |

---

## 4. Sistema de temas [OBLIGATORIO si hay dark mode]

### 4.1 Arquitectura

<!-- Documentar cómo funciona el theming: next-themes, CSS custom properties, etc. -->

```
{Librería de temas} con {estrategia (class/attribute)}, defaultTheme="{default}"
```

### 4.2 Reglas de adaptación entre modos

<!-- La regla de Virso (basada en análisis de Material Design 3, Linear, Stripe):
     "Mismo hue, diferente lightness y saturación por modo" -->

| Aspecto | Light mode | Dark mode |
|---------|-----------|-----------|
| Fondo del botón | {descripción} | {descripción} |
| Saturación | {descripción} | {descripción} |
| Texto del botón | {descripción} | {descripción} |
| Sombras | {descripción} | {descripción} |

**Fórmula para nuevos colores:** {ej: subir lightness +0.07, bajar chroma -0.03, invertir foreground}

### 4.3 Qué NO hacer

- NO dejar el mismo color idéntico en ambos modos
- NO invertir el color simplemente
- {Otras reglas específicas del proyecto}

---

## 5. Layout principal [OBLIGATORIO]

### 5.1 Estructura

```
{Diagrama ASCII del layout principal}

Ejemplo:
SidebarProvider
├── Sidebar (collapsible)
└── ContentArea
    ├── TopBar (sticky, header)
    └── main (contenido scrolleable)
```

<!-- Incluir el archivo donde vive cada pieza -->

### 5.2 Sidebar

- **Modo:** {collapsible, fixed, drawer, etc.}
- **Ancho expandido:** {valor}
- **Ancho colapsado:** {valor}
- **Mobile:** {Sheet, drawer, overlay, etc.}
- **Persistencia:** {cookie, localStorage, etc.}
- **Keyboard shortcut:** {atajo}

### 5.3 TopBar / Header

```
{Diagrama ASCII del header}
```

### 5.4 Focus layout (segundo nivel) [si aplica]

<!-- Para proyectos con navegación por capas (Browse → Create → Detail) -->

| Layout | Route group | Casos de uso |
|--------|-------------|--------------|
| Con sidebar | `{grupo}` | {ejemplos} |
| Sin sidebar | `{grupo}` | {ejemplos} |

#### Header del focus layout

<!-- Variantes del header sin sidebar. Ejemplo de Virso:
     preview = solo "← Volver"
     step = proceso + stepper + "Salir" -->

```
{variante 1} → {descripción}
{variante 2} → {descripción}
```

---

## 6. Componentes UI [CRECE CON EL PROYECTO]

<!-- Esta sección crece conforme se implementan componentes. No llenar todo al inicio.
     Documentar cada componente DESPUÉS de implementarlo, no antes. -->

### 6.1 Biblioteca base

{Cantidad} componentes en `{ruta}`:

{Lista de componentes}

### 6.2 Componentes con reglas especiales

<!-- Solo documentar componentes que tienen gotchas, variantes importantes, o
     reglas que la AI necesita saber. No documentar lo obvio. -->

#### {Nombre del componente}

- **Variantes:** {listar}
- **Regla especial:** {lo que la AI debe saber}
- **Gotcha:** {error común al usarlo}

<!-- Ejemplos de Virso que vale la pena documentar:
     - Button: 6 variantes + active:scale, cuándo usar cuál
     - Card: glass por defecto, CardTitle acepta prop `as`
     - ScrollArea: OBLIGATORIO en vez de overflow-auto, parent necesita altura fija
     - Sheet vs Drawer: Sheet para paneles laterales, Drawer para bottom sheets conversacionales
     - Selectores visuales: cuándo usar Select vs Emoji Pill Grid vs Segmented Control -->

---

## 7. Patrones de página [CRECE CON EL PROYECTO]

<!-- Documentar cada tipo de página DESPUÉS de implementarla.
     Incluir: layout, componentes que usa, estados, y cualquier gotcha. -->

### 7.1 {Nombre del patrón} (ej: Auth Pages)

{Descripción breve del layout y comportamiento}

### 7.2 {Nombre del patrón} (ej: Listado con filtros)

{Descripción breve del layout y comportamiento}

### 7.3 Empty state

<!-- Patrón universal — cómo se ve una página sin datos -->

{Icono} + heading + subtítulo + CTA

---

## 8. Animaciones y motion [OPCIONAL]

<!-- Solo incluir si el proyecto tiene un sistema de animaciones definido. -->

### 8.1 Keyframes

| Nombre | Efecto | Duración |
|--------|--------|----------|
| {nombre} | {descripción} | {duración} |

### 8.2 Reglas

- Solo animar `transform` y `opacity` para 60fps
- Duraciones: {micro}ms (micro), {standard}ms (transiciones), {entrance}ms (entradas)
- NO animar `height`, `width`, `top`, `left`
- `will-change: transform` solo donde sea estrictamente necesario

### 8.3 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Desactivar todas las animaciones */
}
```

---

## 9. Iconografía [OBLIGATORIO]

**Librería:** {nombre} — única librería de iconos.

| Contexto | Tamaño |
|----------|--------|
| Nav items | {clases} |
| Card metadata | {clases} |
| Headings | {clases} |
| Empty state | {clases} |

- Iconos decorativos: `aria-hidden="true"`
- NO mezclar librerías de iconos

---

## 10. Accesibilidad [OBLIGATORIO]

### 10.1 Contraste WCAG AA

- Texto normal: 4.5:1 mínimo
- Texto grande: 3:1 mínimo
- {Notas específicas del proyecto sobre contraste}

### 10.2 Focus visible

Todos los interactivos: `{clases de focus}`

### 10.3 ARIA patterns

| Pattern | Uso |
|---------|-----|
| `aria-label` | Botones de solo ícono |
| `aria-current="page"` | Nav link activo |
| `aria-hidden="true"` | Iconos decorativos |
| `aria-describedby` | Inputs vinculados a error |
| `aria-invalid` | Inputs con error de validación |
| `role="alert"` | Mensajes de error dinámicos |
| `role="status"` | Indicadores de carga |

### 10.4 Formularios accesibles

```tsx
<!-- Ejemplo de implementación con aria-describedby + aria-invalid -->
{código de ejemplo de tu stack}
```

### 10.5 Landmarks

| Landmark | Ubicación |
|----------|-----------|
| `<main>` | {dónde} |
| `<header>` | {dónde} |
| `<nav>` | {dónde} |

### 10.6 Heading hierarchy

```
<h1> — {uso}
<h2> — {uso}
<h3> — {uso}
```

---

## 11. Internacionalización [OPCIONAL]

- **Librería:** {nombre y versión}
- **Idiomas:** {idiomas soportados}
- **Mensajes:** `{ruta a archivos de mensajes}`

**Reglas:**
- NUNCA hardcodear strings de UI
- {Reglas de formato, variables, pluralización}

---

## 12. Gotchas del framework CSS [CRECE CON EL PROYECTO]

<!-- Esta es una de las secciones más valiosas del documento.
     Cada gotcha fue descubierto durante la implementación real.
     Agregar nuevos gotchas CADA VEZ que se descubra uno. -->

### 12.1 {Gotcha 1}

**Problema:** {qué sale mal}
**Solución:** {cómo resolverlo}
**Ejemplo:**
```css
/* MAL */  {código incorrecto}
/* BIEN */ {código correcto}
```

### 12.2 {Gotcha 2}

<!-- Ejemplos reales de Virso que puedes usar como referencia:
     - @source para packages externos en Tailwind 4
     - Parenthesis vs brackets para CSS variables en Tailwind 4
     - oklch() vs hsl() para tokens de color
     - @plugin vs @tailwind directives
     - @theme no emite var() en runtime
     - font-display como nombre reservado
     - overflow: clip vs overflow: hidden con pseudo-elementos -->

---

## 13. Responsive design [OBLIGATORIO]

### 13.1 Breakpoints

| Nombre | Ancho | Comportamiento |
|--------|-------|----------------|
| mobile | < {valor} | {descripción} |
| tablet | {rango} | {descripción} |
| desktop | > {valor} | {descripción} |

### 13.2 Patrones responsive por componente

| Componente | Mobile | Desktop |
|------------|--------|---------|
| Sidebar | {comportamiento} | {comportamiento} |
| {Componente 2} | {comportamiento} | {comportamiento} |
| {Componente 3} | {comportamiento} | {comportamiento} |

---

## 14. Estructura de archivos UI [OBLIGATORIO]

```
{Árbol de archivos de UI del proyecto}

Ejemplo:
packages/ui/src/
├── components/
│   ├── ui/              ← componentes base
│   └── {custom}.tsx     ← componentes custom
├── lib/utils.ts         ← utilidades (cn, etc.)
└── index.ts             ← barrel exports
```

---

## 15. Efectos visuales especiales [OPCIONAL]

<!-- Solo si el proyecto tiene efectos como glassmorphism, gradientes, particles, etc.
     Documentar las reglas para que la AI no rompa el efecto. -->

### 15.1 {Nombre del efecto}

- **Cómo funciona:** {descripción técnica breve}
- **Dónde se usa:** {componentes que lo usan}
- **Reglas:**
  - {Regla 1 — qué respetar para que el efecto funcione}
  - {Regla 2 — qué NO hacer}

---

## 16. Checklist para nuevas funcionalidades [OBLIGATORIO]

<!-- Este checklist se usa en conjunto con el Protocolo de Desarrollo de Features.
     Cada item corresponde a una sección de esta guía. -->

### Colores y tokens
- [ ] Cero colores hardcodeados — solo tokens semánticos
- [ ] {Regla de contraste específica del proyecto}

### Componentes
- [ ] Reutilizar componentes existentes de `{librería}`
- [ ] {Librería de iconos} para todos los iconos
- [ ] {Patrón de border-radius} respetado

### Tema (si aplica dark mode)
- [ ] Funcional en light y dark sin glitches
- [ ] Contraste WCAG AA verificado

### Accesibilidad
- [ ] Focus visible en todos los interactivos
- [ ] `aria-label` en botones de solo ícono
- [ ] `aria-hidden="true"` en iconos decorativos
- [ ] `role="alert"` en errores dinámicos
- [ ] Heading hierarchy correcta
- [ ] {Otras reglas de a11y del proyecto}

### i18n (si aplica)
- [ ] Textos via sistema de i18n — no hardcodeados

### Responsive
- [ ] Funciona en mobile ({ancho mínimo}) y desktop

### Framework CSS
- [ ] {Gotcha 1 verificado}
- [ ] {Gotcha 2 verificado}

---

# Notas sobre este template

## Secciones obligatorias (llenar antes de implementar UI)
1. Paleta de colores (tokens mínimos)
2. Tipografía (font stacks + escala)
3. Espaciado y bordes (radios + espaciado común)
4. Layout principal (estructura + sidebar)
5. Iconografía (librería + tamaños)
6. Accesibilidad (contraste + ARIA + landmarks)
7. Responsive (breakpoints)
8. Estructura de archivos UI
9. Checklist

## Secciones que crecen con el proyecto
- Componentes UI → agregar cada componente nuevo con sus reglas
- Patrones de página → agregar cada tipo de página implementado
- Gotchas → agregar cada bug/gotcha descubierto
- Tokens de estado → agregar conforme se definen estados del dominio
- Fondos semánticos → agregar conforme se establecen patrones de color

## Secciones opcionales (agregar si el proyecto las necesita)
- Sistema de temas (solo si hay dark mode)
- Animaciones (solo si hay un sistema definido)
- i18n (solo si hay multi-idioma)
- Efectos visuales especiales (glassmorphism, gradientes, etc.)

## Señales de que tu guía necesita actualización
- La AI genera un componente con estilos que no siguen la guía → agregar la regla
- Descubres un bug de CSS que la AI repite → agregar a gotchas
- Implementas un patrón de página nuevo → documentar en sección 7
- Cambias tokens de color → actualizar sección 1
- Agregas un componente a la librería → documentar en sección 6 si tiene reglas especiales

## Tamaño esperado
- Al inicio: ~100-150 líneas (secciones obligatorias con valores mínimos)
- Proyecto maduro: ~500-1000+ líneas (como la guía de Virso con 1134 líneas)
- Esto es normal y esperado — la guía DEBE crecer con el proyecto
