# Paquete de inicio — Skills

Las skills de Blueprint AI-First, listas para copiar a un proyecto nuevo.

Un **protocolo** es un documento que explica un procedimiento; un **skill** es ese mismo procedimiento en un formato que la AI carga sola cuando corresponde. Este paquete contiene ambas cosas: los cuatro protocolos de la Parte III convertidos a skills, más cuatro skills que nacieron en proyectos reales y resultaron ser transferibles.

## Instalación

```bash
# Desde la raíz de tu proyecto
mkdir -p .claude/skills
cp -r skills/* .claude/skills/
```

Luego **adapta cada skill a tu proyecto**. Todos traen una sección «Adaptación a tu proyecto» al final que indica exactamente qué cambiar. Un skill copiado sin adaptar es peor que no tenerlo: ocupa presupuesto de carga y da instrucciones que no aplican.

## Contenido

### Protocolos (versión ejecutable de la Parte III)

| Skill | Qué automatiza | Se activa |
|-------|----------------|-----------|
| `protocolo-features` | Pre-implementación, secuencia por capas, checklists | Antes de un feature nuevo |
| `protocolo-cambios` | Clasificación, documento de cambio, análisis de impacto | Al modificar algo que ya funciona |
| `protocolo-cierre` | Fase A: log de sesión, docs, enrutamiento de aprendizajes | Al terminar una sesión |
| `protocolo-ux` | Comportamiento de la interfaz antes de codear | Al diseñar un feature con UI |

### Skills de oficio

| Skill | Qué automatiza | Se activa |
|-------|----------------|-----------|
| `ux-writer` | Glosario, registros por audiencia, microcopy, temperatura | Al escribir cualquier string visible |
| `ux-audit` | Auditoría de 4 capas con reporte y severidades | Antes de mergear frontend |
| `i18n` | Las 3 capas de internacionalización | Al agregar textos, plantillas o catálogos |
| `version-bump` | SemVer desde el historial de commits | Al cerrar una sesión de implementación |

## Lo que estas skills asumen del proyecto

Tres de las ocho dan por hecho que el proyecto tiene los instrumentos del
capítulo «Gobierno del contexto» (Parte II del manual). Ninguna falla sin ellos,
pero rinden menos:

| Instrumento | Quién lo usa | Si no existe |
|---|---|---|
| **Zonas Prohibidas** en el AGENTS.md | `protocolo-features`, `protocolo-cambios` | El agente descubre el límite al chocarse, con trabajo ya hecho |
| **`ADR.md`** | `protocolo-cierre`, y las otras dos al detectar una decisión | El porqué de cada decisión se entierra en el log de sesiones |

Crear un `ADR.md` vacío cuesta un minuto y es el que más se paga después: un
registro de decisiones que arranca en el mes seis nace con seis meses de huecos.

## Orden de adopción sugerido

No instales los ocho el primer día. La progresión que funciona:

0. **Declara tus Zonas Prohibidas y abre un `ADR.md` vacío.** No es un skill, son
   diez minutos, y es lo que hace que los cuatro protocolos tengan dónde escribir.
1. **`protocolo-ux`** — es el que más errores evita y no depende de nada más.
2. **`protocolo-features`** y **`protocolo-cambios`** — cuando el proyecto tenga features que mantener.
3. **`protocolo-cierre`** — cuando las sesiones empiecen a perder contexto entre una y otra.
4. **`ux-writer`** e **`i18n`** — antes de que el copy acumule deriva. Retrofitearlos es caro.
5. **`ux-audit`** y **`version-bump`** — cuando ya haya volumen que auditar y releases que versionar.

## Dependencias entre skills

```
protocolo-features ──┬──> protocolo-ux ──> ux-audit
                     └──> ux-writer ────> i18n
protocolo-cambios ───┘
protocolo-cierre ────────> version-bump
```

Las flechas indican «invoca» o «asume cargado», no un orden de instalación obligatorio: cada skill funciona por separado.

## Nota sobre portabilidad

El formato `SKILL.md` con frontmatter es de Claude Code. El contenido es agnóstico.

Para herramientas sin carga progresiva de contexto, guarda estos archivos como documentos en `docs/` e instruye a la AI desde tu AGENTS.md a consultarlos según el tipo de tarea:

```markdown
## Documentación especializada
- Antes de implementar un feature, leer `docs/protocolos/features.md`
- Antes de escribir textos visibles, leer `docs/protocolos/ux-writer.md`
```

Menos elegante que la carga automática, mismo resultado.
