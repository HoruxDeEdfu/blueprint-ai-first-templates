# Falcux AI-First — paquete

El material de la metodología [Blueprint AI-First](https://ai-first.falcux.com),
listo para llevar a un proyecto: 8 templates de documentos, 10 skills ejecutables
y el detector de entropía documental.

> **Estado: publicado desde el 2026-09-17.** `npx @falcux/ai-first` está en npm;
> la última es la `0.1.3`, del 2026-09-18. El alias sin scope `ai-first` se descartó (ADR-011): npm lo
> bloqueó por similitud con el paquete `ee-first`.

## Qué hay

| | Dónde | Estado |
|---|---|---|
| 8 templates de documentos (AGENTS.md, PRD, guía de diseño, arquitectura, documentos vivos) | `templates/` | 4 publicados; los 4 de la 0.2.0 en `dev` |
| 10 skills para agentes de código (Claude Code, Codex, Cursor, OpenCode, Kimi Code) | `skills/` | 8 publicadas; las 2 de la 0.2.0 en `dev` — [cómo instalarlas](skills/README.md) |
| Detector de entropía (`ai-first audit`) | `src/` | publicado en `0.1.0` |
| `ai-first init`: escribe `AI-FIRST.md` y el ADR, instala las skills, crea `docs/` y mantiene su bloque en `AGENTS.md` | `src/init.ts` | el mínimo, publicado en `0.1.0`; el completo, en `dev` para la `0.2.0` |
| La entrevista de `init` (adaptar cada skill), `sync`, `adr`, `handoff` | — | mapeados en la especificación, sin escribir |

Las skills viven acá y sólo acá desde el 2026-09-17; el sitio enlaza a las
de `prod`. Antes eran una copia que el repo del sitio sobreescribía. Eran 8;
`information-architecture` y `test-fix` entraron ese mismo día (ADR-010).

## El detector

Mide la distancia entre lo que el proyecto documenta y lo que el proyecto es,
con cinco verificaciones que corren en **código puro** —git, sistema de archivos
y expresiones regulares—. Sin modelo, sin API key, sin red. Determinista, y sale
con código de salida para servir igual en un hook local y en CI.

```bash
pnpm install
pnpm run build
node dist/src/cli.js init  --raiz /ruta/a/tu/proyecto   # configura el repo entero
node dist/src/cli.js audit --raiz /ruta/a/tu/proyecto
```

`init` configura el repo para la metodología en un comando: deja un
`AI-FIRST.md` con Zonas Prohibidas sugeridas, superficies de decisión y los
documentos que ya existen; un `docs/ADR.md` vacío; el registro de sesión y la
carpeta de cambios que los protocolos asumen; las cinco skills sin interfaz en
`.agents/skills/` con el enlace para Claude Code (`--skills todas` para las
diez, `--enlazar` para enlaces en vez de copias); y un bloque delimitado en
`AGENTS.md` que dice dónde escribe cada skill. Nunca sobreescribe: lo que ya
existe lo reporta como saltado y sigue, y fuera de sus marcas en `AGENTS.md` no
toca nada. Los templates siguen siendo manuales: están en `templates/`. El
formato de `AI-FIRST.md` y el de las cinco verificaciones están en
[`docs/SPEC-PAQUETE.md`](docs/SPEC-PAQUETE.md).

| Severidad | Verificación | Cómo lee |
|---|---|---|
| P0 | Zona Prohibida tocada | `git diff` contra `zonas_prohibidas` |
| P1 | Decisión sin fila en ADR | `superficies_de_decision` o cambio en `dependencies`; se silencia con `<!-- ai-first: sin-decision -->` en el commit |
| P1 | Alcance excedido | archivos tocados contra los que lista la spec activa |
| P2 | Artefacto huérfano | cada ruta mencionada en un artefacto declarado debe existir |
| P2 | Inventario de componentes desactualizado | nombres en `componentes_dir` contra menciones en el inventario |

**Puntaje:** `entropía = min(100, 40·P0 + 20·P1 + 8·P2)`. Mide entropía, no
salud: más alto es peor.

**Códigos de salida:** `0` sin hallazgos; `1` con cualquier P0; `1` también con
P1 o P2 bajo `--estricto`. `2` es error de uso.

```bash
ai-first audit                      # hook local: árbol de trabajo contra HEAD
ai-first audit --base origin/main   # CI: el rango que la rama trae
ai-first audit --estricto           # corta también por P1 y P2
ai-first audit --registrar          # escribe el resultado en AI-FIRST.md
ai-first audit --json
```

## Desarrollo

Node 22 y pnpm 10, fijados. `pnpm test` compila y corre la suite sobre repos
git desechables. No hay más dependencias de ejecución que `yaml`.

## Licencia

Apache 2.0. Licenciar el material no concede derechos sobre las marcas «Falcux»
ni «Blueprint AI-First».
