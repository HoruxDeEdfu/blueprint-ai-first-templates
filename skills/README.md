# Paquete de inicio — Skills

Las skills de Blueprint AI-First, listas para copiar a un proyecto nuevo.

Un **protocolo** es un documento que explica un procedimiento; una **skill** es ese mismo procedimiento en un formato que la AI carga sola cuando corresponde. Este paquete contiene ambas cosas: los cuatro protocolos de la Parte III convertidos a skills, más seis skills que nacieron en proyectos reales y resultaron ser transferibles.

## Instalación

Las skills se instalan **una sola vez, en una sola carpeta**, y todas las herramientas las leen desde ahí:

```bash
# Desde la raíz de tu proyecto
mkdir -p .agents/skills
cp -r skills/* .agents/skills/

# Un solo enlace para Claude Code
mkdir -p .claude
ln -s ../.agents/skills .claude/skills
```

Con eso el árbol queda así:

```
raíz/
├── AGENTS.md            → el contexto, para cualquier herramienta
├── CLAUDE.md            → una línea: @AGENTS.md
├── .agents/
│   └── skills/          → la fuente única de las skills
│       ├── protocolo-features/SKILL.md
│       ├── ux-writer/
│       │   ├── SKILL.md
│       │   └── references/
│       └── …
└── .claude/
    └── skills → ../.agents/skills     (enlace simbólico)
```

**Por qué esa carpeta y no la de Claude.** `.agents/skills/` es el directorio del estándar abierto *Agent Skills*, y lo leen nativamente Codex, Cursor, OpenCode y Kimi Code. Claude Code lee `.claude/skills/`; un enlace simbólico relativo lo lleva a la misma carpeta. La alternativa —fuente en la carpeta de Claude y un enlace por skill hacia la de agents— también funciona, y así se probó primero; pero obliga a crear un enlace nuevo por cada skill que se agrega, y el enlace único no. Cada archivo existe una sola vez: no hay copias que sincronizar ni versiones que diverjan.

El enlace viaja bien en git (se versiona como enlace, no como copia). Si tu equipo trabaja en Windows sin enlaces simbólicos habilitados, la carpeta de Claude puede ser una copia; en ese caso, declara en `AGENTS.md` cuál es la fuente y cuál la copia.

**Lo que sigue siendo por herramienta:** `AGENTS.md` lo leen todas, y `CLAUDE.md` es sólo `@AGENTS.md` (ver `templates/CLAUDE_MD_TEMPLATE.md`). Claude Code invoca una skill con `/nombre`; Codex con `$nombre`; las demás la cargan cuando su descripción coincide con la tarea.

Luego **adapta cada skill a tu proyecto**. Todas traen una sección «Adaptación a tu proyecto» al final que indica exactamente qué cambiar. Una skill copiada sin adaptar es peor que no tenerla: ocupa presupuesto de carga y da instrucciones que no aplican.

## Contenido

### Protocolos (versión ejecutable de la Parte III)

| Skill | Qué automatiza | Se activa |
|-------|----------------|-----------|
| `protocolo-features` | Pre-implementación en 7 pasos, secuencia por capas, checklists | Antes de un feature nuevo |
| `protocolo-cambios` | Clasificación, documento de cambio, análisis de impacto | Al modificar algo que ya funciona |
| `protocolo-cierre` | Fase A: log de sesión, docs, enrutamiento de aprendizajes | Al terminar una sesión |
| `protocolo-ux` | Comportamiento de la interfaz antes de codear | Al diseñar un feature con UI |

### Skills de oficio

| Skill | Qué automatiza | Trae además | Se activa |
|-------|----------------|-------------|-----------|
| `ux-writer` | Glosario, registros por audiencia, microcopy, temperatura | 5 referencias: glosario, voz, superficies, inglés, deuda | Al escribir cualquier string visible |
| `ux-audit` | Auditoría de 4 capas con reporte y severidades | 2 scripts de la Capa 1: análisis estático y fidelidad de skeletons | Antes de mergear frontend |
| `i18n` | Las 3 capas de internacionalización | 3 referencias, una por capa | Al agregar textos, plantillas o catálogos |
| `version-bump` | SemVer desde el historial de commits | — | Al cerrar una sesión de implementación |
| `information-architecture` | Qué es una cosa, cómo se llama en cada capa y dónde vive: naming, navegación vs. configuración, modelo de contenido, relaciones | — | Al crear, mover o renombrar un módulo, ruta, pestaña o ítem de navegación; antes de `protocolo-ux` |
| `test-fix` | Correr los tests del alcance tocado, clasificar cada falla en mecánica o de negocio, corregir lo mínimo en máximo dos rondas | — | Después de implementar o cambiar algo; E2E sólo bajo decisión explícita |

Los archivos de apoyo viven dentro de la carpeta de cada skill (`references/`, `checks/`) y se cargan sólo cuando la skill los pide: el `SKILL.md` es lo que la herramienta lee siempre; lo demás, bajo demanda.

## Lo que estas skills asumen del proyecto

Tres de las diez dan por hecho que el proyecto tiene los instrumentos del
capítulo «Gobierno del contexto» (Parte II del manual). Ninguna falla sin ellos,
pero rinden menos:

| Instrumento | Quién lo usa | Si no existe |
|---|---|---|
| **Zonas Prohibidas** en el AGENTS.md | `protocolo-features`, `protocolo-cambios` | El agente descubre el límite al chocarse, con trabajo ya hecho |
| **`ADR.md`** | `protocolo-cierre`, y las otras dos al detectar una decisión | El porqué de cada decisión se entierra en el log de sesiones |

Crear un `ADR.md` vacío cuesta un minuto y es el que más se paga después: un
registro de decisiones que arranca en el mes seis nace con seis meses de huecos.

## Orden de adopción sugerido

No instales las diez el primer día. La progresión que funciona:

0. **Declara tus Zonas Prohibidas y abre un `ADR.md` vacío.** No es una skill, son
   diez minutos, y es lo que hace que los cuatro protocolos tengan dónde escribir.
1. **`protocolo-ux`** — es la que más errores evita y no depende de nada más. **`information-architecture`** va con ella en cuanto el producto tenga más de un módulo: decide la estructura sobre la que `protocolo-ux` define el comportamiento.
2. **`protocolo-features`** y **`protocolo-cambios`** — cuando el proyecto tenga features que mantener. **`test-fix`** entra con ellas: es el paso de verificación que las dos invocan.
3. **`protocolo-cierre`** — cuando las sesiones empiecen a perder contexto entre una y otra.
4. **`ux-writer`** e **`i18n`** — antes de que el copy acumule deriva. Retrofitearlas es caro.
5. **`ux-audit`** y **`version-bump`** — cuando ya haya volumen que auditar y releases que versionar.

## Dependencias entre skills

```
information-architecture ──> protocolo-ux ──> ux-audit
                              ▲
protocolo-features ──┬────────┘
                     ├──> ux-writer ────> i18n
                     └──> test-fix
protocolo-cambios ───┘
protocolo-cierre ────────> version-bump
```

Las flechas indican «invoca» o «asume cargada», no un orden de instalación obligatorio: cada skill funciona por separado.

## Nota sobre portabilidad

El formato `SKILL.md` con frontmatter (`name`, `description`) es el del estándar *Agent Skills*; el contenido es agnóstico. Toda herramienta que lea `.agents/skills/` las carga sin cambios.

Para herramientas sin carga progresiva de contexto, guarda estos archivos como documentos en `docs/` e instruye a la AI desde tu AGENTS.md a consultarlos según el tipo de tarea:

```markdown
## Documentación especializada
- Antes de implementar un feature, leer `docs/protocolos/features.md`
- Antes de escribir textos visibles, leer `docs/protocolos/ux-writer.md`
```

Menos elegante que la carga automática, mismo resultado.
