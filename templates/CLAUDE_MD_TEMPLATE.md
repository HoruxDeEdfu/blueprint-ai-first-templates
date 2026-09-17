# CLAUDE.md Template

> El CLAUDE.md es un puntero liviano. La fuente de verdad es AGENTS.md.
> Esta separación permite que el mismo contexto funcione en Claude Code (lee CLAUDE.md)
> y en cualquier otra herramienta (lee AGENTS.md directamente).

## Contenido del CLAUDE.md

El archivo CLAUDE.md en la raíz del proyecto debe contener SOLO:

```
@AGENTS.md
```

Eso es todo. Una línea. Claude Code carga automáticamente el contenido del AGENTS.md.

## ¿Por qué esta separación?

1. **Una sola fuente de verdad.** Si el contenido viviera en CLAUDE.md habría que duplicarlo o sincronizarlo a mano para las demás herramientas. Con AGENTS.md como fuente, todas leen el mismo archivo.

2. **Compatibilidad entre herramientas.** AGENTS.md es el archivo que leen Codex, Cursor, OpenCode, Kimi Code, Zed y otros agentes de código. CLAUDE.md es específico de Claude Code. Lo específico de una herramienta queda en su archivo; lo compartido, en el común.

3. **Migración sin costo.** Si el equipo cambia de herramienta, el AGENTS.md funciona sin cambios. Solo se elimina el CLAUDE.md.

## La misma regla para las skills

Lo que CLAUDE.md hace con el contexto, un enlace simbólico lo hace con las skills:

```
raíz/
├── CLAUDE.md                         → @AGENTS.md (puntero, solo Claude Code)
├── AGENTS.md                         → Fuente de verdad del contexto (todas)
├── .agents/
│   └── skills/                       → Fuente única de las skills (estándar Agent Skills)
│       ├── protocolo-features/SKILL.md
│       ├── protocolo-cambios/SKILL.md
│       ├── protocolo-cierre/SKILL.md
│       ├── protocolo-ux/SKILL.md
│       ├── ux-writer/SKILL.md  (+ references/)
│       └── {dominio-propio}/SKILL.md
├── .claude/
│   ├── skills → ../.agents/skills     → Enlace simbólico, solo Claude Code
│   └── settings.json                 → Config de Claude Code (permisos, hooks)
└── docs/
    ├── PRD.md
    ├── ARQUITECTURA.md
    ├── GUIA_DISENO.md
    ├── ADR.md
    └── changes/
        ├── CHANGE_LOG.md
        └── pending/
```

`.agents/skills/` es el directorio del estándar abierto *Agent Skills*, que Codex, Cursor, OpenCode y Kimi Code leen sin configurar nada. Claude Code lee `.claude/skills/`; el enlace relativo lo lleva a la misma carpeta. Cada skill existe una sola vez.

```bash
mkdir -p .agents/skills .claude
ln -s ../.agents/skills .claude/skills
```

## Lo único que sí es de cada herramienta

| Archivo | Herramienta | Qué contiene |
|---|---|---|
| `CLAUDE.md` | Claude Code | `@AGENTS.md` y nada más |
| `.claude/settings.json` | Claude Code | Permisos, hooks, servidores MCP |
| `.claude/skills` | Claude Code | Enlace a `.agents/skills/` |
| `.cursor/`, `.codex/`, … | Cada una | Su configuración propia, si la necesita |

Reglas del proyecto, convenciones, Zonas Prohibidas y protocolos **nunca** van en un archivo por herramienta. Si aparecen ahí, están duplicadas o están escondidas de las demás.
