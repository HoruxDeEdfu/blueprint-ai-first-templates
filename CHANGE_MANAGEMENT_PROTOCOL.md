---
name: change-management
description: "Protocolo para gestionar cambios de requerimientos en proyectos implementados con AI coding agents. Activar cuando un requerimiento cambia post-implementación, cuando se descubre que un patrón no funciona, cuando la AI implementó algo incorrecto, o cuando cambian prioridades. Aplica independientemente de la herramienta AI utilizada."
---

# Protocolo de gestión de cambios

> Este documento define el proceso para gestionar cambios de requerimientos en proyectos construidos con AI coding agents. El objetivo es que los cambios se implementen sin romper lo existente, con documentación trazable y contexto claro para la AI.

## Principio fundamental

**Un cambio sin evaluación de impacto es una apuesta.** Antes de pedirle a la AI que modifique algo, el equipo humano debe entender qué se toca, qué se puede romper, y qué documentación debe actualizarse. La AI ejecuta; el humano decide.

---

## 1. Tipos de cambio

Cada tipo tiene un flujo diferente. Identificar el tipo ANTES de actuar.

### 1.1 Clasificación

| Tipo | Origen | Ejemplo | Riesgo |
|------|--------|---------|--------|
| **Corrección** | La AI implementó algo incorrecto | Tabla con texto clickeable en vez de ícono | Bajo — scope limitado |
| **Ajuste de diseño** | Descubrimiento en práctica | Un patrón no funciona en mobile | Bajo-medio — puede tocar varios componentes |
| **Cambio de requerimiento** | Cliente/PO pide algo diferente | "Ya no queremos wizard, queremos formulario directo" | Medio-alto — puede afectar arquitectura |
| **Cambio de prioridad** | Re-priorización del backlog | Feature X se pospone, Feature Y se adelanta | Variable — depende de dependencias |

### 1.2 Regla de decisión rápida

- **Si el cambio toca 1-2 archivos y no modifica el schema de BD** → flujo corto (sección 3)
- **Si el cambio toca 3+ archivos, modifica schema, o cambia flujos de navegación** → flujo completo (sección 4)

---

## 2. Estructura de documentación de cambios

### 2.1 Carpeta de cambios

```
docs/
├── changes/                    ← carpeta de cambios
│   ├── CHANGE_LOG.md           ← registro histórico (permanente)
│   └── pending/                ← cambios en proceso (temporal)
│       └── CHG-001_nombre.md   ← documento de cambio individual
├── PRD.md                      ← se actualiza al cerrar el cambio
├── ARCHITECTURE.md             ← se actualiza si aplica
└── ...
```

### 2.2 Anatomía de un documento de cambio (CHG-XXX_nombre.md)

```markdown
# CHG-001: [Nombre descriptivo del cambio]

## Metadata
- **Fecha:** YYYY-MM-DD
- **Solicitado por:** [Cliente / PO / Dev / Descubrimiento propio]
- **Tipo:** [Corrección / Ajuste de diseño / Cambio de requerimiento / Cambio de prioridad]
- **Estado:** [Pendiente / En análisis / En implementación / Completado / Descartado]

## Qué cambia
[Descripción clara de qué se quiere diferente. Incluir capturas o referencias si aplica.]

## Por qué cambia
[Contexto de negocio o técnico que justifica el cambio.]

## Estado actual
[Cómo funciona HOY lo que se va a cambiar. Ser específico: rutas, componentes, archivos.]

## Estado deseado
[Cómo debe funcionar DESPUÉS del cambio. Ser específico.]

## Análisis de impacto
[Se llena durante el análisis — ver sección 4.2]

### Archivos afectados
- [ ] `ruta/archivo1.tsx` — [qué cambia en este archivo]
- [ ] `ruta/archivo2.tsx` — [qué cambia en este archivo]

### Dependencias
- [ ] ¿Requiere migración de BD? [Sí/No — detalle]
- [ ] ¿Afecta otros features? [Sí/No — cuáles]
- [ ] ¿Requiere actualizar tests? [Sí/No — cuáles]
- [ ] ¿Afecta la API/endpoints? [Sí/No — cuáles]

### Documentación a actualizar
- [ ] PRD.md — [qué sección]
- [ ] GUIA_DISENO.md — [qué sección]
- [ ] CLAUDE.md / AGENTS.md — [si aplica]
- [ ] Schema de BD — [si aplica]

## Plan de implementación
[Se llena durante la planificación — ver sección 4.3]

1. Paso 1: ...
2. Paso 2: ...
3. Paso N: ...

## Verificación post-cambio
- [ ] Feature modificado funciona según estado deseado
- [ ] Features adyacentes no se rompieron
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Documento de cambio movido a CHANGE_LOG.md
```

### 2.3 CHANGE_LOG.md (registro permanente)

Este archivo es el registro histórico de todos los cambios. NUNCA se borra. Cuando un cambio se completa, su resumen se mueve aquí y el archivo individual en `pending/` se elimina.

```markdown
# Change Log

## CHG-001: Cambiar navegación de wizard a formulario directo
- **Fecha:** 2025-03-15
- **Tipo:** Cambio de requerimiento
- **Archivos:** 8 archivos modificados, 2 eliminados
- **Migración BD:** No
- **Resumen:** El flujo de creación pasó de wizard 3 pasos a formulario directo...
- **Lecciones:** Documentar siempre el estado anterior antes de modificar...

## CHG-002: ...
```

---

## 3. Flujo corto (cambios de bajo riesgo)

Para correcciones y ajustes menores que tocan 1-2 archivos y no modifican schema.

```
Detectar problema → Documentar en 1 párrafo → Implementar → Verificar → Actualizar docs
```

### 3.1 Pasos

1. **Documentar:** Crear un CHG-XXX mínimo (solo metadata + qué cambia + estado actual + estado deseado).
2. **Implementar en sesión limpia:** Abrir nueva sesión. Dar contexto: "El archivo X actualmente hace Y. Necesito que haga Z. No modifiques ningún otro archivo."
3. **Verificar:** Probar que funciona Y que no rompió nada adyacente.
4. **Cerrar:** Pedirle a la AI que actualice la documentación relevante. Mover resumen a CHANGE_LOG.md. Eliminar el archivo en `pending/`.

### 3.2 Prompt template para la AI (flujo corto)

```
CONTEXTO: Estoy haciendo un ajuste menor al feature [nombre].

ESTADO ACTUAL: [Describir cómo funciona hoy, incluir ruta del archivo]

CAMBIO REQUERIDO: [Describir qué debe cambiar]

RESTRICCIONES:
- Solo modificar [archivo(s) específico(s)]
- No tocar [archivos que NO deben cambiar]
- Mantener [patrones, convenciones, estilos existentes]

Implementa el cambio paso a paso. Después de cada paso, muéstrame qué modificaste para que yo valide antes de continuar.
```

---

## 4. Flujo completo (cambios de medio-alto riesgo)

Para cambios de requerimiento, cambios que tocan 3+ archivos, o cualquier cosa que modifique schema de BD o flujos de navegación.

```
Documentar → Analizar impacto → Planificar → Implementar por pasos → Verificar → Actualizar docs → Cerrar
```

### 4.1 Paso 1: Documentar el cambio

El PO o quien detecta el cambio crea el documento CHG-XXX en `docs/changes/pending/` con las secciones: metadata, qué cambia, por qué cambia, estado actual, estado deseado.

**Regla:** No avanzar a implementación sin documento de cambio. Si el cambio es verbal, documentarlo primero.

### 4.2 Paso 2: Analizar impacto (con ayuda de la AI)

Abrir una sesión DEDICADA al análisis, NO a la implementación.

**Prompt template para análisis de impacto:**

```
Necesito que analices el impacto de un cambio ANTES de implementar nada. NO modifiques ningún archivo.

Lee el documento de cambio en docs/changes/pending/CHG-XXX_nombre.md

Luego analiza:
1. ¿Qué archivos se ven afectados directamente por este cambio?
2. ¿Qué archivos se ven afectados indirectamente (importan o dependen de los directos)?
3. ¿Se requiere migración de base de datos?
4. ¿Hay tests que van a fallar?
5. ¿Este cambio contradice algo definido en CLAUDE.md, GUIA_DISENO.md, o el PRD?

Dame el análisis en formato lista. NO implementes nada todavía.
```

Con el análisis, llenar la sección "Análisis de impacto" del documento de cambio.

### 4.3 Paso 3: Planificar la implementación

Con el impacto claro, definir el plan de implementación ANTES de ejecutar.

**Regla de secuencia:** Implementar en este orden estricto:
1. Schema de BD (si aplica) → migración primero
2. Backend (API, servicios, tipos) → la base
3. Frontend (componentes, páginas) → lo visible
4. Tests → validar todo
5. Documentación → cerrar el loop

**Regla de granularidad:** Cada paso del plan debe ser lo suficientemente pequeño para validarlo individualmente. Si un paso toca más de 3 archivos, subdividirlo.

### 4.4 Paso 4: Implementar por pasos

Abrir una NUEVA sesión limpia para la implementación. No reutilizar la sesión de análisis.

**Prompt template para implementación por pasos:**

```
Vamos a implementar el cambio CHG-XXX documentado en docs/changes/pending/CHG-XXX_nombre.md

Lee el documento completo, incluyendo el análisis de impacto y el plan de implementación.

Implementa SOLO el paso [N] del plan: [descripción del paso].

RESTRICCIONES:
- Solo modificar los archivos listados para este paso
- Seguir los patrones definidos en [CLAUDE.md / GUIA_DISENO.md / UX_PATTERNS_PROTOCOL.md]
- Después de implementar, muéstrame exactamente qué cambió para validar

NO avances al siguiente paso hasta que yo confirme.
```

**Entre pasos:**
- Verificar que lo implementado funciona.
- Verificar que lo anterior no se rompió.
- Confirmar para continuar o corregir antes de avanzar.

### 4.5 Paso 5: Verificar el cambio completo

Después de todos los pasos de implementación:

```
El cambio CHG-XXX está implementado. Necesito que verifiques:

1. Lee el "estado deseado" del documento de cambio. ¿La implementación actual lo cumple?
2. Revisa los archivos listados en "dependencias". ¿Alguno tiene errores o inconsistencias?
3. Ejecuta los tests relevantes.
4. ¿Hay algo que debería funcionar diferente a lo implementado?

Dame un reporte de verificación.
```

### 4.6 Paso 6: Actualizar documentación y cerrar

**Prompt para cierre:**

```
El cambio CHG-XXX fue implementado y verificado. Necesito que:

1. Actualices la documentación principal del proyecto con los cambios realizados:
   - PRD.md: [secciones específicas a actualizar]
   - GUIA_DISENO.md: [si aplica]
   - CLAUDE.md / AGENTS.md: [si aplica]
   - Schema documentation: [si aplica]

2. Agregues un resumen del cambio al CHANGE_LOG.md con formato:
   ## CHG-XXX: [nombre]
   - Fecha, tipo, archivos afectados, si hubo migración, resumen, lecciones aprendidas

3. Confirma cuando hayas terminado para que yo elimine el archivo pending.
```

**Después de que la AI actualiza:**
- Revisar que las actualizaciones son correctas.
- Eliminar `docs/changes/pending/CHG-XXX_nombre.md`.
- El registro en CHANGE_LOG.md queda como evidencia permanente.

---

## 5. Regla del lifecycle de documentos de cambio

Este es el flujo de vida de cada documento de cambio:

```
CREACIÓN                  → docs/changes/pending/CHG-XXX.md (estado: Pendiente)
ANÁLISIS completado       → mismo archivo (estado: En análisis → En implementación)
IMPLEMENTACIÓN completada → mismo archivo (estado: Completado)
DOCS actualizadas         → resumen migrado a CHANGE_LOG.md
CIERRE                    → archivo pending/ ELIMINADO

Resultado final:
- CHANGE_LOG.md tiene el resumen (permanente, trazable)
- docs/changes/pending/ queda limpio (sin archivos huérfanos)
- Documentación principal está al día
```

**Regla de limpieza:** Un archivo en `pending/` que lleve más de 2 semanas sin actividad debe ser revisado. Si el cambio ya no aplica, moverlo a CHANGE_LOG.md con estado "Descartado" y eliminarlo de pending.

---

## 6. Patrones anti-regresión

Estos patrones previenen que la AI rompa cosas al implementar cambios.

### 6.1 Dar contexto explícito de lo que NO debe cambiar

Siempre incluir en el prompt una sección de restricciones:

```
RESTRICCIONES — NO MODIFICAR:
- Archivos en [rutas]
- Patrones de [navegación / interacción / diseño] existentes
- Schema de BD (a menos que el plan lo indique explícitamente)
- Configuración de [auth / routing / middleware]
```

### 6.2 Validar después de cada paso

No implementar más de un paso sin validar. La secuencia es:

```
Implementar paso → Revisar diff → Probar manualmente → Ejecutar tests → Aprobar → Siguiente paso
```

### 6.3 Sesiones limpias para cambios

NUNCA implementar un cambio en una sesión donde ya se estaba trabajando en otra cosa. Siempre:

1. Cerrar o limpiar la sesión actual.
2. Abrir sesión nueva.
3. Dar contexto del cambio (documento CHG-XXX).
4. Implementar.

### 6.4 Branch por cambio (si usan Git)

Cada cambio de tipo "Cambio de requerimiento" o "Cambio de prioridad" debería tener su propia branch:

```
git checkout -b change/CHG-XXX-nombre-descriptivo
```

Esto permite revertir el cambio completo si algo sale mal, sin afectar main.

---

## 7. Cuándo NO usar este protocolo

- **Bug fixes simples** (un botón no funciona, un texto está mal): corregir directamente, no hace falta documento de cambio.
- **Refactors internos que no cambian comportamiento**: usar proceso de refactor estándar, no este protocolo.
- **Nuevos features que no modifican nada existente**: usar el flujo normal de implementación (PRD → Arquitectura → Schema → Implementar).

Este protocolo es SOLO para cuando algo que ya existe necesita cambiar.

---

## 8. Checklist rápido de gestión de cambios

Antes de implementar cualquier cambio, verificar:

- [ ] ¿Tengo un documento CHG-XXX creado con estado actual y estado deseado?
- [ ] ¿Sé cuántos archivos se afectan? (determina flujo corto vs completo)
- [ ] ¿Tengo análisis de impacto? (para flujo completo)
- [ ] ¿Tengo un plan de pasos secuenciales?
- [ ] ¿Voy a usar una sesión limpia?
- [ ] ¿Definí explícitamente qué NO debe cambiar?

Después de implementar:

- [ ] ¿El feature modificado funciona según el estado deseado?
- [ ] ¿Los features adyacentes siguen funcionando?
- [ ] ¿Los tests pasan?
- [ ] ¿La documentación principal está actualizada?
- [ ] ¿El resumen está en CHANGE_LOG.md?
- [ ] ¿Eliminé el archivo de pending/?

---

## 9. Cómo usar este protocolo

### Como skill de Claude Code (.claude/skills/change-management/SKILL.md)
Copiar a `.claude/skills/change-management/SKILL.md`. Claude lo cargará cuando detecte que se está gestionando un cambio.

### Como referencia en CLAUDE.md
Agregar al CLAUDE.md del proyecto:
```
## Gestión de cambios
Para cualquier cambio de requerimiento post-implementación, seguir el protocolo en docs/CHANGE_MANAGEMENT.md. NUNCA implementar un cambio sin documento CHG-XXX previo.
```

### Para herramientas agnósticas
Los principios (documentar antes de cambiar, analizar impacto, implementar por pasos, verificar, actualizar docs) aplican sin importar la herramienta. Los prompt templates se adaptan al formato de la herramienta.
