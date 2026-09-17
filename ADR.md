# Registro de decisiones — `@falcux/ai-first`

Una fila por decisión, en orden, sin borrar nunca. Una decisión entra si es
difícil de revertir, tenía alternativas reales y alguien va a preguntar por qué
en seis meses. Formato en `SPEC-PAQUETE.md` §3.

## ADR-001 — El código del paquete vive en este repo, en la rama `dev`

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
