---
name: feature-development
description: "Protocolo de desarrollo de features con AI coding agents. Activar ANTES de implementar cualquier feature nuevo, página, o módulo. Cubre desde la definición del feature hasta la verificación post-implementación. Funciona con cualquier herramienta AI. Complementa los protocolos de UX, gestión de cambios, y cierre de sesión."
---

# Protocolo de desarrollo de features

> Este documento define el proceso para implementar features nuevos con AI coding
> agents. No reemplaza la creatividad ni la velocidad — la estructura existe para
> que la AI produzca mejor resultado desde el primer intento.

## Principio fundamental

**La AI implementa mejor cuando sabe QUÉ construir, CÓMO debe verse, y QUÉ NO hacer.**
Invertir 15 minutos en contexto ahorra 2 horas de correcciones. La documentación
previa no es overhead — es el prompt más importante que vas a escribir.

---

## 1. Entradas: cómo llega un feature

Un feature puede llegar de múltiples fuentes. El protocolo funciona con todas.

| Fuente | Ejemplo | Qué hacer primero |
|--------|---------|-------------------|
| Documento de requerimientos | Archivo .docx/.xlsx del cliente | Convertir a spec implementable (paso 2) |
| PRD existente | docs/PRD.md con el feature descrito | Verificar que la spec es suficiente (paso 2) |
| Definición del PO | Google Doc, ticket, conversación | Documentar como spec mínima (paso 2) |
| Idea propia / mejora | "Esto debería funcionar diferente" | Documentar como spec mínima (paso 2) |
| Feature generado por AI | PRD generado por LLM desde requerimientos | Validar con humano antes de implementar (paso 2) |

**Regla:** Sin importar de dónde venga, todo feature pasa por el mismo protocolo
antes de llegar a código. La fuente varía; el proceso no.

---

## 2. Pre-implementación: los 6 pasos antes de código

### Paso 1 — Asegurar que existe una spec implementable

Verificar que tienes documentación suficiente para que la AI entienda qué construir.

**Spec mínima viable (lo que necesitas como mínimo):**

```markdown
## Feature: [Nombre]

### Qué hace
[1-3 párrafos describiendo el comportamiento desde la perspectiva del usuario]

### Criterios de aceptación
- [ ] [El usuario puede hacer X]
- [ ] [El sistema responde con Y]
- [ ] [En caso de error, ocurre Z]

### Alcance
- Incluye: [qué sí]
- NO incluye: [qué no — esto es crítico para la AI]

### Dependencias
- [Módulos, endpoints, o componentes que ya existen y que este feature usa]
- [Módulos que este feature NO debe modificar]
```

**Si la spec no existe:** Usar la AI para generarla a partir de la fuente
original (requerimiento del cliente, PRD, etc.), pero SIEMPRE validar con
el PO o decisor antes de implementar. La AI es buena generando specs,
pero puede inventar requerimientos que nadie pidió.

**Si la spec fue generada por AI:** Leerla completa. Verificar que no agregó
features que no se pidieron. Confirmar con el PO si hay dudas.

### Paso 2 — Leer la documentación de diseño

Antes de que la AI escriba una línea de código:

- [ ] Leer `docs/GUIA_DISENO.md` — tokens, componentes, patrones de layout, dark mode
- [ ] Leer `docs/UX_PATTERNS_PROTOCOL.md` — navegación por capas, interacciones estándar

**Preguntas clave de diseño:**
- ¿En qué capa de navegación vive este feature? (Browse, Create, Detail)
- ¿Usa componentes existentes o necesita nuevos?
- ¿Cómo se ve el estado vacío, loading, error?
- ¿Tiene vista mobile?

Si las respuestas no están claras, definirlas ANTES de implementar.

### Paso 3 — Validar enfoque UX (recomendado)

Antes de construir, validar que el enfoque de UX es correcto. Dos opciones:

**Opción A — Agente especializado (si la herramienta lo soporta):**
Lanzar un agente `ux-ui-critic` o equivalente con el prompt:

```
Revisa la spec del feature [nombre] y la guía de diseño del proyecto.
Evalúa:
1. ¿El flujo de usuario es coherente con los patrones de navegación existentes?
2. ¿Los componentes propuestos son consistentes con lo que ya existe?
3. ¿Hay edge cases de UX no contemplados? (empty state, error, mobile)
4. ¿La interacción propuesta sigue el protocolo UX del proyecto?

NO implementes nada. Solo dame tu evaluación y recomendaciones.
```

**Opción B — Revisión mental (siempre disponible):**
Revisar la spec contra el checklist del UX_PATTERNS_PROTOCOL.md (sección 5).
Si algún punto no se cumple, ajustar la spec antes de implementar.

**Cuándo es obligatorio vs. recomendado:**
- Feature con UI nueva (página, modal, formulario) → obligatorio
- Feature solo backend (endpoint, use case, migración) → omitir
- Fix de UI existente → obligatorio si cambia interacción, omitir si es cosmético

### Paso 4 — Verificar dependencias técnicas

Antes de implementar, confirmar:

- [ ] ¿Se requiere migración de BD? → planificarla primero
- [ ] ¿Se necesitan schemas de validación nuevos? → crearlos en packages/shared
- [ ] ¿Hay endpoints que este feature necesita y no existen? → implementar backend primero
- [ ] ¿Hay claves de i18n que crear? → prepararlas en archivos de mensajes
- [ ] ¿Este feature afecta features existentes? → si sí, usar protocolo de cambios

### Paso 5 — Preparar el contexto para la AI

Construir el prompt de implementación con contexto completo:

```
FEATURE: [Nombre del feature]

SPEC: [Referencia a la spec o resumen breve]

DOCUMENTACIÓN A CONSULTAR:
- docs/GUIA_DISENO.md — para tokens, componentes, patrones visuales
- docs/UX_PATTERNS_PROTOCOL.md — para interacciones y navegación
- [Otros docs relevantes]

ARQUITECTURA:
- [Dónde vive este feature en la estructura del proyecto]
- [Qué módulos/componentes existentes debe usar]
- [Patrón de arquitectura a seguir — ej: Clean Architecture 3 capas]

RESTRICCIONES:
- NO modificar [archivos/módulos que no deben cambiar]
- NO implementar [funcionalidad fuera de alcance]
- Seguir los patrones de [navegación/interacción/diseño] existentes

IMPLEMENTA paso a paso. Después de cada paso, muéstrame qué hiciste
para que yo valide antes de continuar.
```

### Paso 6 — Definir la secuencia de implementación

El orden importa. Implementar en esta secuencia:

```
1. Schema/Migración BD (si aplica)
    ↓
2. Domain (entities, ports, value objects)
    ↓
3. Application (use cases, DTOs)
    ↓
4. Infrastructure — Backend (repositories, controllers, servicios externos)
    ↓
5. Shared (schemas Zod, tipos, constantes)
    ↓
6. Infrastructure — Frontend (páginas, componentes, formularios)
    ↓
7. Tests (unit + E2E backend, componentes frontend)
    ↓
8. Verificación final (typecheck, lint, tests completos)
```

**No todos los features necesitan todos los pasos.** Un feature solo-frontend
empieza en el paso 6. Un feature solo-backend termina en el paso 4.
Pero el ORDEN dentro de los pasos aplicables es estricto.

---

## 3. Implementación: durante la sesión

### 3.1 Una sesión = un feature

Cada feature se implementa en una sesión limpia dedicada. Esto significa:
- Contexto fresco (no arrastrar contexto de otro feature)
- La spec del feature es el primer input
- El SESSION_LOG.md de la sesión anterior se leyó para tener contexto

### 3.2 Con equipos de agentes (si la herramienta lo soporta)

Para features que tocan backend + frontend + tests, los agentes especializados
paralelizar el trabajo:

| Agente | Scope | Pasos que ejecuta |
|--------|-------|-------------------|
| Backend Agent | apps/api/ + packages/prisma + packages/shared | 1-5 |
| Frontend Agent | apps/web/ + packages/ui | 6 |
| Test Agent | apps/api/test/ + apps/web/**/*.test.* | 7 |

**Reglas de coordinación:**
- Backend Agent completa primero (crea endpoints que Frontend consume)
- Frontend Agent trabaja después (usa los endpoints y schemas compartidos)
- Test Agent valida al final (verifica que todo funciona junto)
- Schemas compartidos (packages/shared) los crea Backend Agent
- Si hay conflicto en un archivo, el agente owner del scope tiene prioridad

**Configuración (Claude Code):**
```
# En .claude/settings.json o por sesión
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

**Sin equipos de agentes:** Seguir la secuencia del paso 6 manualmente,
validando después de cada paso antes de continuar.

### 3.3 Validación incremental

Después de CADA paso de la secuencia:

```
Implementar paso N
    ↓
¿Compila? (typecheck)
    ↓
¿Los tests existentes siguen pasando?
    ↓
¿El comportamiento es el esperado? (prueba manual rápida)
    ↓
Confirmar → siguiente paso
```

**Si algo falla:** Corregir ANTES de avanzar. No acumular errores.

### 3.4 Señales de que algo va mal

Detener la implementación y reevaluar si:
- La AI modifica archivos que no están en el scope del feature
- La implementación requiere cambiar la arquitectura existente (→ es un cambio, no un feature)
- Aparecen más de 3 archivos que no estaban en la spec
- Los tests existentes empiezan a fallar sin razón aparente

---

## 4. Post-implementación: verificación

### 4.1 Checklist técnico

```bash
# Ejecutar en orden
pnpm typecheck              # 0 errores de tipos
pnpm lint                   # 0 warnings/errores
pnpm test                   # todos los tests pasan (incluyendo los nuevos)
```

### 4.2 Checklist de UX (para features con interfaz)

Referencia: UX_PATTERNS_PROTOCOL.md, sección 5.

- [ ] ¿La navegación respeta las capas (Browse → Create → Detail)?
- [ ] ¿Las interacciones son consistentes con componentes existentes?
- [ ] ¿Los 4 estados están cubiertos? (loading, empty, error, success)
- [ ] ¿Funciona en mobile?
- [ ] ¿Dark mode funciona correctamente?
- [ ] ¿Los textos están en archivos de i18n, no hardcodeados?

### 4.3 Checklist de completitud

- [ ] ¿Todos los criterios de aceptación de la spec se cumplen?
- [ ] ¿Se crearon tests para el feature nuevo?
- [ ] ¿El feature NO rompe features existentes?
- [ ] ¿Lo que está fuera de alcance NO se implementó?

### 4.4 Cierre

Seguir el **Protocolo de cierre de sesión** (SESSION_CLOSURE_PROTOCOL.md):
- AI documenta en SESSION_LOG.md
- Humano verifica
- Commit de código + docs juntos

---

## 5. Casos especiales

### Feature que resulta ser más grande de lo esperado

Si durante la implementación descubres que el feature requiere más de una sesión:

1. Parar la implementación en un punto estable (que lo hecho funcione por sí solo)
2. Hacer cierre de sesión con lo completado
3. Documentar en SESSION_LOG.md qué falta exactamente
4. La siguiente sesión retoma desde los pendientes

**Regla:** Nunca dejar código a medio implementar sin cierre. Si hay que dividir,
cada parte debe ser funcional por separado.

### Feature que requiere cambios en features existentes

Si el feature nuevo necesita modificar algo que ya funciona:

1. Separar: implementar la parte nueva primero (sin tocar lo existente)
2. Después: usar el **Protocolo de gestión de cambios** para las modificaciones
3. Nunca mezclar feature nuevo + cambios en existente en el mismo paso

### Feature solo-backend (sin UI)

Simplificar: omitir pasos 2, 3 de pre-implementación y checklist de UX en
post-implementación. El resto del protocolo aplica igual.

### Feature solo-frontend (sin backend nuevo)

Simplificar: la secuencia de implementación empieza en el paso 6.
Los pasos de pre-implementación aplican completos (especialmente diseño y UX).

---

## 6. Spec mínima viable — template

Para features que llegan sin documentación formal. Llenar este template
ANTES de pedirle a la AI que implemente:

```markdown
# Feature: [Nombre]

## Contexto
[¿Por qué se necesita este feature? ¿Qué problema resuelve?]

## Comportamiento esperado
[Describir desde la perspectiva del usuario — qué hace, qué ve, qué resultado obtiene]

## Criterios de aceptación
- [ ] [Criterio 1]
- [ ] [Criterio 2]
- [ ] [Criterio 3]

## Alcance
**Incluye:**
- [Lo que sí se implementa]

**NO incluye:**
- [Lo que queda fuera — ser explícito]

## Diseño
**Capa de navegación:** [Browse / Create / Detail]
**Componentes:** [Existentes que reutiliza / Nuevos que necesita]
**Estados:** [Loading / Empty / Error / Success — cómo se ve cada uno]

## Dependencias técnicas
- [ ] Migración de BD: [Sí/No — detalle]
- [ ] Endpoints necesarios: [Existentes / Nuevos]
- [ ] Schemas Zod: [Existentes / Nuevos]
- [ ] Claves i18n: [Nuevas que crear]

## Archivos que NO deben modificarse
- [Lista explícita de archivos/módulos fuera de scope]
```

---

## 7. Conexión con otros protocolos

```
                    ┌─────────────────────────────┐
                    │  ESTE PROTOCOLO              │
                    │  (Feature Development)       │
                    └──────┬──────────────┬────────┘
                           │              │
              ┌────────────▼──┐    ┌──────▼────────────┐
              │ UX Protocol   │    │ Change Management  │
              │ (Consistencia │    │ (Si el feature     │
              │  visual)      │    │  modifica algo     │
              │ Pre-impl: ✓   │    │  existente)        │
              └───────────────┘    └───────────────────┘
                                          │
                              ┌───────────▼───────────┐
                              │ Session Closure        │
                              │ (Al terminar la sesión │
                              │  de implementación)    │
                              └────────────────────────┘
```

- **UX Protocol** se consulta en el paso 2 y 3 de pre-implementación
- **Change Management** se activa si el feature nuevo requiere modificar algo existente
- **Session Closure** se ejecuta al terminar la sesión de implementación

---

## 8. Cómo usar este protocolo

### Como skill de Claude Code
Copiar a `.claude/skills/feature-development/SKILL.md`. Claude lo cargará al
detectar que se va a implementar un feature nuevo.

### Como referencia en AGENTS.md
```markdown
## Protocolo de Desarrollo de Features (OBLIGATORIO)
Antes de implementar cualquier feature nuevo, seguir el protocolo en
docs/FEATURE_DEVELOPMENT_PROTOCOL.md. Incluye: spec → diseño → UX → implementar → verificar.
```

### Para herramientas agnósticas
Los principios (documentar antes de codear, validar UX, implementar en secuencia,
verificar post-implementación) aplican sin importar la herramienta.
