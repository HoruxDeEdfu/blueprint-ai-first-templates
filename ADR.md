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

## ADR-007 — La rama publicada se llama `prod` en los tres repos, y mergear a ella despliega

- **Fecha:** 2026-09-17
- **Estado:** aceptada. Supera lo que ADR-001 dice de `main` como rama que
  sirve los raw links; la rama sigue existiendo con otro nombre.

**Contexto.** El sitio y la landing despliegan con Workers Builds a cada push
de `prod`; este repo usaba `dev` y `main`. Pero mergear a `main` acá ya era un
despliegue: cambia al instante lo que el sitio sirve por raw links, y el
publish a npm iba a colgarse de la misma rama. Una rama que despliega sin
llamarse como las otras dos rompe el hábito de quien opera los tres repos:
«mergear a `prod` despliega» es una sola regla si el nombre es uno solo. Hoy
el costo de renombrar era el más bajo que va a tener: nada publicado en npm,
ningún `repository` apuntando a la rama, y la sesión del sitio cambiando URL
del mismo tipo el mismo día.

**Decisión.** La rama publicada es `prod`; `dev` sigue siendo la de trabajo y
`main` desaparece. `prod` se avanza con `--ff-only` cuando Charlie lo decide, y
mergear a ella despliega dos cosas: los raw links del sitio al instante, y npm
cuando la versión del `package.json` cambió, por un workflow que compara con
la versión publicada y no publica si es la misma. `.npmrc` fija
`publish-branch=prod` para que `pnpm publish` se niegue desde otra rama. El
primer publish, `0.1.0`, sale a mano desde `prod` porque trusted publishing se
configura sobre un paquete que ya existe. El cambio de nombre se hizo sin
ventana: `prod` nació idéntica a `main`, el sitio movió sus 16 raw links con
las dos vivas, y `main` se borró al confirmar.

**Alternativas.** *Mantener `main` acá y `prod` en los otros dos*: era la
recomendación inicial, por ahorrar la edición de 16 URL; perdía ante el
argumento del hábito único y del despliegue implícito que `main` ya tenía.
*Publicar a npm por tag `v*` en vez de por merge*: es la convención de los
paquetes npm, pero mete un segundo gesto («además del merge, el tag») que
rompe la regla única; la comparación de versiones lo resuelve sin tags.
*Renombrar con la API de GitHub en vez de crear y borrar*: más corto, pero
depende de que los redirects de rama alcancen a `raw.githubusercontent.com`,
que no se pudo verificar; crear y borrar no depende de nada.

**Consecuencias.** Un merge a `prod` sin subir la versión sólo actualiza raw
links; con la versión subida, publica los dos paquetes. Subir la versión es,
por tanto, la decisión de publicar. Queda pendiente el workflow y la
configuración de trusted publishing (`HANDOFF.md`, paso 4). Los documentos que
digan `main` de este repo están desactualizados; los de las ADR anteriores se
leen con su fecha.

## ADR-008 — Las skills se instalan en `.agents/skills/` con un enlace para Claude Code, y los templates de contexto adoptan el principio editorial

- **Fecha:** 2026-09-17
- **Estado:** aceptada. Supera lo que `skills/README.md` enseñaba hasta hoy
  (copiar a la carpeta de skills de Claude Code) y las secciones de estructura,
  tech stack y comandos que `templates/AGENTS_MD_TEMPLATE.md` pedía inline.

**Contexto.** Los 8 templates se subieron el 2026-04-01 y no cambiaron; el
proyecto donde nació la metodología arrancó dos semanas después y en cinco
meses aprendió dos cosas que el paquete no enseñaba. La primera: su `AGENTS.md`
pasó de plantilla a documento gobernado por un principio editorial —un árbol de
destinos por tipo de contenido, techo de 200 líneas, regla de frescura, cero
duplicación, y las secciones de estructura, stack y comandos fuera del archivo
por derivables de `ls` y del manifiesto del paquete—, porque cada línea que no
evita un error hoy le quita atención a las que sí. La segunda: nada en el
paquete hablaba de más de una herramienta. `skills/README.md` instalaba con
`cp -r` a `.claude/skills/`, y los equipos que usan Claude Code y Codex sobre el
mismo repo acababan con dos copias o con un enlace por skill. Existe un
estándar abierto, *Agent Skills*, cuyo directorio `.agents/skills/` leen
nativamente Codex, Cursor, OpenCode y Kimi Code; Claude Code lee
`.claude/skills/`. Lo verificó `falcux_personal_web` al revés —fuente en la
carpeta de Claude, un enlace por skill en la de agents—, probado con Claude
Code y Codex. Charlie decidió el alcance el 2026-09-17; esta fila es la Parte 1
del lote que `HANDOFF.md` describe.

**Decisión.** En los proyectos que adopten el paquete, la fuente única de las
skills es `.agents/skills/`, y `.claude/skills` es un enlace simbólico relativo
a «../.agents/skills». `AGENTS.md` sigue siendo el archivo cross-tool y
`CLAUDE.md` sigue siendo `@AGENTS.md`. Este repo predica con el ejemplo: su
única skill propia pasa de `.claude/skills/criterio` a
`.agents/skills/criterio`, con el enlace. `skills/` sigue siendo la carpeta del
tarball; lo que cambia es lo que enseña a instalar. Los templates
`CLAUDE_MD_TEMPLATE.md` y `AGENTS_MD_TEMPLATE.md` incorporan el principio
editorial, generalizado sin nombrar el proyecto de origen, con el índice de
skills bajo demanda y el árbol multi-herramienta. Las ocho skills recuperan lo
que se perdió al generalizarlas: las cinco referencias de `ux-writer` y su
sección de enforcement, las tres de `i18n`, los dos scripts de la Capa 1 de
`ux-audit` y el paso 7 de `protocolo-features`, todo generalizado.

**Alternativas.** *Fuente en `.claude/skills/` y un enlace por skill hacia
`.agents/skills/`*, como hizo `falcux_personal_web`: funciona y está probado,
pero obliga a crear un enlace nuevo por cada skill que se agrega y a recordarlo;
el enlace único de carpeta no. *Copias por herramienta*: dos carpetas con el
mismo contenido son la entropía que el paquete mide; divergen en la primera
edición apurada. *Dejar los templates como estaban y anotar el principio en el
manual*: el template es lo que se copia; un principio que vive sólo en el sitio
no llega al `AGENTS.md` de nadie.

**Consecuencias.** El apéndice de templates del sitio repite el bloque `cp -r`
y tiene que cambiar; se avisó a la sesión del sitio. El `init` futuro escribe
`.agents/skills/` y el enlace, no la carpeta de Claude. Un equipo en Windows
sin enlaces simbólicos habilitados usa copia en la carpeta de Claude y declara
la fuente en su `AGENTS.md`. Las skills ganan archivos de apoyo dentro de su
carpeta («references/», «checks/»); los `SKILL.md` no se mueven, así que los
enlaces del sitio siguen vivos. Los templates dejan de pedir estructura, stack
y comandos: un `AGENTS.md` generado desde ellos es más corto y envejece más
despacio.

## ADR-009 — Cinco documentos ganan template: cicatrices, inventario de componentes, arquitectura, documento de cambio y spec por módulo

- **Fecha:** 2026-09-17
- **Estado:** aceptada. Parte 2 del lote de actualización de templates y
  skills (`HANDOFF.md`); sale en la 0.2.0.

**Contexto.** Los 8 templates se subieron el 2026-04-01 y no cambiaron desde
entonces. En el proyecto real donde nació la metodología, los documentos que
más se editaron en los cinco meses siguientes no tenían molde: el catálogo de
cicatrices técnicas (150 commits), el inventario de componentes (163), el
documento de arquitectura (31), una carpeta de cambios que llegó a 385
documentos numerados y una de specs con 26. La metodología ya daba por hecho
que existían: el protocolo de cierre enruta aprendizajes a TECH_NOTES, a la
spec del módulo y al inventario; el protocolo de cambios exige el documento
`CHG-XXX` antes de tocar código; el check 5 del detector lee el inventario
contra el directorio de componentes, y el check 3 lee «Archivos» o «Alcance»
de una spec. Quien adoptaba el paquete tenía que inventar el formato de cinco
documentos que las skills y el detector ya asumían.

**Decisión.** Cinco templates nuevos en `templates/`, con el patrón de nombre
existente: `TECH_NOTES_TEMPLATE.md`, `COMPONENT_LIBRARY_TEMPLATE.md`,
`ARQUITECTURA_TEMPLATE.md`, `CHG_TEMPLATE.md` y `SPEC_MODULO_TEMPLATE.md`.
Cada uno generaliza el documento real sin nombrarlo, cita sus cifras como «un
proyecto real», y trae la anatomía que el detector lee: encabezado por
componente en el inventario, sección «Archivos afectados» en el CHG y
«Archivos del módulo» en la spec. El criterio de entrada fue doble: que las
skills o el detector ya lo asumieran, **y** que en el proyecto real hubiera
tenido edición sostenida. Quedaron fuera por no cumplir uno de los dos: la
matriz de permisos (40 commits, pero es del producto y no de la metodología;
la colisión está en `SPEC-PAQUETE.md` §4), el log de sesiones y el registro
de cambios (su formato ya está en los protocolos y es trivial), y los runbooks
de despliegue (demasiado atados a la infraestructura de cada proyecto).

**Alternativas.** *Dejarlos como prosa en el manual*: el manual ya los
describía y el proyecto real igual tardó meses en converger a un formato; la
prosa dice qué guardar, no cómo, y el detector necesita el cómo. *Un solo
template «docs» genérico*: cinco documentos con cinco ciclos de vida
distintos —uno se agrega arriba, otro se sobreescribe, otro se elimina al
cerrar— no caben en una anatomía; un template genérico habría sido un índice
con cinco secciones, que es lo que ya hace el `AGENTS.md`. *Meter la anatomía
dentro de los protocolos existentes*: el protocolo de cambios ya lleva una
anatomía corta del CHG en su §2.2, y eso es justo lo que no escaló; el
protocolo dice cuándo y el template dice qué, y se descargan por separado.

**Consecuencias.** El paquete pasa de 8 a 13 templates; el sitio cambia la
cuenta en la landing, el volcado para LLMs y el apéndice, que gana el grupo
«Documentos vivos» y suma CHG y SPEC junto a sus protocolos. La cadena de
artefactos del manual y el template de `AGENTS.md` nombran
`docs/SPECS_POR_MODULO.md` como archivo único; la spec por módulo lo
reemplaza por la carpeta `docs/specs/` con un README índice, que es lo que el
proyecto real terminó haciendo. El template ya lo dice desde ADR-008; el
capítulo lo cambia el sitio. La anatomía del CHG queda en tres sitios —protocolo,
skill y template— hasta que el protocolo se edite para apuntar al template;
esa edición toca un template publicado y va en su propio lote. Nada de esto
mueve rutas que el sitio enlaza. El `init` futuro puede ofrecer estos cinco
archivos además de `AI-FIRST.md` y `ADR.md`.

## ADR-010 — La guía de diseño se reorganiza por sistema, y de las cinco skills candidatas entran dos: `information-architecture` y `test-fix`

- **Fecha:** 2026-09-17
- **Estado:** aceptada. Parte 3 del lote de actualización de templates y
  skills (`HANDOFF.md`).

**Contexto.** El template de la guía de diseño se subió el 2026-04-01 y no
cambió desde entonces: 16 secciones numeradas, extraído de una sola guía y
nombrándola. Desde entonces dos guías reales evolucionaron en direcciones
distintas: la de una aplicación de datos con navegación autenticada, que en
cinco meses pasó por 71 revisiones y llegó a 3.009 líneas organizada por
sistema (tokens, layout en tres niveles, móvil, tablas, formularios extensos,
movimiento), y la de un sitio de contenido en otro stack, de 1.114 líneas con
la mitad de las secciones. Cinco skills de la primera quedaron fuera de las 8
del paquete y son candidatas a transferibles: `unit-test-fix`, `e2e-fix`,
`information-architecture`, `ux-patterns` y `clean-architecture`. Allá la
cadena de diseño es `information-architecture` → `protocolo-ux` →
`ux-patterns`, y el paquete sólo tiene el eslabón del medio.

**Decisión.**

1. *La guía.* Se reorganiza por sistema, no por lista de temas, con lo que las
   dos guías reales comparten y sin nombrar a ninguna. Tres cosas nuevas que no
   estaban y son lo que las mantuvo legibles: una sección «Dónde vive la
   verdad» que declara los valores como derivados del archivo de tokens; la
   regla de que cada norma lleva su cicatriz; y un árbol de destinos para lo
   que no le toca (inventario de componentes, copy, decisiones, changelog). Se
   recogen las reglas que sólo se aprenden con volumen (estados como roles y
   no opacidades, un encabezado por tabla, paginación en servidor, la acción
   de crear dentro del estado vacío, skeletons con retraso y su deriva) y se
   marcan las secciones que un sitio de contenido borra. Cierra con la forma
   de la skill `ux-patterns` que el proyecto escribe a partir de ella.
2. *`information-architecture` entra*, generalizada. Responde una pregunta que
   ninguna de las 8 responde («¿qué es esto, cómo se llama y dónde vive?») y es
   el primer eslabón de la cadena; `protocolo-ux` da por decidida esa
   estructura. Su regla de naming (un concepto, un lema, una forma por capa)
   es entropía documental aplicada a la interfaz: el mismo argumento del
   paquete. De sus 437 líneas, la mitad era sitemap, taxonomía y deuda del
   producto; eso pasa a la sección «Adaptación a tu proyecto» como las cinco
   cosas que el proyecto agrega.
3. *`unit-test-fix` y `e2e-fix` entran fusionadas en `test-fix`.* Comparten el
   esqueleto entero (alcance desde git, salida filtrada por un agente aparte,
   clasificación mecánica vs. negocio, corrección mínima, tope de dos rondas,
   suite completa una vez, reporte) y duplicaban ese texto; la fusión deja una
   sección E2E con lo que sólo ella tiene: prerrequisitos, evidencia, tests
   intocables, y la regla de que corre sólo bajo decisión explícita. Lo que
   gobierna es la frontera entre lo que el agente corrige solo y lo que
   decide el humano: los tests son la especificación.
4. *`ux-patterns` no entra como skill.* Dos proyectos reales la escribieron y
   no comparten una sola línea: es 100 % del stack. Lo compartido es la forma,
   y esa va en la última sección de la guía. `protocolo-ux` y `ux-audit` ya
   dicen «crea un `ux-patterns` propio»; una genérica sería una skill de
   marcadores, el caso que el README de skills advierte como peor que no
   tenerla. Sus reglas agnósticas (tokens, una librería de iconos, i18n, 4
   estados) ya existen como checks en la Capa 1 de `ux-audit`.
5. *`clean-architecture` no entra.* Prescribe una arquitectura (dominio →
   aplicación → infraestructura) que el manual no enseña, y el paquete se
   posiciona como gobierno del contexto que se instala encima de cualquier
   framework. Sería agregar el acoplamiento que `HANDOFF.md` ya anota como
   residual en `protocolo-features`. Sus reglas de dependencia son del
   documento de arquitectura del proyecto; una skill de 40 líneas se escribe
   desde ahí.

**Alternativas.** *Fusionar `information-architecture` en `protocolo-ux`*:
una sola skill de diseño, pero mezcla dos momentos (estructura antes de la
spec, comportamiento al diseñarla) y triplica una skill que es corta a
propósito. *Dos skills de tests separadas, como en el origen*: respeta la
activación distinta de E2E, pero al precio de duplicar 40 % del texto; la
regla «E2E sólo bajo decisión explícita» dentro de una sola skill resuelve lo
mismo. *`ux-patterns` como esqueleto con marcadores*: da un archivo que
copiar, pero cada línea sería `{…}`, y una skill sin contenido ocupa
presupuesto de carga sin dar instrucciones. *Reescribir la guía copiando la
de la aplicación y quitando nombres*: 3.000 líneas de las que la mitad son
del producto (pipeline de tokens, barra inferior móvil, formularios de un
dominio, PDFs); el template quedaría inutilizable para un sitio.

**Consecuencias.** El paquete pasa de 8 a **10 skills**; «las 8» que el sitio
documenta y enlaza cambia, y se avisa a la sesión del sitio antes de que `dev`
llegue a `prod`. `skills/README.md` gana las dos filas, el orden de
adopción y el grafo de dependencias; el índice de skills del template de
`AGENTS.md` nombra las dos nuevas; y `protocolo-ux` nombra a
`information-architecture` como eslabón previo en su «Complemento», una
línea que no toca su comportamiento y que se avisó al sitio. Esta parte sale en la 0.2.0 o
después. Hallazgo colateral: el template de protocolo de patrones UX de
`templates/` es, en contenido, el precursor de `protocolo-ux` y no una
plantilla de `ux-patterns`; queda anotado en `HANDOFF.md`, sin mover ni
renombrar, porque el sitio lo enlaza.

## ADR-011 — El alias `ai-first` sin scope se descarta; se publica sólo `@falcux/ai-first`

- **Fecha:** 2026-09-17
- **Estado:** aceptada. Supera la parte de ADR-002 que decidía publicar el
  alias en el mismo primer publish; el nombre en npm del paquete real,
  `@falcux/ai-first`, sigue en pie.

**Contexto.** El primer publish salió el 2026-09-17 desde `prod`, con 2FA en
la cuenta `falcux`: `pnpm publish --access public` en la raíz publicó
`@falcux/ai-first@0.1.0` sin problema. El segundo comando,
`pnpm --filter ai-first publish --access public`, falló con 403: «Package
name too similar to existing package ee-first; try renaming your package to
'@falcux/ai-first'…». No era el 2FA, ya resuelto para el primer comando: es el
chequeo de similitud de npm contra paquetes existentes, pensado contra
typosquatting, y no tiene bandera para forzarlo en un nombre sin scope. El
paquete `ee-first` es una dependencia real y muy instalada (la usa `finalhandler`
de Express), así que no es un falso positivo trivial de desactivar.

**Decisión.** Se descarta el alias. `@falcux/ai-first` es el único nombre en
npm; el comando sigue siendo `ai-first` porque así lo expone el `bin` del
paquete con scope, sólo que se invoca `npx @falcux/ai-first`, no
`npx ai-first`. Se borran la carpeta del alias, el archivo de workspace de
pnpm y su prueba el mismo día.

**Alternativas.** *Pedir a soporte de npm una excepción al chequeo de
similitud*: npm las concede a veces cuando el paquete con scope ya existe y el
propósito es legítimo, pero es un trámite con soporte humano, de duración
incierta, para un nombre que es conveniencia y no necesidad. *Publicar el
alias con otro nombre sin scope* (`falcux-ai-first`, `ai-first-cli`): resuelve
el chequeo pero pierde el nombre corto que motivaba el alias en primer lugar
(ADR-002); no vale la pena mantener dos paquetes por una comodidad menor.

**Consecuencias.** Los packs verticales futuros (`@falcux/compliance-pack`,
`@falcux/fintech-pack`) siguen bajo el scope sin que esto los afecte: nunca
dependieron del alias. `README.md`, `AGENTS.md` y `HANDOFF.md` dejan de
mencionar un segundo paquete. Si en el futuro se quiere un nombre corto, esta
fila es el antecedente de por qué no salió a la primera.

## ADR-012 — Se retiran los cuatro templates de protocolo; las skills `protocolo-*` son el único formato

- **Fecha:** 2026-09-18
- **Estado:** aceptada

**Contexto.** Los cuatro templates de protocolo —desarrollo de features,
gestión de cambios, cierre de sesión y patrones UX— se subieron el
2026-04-01, antes de que este repo existiera como paquete. Los cuatro llevan
frontmatter de skill (nombres `feature-development`, `change-management`,
`session-closure`, `ux-patterns`) con los nombres de antes de la
generalización del 2026-09-15, que los renombró a `protocolo-features`,
`protocolo-cambios`, `protocolo-cierre` y `protocolo-ux`. `lote-3` ya había
encontrado el caso del de patrones UX («es el precursor de `protocolo-ux`,
no una plantilla de `ux-patterns`») y lo dejó sin resolver porque el sitio lo
enlazaba. Al revisar los otros tres, el mismo patrón se repite en los cuatro.
Además, ninguno sigue el mecanismo que sí tienen los demás templates: no se
declaran bajo `artefactos.*` en `AI-FIRST.md`, y ningún check del detector
los lee. Y el contenido divergió: las skills incorporan Zonas Prohibidas y
`ADR.md`, formalizados el 2026-09-16, que los templates no tienen porque son
de un mes y medio antes. El template de `AGENTS.md`, reescrito el
2026-09-17, ya sólo instruye instalar las skills; no hay ningún flujo
vigente que pida copiar estos cuatro documentos a un proyecto.

**Decisión.** Se borran los cuatro. `skills/protocolo-*/SKILL.md` queda como
el único formato de los cuatro protocolos de la Parte III. El paquete pasa de
13 a 9 templates. El template del documento de cambio deja de nombrar al de
gestión de cambios como alternativa a la skill.

**Alternativas.** *Reescribirlos como prosa sin frontmatter de skill,
distinta del contenido de la skill*: es la lectura literal de
`skills/README.md` («protocolo = documento; skill = mismo procedimiento en
formato IA»), pero exige mantener dos versiones del mismo procedimiento
sincronizadas a mano para siempre —la entropía que este producto vende
medir— sin que ningún mecanismo del propio paquete lo vigile. *Dejarlos
como están, marcados obsoletos en una nota*: no evita que alguien los copie
igual, y no corrige el `name:` que colisiona con el nombre real de la skill.

**Consecuencias.** El sitio pierde 4 tarjetas de descarga en el apéndice y
ajusta 8 archivos que nombran los cuatro templates —capítulos de protocolos,
la guía de diseño, el capítulo de AGENTS.md, el glosario—; ninguno se tocó
desde acá. Un proyecto que instaló la versión anterior del paquete y copió
estos cuatro documentos los conserva sin problema: nada los borra
retroactivamente, sólo dejan de distribuirse en versiones nuevas.
