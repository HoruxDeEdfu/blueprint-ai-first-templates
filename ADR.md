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
