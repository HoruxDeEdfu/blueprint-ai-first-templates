# AGENTS.md Template — Metodología AI-First

> Este template define la estructura recomendada para el archivo AGENTS.md (o equivalente).
> El CLAUDE.md debe contener únicamente: `@AGENTS.md`
>
> **Principio:** AGENTS.md contiene **solo reglas activas del proyecto**. Techo: **200 líneas**.
> Cada línea responde a una pregunta: *«¿Quitar esto haría que la AI —o un humano— cometa un
> error ahora mismo?»* Si la respuesta no es inmediata, no entra. Lo que no cabe va a skills
> (cargadas bajo demanda) o a documentos referenciados.

---

## Cómo usar este template

1. Copiar este archivo como `AGENTS.md` en la raíz del proyecto
2. Crear `CLAUDE.md` con solo: `@AGENTS.md`
3. Reemplazar los placeholders `{...}` con información del proyecto
4. Eliminar las secciones marcadas como `[OPCIONAL]` si no aplican
5. **No agregar** estructura de carpetas, tech stack ni lista de comandos: se derivan de `ls`
   y del manifiesto del paquete (`package.json` o equivalente). Ver §Notas al final.
6. Instalar las skills en `.agents/skills/` con el enlace para Claude Code (ver árbol)

### Árbol multi-herramienta

```
raíz/
├── AGENTS.md              → Fuente de verdad del contexto (este archivo). La leen todas.
├── CLAUDE.md              → Solo `@AGENTS.md`. Claude Code.
├── .agents/skills/        → Fuente única de las skills (estándar Agent Skills):
│                            Codex, Cursor, OpenCode y Kimi Code la leen nativamente.
├── .claude/skills         → Enlace simbólico a ../.agents/skills. Claude Code.
└── docs/                  → Lo que AGENTS.md referencia y no contiene.
```

Para herramientas que no leen AGENTS.md (Lovable, algunos IDE), copiar el contenido en su
campo de contexto del proyecto. Nada de lo que sigue vive en un archivo por herramienta.

---

# {Nombre del Proyecto}

> {Descripción en 1-2 líneas: qué es, para quién, qué problema resuelve.}
> {Nomenclatura, si hay términos de negocio que el código nombra distinto: «el módulo X se
> llama Y en la interfaz (técnico: `z`). Los identificadores no cambian.»}

**Dominio:** {URLs de producción y QA si existen} · **Stack con versiones:** `docs/ARQUITECTURA.md` §1

---

## Principio editorial de este archivo

AGENTS.md contiene **solo reglas activas del proyecto**. Antes de agregar cualquier línea,
aplicar el filtro: *«¿Quitar esto haría que la AI cometa un error ahora mismo?»*

### Árbol de decisión de documentación

| Tipo de contenido | Destino |
|---|---|
| Invariante arquitectónico o convención **vigente** del proyecto | **`AGENTS.md`** (este archivo) |
| Límite que no se cruza sin aprobación (migraciones, infra, secretos) | **§Zonas Prohibidas** de este archivo |
| Decisión difícil de revertir, con las alternativas descartadas y por qué | `docs/ADR.md` |
| Fix histórico, post-mortem, cicatriz de una librería o del stack | `docs/TECH_NOTES.md` |
| Estado de fase, progreso, lo completado y lo pendiente | `docs/SESSION_LOG.md` |
| Cambio formal con diseño y rollback | `docs/changes/pending/CHG-XXX.md` → `CHANGE_LOG.md` |
| Reglas de diseño, UX, microinteracciones | `docs/GUIA_DISENO.md` o skill `protocolo-ux` |
| Detalles de un módulo (modelo, endpoints, reglas de negocio) | `docs/specs/{modulo}.md` |
| Arquitectura, pilares, stack con versiones | `docs/ARQUITECTURA.md` |
| Procedimiento que la AI debe seguir en cierto tipo de tarea | skill en `.agents/skills/{nombre}/` |
| Estructura de carpetas, comandos estándar, dependencias | **No entra.** Derivable de `ls` y del manifiesto; si necesita prosa, `docs/ARQUITECTURA.md` §3 y aquí solo la referencia |

### Umbrales duros

- **Techo:** 200 líneas. Al rebasarlo, depurar antes de seguir agregando.
- **Frescura:** una regla que menciona una fase, un sprint o un prompt concreto («Fase 0»,
  «Prompt 1b») es sospechosa: probablemente es historia, no regla. Historia → `docs/SESSION_LOG.md`.
- **Duplicación prohibida:** si la información ya vive en `docs/ARQUITECTURA.md`, `docs/GUIA_DISENO.md`
  o una spec, aquí va la referencia, no el contenido. Dos copias divergen en la primera edición.

Esta tabla también gobierna el cierre de sesión: los aprendizajes se enrutan según ella,
**no por defecto a AGENTS.md**.

---

## Estructura y comandos

- Estructura del repo: `docs/ARQUITECTURA.md` §3. Comandos: sus §3.1 (fuente de verdad: los
  `scripts` del manifiesto raíz). No se repiten aquí.
- Los únicos comandos que sí van aquí son los **no derivables** del manifiesto:

```bash
# Ejemplo: correr un solo test, que ningún script declara
{comando de test} -- ruta/al/archivo.spec.ts
{comando de test} -- -t "nombre del test"
```

## Reglas críticas

> Solo reglas que la AI violaría sin esta instrucción. Detalle y fundamentos, en el documento
> que la tabla de arriba indique; aquí, la regla y la referencia.

### Arquitectura
- {Patrón arquitectónico principal y qué NUNCA se viola}
- {Dependencias permitidas entre capas}
- {Dónde va la lógica de negocio}

### Pilares transversales [si aplica] (detalle en `docs/ARQUITECTURA.md` §{n})
- {Multi-tenancy: cómo se obtiene el identificador del tenant y por dónde NO se pasa}
- {Permisos: niveles, decorador o guard obligatorio}
- {Auditoría: qué se registra, qué NUNCA se registra}

### UI y Diseño (detalle en `docs/GUIA_DISENO.md`)
- {Regla de tokens: NUNCA hardcodear colores}
- {Regla de tipografía o peso de fuente}
- {Librería de iconos única}
- {Regla de i18n: todo string visible pasa por la librería}

### Datos
- {Convención de naming}
- {Campos obligatorios por modelo}
- {Soft delete u otras convenciones}

### Git
- Ramas: `{patrón de ramas}`
- Commits: `{patrón de commits}` — código + docs en el mismo commit

## Zonas Prohibidas

> Rutas que no se modifican sin aprobación explícita de {quien aprueba}. La AI las comprueba
> antes de escribir código (paso 1 de `protocolo-features`); si el trabajo las toca, se detiene
> y pregunta. Tocarlas sin aprobación es el hallazgo de mayor severidad del detector.

- `{ruta/a/migraciones/}` — {por qué}
- `{ruta/a/infraestructura/}` — {por qué}
- `{archivos de secretos o configuración de producción}` — {por qué}

---

## Protocolo de trabajo (OBLIGATORIO)

- **Feature nuevo:** skill `protocolo-features` (pre-implementación en 7 pasos → secuencia por
  capas → checklists).
- **Cambio sobre algo que ya funciona:** skill `protocolo-cambios`. Documento CHG obligatorio
  solo para cambios de requerimiento, diseño o prioridad, o que toquen el esquema de datos o
  más de {n} archivos. Bugs simples, typos y refactors sin cambio de comportamiento no lo
  requieren.
- **Cierre de sesión:** skill `protocolo-cierre` (enruta los aprendizajes con el árbol del
  §Principio editorial).
- **Decisiones difíciles de revertir** (una dependencia de producción, un límite entre capas, un
  paquete compartido nuevo): fila en `docs/ADR.md` con las alternativas descartadas. El plan se
  archiva; la fila queda.
- **Las decisiones de producto son de {quien decide el producto}.** Alcance, diseño, prioridad y
  semántica de negocio los decide esa persona. El agente **recomienda** —con su razonamiento y
  una opción preferida— y **pregunta**; no cierra la decisión ni la asienta como acordada. Todo
  punto abierto se marca **DECISIÓN PENDIENTE** con opciones y consecuencias. Las decisiones
  técnicas verificables (medir algo, elegir dónde vive un helper) sí las resuelve el agente.

---

## Documentación

> Listar los documentos que la AI debe conocer, con una instrucción de carga: qué se lee
> siempre, qué bajo demanda, qué nunca completo.

- `docs/PRD.md` — Fuente funcional maestra. **No cargar completo**: usar las specs
- `docs/specs/{modulo}.md` — Specs autocontenidas. Cargar **la del módulo en curso**
- `docs/ARQUITECTURA.md` — Stack con versiones, estructura, pilares, módulos
- `docs/GUIA_DISENO.md` — Diseño y UX: tokens, layout, mobile, microinteracciones
- `docs/ADR.md` — Decisiones tomadas y alternativas descartadas. Leer antes de proponer una
- `docs/TECH_NOTES.md` — Cicatrices técnicas por stack. **Bajo demanda**, no cada turno
- `docs/SESSION_LOG.md` — Registro cronológico de sesiones. Últimas {n} entradas al iniciar
- `docs/changes/CHANGE_LOG.md` + `pending/` — Cambios formales
- `docs/COMPONENT_LIBRARY.md` — Inventario UI [si existe]. Obligatorio actualizarlo al tocar
  `{ruta/de/componentes}` en el mismo commit
- `{ruta/al/esquema}` — Esquema de datos

---

## What NOT to Do (invariantes activos)

> Solo invariantes del proyecto, cada uno con la razón en media línea. Cada línea existe porque
> la AI ya cometió el error al menos una vez. Los gotchas de stack ya resueltos van a
> `docs/TECH_NOTES.md`, no aquí.

**Arquitectura y seguridad**
- NO {anti-patrón} — {por qué, en media línea}
- NO {anti-patrón} — {por qué}

**Datos**
- NO {anti-patrón} — {por qué}

**Frontend**
- NO crear componentes o layouts nuevos cuando existe uno equivalente — buscar primero en la
  librería y en pantallas similares; extender antes que duplicar
- NO {anti-patrón} — {por qué}

**Operacional**
- NO implementar features sin cargar la spec del módulo. No cargar el PRD completo
- NO {anti-patrón} — {por qué}

> Mantener esta lista viva: entra un anti-patrón cuando se descubre; sale cuando la regla que lo
> evita ya vive en el código (un lint, un tipo, un test).

---

## Agent Teams [OPCIONAL — si la herramienta soporta agentes en paralelo]

> Regla: en tareas multicapa, activar los agentes como equipo en orden (Backend → Frontend →
> Test). Scopes y responsabilidades: tabla en la skill `protocolo-features`. `{paquete
> compartido}` es propiedad del agente Backend; el Frontend lo consume, nunca lo modifica.

---

## Skills (bajo demanda)

> Cada skill tiene su descripción canónica en `.agents/skills/{nombre}/SKILL.md`. Aquí solo el
> índice y las reglas de orquestación cuando aplican. La herramienta las carga cuando la tarea
> coincide con su descripción; no hace falta pedirlas.

**Protocolos de trabajo:** `protocolo-features`, `protocolo-cambios`, `protocolo-cierre`;
`test-fix` después de implementar o cambiar (E2E sólo si se pide); `version-bump` al final de
cada sesión, después de `protocolo-cierre`.

**Diseño y UX** (en este orden): `information-architecture` (qué es, cómo se llama, dónde vive) →
`protocolo-ux` (comportamiento) → `ux-writer` (texto: obligatoria al escribir CUALQUIER string
visible) → `i18n` (dónde vive cada string) → `ux-audit` (antes de mergear frontend).

**Del dominio:** `{dominio-1}` — {qué cubre} · `{dominio-2}` — {qué cubre}

---

## Estado actual

Para estado de fases, backlog y pendientes: **`docs/SESSION_LOG.md`** (cronológico inverso,
últimas {n} entradas al iniciar sesión). Para cambios formales: `docs/changes/CHANGE_LOG.md`.
Este archivo **no** lleva estado: envejece y nadie lo actualiza.

---

# Notas sobre el template

## Lo que salió del template, y por qué

Las versiones anteriores pedían tres secciones que ya no están:

| Sección | Por qué salió | Dónde vive ahora |
|---|---|---|
| Estructura del repo (árbol) | `ls` la da al instante y siempre al día; el árbol escrito envejece con la primera carpeta nueva | `docs/ARQUITECTURA.md` §3, solo si necesita prosa |
| Tech stack | El manifiesto del paquete la declara con versiones exactas; la copia en prosa miente en el primer bump | `docs/ARQUITECTURA.md` §1 |
| Comandos | Los `scripts` del manifiesto son la fuente de verdad; repetirlos es duplicar | Solo los **no derivables** (test único, flags raras) |

La medición que lo justifica: un AGENTS.md real de 200 líneas gastaba más de 60 en estas tres
secciones, y eran las que más veces estaban desactualizadas. Cada línea que no evita un error le
quita atención a las que sí.

## Secciones obligatorias (mínimo viable)

1. Descripción del proyecto (1-2 líneas) y nomenclatura
2. Principio editorial con su árbol de decisión
3. Reglas críticas (solo las que la AI violaría sin ellas)
4. Zonas Prohibidas
5. Protocolo de trabajo (qué skill en qué momento, quién decide)
6. Documentación (mapa con instrucción de carga)
7. What NOT to do (invariantes reales, con razón)

## Secciones recomendadas

8. Índice de skills
9. Estado actual como puntero al log de sesión

## Secciones opcionales

10. Agent teams
11. Pilares transversales (multi-tenancy, permisos, auditoría)

## Criterio para incluir vs. delegar

| Pregunta | Sí → inline | No → delegar |
|---|---|---|
| ¿La AI comete errores sin esto? | ✓ | |
| ¿Aplica a TODAS las tareas? | ✓ | |
| ¿Son menos de 5 líneas? | ✓ | |
| ¿Es un procedimiento para cierto tipo de tarea? | | → skill |
| ¿Es conocimiento de dominio extenso? | | → skill |
| ¿Son specs de un módulo? | | → `docs/specs/` |
| ¿Son reglas de diseño con tokens y valores? | | → `docs/GUIA_DISENO.md` |
| ¿Es el porqué de una decisión? | | → `ADR.md` |
| ¿Es un gotcha de stack ya resuelto? | | → `docs/TECH_NOTES.md` |
| ¿Es estado, progreso o historia? | | → `docs/SESSION_LOG.md` |

## Señales de que tu AGENTS.md es demasiado largo

- Más de 200 líneas → depurar con el árbol de decisión antes de agregar nada más
- La AI empieza a ignorar reglas del final del archivo → priorizar, mover lo menos crítico
- Hay secciones que solo aplican a ciertos módulos → convertir en skill
- Hay código de ejemplo extenso → mover a un documento referenciado
- Hay líneas que nombran una fase o un sprint → es historia; va al log de sesión
- La estructura o los comandos están escritos → borrarlos; `ls` y el manifiesto no envejecen
