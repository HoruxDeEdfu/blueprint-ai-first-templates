# GUIA_DISENO.md — Template

> Este template define la estructura de la guía de diseño de un proyecto que se
> construye con agentes de IA. Sale de dos guías reales que siguen vivas: la de
> una aplicación de datos con navegación autenticada, que en cinco meses pasó
> por más de setenta revisiones y superó las tres mil líneas, y la de un sitio
> de contenido en otro stack. Lo que las dos comparten está acá; lo que era de
> cada producto quedó afuera.
>
> **Principio:** este documento es EVOLUTIVO. No se escribe completo al inicio.
> Se empieza con las secciones obligatorias y crece con la implementación. Pero
> crece con una regla: **una regla sin su cicatriz es una opinión**. Cada norma
> que entre después del primer día dice qué pasó para que hiciera falta.
>
> **Segundo principio:** los valores de esta guía son **derivados, no
> autoridad**. Los tokens viven en un archivo del código; si un valor de acá no
> coincide con ese archivo, el que está mal es este documento.

---

## Cómo usar este template

1. Copiar como `docs/GUIA_DISENO.md` en tu proyecto.
2. Decidir el perfil. **Aplicación** (navegación autenticada, listas, formularios,
   detalle) usa todas las secciones. **Sitio** (contenido público, sin CRUD)
   borra las secciones marcadas *[APLICACIONES]* en vez de dejarlas vacías.
3. Llenar las secciones **[OBLIGATORIO]** antes de la primera sesión de
   implementación de interfaz.
4. Las secciones **[CRECE CON EL PROYECTO]** se llenan conforme se implementa,
   cada una con la cicatriz que la originó.
5. Las secciones **[OPCIONAL]** se agregan si el proyecto las necesita.
6. Eliminar esta guía de uso y los comentarios `<!-- -->` cuando el documento
   esté en uso.

### Relación con otros documentos y skills

Este documento es el eslabón del medio de una cadena, y conviene saber qué no
le toca:

| Pregunta | Quién responde |
|---|---|
| ¿Qué es esto, cómo se llama y dónde vive? | Skill `information-architecture` |
| ¿Cómo se comporta el usuario al usarlo? | Skill `protocolo-ux` (modal vs. página, tablas, formularios, 4 estados) |
| ¿Con qué tokens, layouts y componentes se ve en ESTE proyecto? | **Esta guía** |
| ¿Con qué código lo construyo? | Tu skill `ux-patterns`, que se escribe a partir de esta guía (ver la última sección) |
| ¿Qué componentes existen ya? | El inventario de componentes, documento aparte que el detector de entropía verifica |
| ¿Qué dice cada texto? | Skill `ux-writer` y su glosario |
| ¿Por qué se eligió esto y no aquello? | `docs/ADR.md`; esta guía enlaza la fila, no repite el argumento |
| ¿Qué gotcha tiene el stack fuera de lo visual? | Las notas técnicas del proyecto |

Lo que esta guía **no** lleva: el inventario de componentes (crece solo y tiene
su documento), los valores de token copiados (se derivan del archivo), el copy
(vive en el glosario) y un changelog (vive en git y en los documentos de cambio).

---

## Índice

0. [Dónde vive la verdad](#0-dónde-vive-la-verdad) — OBLIGATORIO
1. [Principio fundamental y sus excepciones](#1-principio-fundamental-y-sus-excepciones) — OBLIGATORIO
2. [Sistema de tokens](#2-sistema-de-tokens) — OBLIGATORIO
3. [Tipografía](#3-tipografía) — OBLIGATORIO
4. [Espaciado, radios y sombras](#4-espaciado-radios-y-sombras) — OBLIGATORIO
5. [Temas](#5-temas) — OBLIGATORIO si hay modo oscuro
6. [Layout en niveles](#6-layout-en-niveles) — OBLIGATORIO · APLICACIONES
7. [Móvil](#7-móvil) — OBLIGATORIO
8. [Listas y tablas](#8-listas-y-tablas) — CRECE · APLICACIONES
9. [Formularios](#9-formularios) — CRECE · APLICACIONES
10. [Movimiento](#10-movimiento) — OPCIONAL
11. [Identidad y pantallas expresivas](#11-identidad-y-pantallas-expresivas) — OPCIONAL
12. [Iconografía](#12-iconografía) — OBLIGATORIO
13. [Accesibilidad](#13-accesibilidad) — OBLIGATORIO
14. [Otras superficies de salida](#14-otras-superficies-de-salida) — OPCIONAL
15. [Componentes con reglas especiales](#15-componentes-con-reglas-especiales) — CRECE
16. [Cicatrices](#16-cicatrices) — CRECE
17. [Checklist para nuevas funcionalidades](#17-checklist-para-nuevas-funcionalidades) — OBLIGATORIO
18. [Tu skill ux-patterns](#18-tu-skill-ux-patterns) — OBLIGATORIO

---

## 0. Dónde vive la verdad [OBLIGATORIO]

<!-- Esta sección es la que evita que la guía envejezca sin que nadie lo note.
     Dice qué archivo manda, y deja escrito que las tablas de abajo son copias. -->

| Qué | Dónde | Quién lo cambia |
|---|---|---|
| Tokens de color, radio, sombra, movimiento | `{ruta del archivo de tokens}` | {a mano / generado por `{comando}` desde `{fuente}`} |
| Escala tipográfica | `{ruta}` | {…} |
| Criterio de contraste | {WCAG 2.x AA / APCA} — medido con `{herramienta o función}` | {quien decide el producto} |
| Referencia visual (herramienta de diseño) | {URL o «no hay»} | {dirección del sync: código → diseño, diseño → código, ninguna} |
| Inventario de componentes | `{ruta del inventario}` | Se actualiza en el mismo commit que el componente |

**Reglas:**

- Las tablas de valores de esta guía **son derivadas**. Para el valor exacto de
  un token, leer el archivo; si difieren, corregir la guía.
- Si los tokens se generan, **nadie edita el archivo generado a mano**: el
  siguiente build lo sobreescribe. Si hay un check que lo detecta, nombrarlo acá.
- La referencia visual es fuente de verdad **visual** (tokens, tipografía,
  layout, estados). No es fuente del inventario funcional: los módulos que
  aparezcan en sus mockups de navegación son ejemplo, no catálogo. Si divergen,
  manda la especificación del producto.
- Si la herramienta de diseño sólo sincroniza en una dirección, decirlo. Un
  color editado en el lado que no manda se pierde en el próximo sync.

---

## 1. Principio fundamental y sus excepciones [OBLIGATORIO]

<!-- La regla nº1 del proyecto. Ejemplos reales:
     «Todo color vive en tokens del tema.»
     «Si no funciona en 390px, no se publica.»
     «Si una captura permite adivinar la librería de componentes, falta capa de identidad.» -->

**{Tu principio fundamental aquí.}**

**Excepciones declaradas.** Toda regla dura tiene excepciones legítimas. Si no
se escriben, el check que la verifica cría alarmas que el equipo aprende a
ignorar, y un check ignorado no existe.

| Excepción | Por qué es legítima | Alcance |
|---|---|---|
| {p. ej. paneles decorativos de marca usan colores fijos} | {se pintan sobre gradientes de marca, no sobre superficies del tema} | {sólo auth, error, onboarding; nunca UI funcional} |

**Cómo se verifica:** `{comando: grep, lint, script}`. Si no hay comando, el
principio es una aspiración.

---

## 2. Sistema de tokens [OBLIGATORIO]

### 2.1 Roles

<!-- Un token es un ROL (qué hace), no un color (cómo se ve). Si tu sistema tiene
     escalas primitivas con pasos numerados, agrega la columna «paso»; es lo que
     permite derivar variantes sin inventar valores. -->

**Superficies**

| Rol | Light | Dark | Uso |
|---|---|---|---|
| `background` | `{valor}` | `{valor}` | Cuerpo, inputs, la base más clara |
| `muted` / canvas | `{valor}` | `{valor}` | Área de contenido, detrás de las tarjetas |
| `card`, `popover` | `{valor}` | `{valor}` | Superficies que flotan sobre el canvas |
| `{sidebar}` | `{valor}` | `{valor}` | Navegación principal |

**Texto y bordes**

| Rol | Light | Dark | Uso |
|---|---|---|---|
| `foreground` | `{valor}` | `{valor}` | Texto principal |
| `muted-foreground` | `{valor}` | `{valor}` | Texto secundario, placeholders, fechas |
| `border`, `input` | `{valor}` | `{valor}` | Bordes y contornos de campo |

**Acción**

| Rol | Light | Dark | Uso |
|---|---|---|---|
| `primary` / `primary-foreground` | `{valor}` | `{valor}` | Botones, enlaces activos, anillo de foco |
| `destructive` / `destructive-foreground` | `{valor}` | `{valor}` | Acciones destructivas |

### 2.2 Jerarquía de superficies

```
Light (más claro = más arriba):
  canvas  <  navegación  <  card = background

Dark (más claro = más arriba, pero invertido en valor):
  background  <  canvas  <  navegación  <  card
```

Las tarjetas «flotan» sobre el canvas por diferencia de luminosidad, no por
bordes. En dark la elevación se comunica con **superficie más clara**, no con
sombra: las sombras pierden efecto sobre fondos oscuros.

### 2.3 Regla de contención: contenido sobre superficie [APLICACIONES]

**Invariante:** ningún contenido vive directamente sobre el canvas. Todo va
sobre una superficie que lo separe del fondo: una tarjeta, una tabla con fondo
propio, o un panel con fondo diferenciado (raro; documentar la excepción).

Únicos elementos permitidos sobre el canvas: el título de página, las migas de
pan, las acciones de página y los elementos estructurales del layout.

Anti-patrones: formularios «desnudos» sobre el fondo; bloques de indicadores
sueltos; y el contrario, el doble contenedor: envolver en tarjeta una tabla que
ya trae su fondo.

### 2.4 Los estados son roles, no opacidades

<!-- La cicatriz que más pesa de las dos guías de origen. Una aplicación fabricó
     sus estados con opacidad sobre el token —`bg-muted/40`, `hover:bg-primary/90`,
     `text-muted-foreground/60`— y al medirlo tenía 618 usos con 101 niveles
     distintos. No era un sistema: era cada componente inventando un paso donde
     no había escala. -->

Cada estado que necesite color propio es un **rol con nombre** que apunta a un
valor de la escala. La opacidad sobre un token queda para lo que compone sobre
contenido desconocido (scrims, vidrio) y se declara en el token, no en el uso.

| Necesito… | Rol |
|---|---|
| Hover de fila, ítem de lista, botón fantasma | `{muted-hover}` |
| Fila seleccionada o presionada | `{muted-active}` |
| Callout o panel dentro de una tarjeta | `{muted-subtle}` |
| Divisor más quieto que `border` | `{border-subtle}` |
| Borde enfatizado, zona de arrastre | `{border-strong}` |
| Glifo deshabilitado o decorativo | `{foreground-disabled}` |
| Hover del primario | `{primary-hover}` |
| Zona seleccionada con tinte de acento | `{primary-surface}` + `{primary-border}` |
| Scrim de diálogo / de drawer | `{overlay}` / `{overlay-soft}` (alfa por diseño) |
| Skeleton | `{skeleton}` |

**Si el sistema es chico**, dos o tres niveles de opacidad con nombre cumplen lo
mismo. Lo que no escala es que cada componente invente el suyo. Un estado nuevo
es un rol nuevo, nunca un `/NN` suelto.

### 2.5 Contraste

- **Criterio declarado en §0.** WCAG 2.x y APCA no se convierten entre sí: una
  guía que mezcla los dos no tiene criterio.
- **Medir contra el color que la aplicación pinta de verdad.** El texto oscuro
  casi nunca es negro puro; medir contra `#000` da un resultado que la pantalla
  no tiene. Cicatriz real: cinco centésimas de luminosidad movieron un texto un
  escalón entero de tamaño.
- **Los pares que no conforman y se aceptan se escriben**, con quién lo decidió
  y cuándo. Una excepción sin registro se «corrige» seis meses después subiendo
  un peso que rompe el sistema.

| Par que no conforma | Medida | Decisión | Quién / cuándo |
|---|---|---|---|
| {p. ej. primario a 16px en peso 600} | {valor} | {aceptado; no corregir subiendo peso ni tamaño} | {…} |

### 2.6 Reglas de color

1. **Nunca blanco puro ni negro puro** en fondos. Un tinte mínimo hacia la
   paleta mantiene la identidad en los dos modos.
2. Los colores de acción **se ajustan por modo**: mismo tono, más luminosidad y
   menos saturación en dark (detalle en §5).
3. El texto sobre un color de acción **lo decide la medición**, no la costumbre.
4. Los colores de marca fijos (§11) **sólo en superficies decorativas**. La UI
   funcional usa roles.

### 2.7 Cómo usar tokens

```tsx
// CORRECTO — roles
<div className="bg-muted">                 // canvas
<div className="bg-card">                  // tarjeta
<p className="text-muted-foreground">      // secundario, pleno; no text-foreground/70
<tr className="hover:bg-{muted-hover}">    // estado = rol

// INCORRECTO — colores de la paleta del framework
<div className="bg-slate-200 dark:bg-neutral-900">
<p className="text-gray-500">
```

**Verificación:** `{comando que busca clases de color crudas y opacidades sobre tokens}`
debe dar cero fuera de las excepciones de §1.

---

## 3. Tipografía [OBLIGATORIO]

### 3.1 Familias y carga

| Rol | Familia | Pesos cargados | Cuándo |
|---|---|---|---|
| Interfaz | `{fuente}` | {400, 500, 600} | Todo lo que no sea display |
| Display | `{fuente o «la misma»}` | {…} | Títulos protagonistas, cifras grandes |
| Mono | `{stack del sistema}` | — | Código, identificadores técnicos |

<!-- Cómo se cargan: fuente del framework, @font-face local, CDN. Si se
     subsetean y se autoalojan, decirlo: cambia la política de CSP. -->

### 3.2 Escala por rol

**Un nivel se justifica por ROL, no por tamaño.** Si un diseño pide un tamaño
que no está en la escala, la pregunta es qué rol nuevo cumple, no cuántos
píxeles mide. Sin rol nuevo, se colapsa al nivel existente más cercano.

<!-- Cicatriz: dos niveles de título de pantalla separados por 2 px, uno con 48
     usos y otro con 8. Ningún lector los distinguía. -->

| Rol | Clase o token | Familia | Dónde |
|---|---|---|---|
| Título de pantalla | `{…}` | {…} | Uno solo por pantalla; lo pinta el componente de encabezado, no un `<h1>` a mano |
| Título de sección | `{…}` | {…} | {…} |
| Título de tarjeta | `{…}` | {…} | {…} |
| Cuerpo | `{…}` | {…} | Texto general |
| Secundario | `{…}` | {…} | Fechas, metadatos, ayuda |
| Etiqueta overline | `{…}` | {…} | Encima de un título; el único uppercase permitido |

### 3.3 Pesos

- Pesos permitidos: {…}. **Tope:** `{font-semibold}`; ningún componente usa
  `{font-bold}` salvo las excepciones de abajo.
- {Pesos prohibidos: `font-thin`, `font-light`, …}
- Excepciones al tope, con su razón: {…}

### 3.4 Reglas

- {Fuente display} sólo en {dónde}. Nunca en botones, inputs ni controles.
- Tracking negativo sólo en tamaños display. Uppercase sólo en overline.
- Nunca cursivas en bloques largos.

---

## 4. Espaciado, radios y sombras [OBLIGATORIO]

### 4.1 Radios

| Token | Valor | Uso |
|---|---|---|
| `{sm}` | {valor} | Badges, chips |
| `{md}` | {valor} | Botones, inputs |
| `{lg}` | {valor} | Tarjetas, diálogos |
| `{xl}` | {valor} | Contenedores grandes, decorativo |

**Coherencia:** dentro de un mismo componente, un solo radio. Contenedor grande,
controles internos chicos.

### 4.2 Sombras

| Token | Valor | Uso |
|---|---|---|
| `{shadow-sm}` … `{shadow-xl}` | `{valores}` | {…} |

<!-- Si las sombras llevan tinte de la paleta en vez de negro puro, decirlo:
     es lo que las hace parecer del mismo sistema que los colores. -->

- Elevación en dark: superficie más clara, no sombra (§2.2).
- Nunca sombras sueltas del framework fuera de estos tokens.

### 4.3 Espaciado común

| Contexto | Valor |
|---|---|
| Padding de página | {valor} móvil / {valor} escritorio |
| Gap entre tarjetas | {valor} |
| Padding interno de tarjeta | {valor} |
| Separación entre secciones | {valor} |
| Título ↔ subtítulo de página | {valor} — **uno solo**; la mezcla 50/50 con otro valor es la deriva típica |

---

## 5. Temas [OBLIGATORIO si hay modo oscuro]

### 5.1 Arquitectura

```
{Mecanismo: clase en <html>, atributo data-theme, media query}
{Default: system / dark / light}  {Persistencia: localStorage, cookie}
{Cómo se evita el flash de tema al cargar}
```

### 5.2 Cómo se adapta un color entre modos

Consenso de la industria y de las dos guías de origen: **mismo tono, distinta
luminosidad y saturación**. No se invierte, no se deja igual: se ajusta.

| Aspecto | Light | Dark |
|---|---|---|
| Fondo del botón primario | Tono medio-oscuro | Tono más claro |
| Saturación | Plena | Ligeramente menor |
| Texto del botón | Claro sobre oscuro | Oscuro sobre claro (se invierte) |
| Hover | Un poco más oscuro | Un poco más claro |
| Elevación | Sombra | Superficie más clara |

**Fórmula para un color de acción nuevo:** {p. ej. subir luminosidad +0.07,
bajar croma −0.02 a −0.05, invertir el foreground}.

### 5.3 Qué NO hacer

- NO dejar el mismo color en ambos modos.
- NO invertir el color sin más: rompe la jerarquía y falla contraste.
- NO resolver el dark mode a mano en el componente con `dark:{color crudo}`:
  se resuelve en el token.

---

## 6. Layout en niveles [OBLIGATORIO · APLICACIONES]

<!-- El skill `protocolo-ux` define las capas de comportamiento (Browse →
     Create/Edit → Detail). Esta sección dice cómo se ven en ESTE proyecto:
     qué layout, qué componentes, qué reglas. Una aplicación madura terminó con
     tres niveles y tablas de decisión entre ellos; se recogen acá. -->

### 6.1 Nivel 1 — Shell con navegación principal

```
{Diagrama ASCII: navegación principal + cabecera + área de contenido}
```

**Reglas de separación:** {p. ej. sin bordes entre navegación, cabecera y
contenido: la separación es por color y sombra}.

**Navegación principal**

- Ancho expandido / colapsado: {valores}. Persistencia: {…}.
- **Ubicación por frecuencia, no por rol.** Uso diario o semanal → navegación
  principal. Onboarding u ocasional → configuración. Los procesos internos de
  un registro no van en la navegación: viven en su detalle.
- **Visibilidad por permiso, dos estados.** Sin permiso → no se renderiza. Con
  permiso y sin implementar → visible con «Próximamente». No existe «visible
  pero inaccesible».
- Ítem activo / inactivo: `{clases}`.

**Navegación secundaria (sub-rutas)**

- Escritorio: {columna vertical / tabs}. Por debajo de {breakpoint}: {tabs
  horizontales / el mismo panel en un drawer}.
- **El ítem activo lleva superficie propia.** Si el canvas y el ítem activo
  comparten token, el activo es invisible y sólo lo distingue el color del texto.
- Anidamiento: un solo nivel, siempre abierto, con línea guía que lo ate al
  padre. Un tercer nivel pide otro patrón.
- Un panel de navegación es **de módulos, no de registros**: en el detalle de un
  registro invierte la jerarquía. Un registro navega con tabs.

**Cabecera del shell:** {qué va a la izquierda, a la derecha; dónde viven el
cambio de tema y de idioma}.

### 6.2 Nivel 2 — Foco (detalle, creación, flujos)

Layout **sin navegación principal**. Dos piezas, y cada una hace una sola cosa:

**Barra de navegación slim** (`{componente}`, altura fija `{48px}`)

| Variante | Cuándo | Contenido |
|---|---|---|
| `back` | Detalle que vuelve a un listado | `← {Listado}` + título de contexto truncado + slot derecho opcional |
| `exit` | Creación o edición | Título de contexto + `✕ Salir` |
| `sequential` | Proceso de varios pasos | Título + indicador de paso + `✕ Salir` |

Reglas: **sólo navegación** (ni título h1, ni migas, ni acciones); altura fija;
«Volver» y «Salir» en variante `outline` para que se lean como clic; si la
barra tiene «Salir», el formulario no repite «Cancelar».

**Encabezado de página** (`{componente}`, dentro del contenido)

```
{Listado} > {Registro}                         migas
{Título}                                        h1, único nivel de título de pantalla
[badge] [identificador] [flag]                  metadatos
                                   [acciones]   derecha
```

**No se arma a mano.** Un `<h1>` suelto con la clase correcta arregla hoy y
deriva mañana; el componente trae el espaciado, la responsividad de las
acciones y su skeleton espejado.

### 6.3 Nivel 3 — Drawer (sub-contenido subordinado)

Para consulta o vista previa **subordinada** a un nivel 2. En vez de una ruta
nueva que fuerce «volver y volver», un panel lateral que se abre desde el padre.

| Drawer | Página (nivel 2) |
|---|---|
| Consulta o vista previa de sólo lectura | Formulario que el usuario debe llenar |
| Necesita el contexto del padre visible | La tarea requiere foco completo |
| Contenido subordinado a una entidad | Contenido independiente, con URL compartible |

Reglas: ancho fijo en escritorio (`{600px}`), pantalla completa en móvil; scroll
independiente; se cierra con X, overlay y Escape; carga perezosa al abrirse; sin
barra de navegación propia.

**El header de un drawer no lleva contenido de largo libre.** Título, badges y
controles sí; un texto escrito por un usuario, no: crece sin tope y se come el
alto del contenido. Cicatriz real: motivos de entre 600 y 3.000 caracteres en
un header; ninguno cabía, y un `line-clamp` sólo habría tapado el síntoma.

### 6.4 Cuándo usar cada nivel

| Nivel 1 | Nivel 2 | Nivel 3 |
|---|---|---|
| Listados, dashboards | Detalle de una entidad | Vista previa de sub-contenido |
| Cualquier vista con navegación principal | Formularios de creación, procesos | Documentos relacionados, historial |

**Regla de profundidad:** por debajo del nivel 2 **no se crea una ruta**; se
usa un drawer. Si el drawer necesita URL compartible, el contenido no era
subordinado y le toca nivel 2.

### 6.5 Detalle en dos columnas [OPCIONAL]

Para detalles con tres o más pestañas de contenido: columna izquierda fija con
identidad y acciones (`{300px}`, `sticky`), derecha flexible con las pestañas.

Reglas: ancho fijo en la columna izquierda, no porcentaje; `min-w-0` en la
derecha para que las tablas no la desborden; el banner de estado del registro
va en la columna izquierda, visible en cualquier pestaña; en móvil colapsa a una
columna. No usar para formularios de creación ni para detalles con una sola
pestaña.

---

## 7. Móvil [OBLIGATORIO]

### 7.1 Estrategia

Escritorio y móvil comparten datos y lógica; cambia la presentación por
breakpoint. La navegación móvil **no es la de escritorio colapsada**.

| Breakpoint | Rango | Navegación | Listas | Procesos |
|---|---|---|---|---|
| Móvil | `< {md}` | {barra inferior + drawer «Más» / menú} | Tarjetas | Stepper vertical colapsable |
| Escritorio | `≥ {md}` | {navegación lateral} | Tabla completa | Stepper horizontal |

Un solo breakpoint principal (`{md}`) para todas las variaciones de escritorio.

### 7.2 Navegación móvil [APLICACIONES]

- {Barra inferior: cuántos slots, cómo se eligen (derivados de la misma fuente
  que la navegación de escritorio, nunca por rol a mano), qué pasa con el resto}.
- **Cero pestañas deshabilitadas**: lo que no está disponible no se muestra.
- Ítem activo / inactivo: `{clases}`. Alto mínimo: `{56px}`.

### 7.3 Listas: tabla en escritorio, tarjetas en móvil

Las tablas **no scrollean horizontalmente en móvil**: se vuelven tarjetas con la
información priorizada.

```tsx
<div className="hidden md:block"><Table>…</Table></div>
<div className="space-y-3 md:hidden">{items.map(item => <Card …/>)}</div>
```

Reglas: mostrar sólo nombre, tipo, estado y uno o dos datos clave; toda la
tarjeta es el enlace; chevron como affordance; `min-w-0 flex-1` en los textos
para que `truncate` funcione; la acción principal es tocar la tarjeta y las
secundarias van en un menú, sin botón dividido (no hay ancho).

### 7.4 Objetivos táctiles y área segura

- Todo interactivo en móvil: **≥ 44px**. Patrón: `h-11 w-11 md:h-{n} md:w-{n}`.
- Elementos fijos al fondo: `pb-[env(safe-area-inset-bottom)]`, y el viewport
  con `viewport-fit=cover` para que `env()` funcione.
- El `<main>` bajo una barra inferior compensa su alto: `pb-{20} md:pb-{4}`.

### 7.5 Patrones recurrentes

| Elemento | Móvil | Escritorio |
|---|---|---|
| Acción primaria del encabezado | Ancho completo, 44px | Ancho natural |
| Acciones secundarias | Colapsadas en un `⋯` | Botones nombrados |
| Controles de vista (alcance, período) | Apilados, ancho completo, **nunca dentro del `⋯`** | En fila |
| Filtros de formulario | Apilados, ancho completo | En fila, ancho fijo |
| Sólo móvil / sólo escritorio | `md:hidden` | `hidden md:block` |

Esconder un filtro detrás de un menú oculta el estado de lo que se está viendo.
Un filtro se ve siempre.

---

## 8. Listas y tablas [CRECE CON EL PROYECTO · APLICACIONES]

<!-- El comportamiento (acción principal nombrada, fila clicable, filtros arriba)
     lo fija `protocolo-ux`. Acá va cómo se implementa en este proyecto y las
     reglas que sólo se aprenden con volumen. -->

### 8.1 Un cuerpo de filas, un encabezado

Una tabla con variantes declara sus encabezados **una sola vez**. Si el cuerpo
es común y cada variante declara el suyo, divergen en cuanto alguien agrega una
columna, y el fallo es silencioso: las celdas se corren a la columna vecina y
nada lanza error. Cicatriz real: ocho celdas contra siete encabezados durante
semanas, sin que ningún test lo viera, porque todos afirmaban por texto y el
texto estaba, sólo que en la columna equivocada.

- Una columna condicional multiplica el riesgo. Un valor idéntico en todas las
  filas no es una columna: es un dato del encabezado de sección.
- El `colSpan` de una fila separadora sale de la misma constante que las
  columnas.
- **El test que sirve:** cada fila tiene tantas `<td>` como `<th>` hay en el
  `<thead>`, en todas las variantes. Una línea, y cubre la clase entera de bug.
- Un `overflow-hidden` externo no impide el scroll horizontal: lo esconde a
  medias. El desborde se resuelve con anchos declarados. Y `table-fixed` no
  comprime lo que no hace wrap: lo deja salirse encima de la celda vecina.

### 8.2 Tipografía de listas

Tres tamaños, y sólo tres. Aplican a la tabla y a las tarjetas móviles que la
reemplazan: son la misma lista en dos anchos.

| Rol | Tamaño | Dónde |
|---|---|---|
| Encabezado de columna | `{12px}` | Lo trae el componente; no sobreescribir |
| Texto primario (nombre) | `{14px}` | Lo trae la celda; el nombre sólo agrega `font-medium` |
| Secundario (id, fecha, hora) | `{12px}` | Lo pone el consumidor, en `muted-foreground` |

Nada por debajo del tamaño secundario en una fila. Fecha con hora: la hora lleva
**menos peso, no menos tamaño**. La columna de identidad lleva `min-w-*` en el
encabezado para que el navegador no le quite ancho a favor de columnas de una
palabra.

### 8.3 Acciones de fila

Implementadas por `{componente}` en la última columna, **sticky** a la derecha,
con fondo opaco y el hover de la fila repintado como overlay dentro de la celda
fija (una columna sticky opaca borra los tintes de su fila; un color por capa).

| Tipo de lista | Etiqueta de la acción principal |
|---|---|
| Negocio | «{Revisar}» |
| Configuración | «{Editar}» o el verbo real |

### 8.4 Barra de la tabla

Toda lista filtrable lleva su barra, en la misma tarjeta que la tabla, como
header con borde inferior.

```
[🔍 Buscar…]          [filtros •] [orden] [columnas] [⚙]   [Acción primaria ▾]
```

1. **El buscador siempre visible**, a la izquierda, con debounce. No se
   colapsa en un icono: el usuario llega con un nombre en la mano.
2. **Los controles secundarios son iconos** sin etiqueta. El que tiene estado
   distinto del default lleva un punto de acento; un indicador que nunca se
   apaga es decoración. Con dos controles la barra admite etiquetas, por
   contenedor y no por viewport: el mismo card mide distinto con la navegación
   abierta o cerrada.
3. **Sólo la acción primaria lleva texto.** Una por barra. La segunda va dentro
   del desplegable de la primera o en un `⋯`.

**Lo que está fuera no se repite dentro.** Un icono en la barra es acceso
rápido; el panel de configuración es donde vive el resto. Si un control está
en la barra, su sección no se lista otra vez en el panel: son dos puertas al
mismo sitio y el usuario deja de predecir qué abre cada cosa. Toda duplicación
deliberada se declara con su razón.

**Alcance vs. filtros, dos zonas.** El alcance (período, área) va en la
cabecera y siempre visible: da denominador a la cifra. Lo aplicado por el
usuario va en una fila de chips bajo la barra, que **desaparece cuando no hay
ninguno**. El período es encuadre, no filtro: chip permanente sin «×».

**Cuando no hay datos hasta ejecutar** (un informe, una consulta parametrizada)
no es una tabla filtrada: es un formulario de consulta siempre visible con su
botón de ejecutar. Sin barra ni badge de filtros: un badge implica refinar un
conjunto que todavía no existe.

**Las listas de configuración con dos o tres controles conservan el patrón
simple.** Un panel de configuración de vista para dos filtros agrega peso sin
agregar nada. Es una excepción declarada, no deuda.

### 8.5 Paginación

Cinco reglas duras:

1. **Si la lista pagina, todo filtro se resuelve en el servidor.** Filtrar en
   cliente lo que el servidor ya recortó da un total que no corresponde a
   ninguna consulta real, y el usuario ve un número plausible.
2. El contador y el paginador leen el `total` del servidor, nunca `items.length`.
3. Dos listas en la misma URL = dos juegos de parámetros, y la pestaña activa
   también va en la URL: paginar es navegar.
4. Filtrar reinicia la página de **su** lista, no la de la otra.
5. Vacío por filtro ≠ vacío por falta de datos: el estado vacío lo dice.

### 8.6 Estados vacíos

Icono del módulo, mensaje, y «Limpiar filtros» si hay filtros activos.

**La acción de crear va dentro del estado vacío.** Si el único botón para crear
vive en el componente de lista y ese componente sólo se monta con datos, el
recurso queda inalcanzable: no hay cómo crear el primero. Cicatriz real: una
cuenta nueva nacía sin catálogo y su pantalla no ofrecía ninguna acción. Aplica
a todo recurso que el usuario construye desde cero.

### 8.7 Celdas

- **Etiqueta, nunca el valor del enum.** `OPEN` se ve como «Abierta». Si la
  tabla la arma el servidor (y viaja igual a pantalla y a exportación), la
  etiqueta se resuelve allá con respaldo al valor crudo, nunca a vacío: un enum
  nuevo sin etiqueta debe verse raro, no desaparecer.
- Si el filtro nombra el valor, la celda usa el **mismo** texto.
- Un identificador largo (UUID) se muestra **abreviado** con el completo en un
  popover y botón de copiar. El recorte es de render, no del dato: la
  exportación lleva el valor entero.
- Columna de fecha: dos líneas (fecha, hora), `whitespace-nowrap`, formateada
  por la librería de i18n, nunca con métodos nativos sin locale.

### 8.8 Skeletons

Todo estado de carga se construye con los **skeletons compartidos** del
proyecto (`{ruta}`), no con barras sueltas.

- **Reservar la altura de línea del texto real**, no la altura visual de la
  barra: un título de 22px ocupa una línea de 28px. Una barra suelta desalinea
  todo lo de abajo. Referencia: `{tamaño}` → `{alto de línea}`.
- **Aparición retrasada (200 ms)** para todo skeleton que ocupe un bloque
  completo: si el servidor responde antes, el contenido entra directo. 200 y no
  300: errar por arriba se lee como clic muerto. **No** aplica a un fragmento
  dentro de contenido ya pintado: ahí el retraso deja un hueco que colapsa. El
  criterio: ¿el skeleton reemplaza todo lo que va a ocupar ese espacio, o
  convive con contenido que el usuario ya lee?
- **La deriva no se ve en review.** El skeleton se escribe con la estructura de
  ese día; los cambios posteriores agregan una columna y nadie abre el archivo
  hermano, porque nunca caen juntos en el diff. Medido: 6 de 47 skeletons
  declaraban menos columnas de las reales. Lo detecta un script:
  `{comando que compara columnas del skeleton contra encabezados reales}`.
- El skeleton replica la **estructura**, no el detalle: un badge, un avatar y un
  texto en la misma celda son una barra.
- Color: el rol `{skeleton}`, visible sobre el canvas y sobre la tarjeta.

---

## 9. Formularios [CRECE CON EL PROYECTO · APLICACIONES]

### 9.1 Obligatoriedad: depende de la proporción

| Formulario | Patrón |
|---|---|
| Largo, con la mayoría de campos requeridos (≈80 %+) | Marcar los **opcionales** con «(opcional)» junto al label |
| Corto, mitad y mitad | Marcar los **requeridos** con `*` |

Si casi todo es requerido, el ruido de `*` en cada campo supera su beneficio.

### 9.2 Selección

- `Select` hasta `{15}` opciones; por encima, combobox con búsqueda.
- Un combobox dentro de un diálogo necesita {sus arreglos: rueda del mouse,
  `min-w-0` en el grid del diálogo, `w-full` en el ítem}. Ver §16.
- Cascadas (país → región → ciudad): cambiar el padre limpia a los hijos, en el
  estado local y en los cambios pendientes del autoguardado.

### 9.3 Estado de guardado

Con guardado manual, el header de la tarjeta muestra «Cambios sin guardar» /
«Guardado ✓» después del primer guardado exitoso. El botón se deshabilita cuando
no hay cambios. **Crítico:** tras guardar, resetear el formulario a los valores
actuales para que el flag de cambios vuelva a falso.

### 9.4 Solo lectura

Un registro que ya no se edita muestra un banner informativo al inicio del
contenido, con copy específico por estado, en `muted` con borde sutil: no es un
error y no usa colores de alerta.

### 9.5 Formularios por secciones

Acordeón con sólo la primera sección abierta; badge de completitud por sección
(número → check al llenar los obligatorios); texto «X de Y obligatorios»;
«Continuar» al final de cada sección; al fallar la validación se abren las
secciones con error.

### 9.6 Campos condicionales

La visibilidad por dependencia (`{depends_on}`) se evalúa en **un solo lugar**
y se usa en render y en el conteo de progreso: sólo los campos visibles cuentan.

### 9.7 Autoguardado

Debounce de `{30 s}`; envío incremental de lo que cambió; indicador de estado
(inactivo / guardando / guardado / error); flush antes de enviar; recuperación
en error (los cambios vuelven a la cola).

### 9.8 Archivos

El campo de archivo muestra su estado (subiendo / subido: nombre / error
visible) y se deshabilita durante la subida. Un fallo silencioso es un dato que
el usuario cree guardado.

---

## 10. Movimiento [OPCIONAL]

### 10.1 Duraciones y curvas son tokens

| Token | Duración | Uso |
|---|---|---|
| `{micro}` | {150 ms} | Hover, opacidad de controles. Default de toda transición |
| `{fast}` | {200 ms} | Iconos que rotan, confirmaciones breves |
| `{normal}` | {250 ms} | Entrada y salida de contenido |
| `{medium}` | {300 ms} | Paneles, drawers, ancho de la navegación |
| `{slow}` | {500 ms} | Avance de un proceso que el usuario no controla |

Las curvas se llaman como las del framework CSS: un nombre propio dejaría dos
sistemas conviviendo. Un `duration-200` suelto o un `0.3s` en un `style` inline
{lo rechaza el check / es deuda}.

### 10.2 Elegir por intención

| Utilidad | Qué comunica | Duración · curva |
|---|---|---|
| `{motion-state-change}` | Algo cambió de estado | fast · out |
| `{motion-reveal}` / `{motion-dismiss}` | Contenido que aparece / se va | normal · out |
| `{motion-progress}` | Avance de proceso | slow · out |
| `{motion-lateral}` | Algo se mueve sin entrar ni salir | medium · in-out |

### 10.3 Movimiento reducido

Bajo `prefers-reduced-motion: reduce` las duraciones van a `0ms` **en el
token**, no componente por componente. Las curvas no se tocan: sobra el tiempo,
no la forma. Si hay una librería de animación aparte, tiene su propia política
central; dos mecanismos porque son dos motores, no dos políticas. El retraso
del skeleton se conserva: es visibilidad, no movimiento.

### 10.4 Principios

1. Cada animación informa, confirma o mantiene la orientación.
2. Sólo `transform` y `opacity`. Nunca `height`, `width`, `top`, `left`.
3. No animar inputs ni conteos de datos: el dato real se lee de inmediato.
4. No superar `{slow}` en acciones del usuario.
5. Una animación no justifica hidratar un componente: si no hay estado, va sin
   framework.
6. Nunca scroll-jacking.

---

## 11. Identidad y pantallas expresivas [OPCIONAL]

### 11.1 Marca

- Activos: `{ruta}` — {logo completo / símbolo, versiones por modo}.
- Reglas: {dónde va cada versión; tamaño mínimo; espacio de respeto; nunca
  rotar, deformar ni recolorear}.
- **Anti-referencia:** {qué no queremos parecer}. Si una captura permite
  adivinar la librería de componentes, falta capa de identidad: tipografía
  propia, escala propia, superficie propia.

### 11.2 Dónde se permite ser expresivo

| Expresivo | Funcional |
|---|---|
| Login, registro, recuperar contraseña | Dashboard y listados |
| Onboarding de primer ingreso | Formularios de creación |
| Páginas de error, mantenimiento | Detalle de registros |

Regla: formulario de 1 a 3 campos **y** necesidad de contexto emocional → patrón
expresivo. Formularios complejos o datos tabulares → layouts funcionales.

### 11.3 Recetas

<!-- Sólo las que el proyecto usa. Cada una con sus reglas para que la IA no
     rompa el efecto. Ejemplos de las dos guías de origen: -->

- **Colores de marca fijos:** no cambian entre modos porque se pintan sobre
  fondos de marca. Sólo en decorativo; nunca en UI funcional.
- **Vidrio (glass):** sólo sobre gradientes o imagen (sobre superficie plana no
  se nota); máximo 4 o 5 formas por panel; siempre `aria-hidden`; fallback
  opaco sin `backdrop-filter`; nunca puramente decorativo, siempre contiene algo.
- **Gradientes:** máximo 3 paradas; el color dominante es el primario; nunca en
  elementos funcionales.
- **Animación decorativa:** duración mínima `{7 s}`, `ease-in-out`, amplitud
  máxima `{20px}`, duraciones variadas para que no se sincronicen, y nunca en
  elementos funcionales.

El texto de estas pantallas es de la skill `ux-writer`: esta guía no lo define.

---

## 12. Iconografía [OBLIGATORIO]

**Librería:** `{nombre}` — única librería de iconos. Nombre **canónico** de cada
icono, no el alias deprecado: el alias desaparece cuando la librería lo retire.

| Contexto | Tamaño |
|---|---|
| Navegación | `{clases}` |
| Metadatos de tarjeta | `{clases}` |
| Acciones | `{clases}` |
| Estado vacío | `{clases}` |

- Iconos decorativos: `aria-hidden="true"`. Iconos de acción sin texto: `aria-label`.
- Grosor de trazo: `{valor}`, uno solo.
- NO mezclar librerías.

---

## 13. Accesibilidad [OBLIGATORIO]

### 13.1 Contraste

Criterio y herramienta en §0. Excepciones aceptadas en §2.5.

### 13.2 Foco visible

Todos los interactivos: `{clases de foco}`. Nunca se remueve el outline
globalmente.

### 13.3 ARIA

| Patrón | Uso |
|---|---|
| `aria-label` | Botones de sólo icono |
| `aria-current="page"` | Enlace de navegación activo |
| `aria-hidden="true"` | Iconos y formas decorativas |
| `aria-describedby` + `aria-invalid` | Inputs con error |
| `role="alert"` | Errores dinámicos |
| `role="status"` | Indicadores de carga |
| `aria-live="polite"` | Progreso de un proceso |

### 13.4 Reglas

- El color nunca es el único indicador: icono, texto o forma lo acompañan.
- Landmarks: un `<main>`, `<header>`, `<nav>` con nombre.
- Jerarquía de encabezados: un `<h1>` por pantalla (§3.2).
- Objetivos táctiles ≥ 44px (§7.4).
- Con `forced-colors: active` los efectos decorativos pueden colapsar; las
  acciones tienen que seguir visibles.
- Toda interacción por gesto tiene alternativa por botón.

---

## 14. Otras superficies de salida [OPCIONAL]

<!-- PDF, email transaccional, imágenes sociales, impresión: sin tokens CSS ni
     dark mode. Las dos guías de origen llegaron acá. -->

| Superficie | Paleta | Tipografía | Regla |
|---|---|---|---|
| {PDF} | Constantes nombradas mapeadas de los roles a hex, sin dark | Mismas familias y pesos; fallback declarado | Nunca hex en el renderer: siempre la constante |
| {Email} | {…} | {…} | {…} |
| {Imagen social} | {…} | {…} | {…} |

Las constantes de severidad o estado usan **los mismos** colores que la UI.

---

## 15. Componentes con reglas especiales [CRECE CON EL PROYECTO]

<!-- El inventario completo vive en su documento. Acá SÓLO los componentes que
     tienen una regla que la IA necesita saber para no romper algo: variantes
     con criterio de uso, gotchas, prohibiciones. No documentar lo obvio. -->

#### `{Componente}`

- **Variantes:** {cuándo cada una}
- **Regla:** {lo que hay que saber}
- **Cicatriz:** {qué pasó}

<!-- Casos que en las guías de origen sí merecieron ficha: el área de scroll
     propia vs. el overflow nativo (y que un max-height directo sobre ella no
     scrollea); el botón dentro de un formulario sin type="button"; el tooltip
     sobre un input deshabilitado; el diálogo con footer fijo que necesita grid
     y no flex; el texto de ayuda de campo como tooltip para no romper la
     alineación de la grilla. -->

---

## 16. Cicatrices [CRECE CON EL PROYECTO]

<!-- La sección más valiosa a los seis meses. Cada entrada se descubrió
     implementando. Agregar una CADA VEZ que se descubra; si la IA repite un
     error, es que falta acá. Tres grupos: layout, componentes, framework CSS. -->

### 16.1 De layout

#### {Nombre}

**Problema:** {qué sale mal}
**Regla:** {qué se hace}
**Cicatriz:** {qué pasó, medido si se puede}

### 16.2 De componentes

#### {Nombre}

```tsx
// MAL
// BIEN
```

### 16.3 Del framework CSS

<!-- Directivas de detección de clases en monorepos, sintaxis de variables,
     nombres reservados, diferencias entre versiones. Lo que no es visual va a
     las notas técnicas, no acá. -->

---

## 17. Checklist para nuevas funcionalidades [OBLIGATORIO]

<!-- Cada ítem corresponde a una sección de esta guía. Cada ítem que se pueda
     verificar con un comando lleva el comando: un checklist que sólo se lee se
     deja de leer. -->

| | Verificación | Cómo |
|---|---|---|
| [ ] | Cero colores crudos ni opacidades sobre tokens fuera de las excepciones de §1 | `{comando}` |
| [ ] | Tipografía: pesos dentro del tope; un solo título de pantalla | `{comando o lectura}` |
| [ ] | Dark y light sin glitches; contraste medido con el criterio de §0 | Toggle + `{herramienta}` |
| [ ] | Contenido sobre superficie, sin doble contenedor | Lectura en navegador |
| [ ] | Componentes del inventario reutilizados; inventario actualizado en el mismo commit si se tocó uno compartido | `{check del detector}` |
| [ ] | Iconos de la única librería, con nombre canónico | `{comando}` |
| [ ] | Móvil: listas como tarjetas, filtros a ancho completo, encabezado apilado | Captura a 390px |
| [ ] | Objetivos táctiles ≥ 44px; área segura en elementos fijos | Medición |
| [ ] | Los 4 estados; skeleton con retraso y estructura real | `{script de skeletons}` |
| [ ] | Duraciones por token, nunca a mano | `{comando}` |
| [ ] | `prefers-reduced-motion` verificado en CSS y en la librería de animación por separado | Navegador |
| [ ] | Área de scroll propia en contenedores internos | Lectura |
| [ ] | Feedback tras acciones mutativas | Lectura |
| [ ] | Copy por `ux-writer`; strings por `i18n` | `{comando}` |
| [ ] | Accesibilidad: foco visible, labels asociados, ARIA de §13 | axe o equivalente |

---

## 18. Tu skill ux-patterns [OBLIGATORIO]

<!-- El paquete no trae una skill `ux-patterns` genérica a propósito: dos
     proyectos reales la escribieron y no comparten una sola línea de contenido,
     porque es 100 % del stack. Lo que sí comparten es la forma. Esta sección
     te la da para que la escribas a partir de esta guía. -->

Una skill `ux-patterns` es la versión **ejecutable** de esta guía: lo que la IA
carga sola cuando toca interfaz, en vez de leer estas líneas cada vez. Se escribe
después de la primera implementación, no antes, y cabe en 60 líneas más
referencias.

```markdown
---
name: ux-patterns
description: "Patrones de UI del frontend de {producto} ({stack}): {los 4 o 5
  temas que más se violan}. Activar SIEMPRE al escribir o editar componentes,
  páginas, layouts, formularios o tablas bajo {rutas}. Fuente: docs/GUIA_DISENO.md."
---

## Reglas críticas            ← 8 a 11, cada una apunta a la sección de la guía
## Capas → layouts            ← cómo se ven las capas de protocolo-ux en este stack
## Qué NO hacer               ← lo que la IA repite; sale de §16
## Verificación               ← los comandos de §17
## Referencias                ← esta guía, el inventario, la skill protocolo-ux
```

Reglas de la skill:

- Cada regla crítica **remite** a una sección de esta guía; no la repite.
- Sus «Qué NO hacer» salen de las cicatrices: si algo entra en §16, entra acá.
- Si el proyecto tiene detalle largo por tema (tablas, formularios, móvil), va
  en archivos de referencia junto a la skill, no en el cuerpo.
- La descripción nombra rutas concretas del repo: es lo que hace que se active.

---

# Notas sobre este template

## Cómo crece este documento

| Lo que aparece | Va en |
|---|---|
| Una regla visual nueva con su cicatriz | Esta guía, en su sección |
| Un valor de token | El archivo de tokens; acá, la referencia |
| Un componente nuevo | El inventario; acá sólo si tiene regla especial |
| Un gotcha del stack que no es visual | Las notas técnicas |
| Una decisión con alternativas descartadas (criterio de contraste, tope de peso) | Fila en `docs/ADR.md`; acá el enlace |
| Un texto, un glosario | La skill `ux-writer` |
| Qué cambió y cuándo | Git y los documentos de cambio; acá no hay changelog |

## Señales de que la guía necesita actualización

- La IA genera algo que no sigue la guía → falta la regla, con su cicatriz.
- Un bug de interfaz se repite → falta en §16.
- Un patrón de pantalla nuevo → se documenta después de implementarlo, no antes.
- Un párrafo aparece dos veces en secciones distintas → depurar, no agregar. En
  una de las guías de origen la misma regla de navegación móvil quedó escrita
  dos veces con veinte líneas de distancia.
- Una tabla de valores contradice el archivo de tokens → la guía está mal.

## Tamaño esperado

- Al inicio: 100 a 150 líneas, las secciones obligatorias con valores mínimos.
- Una aplicación madura pasó de 3.000 líneas en cinco meses, y siguió siendo
  legible por tres cosas: cada regla llevaba su cicatriz, el inventario de
  componentes vivía en otro documento, y los valores eran derivados. Sin esas
  tres, el mismo tamaño es ruido.
- Un sitio de contenido quedó en 1.100 con la mitad de las secciones. Es lo
  esperable: el perfil decide, no el número.
