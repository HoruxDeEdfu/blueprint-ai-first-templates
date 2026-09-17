# COMPONENT_LIBRARY.md — Template reutilizable

> Este template define la estructura del inventario vivo de componentes UI de
> un proyecto construido con AI coding agents: qué componentes existen, en qué
> capa viven, cuándo usarlos, cuándo **no**, y qué usar en su lugar.
>
> **Principio:** Un solo inventario, mantenido en el mismo commit que el
> código. Sin él, la AI crea el tercer `Badge` del proyecto porque no supo que
> ya había dos. Con él desactualizado, la AI reutiliza un componente que se
> borró hace un mes. Las dos cosas cuestan más que mantener este archivo.
>
> **Relación con otros documentos:**
> - La guía de diseño define **cómo se ve** el sistema (tokens, tipografía, espaciado)
> - Este inventario define **qué piezas existen** y cuándo se usa cada una
> - Las props las define TypeScript; acá no se duplican tablas de props
>
> **Lo verifica el detector.** El check 5 de `ai-first audit` compara los
> archivos del directorio de componentes contra los nombres que este archivo
> menciona, en las dos direcciones. Ver «Notas sobre el template» al final.

---

## Cómo usar este template

1. Copiar como `docs/COMPONENT_LIBRARY.md` en el proyecto
2. Llenar las secciones marcadas **[OBLIGATORIO]** antes de la primera sesión
   de implementación de UI; la sección 4 arranca casi vacía y crece con el código
3. Declararlo en `AI-FIRST.md`: `artefactos.inventario_componentes` con la ruta
   de este archivo y `artefactos.componentes_dir` con el directorio de
   componentes compartidos. Sin las dos claves el check 5 se reporta omitido
4. Cada componente compartido tiene **un encabezado con su nombre exacto**
   (`#### NombreDelComponente`), que es lo que el detector lee
5. Eliminar las notas del final (`# Notas sobre el template`) cuando el
   documento esté en uso

---

# Inventario de componentes — {Nombre del Proyecto}

> **Inventario vivo de los componentes UI compartidos.** Define qué existe,
> cuándo usarlo, cuándo no, y qué tokens y estados consume.
>
> **Dueño:** {rol o agente que lo mantiene, ej. «Frontend Agent»}.
> **Fuente de verdad visual:** {herramienta de diseño y archivo, si existe}.
> **Verificación:** `ai-first audit`, check 5.

---

## 1. Principios [OBLIGATORIO]

1. **Un solo inventario.** Cualquier componente reutilizable —usado en 2+
   lugares o candidato explícito a serlo— aparece acá.
2. **No duplica tablas de props.** Las props las define TypeScript. Este
   documento responde «qué es, cuándo, por qué, en vez de qué».
3. **No duplica la guía de diseño.** Los tokens se referencian por nombre, no se
   redefinen.
4. **Se actualiza en el mismo commit que el código.** Crear, renombrar o borrar
   un componente sin tocar este archivo es un hallazgo del detector y un PR
   bloqueado. Ver §6.
5. **Alcance limitado a lo compartido.** Un componente privado de una página
   vive fuera del directorio de componentes compartidos y no entra acá.

---

## 2. Capas del sistema [OBLIGATORIO]

| Capa | Qué contiene | Ubicación | Dueño |
|---|---|---|---|
| **0 — Primitivos de la librería base** | Lista blanca de primitivos usados + lista negra explícita | {importados desde la librería, ej. shadcn/ui} | {rol} |
| **1 — Compartidos** | Envoltorios propios sobre los primitivos + compuestos reutilizables | {ruta, ej. paquete `ui`} | {rol} |
| **2 — Patrones de layout** | Estructura de página: encabezados, barras de herramientas, navegación, steppers | {ruta} | {rol} |
| **3 — Dominio** | Componentes con semántica de negocio: badges de estado, indicadores, renderizadores de entidades | {ruta} | {rol} |

**Regla de clasificación:** si un componente podría usarse fuera de este
producto (un `EmptyState` genérico), es Capa 1. Si su existencia depende del
dominio (un badge que mapea severidades del negocio), es Capa 3.

Ajustar el número de capas al proyecto. Dos capas —compartidos y dominio— son
suficientes para un producto chico; cuatro aparecieron en un proyecto real al
pasar de treinta componentes.

---

## 3. Formato por entrada [OBLIGATORIO]

Cada componente documentado usa este formato, breve y disciplinado:

```markdown
#### NombreDelComponente

- **Estado**: [estable | experimental | deprecated | pendiente]
- **Ubicación**: `{ruta_del_archivo}`
- **Capa**: [0 | 1 | 2 | 3]
- **Propósito**: una línea.
- **Cuándo usar**: contextos o situaciones concretos.
- **Cuándo NO usar**: casos que parecen aplicar y no son el encaje correcto, y qué usar en su lugar.
- **Props clave**: las 3–5 props que definen su comportamiento (nombre + tipo resumido; NO la tabla completa).
- **Tokens consumidos**: variables de color, radio, sombra y movimiento que aplica. Nunca valores literales.
- **Estados**: default, hover, focus-visible, disabled, loading, error — los que apliquen.
- **Accesibilidad**: lo mínimo: ARIA, foco, contraste, teclado.
- **Referencia de diseño**: identificador en la herramienta de diseño, o «sin referencia directa».
- **Referenciado en specs**: specs de módulo que lo mencionan.
- **Ejemplo**: [OPCIONAL] un uso mínimo en bloque de código.
```

**Regla anti-inflación:** si una entrada supera ~25 líneas está duplicando
documentación. Recortar.

---

## 4. Inventario [CRECE CON EL PROYECTO]

> Arranca con pocas entradas y crece con el código. El formato es obligatorio
> desde la primera; el contenido llega con la implementación.

### 4.0 Correspondencia con la herramienta de diseño [OPCIONAL]

{Si el proyecto mantiene una librería en su herramienta de diseño, la tabla que
mapea componente → set → identificador. Es lo que permite que un cambio visual
se haga una vez y no dos.}

| Componente | Set en diseño | Identificador | Variantes |
|---|---|---|---|
| {Nombre} | {set} | {id} | {n} |

### 4.1 Capa 0 — Primitivos de la librería base

**Lista blanca** (primitivos que el proyecto usa tal cual, con su envoltorio si lo hay):

| Primitivo | Envoltorio propio | Nota |
|---|---|---|
| {Button} | {sí / no} | {…} |

**Lista negra** (primitivos que **no** se usan, y qué se usa en su lugar):

| Primitivo | Por qué no | Usar en su lugar |
|---|---|---|
| {Primitivo} | {razón} | {componente propio} |

La lista negra existe porque la AI conoce la librería base mejor que el
proyecto: sin ella, cada sesión vuelve a importar el primitivo que se decidió
no usar.

### 4.2 Capa 1 — Compartidos

<!-- Una entrada por componente, con el formato de §3. El encabezado lleva el
     nombre exacto del archivo, sin extensión. -->

### 4.3 Capa 2 — Patrones de layout

<!-- Una entrada por componente, formato de §3. -->

### 4.4 Capa 3 — Dominio

<!-- Una entrada por componente, formato de §3. -->

---

## 5. Estados comunes [OBLIGATORIO]

Todos los componentes cubren, cuando aplique, estos estados de forma consistente:

| Estado | Cuándo aplica | Referencia |
|---|---|---|
| Default | Siempre | tokens base del tema |
| Hover | Elementos interactivos | {token o utilidad} |
| Focus-visible | Todo elemento enfocable por teclado | {token o utilidad} |
| Active / Pressed | Botones y elementos clicables | {…} |
| Disabled | Elementos desactivables | {…} |
| Loading | Acciones asíncronas | {componente de esqueleto o spinner} |
| Error | Validación fallida | {token destructivo} + mensaje `role="alert"` |
| Empty | Sin datos | {componente de estado vacío} |

Un componente que no documenta un estado que sí le aplica se considera
incompleto en la revisión.

---

## 6. Mantenimiento [OBLIGATORIO]

Este documento muere si no se actualiza. Cuatro compuertas:

### 6.1 Al desarrollar un feature (protocolo de features)

- **Antes de implementar:** leer este documento para reutilizar antes de crear.
  Es el «inventario de reuso» del protocolo.
- **Después:** si el feature creó, modificó o renombró un componente compartido,
  la entrada se actualiza **en el mismo commit**.

### 6.2 Al gestionar un cambio (protocolo de cambios)

- El documento de cambio lista este archivo en «Documentación a actualizar» si
  toca componentes compartidos.
- El cierre del cambio verifica que la entrada quedó al día.

### 6.3 Al cerrar la sesión (protocolo de cierre)

- Revisar si hubo cambios en el directorio de componentes y, si los hubo,
  actualizar las entradas correspondientes.

### 6.4 Verificación automática

`ai-first audit` (check 5, P2) compara los archivos del directorio declarado en
`componentes_dir` contra los nombres mencionados acá:

- un componente en disco que este archivo no menciona → **sin inventariar**;
- un encabezado con forma de componente cuyo archivo ya no existe →
  **inventariado pero inexistente**.

Corre en el hook local y en CI, sin modelo ni red. Un hallazgo se resuelve
actualizando este archivo, no silenciando el check.

---

## 7. Cómo agregar un componente nuevo [OBLIGATORIO]

Secuencia estricta:

1. **Antes de escribir código:** confirmar que no existe acá bajo otro nombre.
   Si hay uno parecido, extenderlo en vez de crear otro.
2. **Decidir la capa** según §2.
3. **Implementar** en la ubicación de esa capa.
4. **Agregar la entrada** en §4 con el formato de §3, estado `pendiente` →
   `experimental` → `estable`.
5. **Commit único** con código + entrada. Un PR sin las dos partes se rechaza.

---

## 8. Cómo deprecar un componente [OBLIGATORIO]

1. Cambiar el estado a `deprecated` y agregar una línea
   `**Reemplazo**: NombreDelComponenteNuevo`.
2. Identificar consumidores con `grep`. Con más de 3, abrir un documento de
   cambio: aplica el protocolo de cambios.
3. Migrar consumidores.
4. Eliminar el componente **y su entrada** en un commit final. Si la entrada
   sobrevive al archivo, el detector lo reporta.

**Regla:** ningún componente se elimina sin pasar al menos un release en
`deprecated`, salvo en fase de pre-implementación.

---

## Changelog

| Fecha | Cambio | Origen |
|---|---|---|
| {YYYY-MM-DD} | {qué componente cambió y por qué, en dos líneas} | {CHG-XXX / sesión} |

---

# Notas sobre el template

## Cómo encaja con el check 5 del detector

El detector lee este archivo en código puro, sin modelo, así que las
convenciones importan:

- **Qué archivos cuenta.** Todo lo que haya bajo `componentes_dir` con extensión
  `.tsx`, `.jsx`, `.ts`, `.js`, `.astro`, `.vue` o `.svelte`, recursivamente.
  Se saltan los archivos `*.test.*`, `*.spec.*`, `*.stories.*` y `*.d.ts`, y
  cualquier archivo o carpeta cuyo nombre empiece por `.` o `_`. Un archivo
  `index` dentro de una carpeta cuenta como el componente con el nombre de la
  carpeta; el `index` de la raíz es el barril y no cuenta.
- **Dirección 1: en disco y no en el documento.** Cada nombre de archivo (sin
  extensión) tiene que aparecer en el texto como palabra completa. Basta con
  mencionarlo una vez, en un encabezado o en una tabla de lista blanca. Por eso
  la Capa 0 vale: un primitivo que vive dentro de `componentes_dir` y no tiene
  entrada propia se menciona en la lista blanca y deja de ser hallazgo.
- **Dirección 2: en el documento y no en disco.** Sólo miran los encabezados
  (de nivel 2 en adelante). Un encabezado afirma que existe un componente si
  va entre acentos graves o ángulos, o si tiene joroba interna
  (`PageHeader`). Una palabra capitalizada suelta —«Formularios»,
  «Compartidos»— es título de sección, no afirmación. **Un componente de una
  sola palabra (`Table`, `Badge`) va entre acentos graves en su encabezado**;
  si no, el detector no puede saber que se afirma su existencia y no lo
  reporta cuando se borre.
- **Componentes privados de página.** Si viven dentro de `componentes_dir`, el
  detector los exige inventariados. Dos salidas: moverlos fuera del
  directorio (lo que este template recomienda), o ponerlos en una carpeta
  con prefijo `_`, que el detector no recorre.
- **Renombres.** Compara por nombre, así que renombrar un archivo sin tocar el
  inventario produce los dos hallazgos a la vez. Es a propósito.

## De dónde sale este formato

En un proyecto real de cinco meses este fue el documento **más editado del
repositorio**: 163 commits, por encima del catálogo de cicatrices (150) y muy
por encima del documento de arquitectura (31). Terminó con unas cincuenta
entradas en cuatro capas, más una tabla de correspondencia con la librería de
diseño. Cuatro cosas que aprendió en el camino y que este template ya trae:

1. **La lista negra de primitivos** apareció cuando la AI importó por tercera
   vez un primitivo que el equipo había decidido envolver. La regla no bastaba
   en el `AGENTS.md`; hacía falta la tabla que dice «éste no, usá aquél».
2. **«Cuándo NO usar»** es el campo que más consultas evita. «Cuándo usar» lo
   adivina cualquiera por el nombre; el error típico es usar el componente
   correcto para el caso equivocado.
3. **El changelog al final** con fecha y origen. Sin él, una entrada modificada
   no dice por qué cambió, y la siguiente sesión deshace el cambio creyendo
   que es un error.
4. **La verificación automática** se propuso en el documento original como
   «script recomendado para la fase 2» y nunca se escribió. El check 5 del
   detector es ese script, generalizado.

## Qué no va acá

- **Tablas de props completas.** Las define TypeScript y el editor las muestra;
  copiarlas es garantía de deriva.
- **Tokens y valores de diseño.** Van en la guía de diseño; acá se nombran.
- **Componentes de una sola página.** Si se vuelven compartidos, se mudan de
  carpeta y entran.
