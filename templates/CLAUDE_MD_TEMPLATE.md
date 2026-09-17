# CLAUDE.md Template

> El CLAUDE.md es un puntero liviano. La fuente de verdad es AGENTS.md.
> Esta separación permite que el mismo contexto funcione en Claude Code (lee CLAUDE.md)
> y en otras herramientas (leen AGENTS.md directamente).

## Contenido del CLAUDE.md

El archivo CLAUDE.md en la raíz del proyecto debe contener SOLO:

```
@AGENTS.md
```

Eso es todo. Una línea. Claude Code cargará automáticamente el contenido del AGENTS.md.

## ¿Por qué esta separación?

1. **Cross-tool compatibility:** AGENTS.md es el estándar emergente para Cursor, Zed, OpenCode, Antigravity y otros AI coding agents. CLAUDE.md es específico de Claude Code.

2. **Una sola fuente de verdad:** Si el contenido viviera en CLAUDE.md, habría que duplicarlo o sincronizarlo manualmente para otras herramientas. Con AGENTS.md como fuente, todos apuntan al mismo archivo.

3. **Migración simple:** Si el equipo decide cambiar de herramienta, el AGENTS.md funciona sin cambios. Solo se elimina el CLAUDE.md.

## Archivos complementarios en el ecosistema

```
raíz/
├── CLAUDE.md                         → @AGENTS.md (puntero)
├── AGENTS.md                         → Fuente de verdad del contexto
├── .claude/
│   ├── skills/                       → Conocimiento on-demand [Claude Code]
│   │   ├── ux-patterns/SKILL.md
│   │   ├── change-management/SKILL.md
│   │   ├── i18n-patterns/SKILL.md
│   │   └── domain-{nombre}/SKILL.md
│   └── settings.json                 → Config de Claude Code
└── docs/
    ├── PRD.md
    ├── GUIA_DISENO.md
    ├── UX_PATTERNS_PROTOCOL.md
    ├── CHANGE_MANAGEMENT_PROTOCOL.md
    └── changes/
        ├── CHANGE_LOG.md
        └── pending/
```
