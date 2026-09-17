# Falcux AI-First — el paquete

Repo de `@falcux/ai-first`: los 8 templates, una copia de las 8 skills y el
código del detector de entropía documental. El sitio de la metodología vive en
otro repo, `falcux-ai-first-docs-web`; este repo, `falcux-ai-first-package`,
**entrega**; aquél **documenta**.

**El paquete no está publicado.** Desde el 2026-09-17 los dos `package.json`
ya no llevan `private: true` y van en `0.1.0`: están listos para el primer
publish, que sigue siendo una decisión aparte. Lo único que impide publicar
por accidente es no correr `pnpm publish`.

## Estructura

```
src/cli.ts                 Entrada de `ai-first`. Dos comandos: init y audit.
src/init.ts                init mínimo: escanea y escribe AI-FIRST.md + ADR.md.
src/audit.ts               Orquesta las cinco verificaciones y el puntaje.
src/verificaciones/        Un archivo por check, en el orden de la spec.
src/ai-first-md.ts         El lector del contrato. Único sitio que interpreta el frontmatter.
src/puntaje.ts             40·P0 + 20·P1 + 8·P2. Calibrado contra la landing.
src/git.ts  src/glob.ts  src/markdown.ts   Lo único que se le pregunta a git, a los patrones y al Markdown.
test/                      node:test sobre repos git desechables. Sin mocks.
skills/                    COPIA GENERADA. Ver «Las skills».
templates/                 Los 8 templates. Acá es su único hogar. El sitio enlaza a los de `main`.
alias/                     El paquete `ai-first` sin scope (ADR-002): un shim que importa `@falcux/ai-first/cli`.
pnpm-workspace.yaml        Raíz + alias/. El alias depende del raíz por `workspace:*`.
SPEC-PAQUETE.md            El contrato: formato de AI-FIRST.md, los 5 checks, el puntaje.
ADR.md                     Por qué se decidió cada cosa. Se agrega, no se edita.
```

## Tech stack

TypeScript compilado con `tsc` a `dist/`, ESM, **Node 22** (`.nvmrc`) y
**pnpm 10.28.2**, fijados. Una sola dependencia de ejecución: `yaml`. Todo lo
demás es `node:`. Añadir una dependencia es decisión: pasa por el ADR.

## Comandos

```bash
pnpm install
pnpm test               # compila y corre la suite. Es la compuerta de todo commit.
pnpm run build
pnpm run audit:self     # el detector sobre este repo. Debe dar 0 / 100.
node dist/src/cli.js init  --raiz <repo>
node dist/src/cli.js audit --raiz <repo> [--base <ref>] [--estricto] [--registrar] [--json]
```

## Reglas críticas

### Las skills

- `skills/` es una **copia generada**. La fuente de verdad está en el repo del
  sitio, cuyo workflow la sobreescribe con `rsync --delete` a cada publicación.
  **Nada que se escriba dentro de `skills/` sobrevive.** Es Zona Prohibida en
  `AI-FIRST.md` por eso, no por importancia.
- Los templates de `templates/`, en cambio, sí viven acá y sólo acá. Moverlos o
  renombrarlos rompe las tarjetas de descarga del sitio cuando llegue a `main`;
  la lista está en `HANDOFF.md`.

### Ramas

- Se trabaja en **`dev`**. **`main` no se toca** hasta que el paquete merezca
  verse: el sitio publicado descarga skills desde los raw links de `main`, y el
  workflow del sitio empuja ahí. Un `main` a medias rompe enlaces vivos.
- Publicar el paquete es una decisión aparte de mergear `dev`. Ver `HANDOFF.md`.

### El alias

- `alias/` es `ai-first` sin scope. No tiene código: su bin importa
  `@falcux/ai-first/cli`, el único `export` del raíz. Las pruebas exigen que los
  dos `package.json` compartan `version` y `private` (hoy, ninguno lo lleva):
  se publican juntos, en la misma versión, o no se publica ninguno.

### El detector

- Corre en **código puro**: git, sistema de archivos y regex. Sin modelo, sin
  API key, sin red. Es el argumento de venta; no se negocia.
- Los pesos **40 / 20 / 8** están calibrados contra el único ejemplo publicado
  en la landing (1 P0 + 1 P1 + 1 P2 = 68). Cambiarlos cambia lo que la landing
  promete: es ADR y aviso al repo del sitio.
- Un check que no puede correr se reporta **omitido, nunca aprobado**.
- Cada regla del check 4 tiene su falso positivo detrás, comentado en el
  código. Una regla nueva entra con su caso real y su prueba.
- `init` **nunca sobreescribe**. No hay `--forzar` y no lo va a haber (ADR-003).

### Decisiones

- `ADR.md` se **agrega**, no se edita. Una decisión superada gana una fila nueva
  que la supera; la vieja queda.
- Las superficies de decisión están en `AI-FIRST.md`. Tocarlas sin fila en el
  ADR da P1 en `audit:self`, y el P1 tiene razón hasta que se demuestre lo
  contrario en el cuerpo del commit con `<!-- ai-first: sin-decision -->`.

### Verificación antes de confirmar

- `pnpm test` en verde **por su exit code**, no por leer la salida. Un `grep`
  encadenado ya dejó pasar un rojo una vez.
- `audit:self` en **0 / 100**. Si no, o hay algo que arreglar o hay una fila de
  ADR que escribir.

### Idioma

Todo en español: código, comentarios, pruebas, mensajes. Los commits **sin
tildes**; el resto, con ellas.

## Documentación

| Archivo | Qué contiene |
|---|---|
| `HANDOFF.md` | Estado, pendientes y los bloqueadores que comparte con el sitio. Léelo al empezar. |
| `SPEC-PAQUETE.md` | El contrato del detector. Se probó contra código el 2026-09-17; lo que dejó abierto está en `HANDOFF.md`. |
| `ADR.md` | Las decisiones tomadas y lo que se descartó. |
| `AI-FIRST.md` | Lo que gobierna a este repo. Lo lee `audit:self`. |
| `README.md` | Lo que ve quien llega. Rotula el paquete como proyectado. |

## What NOT to do

- **No escribas en `skills/`.** Se pierde en la siguiente sincronización.
- **No toques `main`.** Sirve enlaces publicados.
- **No publiques a npm.** Ni con `--dry-run` sin avisar. El primer publish
  tiene su lista en `HANDOFF.md`. El scope `@falcux` ya es de la cuenta de
  usuario `falcux` (ADR-004); no hay organización que crear.
- **No cambies los pesos del puntaje** sin ADR y sin avisar al sitio.
- **No añadas un modelo, una API ni una llamada de red** al detector.
- **No metas contenido del sitio acá.** El sitio documenta; este repo entrega.
