# Registro de decisiones — `@falcux/ai-first`

Una fila por decisión, en orden, sin borrar nunca. Una decisión entra si es
difícil de revertir, tenía alternativas reales y alguien va a preguntar por qué
en seis meses. Formato en `SPEC-PAQUETE.md` §3.

## ADR-001 — El código del paquete vive en `blueprint-ai-first-templates`, rama `dev`, y no en el repo del sitio

- **Fecha:** 2026-09-17
- **Estado:** aceptada

**Contexto.** El detector de entropía estaba especificado y sin escribir. Había
que decidir dónde ponerlo. El repo del sitio (`falcux-ai-first`) es Astro +
Starlight, estático, y Workers Builds lo publica a cada push de `prod`. Este
repo tenía los 8 templates —que no existen en ningún otro lado— y una copia de
las 8 skills que el workflow de sincronización del repo del sitio regenera con
`rsync --delete`. El sitio
publicado descarga skills desde los raw links de `main` de este repo.

**Decisión.** El código se escribe acá, en `dev`. `main` no se toca hasta que
el detector merezca verse: sigue sirviendo los raw links y recibiendo la
sincronización de skills. `SPEC-PAQUETE.md` se muda acá porque es el contrato
del paquete, no del sitio.

**Alternativas.** *Workspace pnpm en el sitio*: obligaba a mover el Astro a un
subdirectorio y a cambiar el root de Workers Builds desde el panel de
Cloudflare, fuera de git, para cero beneficio. *Repo nuevo*: los templates
viven sólo acá y el paquete los necesita; duplicarlos es la entropía que el
producto combate. *Repo privado hasta que funcione*: el diseño ya estaba
publicado entero en el manual, la Apache 2.0 se eligió a propósito, y con cero
estrellas no había audiencia ante la que esconder commits a medias.

**Consecuencias.** Nada del código puede vivir dentro de `skills/`: el rsync lo
borraría. El repo pasa de ser sólo material descargable a ser también un
paquete, y va a necesitar renombrarse antes de publicar. Se desarrolla en
abierto desde el primer commit.

## ADR-002 — Se publica como `@falcux/ai-first`, con `ai-first` como alias funcional

- **Fecha:** 2026-09-17
- **Estado:** aceptada

**Contexto.** Los dos nombres estaban libres en npm. El nombre sin scope es más
corto para la landing (`npx ai-first`). El proyecto tiene previstos packs
verticales (`@falcux/compliance-pack`, `@falcux/fintech-pack`) que son la capa
que se cobra.

**Decisión.** El paquete real es `@falcux/ai-first`. En el mismo primer publish
se publica `ai-first` sin scope como alias fino: depende de `@falcux/ai-first`
y expone el mismo `bin`. El comando es `ai-first audit` en los dos casos. La
primera publicación del scoped lleva `--access public`.

**Alternativas.** *Sólo `ai-first` sin scope*: más corto, pero un nombre sin
scope es del primero que llega y no controla a `ai-first-*` ni a los packs; la
familia se vería como paquetes sueltos de nadie. *Sólo `@falcux/ai-first`*:
deja el nombre corto libre para que otro se lo quede el día que la landing lo
mencione. *Reservar `ai-first` con un placeholder vacío*: la política de
disputas de npm permite reclamar nombres ocupados por paquetes sin contenido
funcional.

**Consecuencias.** Dos paquetes que publicar en cada release, con el alias
siempre apuntando a la misma versión. El scope `@falcux` hay que crearlo en
npm como organización antes del primer publish. Los packs verticales heredan
el namespace sin discusión.

## ADR-003 — Un `init` mínimo antes que el `init` completo del mapa

- **Fecha:** 2026-09-17
- **Estado:** aceptada

**Contexto.** `audit` exige un `AI-FIRST.md` que, sin herramienta, sólo se
escribe leyendo la spec entera. Publicar `audit` solo era publicar algo que no
arranca. El `init` del mapa v1 —escanear, entrevistar, adaptar las 8 skills,
generar AGENTS.md— depende de tres decisiones abiertas: la colisión de
nombres de las skills (bloqueador nº2), el esquema de `.ai-first/manifest.json`
y las secuencias base por arquitectura.

**Decisión.** `init` escanea el repo y escribe dos archivos: `AI-FIRST.md` con
sugerencias derivadas de lo que encuentra, y un `ADR.md` vacío. No toca
skills ni AGENTS.md, no escribe manifiesto y nunca sobreescribe. Es el
primer paso del `init` completo, no un sustituto: la entrevista y las skills
se montan encima cuando sus bloqueadores se resuelvan.

**Alternativas.** *Publicar sólo `audit`*: nadie lo puede usar sin el archivo.
*Esperar al `init` completo*: semanas y tres decisiones que no son código,
sin aprender nada del check 2 en repos ajenos mientras tanto. *Sobreescribir
con `--forzar`*: un `AI-FIRST.md` editado a mano vale más que cualquier
sugerencia automática; la opción era un arma cargada.

**Consecuencias.** La v0.1 se rotula como lo que es: instrumento de medición
más el archivo que lo alimenta, sin reemplazar el `git clone` de las skills.
Quien la instale sigue copiando skills a mano. Lo que `init` escribe se valida
con el mismo lector que usa `audit` antes de tocar el disco.

## ADR-004 — El scope `@falcux` se publica desde la cuenta de usuario `falcux`, no desde una organización

- **Fecha:** 2026-09-17
- **Estado:** aceptada. Supera la consecuencia de ADR-002 que pedía crear
  `@falcux` como organización antes del primer publish.

**Contexto.** ADR-002 dio por hecho que un scope exige una organización. En
npm un scope pertenece a quien lleve ese nombre, sea usuario u organización, y
ya existía la cuenta de usuario `falcux`, verificada con `npm whoami` el
2026-09-17. Usuario y organización comparten el espacio de nombres: una
organización `falcux` no se puede crear mientras exista el usuario; habría que
convertir la cuenta, eligiendo otro nombre para el usuario personal.

**Decisión.** `@falcux/ai-first` y el alias `ai-first` se publican desde la
cuenta de usuario `falcux`, con 2FA activo. No se crea organización ni se
convierte la cuenta.

**Alternativas.** *Convertir la cuenta en organización ahora*: da equipos,
tokens y permisos por miembro que hoy no tiene quién usar, a cambio de
renombrar el usuario personal y rehacer el login en cada máquina. *Crear la
organización con otro nombre*: pierde el scope `@falcux`, que es la marca.

**Consecuencias.** Los paquetes quedan atados al login personal y a su 2FA;
quien publique es una sola persona hasta que se convierta la cuenta. La
conversión conserva el scope y los paquetes, así que se puede hacer el día que
haya más de una persona publicando, sin tocar nada de lo publicado. El paso 1
de la lista de publish en `HANDOFF.md` desaparece.

## ADR-005 — El repo del paquete se llama `falcux-ai-first-package`

- **Fecha:** 2026-09-17
- **Estado:** aceptada

**Contexto.** ADR-001 anticipó que el repo, nacido como material descargable
con el nombre `blueprint-ai-first-templates`, iba a necesitar renombrarse al
volverse paquete: el `repository` del `package.json` es la URL que npm muestra.
El repo del sitio ya se había renombrado a `falcux-ai-first-docs-web`, soltando
`falcux-ai-first`. En GitHub no hay organización `falcux`: el usuario `falcux`
existe desde 2013, sin repos, y no es del proyecto. GitHub redirige los
nombres viejos mientras nadie los reutilice, así que el renombre no bloqueaba
el publish; se hizo antes para editar una sola vez las URL del sitio.

**Decisión.** `HoruxDeEdfu/falcux-ai-first-package`. Los dos `package.json`
declaran `repository`, `homepage` (`ai-first.falcux.com`) y `bugs` con ese
nombre; el alias agrega `directory: alias`.

**Alternativas.** *`falcux-ai-first`*, espejo del nombre npm: estaba libre,
pero cada mención a `falcux-ai-first` en los documentos de este repo pasaba de
desactualizada a señalar al repo equivocado, y el clon local del sitio empuja
todavía a esa URL. *`ai-first`* a secas bajo la cuenta personal: es la
convención de cuentas personales y el más corto, pero junto a
`falcux-ai-first-docs-web` queda huérfano y sin la marca que la Apache 2.0
protege. *`falcux/ai-first`*: exige el handle `falcux`, que no es nuestro;
Charlie va a evaluar pedirlo a GitHub.

**Consecuencias.** Los dos repos se leen como hermanos: `-docs-web` documenta,
`-package` entrega. Si el handle `falcux` se consigue, transferir el repo ahí y
dejarlo en `falcux/ai-first` conserva los redirects; sería una fila nueva.
Hasta entonces, `main` sigue sirviendo raw links por redirect, y el sitio
tiene que actualizar 21 URL y una línea del workflow en la edición del merge.

## ADR-006 — `skills/` es la fuente de verdad de las 8 skills; el sitio deja de sincronizarlas

- **Fecha:** 2026-09-17
- **Estado:** aceptada. Supera la consecuencia de ADR-001 «nada del código
  puede vivir dentro de `skills/`: el rsync lo borraría», y la Zona Prohibida
  que `AI-FIRST.md` declaraba por esa razón.

**Contexto.** El 2026-09-16 las skills se autoraban en el repo del sitio y un
workflow las empujaba acá con `rsync --delete` a cada publicación de `prod`. La
razón era de ese día: el repo Mintlify se daba de baja y éste era un espejo
público sin CI, así que la fuente tenía que estar donde había workflow. Esa
razón caducó al día siguiente, cuando este repo pasó a ser el paquete: la
carpeta `skills/` viaja en el tarball de npm (`files` del `package.json`) y no
se podía editar desde acá. Mantener la sincronización obligaba a distribuir
una carpeta cuyo dueño era otro repo. Lo pidió el sitio con su criterio;
Charlie lo decidió.

**Decisión.** `skills/` vive acá y sólo acá. El sitio borró su copia y el
workflow, tras verificar con `diff -rq` que los 9 archivos eran idénticos a los
de `dev` en `6de6794`. `AI-FIRST.md` queda sin Zonas Prohibidas: la de `skills/`
existía por el rsync, no por importancia, y el check 1 se reporta omitido antes
que inventar una zona.

**Alternativas.** *Seguir sincronizando desde el sitio*: el paquete publicaría
algo que no gobierna, y cada edición a una skill pasaría por un repo privado
ajeno al paquete. *Sincronizar al revés, de acá al sitio*: el sitio no necesita
la copia; enlaza a los raw links de `main`. Un espejo sin lector es entropía.

**Consecuencias.** Las skills se editan acá con las mismas compuertas que el
código: `pnpm test` y `audit:self`. El sitio sigue enlazando a
`main/skills/<nombre>/SKILL.md`; mover o renombrar esas rutas se coordina antes
del merge a `main`, igual que con `templates/`. Nace una dependencia de
contenido en los dos sentidos: `protocolo-features`, `protocolo-cambios` y
`protocolo-cierre` asumen el capítulo «Gobierno del contexto» del manual; si
cambian ellas, se avisa al sitio, y si cambia el capítulo, el sitio avisa acá.
El bloqueador compartido nº2, los nombres genéricos de las skills, pasa a ser
enteramente de este repo.
