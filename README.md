# Falcux AI-First — paquete

El material de la metodología [Blueprint AI-First](https://ai-first.falcux.com),
listo para llevar a un proyecto: 8 templates de documentos, 8 skills ejecutables
y el detector de entropía documental.

> **Estado: proyectado, no publicado.** `npx @falcux/ai-first` todavía no existe
> en npm. Lo que hay acá se puede clonar y correr; lo que no hay es un paquete
> instalable. El sitio lo rotula igual.

## Qué hay

| | Dónde | Estado |
|---|---|---|
| 8 templates de documentos (AGENTS.md, PRD, guía de diseño, protocolos) | `templates/` | publicados |
| 8 skills para Claude Code | `skills/` | publicadas — [cómo instalarlas](skills/README.md) |
| Detector de entropía (`ai-first audit`) | `src/` | escrito, sin publicar |
| `ai-first init` mínimo: escanea y escribe `AI-FIRST.md` + `ADR.md` | `src/init.ts` | escrito, sin publicar |
| `init` completo (entrevista, skills), `sync`, `adr`, `handoff` | — | mapeados en la especificación, sin escribir |

Las skills se sincronizan **desde** el repo del sitio a cada publicación: acá
son una copia generada. Editarlas acá se pierde en la siguiente sincronización.

## El detector

Mide la distancia entre lo que el proyecto documenta y lo que el proyecto es,
con cinco verificaciones que corren en **código puro** —git, sistema de archivos
y expresiones regulares—. Sin modelo, sin API key, sin red. Determinista, y sale
con código de salida para servir igual en un hook local y en CI.

```bash
pnpm install
pnpm run build
node dist/src/cli.js init  --raiz /ruta/a/tu/proyecto   # escribe AI-FIRST.md y ADR.md
node dist/src/cli.js audit --raiz /ruta/a/tu/proyecto
```

`init` escanea el repo y deja un `AI-FIRST.md` con Zonas Prohibidas sugeridas,
superficies de decisión y los documentos que ya existen, más un `ADR.md`
vacío. No toca nada más y nunca sobreescribe. Su formato y el de las cinco
verificaciones están en [`SPEC-PAQUETE.md`](SPEC-PAQUETE.md).

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
