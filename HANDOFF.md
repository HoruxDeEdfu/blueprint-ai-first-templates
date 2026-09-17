# Handoff — `@falcux/ai-first`

El paquete: los 8 templates, las 8 skills y el detector de
entropía documental. El sitio de la metodología tiene su propio handoff en el
repo `falcux-ai-first-docs-web`; acá sólo lo que es del paquete y lo que los
dos comparten. Este repo se llama `falcux-ai-first-package` desde el
2026-09-17 (ADR-005); antes fue `blueprint-ai-first-templates`, y antes
`docs-ai-first-blueprint`. GitHub redirige los dos nombres viejos mientras
nadie los reutilice.

> Este archivo nació el 2026-09-17 al mudar la Parte B del handoff del sitio,
> que fue donde el paquete se planeó mientras no tenía repo. El plan original
> sigue abajo tal como se escribió, para que se vea qué se cumplió y qué no.

---

## Estado al 2026-09-17

**Lo que existe y corre**, en `dev`, con 65 pruebas en verde y `audit:self` en 0:

| Comando | Estado |
|---|---|
| `ai-first audit` | Los cinco checks de la spec, el puntaje y los exit codes. Dos modos: árbol de trabajo (hook local) y `--base <ref>` (CI). |
| `ai-first init` | Mínimo: escanea, sugiere y escribe `AI-FIRST.md` + `ADR.md`. No toca skills ni AGENTS.md. Nunca sobreescribe (ADR-003). |
| `sync`, `adr`, `handoff` | Mapeados abajo, sin escribir. El CLI lo dice con exit 2. |
| `ai-first` sin scope | El alias de ADR-002, en `alias/`: shim que importa `@falcux/ai-first/cli`, miembro del workspace pnpm, `workspace:*` que `pnpm pack` vuelve versión exacta. Cinco pruebas lo atan al raíz. |

**Lo que la spec dejó abierto y cómo se resolvió** — si la spec cambia, alinear
esto o el código:

1. *Check 2, «el mismo rango de commits».* Sin `--base`, árbol + índice + sin
   seguimiento contra HEAD; con `--base`, `ref...HEAD`. La anotación
   `ai-first: sin-decision` sólo se lee en el segundo modo.
2. *Check 3, cómo una spec «lista archivos».* Sección cuyo título empiece por
   «Archivos» o «Alcance», rutas entre acentos graves, globs permitidos.
3. *Check 4, determinista pero no discreto.* En bruto daba 63 P2 contra el repo
   del sitio; con reglas explícitas (comentadas en el código) bajó a 16, casi
   todos ciertos. **La saturación es real**: 13 P2 dan 100/100. Un tope por
   check o por documento es cambio de spec, no de código. Sin decidir.
4. *`artefactos` son documentos que hablan de ESTE repo.* Un spec genérico o un
   handoff que narra otros repos genera un P2 por cada ruta ajena.

**Decisiones tomadas**, con sus alternativas, en `ADR.md`: dónde vive el
código (001), el nombre en npm y el alias (002), init mínimo antes que completo
(003), publicar desde la cuenta de usuario `falcux` y no desde una organización
(004), el nombre del repo (005), y `skills/` como fuente de verdad en vez de
copia del sitio (006).

**Las skills cambiaron de dueño el 2026-09-17** (ADR-006). El sitio borró su
`skills/` y el workflow que la empujaba acá con `rsync --delete`, tras
verificar con `diff -rq` que los 9 archivos eran idénticos a los de `dev` en
`6de6794`. Desde entonces `skills/` se edita acá; `AI-FIRST.md` la quita de
Zonas Prohibidas porque la razón era el rsync. El sitio sigue enlazando a
`prod/skills/<nombre>/SKILL.md`. Tres skills asumen su capítulo «Gobierno del
contexto»: tocarlas obliga a avisar al sitio, y viceversa.

### Lo que sigue, en orden

Para el `npx` ya no falta código: el alias (ADR-002) quedó escrito el
2026-09-17. Todo lo que falta son decisiones o pasos manuales de Charlie, en
este orden porque cada uno alimenta al siguiente:

1. ~~Crear la organización `@falcux` en npm.~~ **No hace falta (ADR-004).** El
   scope `@falcux` ya es de la cuenta de usuario `falcux`, verificado el
   2026-09-17 con `npm whoami` desde esta máquina, ya logueada. Lo único que
   queda de este paso es tener 2FA activo en esa cuenta antes de publicar.
2. ~~Decidir el renombre del repo.~~ **Hecho el 2026-09-17**: es
   `falcux-ai-first-package` (ADR-005), y los dos `package.json` ya declaran
   `repository`, `homepage` y `bugs` con ese nombre. Lo que arrastra al sitio
   se resolvió en la lista del merge, abajo.
3. ~~Quitar `private: true` y subir a `0.1.0` en los dos `package.json`.~~
   **Hecho el 2026-09-17**, raíz y `alias/` en el mismo commit. Desde entonces
   nada frena un `pnpm publish` accidental salvo no correrlo. La prueba
   `test/alias.test.ts` sigue exigiendo que `version` y `private` coincidan.
4. **Primer publish a mano, desde `prod`** (ADR-007). Trusted publishing de
   npm se configura desde la página del paquete, así que el paquete tiene que
   existir antes: la `0.1.0` sale de la máquina de Charlie, logueada como
   `falcux`, con `prod` al día y árbol limpio (`.npmrc` fija
   `publish-branch=prod`; `pnpm publish` se niega desde otra rama). Dos
   comandos en este orden: `pnpm publish --access public` en la raíz y luego
   `pnpm --filter ai-first publish --access public`. Son dos porque `pnpm -r`
   excluye la raíz del workspace por defecto; el alias va segundo porque su
   `package.json` empaquetado ya pide la versión exacta del raíz. Esa versión
   sale sin provenance; es el precio de no crear nunca un token de larga vida.
   Nada de esto se corre sin que Charlie lo pida: es el único paso irreversible.
   **Después**, y es la segunda mitad del paso: configurar trusted publishing en
   npmjs.com para los dos paquetes apuntando a este repo y al workflow, y
   escribir `.github/workflows/publish.yml` disparado por push a `prod`, con
   `id-token: write`, que corre la suite y `audit:self --base`, compara la
   versión del `package.json` con la publicada y publica raíz y alias sólo si
   cambió. Queda por verificar si `pnpm publish` ya habla OIDC con npm; si no,
   el workflow empaqueta con `pnpm pack` y publica el tarball con `npm publish`.
5. **Verificar en una carpeta vacía:** `npx @falcux/ai-first --help` y
   `npx ai-first --help` deben dar la misma ayuda.

Nota menor: el tarball del alias lleva `bin/`, `package.json` y `README.md`, no
`LICENSE`; el campo `license: Apache-2.0` sí viaja. Copiar el archivo sería
duplicarlo. Si npm lo reclama en la página del paquete, se copia en el `prepack`.

**El merge de `dev` a `main` se hizo el 2026-09-17**, avance directo de 12
commits hasta `b6d3804`, coordinado con el sitio en dos lotes: primero el
nombre nuevo del repo en las 21 URL y el workflow de sincronización, sin mover
rutas; después de nuestro merge, las 8 tarjetas de `/docs/apendices/templates`
a `main/templates/<archivo>`, publicado en `prod` del sitio en `e60c1a2`.
Verificado desde la página publicada: 8 tarjetas a `templates/`, ninguna a la
raíz, cero nombres viejos, las 8 URL en 200. La raíz de `main` siguió dando 200
unos minutos por la caché del CDN de GitHub, no porque los archivos siguieran
ahí. Desde entonces la rama publicada y `dev` van a la par; los merges
siguientes los decide Charlie y ya no arrastran nada del sitio.

**`main` pasó a llamarse `prod` el 2026-09-17** (ADR-007), para que los tres
repos —landing, sitio y paquete— compartan la convención «mergear a `prod`
despliega». Se hizo sin ventana de enlaces rotos: `prod` se creó idéntica a
`main` en `741e422` y se puso por defecto, el sitio cambió sus 16 raw links de
la rama vieja a la nueva con las dos vivas, y `main` se borró al confirmar.

Después del publish, por retorno: el `init` completo (entrevista, skills),
que depende del bloqueador nº2; los hooks (hueco 5); y `.ai-first/manifest.json`,
que tiene frontera pero no esquema.

### Lote de actualización de templates y skills (decidido el 2026-09-17)

**El hallazgo.** Los 8 templates se subieron el 2026-04-01 y no cambiaron
desde entonces; Compliance arrancó el 2026-04-15 y en cinco meses evolucionó
justo lo que los templates no tienen: un principio editorial en `AGENTS.md`
(árbol de destinos por tipo de contenido, techo de 200 líneas, frescura, cero
duplicación, y estructura y comandos fuera por derivables de `ls` y
`package.json`), y documentos sin molde —TECH_NOTES (150 commits),
COMPONENT_LIBRARY (163), ARQUITECTURA (31), ROLES_PERMISSIONS_MATRIX (40),
una carpeta de cambios con 20 CHG y una de specs con 26—. Los 4 protocolos
coinciden casi línea a línea con los de Compliance porque allá también se
estancaron: la práctica se mudó a las skills. Las 8 skills sí reflejan
Compliance al 2026-09-15, pero perdieron al generalizarse las referencias de
`ux-writer` (5) e `i18n` (3), los dos checks de `ux-audit`, el paso 7 de
features y el «Enforcement» de `ux-writer`. Y nada en el paquete habla de más
de una herramienta: `skills/README.md` instala con `cp -r` a la carpeta de skills de Claude.

**La decisión multi-agente.** En los proyectos que adopten el paquete, la
fuente de las skills va en «.agents/skills/», el directorio del estándar Agent
Skills que leen nativamente Codex, Cursor, OpenCode y Kimi Code, con un solo
enlace simbólico «.claude/skills» apuntando a «../.agents/skills» para Claude
Code. `AGENTS.md` es el
archivo cross-tool; `CLAUDE.md` sigue siendo `@AGENTS.md`. Lo verificó
`falcux_personal_web` al revés (fuente en la carpeta de Claude, enlaces por skill en
la de agents), probado con Claude Code y Codex. En este repo `skills/` sigue
siendo la carpeta del tarball; lo que cambia es lo que enseña a instalar.

**Tres partes, tres sesiones, un orden.** Cada parte es una sesión de Claude
(`lote-1`, `lote-2`, `lote-3`), cada una en su **worktree y rama** (`lote-1`,
`lote-2`, `lote-3`, nacidas de `dev`), porque comparten archivos. Se mergean a
`dev` **en orden**: primero la 1; la 2 rebasa sobre `dev` cuando la 1 esté
dentro; la 3, cuando la 2. Números de ADR reservados para que el append no
choque: **ADR-008** para la parte 1, **ADR-009** para la 2, **ADR-010** para la
3. Cada sesión escribe su fila con su número aunque la anterior no haya
llegado. Cada commit pasa `pnpm test` por exit code y `audit:self` en 0.

1. **Parte 1 — `lote-1`. Sin dependencias externas salvo un aviso.** Va antes
   de la `0.1.0`. `skills/README.md` con la instalación multi-agente
   («.agents/skills/» más el enlace de Claude). `templates/CLAUDE_MD_TEMPLATE.md` y
   `templates/AGENTS_MD_TEMPLATE.md` con el principio editorial de Compliance,
   sin las secciones derivables, con el índice de skills on-demand y el árbol
   multi-herramienta. Restaurar en las 8 skills lo perdido al generalizar, ya
   generalizado. Opcional: que este repo predique con el ejemplo y mueva
   `.claude/skills/criterio` a «.agents/skills/criterio» con el enlace.
   **Aviso al sitio**: el apéndice de templates repite el bloque `cp -r` de
   instalación; hay que avisar a la sesión `redirects` para que lo cambie.
   Antes de tocar `protocolo-features`, `protocolo-cambios` o
   `protocolo-cierre`, avisar también: asumen el capítulo de gobierno.
2. **Parte 2 — `lote-2`. Necesita al sitio.** Templates nuevos para lo que
   Compliance más editó: un template de TECH_NOTES, uno de inventario de
   componentes (el check 5 del detector ya lo asume), uno de ARQUITECTURA, el
   documento CHG de la carpeta de cambios y la SPEC por módulo. Fuentes: la
   carpeta docs de Compliance, y en `falcux_personal_web` el CHG-template de
   changes/pending y el README de specs. Generalizar como se hizo con
   las skills: sin nombrar el proyecto de origen. Cambian la cadena de
   artefactos del manual y las tarjetas del apéndice: coordinar con `redirects`
   antes del merge a `prod`. Sale en `0.2.0`.
3. **Parte 3 — `lote-3`. Después.** Reestructurar `GUIA_DISENO_TEMPLATE.md`
   contra la GUIA_DISENO de Compliance (3009 líneas, 71 commits: tokens,
   layout en niveles, móvil, formularios) y evaluar, una por una y con criterio,
   las skills transferibles que quedaron fuera: `unit-test-fix`, `e2e-fix`,
   `information-architecture`, `ux-patterns`, `clean-architecture`. Agregar una
   skill es cambiar «las 8» que el sitio documenta: coordinar con `redirects`.

**Lo que ninguna parte hace**: publicar a npm, avanzar `prod`, cambiar los
pesos del puntaje, mover o renombrar rutas de `skills/` o `templates/` que el
sitio enlaza. Para el `init` futuro queda anotado: escribe «.agents/skills/» y
el enlace de Claude, no la carpeta de Claude.

### Cómo trabajar acá

`AGENTS.md` tiene las reglas. Las que más duelen si se ignoran: las rutas de
`skills/` y `templates/` que el sitio enlaza no se mueven sin coordinar; `prod`
se avanza sólo cuando Charlie lo decide, y mergear ahí despliega; `pnpm test` en
verde por exit code y
`audit:self` en 0 antes de cada commit.

---

# El plan del paquete (mapeado el 2026-09-16)


## Objetivo

Convertir la metodología AI-First (hoy: 8 templates + 8 skills descargables vía
`git clone`) en un paquete instalable con `npx`, al estilo de Impeccable y
ai-blueprint.dev.

## Naming

- **Metodología:** Falcux AI-First (antes «AI-First Blueprint» — se renombra por
  colisión, ver Posicionamiento)
- **Paquete npm:** `@falcux/ai-first` → `npx @falcux/ai-first`
- **Comando:** `/ai-first`
- **Packs verticales futuros:** `@falcux/compliance-pack`, `@falcux/fintech-pack`
- Verificado libre en npm: `@falcux/*`, `falcux-ai-first`, `create-falcux`, `ai-first`

## Posicionamiento

Tres proyectos ocupan capas distintas y no compiten directamente:

- **ai-blueprint.dev** → ciclo de construcción (`/feature → /implement → /check → /complete`)
- **impeccable.style** → calidad visual del output
- **Falcux AI-First** → **gobierno del contexto**: Zonas Prohibidas, tabla ADR, matriz
  de permisos, entropía documental

Mensaje: no reemplaza a un framework de workflow, se instala encima. Los otros dos
asumen que el contexto está sano; este resuelve que se degrada.

## Estado de los skills (auditado)

Los 8 skills publicados YA están generalizados — sin referencias a AutenTIC ni al
proyecto de compliance donde nacieron. Frontmatter correcto, con disparadores concretos
y desambiguación cruzada entre skills. El contenido no es el problema.

**Único acoplamiento residual:** la secuencia de implementación de `protocolo-features`
asume arquitectura hexagonal (dominio → aplicación → infraestructura). Mitigado en la
nota de adaptación, pero conviene que `init` ofrezca 2–3 secuencias base según
arquitectura detectada (ej. Next.js + Supabase simple vs. hexagonal).

## Los 5 huecos a cerrar

1. **Instalación por `git clone` + `cp`** → reemplazar por instalador `npx` interactivo,
   con adaptadores por herramienta (Claude Code primero; Cursor y Codex después).
2. **Adaptación manual de cada skill** → el comando `init` entrevista el proyecto
   (stack, comandos de verificación, arquitectura, agentes paralelos sí/no) y reescribe
   solo las secciones «Adaptación a tu proyecto». Elimina el warning actual.
3. **Nada ejecutable** → ningún skill declara `allowed-tools` ni trae scripts. Construir
   el **detector de entropía** en código puro (git + fs + regex, sin modelo ni API key).
   Checks iniciales:
   - Zona Prohibida tocada (P0)
   - Decisión arquitectónica sin fila nueva en ADR (P1)
   - Artefacto huérfano: referenciado pero inexistente (P2)
   - Más de N archivos fuera del scope de la spec (P1)
   - Librería de componentes modificada sin actualizar su inventario (P2)

   Salida con exit codes → sirve igual para hook local y para CI.
4. ~~**Falta artefacto de estado**~~ → **`AI-FIRST.md` especificado** el 2026-09-16
   en `SPEC-PAQUETE.md` §5: Markdown con frontmatter YAML, donde el frontmatter lo
   verifica el detector y el cuerpo lo lee un humano en el diff del PR. Con él
   quedaron definidos los cuatro instrumentos, la frontera con `AGENTS.md`, las
   cinco verificaciones y la fórmula del puntaje. Falta el código.
5. **Hooks no se entregan** → la metodología enseña 3 capas (AGENTS.md / skills / hooks)
   pero el paquete solo entrega 1 y 2. Falta el hook de PostToolUse y Stop.

## Mapa de comandos v1

| Comando | Qué hace | Artefacto |
|---|---|---|
| `/ai-first init` | Escanea repo, entrevista, adapta skills, genera artefactos base | AI-FIRST.md, AGENTS.md, ADR.md |
| `/ai-first audit` | Reporte de entropía con severidades | reporte + score |
| `/ai-first sync` | Repara lo que audit encontró | artefactos actualizados |
| `/ai-first adr` | Registra decisión con contexto y consecuencias | fila en ADR.md |
| `/ai-first handoff` | Empaqueta contexto para otro agente/dev | handoff.md |

Los 8 skills actuales (`protocolo-features`, `protocolo-cambios`, `protocolo-cierre`,
`protocolo-ux`, `ux-writer`, `ux-audit`, `i18n`, `version-bump`) se mantienen como están
y se distribuyen dentro del paquete.

## Patrones a replicar (arquitectura, no contenido)

De ai-blueprint.dev:

- Instalador interactivo con checklist de herramientas; copia solo los archivos del
  adaptador seleccionado
- **Manifiesto de estado** (`.state/manifest.json`) para que el `update` distinga
  archivos propios sin modificar de los editados localmente
- Tope de tamaño del contexto durable (~20KB) para que los skills lo carguen on-demand
- El instalador verifica destinos y se detiene ante symlinks o conflictos, sin copiar
  parcialmente

De impeccable.style:

- Detector que corre en código, sin gastar tokens
- Un solo namespace de comandos = una marca

No copiar: texto, estructura de docs ni nombres de comandos ajenos.

## Lo decidido el 2026-09-16 — ver `SPEC-PAQUETE.md`

**El hallazgo que disparó la sesión:** los cuatro instrumentos que la landing vende
—Zonas Prohibidas, tabla ADR, matriz de permisos, entropía documental— **no existen
en el manual ni en las 8 skills**. Verificado con grep: aparecen sólo en
la landing del sitio. El manual enseña otro vocabulario (cadena de artefactos,
`SESSION_LOG`, `CHANGE_LOG`, `CHG-XXX`, `TECH_NOTES`) y el skill `protocolo-cierre`
enruta aprendizajes a cuatro destinos, ninguno de los cuales es ADR. Es entropía
documental del propio proyecto.

Tres decisiones, para no rediscutirlas:

1. **ADR convive; no reemplaza nada.** Fundamentado en CRM Compliance, donde nació
   la metodología: su árbol de decisión de documentación tiene siete destinos y
   ninguno responde «por qué se eligió esto en vez de aquello». El `SESSION_LOG` va
   por 27.682 líneas y 626 sesiones, y hay 385 `CHG-XXX`, así que el porqué de una
   decisión vieja está enterrado sin índice. `TECH_NOTES` guarda cicatrices, no
   decisiones, y ARQUITECTURA.md es documento de estado: al cambiar la decisión,
   la justificación anterior se sobrescribe. ADR agrega la fila que faltaba.

2. **`AI-FIRST.md` es Markdown con frontmatter YAML**, y la frontera con `AGENTS.md`
   es que **`AGENTS.md` es para los agentes y `AI-FIRST.md` es para las
   herramientas**. El manifiesto de instalación es un segundo archivo,
   `.ai-first/manifest.json`; confundirlos es lo que llena de ruido al artefacto de
   estado.

3. **Los cuatro instrumentos entraron al manual** como capítulo nuevo de la Parte
   II: `docs/parte-2/gobierno-del-contexto`, en la posición 3 de 5 —después de
   `agents-md`, porque presupone que el lector ya sabe qué es el AGENTS.md y qué
   es la cadena de artefactos—. El manual pasa de 11 a **12 capítulos** y el sitio
   de 19 a **20 páginas**.

   Las cifras del capítulo salen del proyecto real donde nació la metodología y
   **no lo nombran**, igual que se hizo al generalizar las skills. Son verificables:
   27.682 líneas de `SESSION_LOG` en 626 sesiones, 1.587 de `TECH_NOTES`, 385
   `CHG-XXX`, un `AGENTS.md` de 201 líneas contra un techo declarado de 200.

**Colisión advertida:** en Compliance, `docs/ROLES_PERMISSIONS_MATRIX.md` (461
líneas) es la matriz de permisos **del producto**, no la del repositorio. Se resolvió
por ubicación y no por renombre, para no tocar la landing publicada. Detalle en
`SPEC-PAQUETE.md` §4.

## Siguiente paso sugerido

Con `AI-FIRST.md` especificado, el camino se abre en dos y ya no hay dependencia
entre ellos:

- **El detector** (mayor diferenciación). Los checks 1 y 4 son deterministas y se
  pueden construir hoy; el 2 es heurístico por diseño y el que hay que probar
  contra un repo real antes de creerle.
- **`init`** (mayor retorno). Depende además de resolver la colisión de nombres de
  las skills, que es el bloqueador compartido nº2.

El capítulo de la Parte II es trabajo de escritura y no bloquea a ninguno de los dos,
pero sí cierra la brecha entre lo que la landing promete y lo que el sitio define.

---

# Bloqueadores compartidos

> **`blueprint-ai-first-mintlify` se dio de baja el 2026-09-16** —borrado de
> GitHub— después de que sus dos dependencias de orden quedaran resueltas el mismo
> día. Se dejan escritas porque explican por qué el orden importaba:
>
> 1. ~~**`ai-first.falcux.com` apunta hoy a Mintlify**~~ — **resuelto el
>    2026-09-16**: el dominio ya apunta al Worker. Era la dependencia de orden
>    que obligaba a enrutar antes de apagar; ya no existe, así que Mintlify se
>    puede dar de baja cuando se quiera sin tumbar el subdominio.
> 2. ~~**el workflow de sincronización del sitio vive en ese repo.**~~ — **resuelto el 2026-09-16**: las
>    8 skills y el workflow se mudaron a este repo, que pasa a ser la fuente de
>    verdad. El workflow dispara ahora a cada push de `prod` en vez de `main`.
>    Con esto `blueprint-ai-first-mintlify` ya no tiene nada que nadie necesite:
>    se puede apagar cuando se quiera.


Los cuatro puntos donde el sitio y el paquete se tocan. Ninguno es responsabilidad
exclusiva de un frente.

**1. Licencia — decidida: Apache 2.0 a nombre de Charlie Herrera.** Hecho en este
repo (`LICENSE`, y `license` declarado en `package.json`).

Se eligió licencia única y permisiva para todo —código, skills y manual juntos—
porque es lo que hacen los referentes del sector: ai-blueprint.dev usa MIT e
impeccable usa Apache 2.0, y ninguno separa el contenido del código. Entre las dos,
Apache 2.0 por su cláusula 6: deja escrito que licenciar el material no concede
derechos sobre las marcas «Falcux» ni «Blueprint AI-First», que es el activo del
modelo —el blueprint atrae, falcux.com vende—.

Replicado también en `blueprint-ai-first-templates` (commit `7c84650`, ya en su
`main` público): es de donde la gente clona las skills y no declaraba licencia,
así que quien las descargaba no tenía permiso formal para usarlas. Vive en la
raíz a propósito, donde el `rsync --delete` del workflow de sincronización del
sitio no lo alcanzaba, porque ese sincronizaba `skills/` contra `skills/`. (Ese
workflow dejó de existir el 2026-09-17, ADR-006; la razón de ubicación ya no
aplica, pero el archivo sigue bien donde está.)

`blueprint-ai-first-mintlify` **no se corrige**: se da de baja al terminar este
sitio. Su `LICENSE` seguirá diciendo `Copyright (c) 2023 Mintlify` hasta que
desaparezca, y eso es aceptable porque el repo muere. Con eso, el bloqueador
queda cerrado.

**2. Nombres de los skills.** Los 8 se instalan con nombres genéricos (`i18n`,
`version-bump`). En un proyecto que ya tenga un skill `i18n`, colisionan. Es un hallazgo
del repo de contenido y a la vez una restricción de diseño del `init` (hueco 2).
Sigue abierto: la mudanza del 2026-09-16 movió las skills de sitio, no les cambió
el nombre.

**3. Redirecciones.** Son dos conjuntos que se implementan en el mismo Worker:
   - Las 16 de Mintlify → `/docs/…` (pendiente 4 del sitio).
   - Las del dominio viejo de AutenTIC → falcux.com: verificar que existan los 301; el
     índice de Google todavía apunta allá.

**4. ~~Renombrar los repos.~~ Resuelto el 2026-09-17.** Este repo pasó de
`blueprint-ai-first-templates` a **`falcux-ai-first-package`** (ADR-005); el del
sitio ya era **`falcux-ai-first-docs-web`**, aunque su clon local y los
documentos de acá lo llamaban `falcux-ai-first`. Lo que queda es del sitio: la
línea `repository:` del workflow de sincronización de skills, las 8 tarjetas de templates con el
nombre viejo `docs-ai-first-blueprint`, 11 menciones más en esa página, una en
cada capítulo de protocolos y una en «sobre este proyecto». Todo funciona hoy
por los redirects de GitHub; se corrige en la misma edición que la ruta
`templates/`. El clon local del sitio empuja a `falcux-ai-first.git`, que
redirige: `git remote set-url origin` cuando se abra ese repo.

## Otros hallazgos abiertos del repo de contenido

- **Su `AGENTS.md` es el template de Mintlify sin personalizar**, con el banner de
  *first-time setup* todavía puesto.
- ~~**El README dice que hay que replicar `skills/` a mano al repo público**, pero el
  workflow de sincronización del sitio (commit `fcf5eca`) ya lo automatizaba con `rsync --delete`.
  Una de las dos fuentes miente.~~ **Cerrado el 2026-09-17**: no hay nada que
  replicar en ningún sentido; `skills/` vive sólo acá (ADR-006).

---

