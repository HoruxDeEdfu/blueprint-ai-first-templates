# AGENTS.md Template — Metodología AI-Assisted Development

> Este template define la estructura recomendada para el archivo AGENTS.md (o equivalente).
> El CLAUDE.md debe contener únicamente: `@AGENTS.md`
>
> **Principio:** Máximo ~150 líneas en este archivo. Todo conocimiento especializado
> va en skills (.claude/skills/) o documentación referenciada. Cada línea aquí debe
> responder a: "¿La AI cometería un error sin esta instrucción?"

---

## Cómo usar este template

1. Copiar este archivo como `AGENTS.md` en la raíz del proyecto
2. Crear `CLAUDE.md` con solo: `@AGENTS.md`
3. Reemplazar los placeholders `{...}` con información del proyecto
4. Eliminar las secciones marcadas como `[OPCIONAL]` si no aplican
5. Mover conocimiento extenso a skills o docs referenciados

### Convención de archivos

```
CLAUDE.md          → Solo referencia: @AGENTS.md (Claude Code)
AGENTS.md          → Fuente de verdad cross-tool (este archivo)
```

Para herramientas que no soportan AGENTS.md (Antigravity, Lovable, etc.),
copiar el contenido relevante en el campo de contexto del proyecto.

---

# {Nombre del Proyecto}

> {Descripción en 1-2 líneas: qué es, para quién, qué problema resuelve.}

**Dominio:** {URLs de producción si existen}

## Estructura del Monorepo

```
{nombre}/
├── apps/
│   ├── web/                → {Framework frontend}
│   └── api/                → {Framework backend}
├── packages/
│   ├── ui/                 → {Librería de componentes}
│   ├── shared/             → {Schemas, types, constantes}
│   └── prisma/             → {ORM schema, migraciones}
├── docs/                   → {Documentación del proyecto}
│   ├── PRD.md
│   ├── GUIA_DISENO.md
│   ├── ARQUITECTURA.md
│   └── changes/            → Protocolo de gestión de cambios
│       ├── CHANGE_LOG.md
│       └── pending/
└── CLAUDE.md               → @AGENTS.md
```

## Tech Stack

**Frontend:** {Framework, form library, validación, UI library, CSS, i18n, iconos, testing}
**Backend:** {Framework, ORM, validación, auth strategy, scheduling, docs API, testing}
**Auth:** {Proveedor → mecanismo → estrategia en backend}
**Servicios:** {Email, billing, monitoring, etc.}
**Infra:** {Hosting frontend, hosting backend, DB, Auth provider}
**Monorepo:** {Package manager, orchestrator, TS config}

## Comandos

```bash
# Desarrollo
{comando dev}                    # {descripción}
{comando build}                  # {descripción}
{comando lint}                   # {descripción}
{comando typecheck}              # {descripción}

# Testing
{comando test frontend}         # {descripción}
{comando test backend}          # {descripción}

# Base de datos
{comando migraciones}           # {descripción}
{comando seed}                  # {descripción}
{comando studio/GUI}            # {descripción}

# UI Components [si aplica]
{comando agregar componente}    # {descripción + notas}
```

## Reglas Críticas

> Solo incluir reglas que la AI violaría sin esta instrucción.
> Para reglas extensas, crear un skill en .claude/skills/

### Arquitectura
- {Regla 1 — patrón arquitectónico principal y qué NUNCA violar}
- {Regla 2 — dependencias permitidas entre capas}
- {Regla 3 — dónde va la lógica de negocio}

### Multi-tenancy [si aplica]
- {Regla de aislamiento de datos entre tenants}
- {Cómo se obtiene el tenant_id}

### UI y Diseño
- {Regla de tokens — NUNCA hardcodear colores}
- {Regla de tipografía o peso de fuente}
- {Referencia a guía de diseño}: ver `docs/GUIA_DISENO.md`
- {Referencia a protocolo UX}: ver `docs/UX_PATTERNS_PROTOCOL.md`

### i18n [si aplica]
- {Regla de no hardcodear strings}
- {Referencia a skill o convenciones}: ver `.claude/skills/i18n-patterns/`

### ORM / Base de datos
- {Convención de naming — snake_case, @map, etc.}
- {Campos obligatorios por modelo — id, timestamps, tenant_id}
- {Soft delete u otras convenciones}

### Git
- Ramas: `{patrón de ramas}`
- Commits: `{patrón de commits}`

## Protocolo de Desarrollo de Features (OBLIGATORIO)

Antes de escribir código para cualquier feature nueva:

1. **Leer** `docs/GUIA_DISENO.md` — aplicar tokens, patrones, layout
2. **Leer** `docs/UX_PATTERNS_PROTOCOL.md` — verificar navegación por capas, interacciones
3. **[Si aplica] Lanzar agente especializado** — `{nombre del agente}` para validar enfoque
4. **Verificar** {verificaciones pre-implementación: i18n, tipos, etc.}
5. **Implementar** por pasos pequeños, validando después de cada uno
6. **Después de implementar:** ejecutar `{comando de verificación}` + actualizar docs

### Gestión de cambios post-implementación
Para cambios de requerimientos en features existentes, seguir el protocolo en
`docs/CHANGE_MANAGEMENT_PROTOCOL.md`. NUNCA implementar un cambio sin documento CHG-XXX previo.

## Documentación

> Listar TODOS los documentos que la AI debe conocer, agrupados por función.

### Especificaciones del producto
- `docs/PRD.md` — {descripción breve}
- `docs/ARQUITECTURA.md` — {descripción breve}
- `docs/SPECS_POR_MODULO.md` — {descripción breve} [si existe]

### Diseño y UX
- `docs/GUIA_DISENO.md` — Guía de diseño del proyecto (tokens, componentes, gotchas)
- `docs/UX_PATTERNS_PROTOCOL.md` — Protocolo de patrones UX agnóstico

### Gestión de cambios
- `docs/changes/CHANGE_LOG.md` — Registro histórico de cambios
- `docs/changes/pending/` — Cambios en proceso

### Requerimientos externos [si aplica]
- `docs/requerimientos/{archivo}` — {descripción}

## What NOT to Do

> Anti-patrones descubiertos durante el desarrollo. Cada línea existe porque
> la AI ya cometió este error al menos una vez.

- NO {anti-patrón 1 — framework/librería}
- NO {anti-patrón 2 — arquitectura}
- NO {anti-patrón 3 — UI/diseño}
- NO {anti-patrón 4 — base de datos}
- NO {anti-patrón 5 — navegación/UX}
- NO {anti-patrón 6 — tooling/build}

> Mantener esta lista viva: agregar nuevos anti-patrones conforme se descubren.

## Agent Teams [OPCIONAL — si se usan equipos de agentes]

> Activar con la configuración correspondiente de la herramienta.
> Definir roles solo si el proyecto tiene backend + frontend + tests separables.

- **Backend Agent**: {scope, reglas, archivos que puede tocar}
- **Frontend Agent**: {scope, reglas, archivos que puede tocar}
- **Test Agent**: {scope, reglas, qué valida}

Regla: cada agente respeta su scope. Schemas compartidos viven en {paquete compartido}.

## Skills [OPCIONAL — si la herramienta soporta skills]

> Skills cargan conocimiento on-demand sin inflar este archivo.

- `.claude/skills/{nombre}/` — {descripción}
- `.claude/skills/{nombre}/` — {descripción}

## Estado Actual [OPCIONAL pero recomendado]

> Fase actual del proyecto. Ayuda a la AI a entender qué existe y qué no.

**Fase actual:** {nombre y descripción de la fase}

**Completado:** {resumen de lo que ya está implementado}

**En progreso:** {qué se está construyendo ahora}

**Pendiente:** {qué NO implementar todavía}

---

# Notas sobre el template

## Secciones obligatorias (mínimo viable)
1. Descripción del proyecto (1-2 líneas)
2. Estructura del repo (árbol)
3. Tech stack (1 línea por capa)
4. Comandos (los que se usan día a día)
5. Reglas críticas (solo las que la AI violaría sin ellas)
6. Documentación (mapa de docs)
7. What NOT to do (anti-patrones reales)

## Secciones recomendadas
8. Protocolo de desarrollo de features
9. Estado actual del proyecto

## Secciones opcionales
10. Agent teams (si se usan)
11. Skills (si la herramienta los soporta)

## Criterio para incluir vs. delegar

| Pregunta | Sí → inline | No → delegar |
|----------|-------------|--------------|
| ¿La AI comete errores sin esto? | ✓ | |
| ¿Aplica a TODAS las tareas? | ✓ | |
| ¿Son menos de 5 líneas? | ✓ | |
| ¿Es conocimiento de dominio extenso? | | → skill |
| ¿Son specs detalladas de un módulo? | | → doc referenciado |
| ¿Son reglas de diseño con tokens/valores? | | → GUIA_DISENO.md |
| ¿Son endpoints o páginas? | | → doc referenciado |
| ¿Son reglas de negocio extensas? | | → PRD o doc dedicado |

## Señales de que tu AGENTS.md es demasiado largo
- Más de 200 líneas → mover conocimiento a skills
- La AI empieza a ignorar reglas del final del archivo → priorizar, mover lo menos crítico
- Tienes secciones que solo aplican a ciertos módulos → convertir en skill
- El archivo tiene código de ejemplo extenso → mover a doc referenciado
