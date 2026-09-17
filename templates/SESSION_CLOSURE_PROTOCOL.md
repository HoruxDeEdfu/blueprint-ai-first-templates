---
name: session-closure
description: "Protocolo de cierre de sesión para desarrollo con AI coding agents. Activar al finalizar cualquier sesión de implementación, antes de hacer commit o cerrar la herramienta. Garantiza que la documentación quede actualizada, verificada, y que la siguiente sesión tenga contexto completo."
---

# Protocolo de cierre de sesión

> Este documento define el proceso para cerrar correctamente una sesión de
> implementación con AI coding agents. El objetivo: que la siguiente persona
> (o tú mismo mañana) pueda retomar sin perder contexto.

## Principio fundamental

**Una sesión sin cierre es deuda de contexto.** Cada sesión que termina sin
documentar qué se hizo, qué cambió, y qué quedó pendiente le cuesta tiempo
a la siguiente sesión. El cierre no es burocracia — es inversión.

---

## 1. Cuándo usar este protocolo

- Al terminar una sesión de implementación de features
- Al terminar una sesión de corrección de bugs que modificó comportamiento
- Al terminar una sesión de gestión de cambios (protocolo CHG-XXX)
- Al terminar una sesión de refactoring que afectó la arquitectura

**NO es necesario para:**
- Sesiones exploratorias o de investigación sin cambios de código
- Sesiones de solo lectura/análisis
- Fix de typos o cambios cosméticos menores

---

## 2. El cierre en 3 fases

```
Fase A: La AI documenta (automatizable)
    ↓
Fase B: El humano verifica (no delegable)
    ↓
Fase C: El humano cierra (commit + sync)
```

---

## 3. Fase A — La AI documenta

Pedirle a la AI que ejecute las siguientes actualizaciones. Usar este prompt
o uno equivalente adaptado a la herramienta:

### Prompt de cierre

```
La sesión de implementación terminó. Necesito que hagas el cierre de documentación:

1. RESUMEN DE SESIÓN: Crea o actualiza `docs/SESSION_LOG.md` agregando una entrada
   con fecha, qué se implementó, qué archivos se modificaron, y qué quedó pendiente.

2. DOCUMENTACIÓN DEL PROYECTO: Revisa y actualiza los siguientes documentos
   SOLO si los cambios de esta sesión los afectan:
   - AGENTS.md — ¿cambió alguna regla, comando, o estructura?
   - docs/GUIA_DISENO.md — ¿se crearon componentes nuevos o patrones nuevos?
   - docs/PRD.md — ¿se completó algo que estaba como pendiente?
   - docs/ARQUITECTURA.md — ¿cambió la arquitectura o se agregó un módulo?
   - docs/changes/CHANGE_LOG.md — ¿se completó algún cambio CHG-XXX?

3. ANTI-PATRONES: Si durante la sesión descubriste un gotcha o un error que
   la AI cometió y tuviste que corregir, agrégalo a la sección "What NOT to Do"
   del AGENTS.md o a la sección "Gotchas" de GUIA_DISENO.md.

4. PENDIENTES: Si quedó algo sin terminar, documéntalo claramente con:
   - Qué falta hacer
   - En qué archivo(s)
   - Cualquier contexto que la siguiente sesión necesite

NO hagas cambios de código. Solo documentación.
```

### SESSION_LOG.md — formato de entrada

```markdown
## YYYY-MM-DD — [Descripción breve de la sesión]

**Implementado:**
- [Feature o cambio 1]
- [Feature o cambio 2]

**Archivos modificados:**
- `ruta/archivo1.tsx` — [qué cambió]
- `ruta/archivo2.ts` — [qué cambió]

**Documentación actualizada:**
- [Doc 1] — [qué sección se actualizó]
- [Doc 2] — [qué sección se actualizó]

**Anti-patrones descubiertos:**
- [Gotcha o error descubierto, si aplica]

**Pendiente para siguiente sesión:**
- [ ] [Tarea pendiente 1 — contexto necesario]
- [ ] [Tarea pendiente 2 — contexto necesario]

**Tests:** [X] passing / [Y] total
```

---

## 4. Fase B — El humano verifica

Esta fase NO es delegable a la AI. El humano revisa lo que la AI documentó.

### Checklist de verificación (5 puntos)

#### 4.1 ¿El resumen de sesión es correcto?

Abrir `docs/SESSION_LOG.md` y verificar:
- [ ] ¿La descripción refleja lo que realmente se hizo?
- [ ] ¿Los archivos modificados son los correctos? (cruzar con `git diff --name-only`)
- [ ] ¿Los pendientes están claros para alguien que no estuvo en la sesión?

**Error común de la AI:** Listar archivos que no se modificaron, u omitir
archivos que sí cambiaron. Siempre cruzar con el diff de git.

#### 4.2 ¿La documentación actualizada es precisa?

Para cada documento que la AI dice haber actualizado:
- [ ] Abrir el documento y leer la sección modificada
- [ ] ¿La información agregada es correcta? (no inventó features, no cambió datos existentes)
- [ ] ¿Mantuvo el formato y tono del resto del documento?

**Error común de la AI:** Agregar información redundante, cambiar secciones
que no debía tocar, o describir la implementación de forma imprecisa.
Especial atención a números (endpoints, conteos de tests, versiones).

#### 4.3 ¿Los anti-patrones son reales?

Si la AI agregó algo a "What NOT to Do" o "Gotchas":
- [ ] ¿Es un error real que ocurrió, o es una precaución genérica?
- [ ] ¿La descripción es suficientemente específica para ser útil?

**Regla:** Solo agregar anti-patrones que realmente ocurrieron en esta sesión.
No permitir que la AI agregue advertencias genéricas del tipo "NO usar eval()".

#### 4.4 ¿Los tests pasan?

- [ ] Ejecutar la suite de tests completa (no solo los tests nuevos)
- [ ] Si algún test falla, NO cerrar la sesión — corregir primero

```bash
# Ejemplo
pnpm test                    # toda la suite
pnpm typecheck               # verificación de tipos
pnpm lint                    # lint
```

#### 4.5 ¿Quedó algo sin documentar?

Revisar mentalmente:
- [ ] ¿Se tomó alguna decisión de arquitectura que no quedó escrita?
- [ ] ¿Se descubrió algo sobre el comportamiento del sistema que otros deberían saber?
- [ ] ¿Cambió algún flujo de usuario que debería reflejarse en el PRD o la guía de diseño?

Si la respuesta es sí a cualquiera, agregar manualmente antes de cerrar.

---

## 5. Fase C — El humano cierra

### 5.1 Commit de código + documentación

Hacer commit de todo junto (código + docs actualizados) para que el
historial de git refleje qué cambio de código motivó qué cambio de docs.

```bash
# Patrón de commit recomendado
git add .
git commit -m "feat: [descripción del feature]

- [Cambio principal 1]
- [Cambio principal 2]
- docs: actualizado [docs afectados]
- pending: [pendiente si aplica]"
```

**Regla:** El código y su documentación se commitean juntos. Nunca commitear
código en un commit y docs en otro — pierdes la trazabilidad.

### 5.2 Sincronizar espejo en Notion (si aplica)

Actualizar el espejo de documentación en Notion con los cambios relevantes.
No es necesario copiar todo — solo:
- Estado de features (completado, en progreso, pendiente)
- Decisiones de producto tomadas
- Pendientes que el equipo debe conocer

**Regla:** Notion es el espejo para humanos, no la fuente de verdad técnica.
Si hay conflicto entre lo que dice Notion y lo que dice el repo, el repo gana.

### 5.3 Cerrar cambios pendientes (si aplica)

Si la sesión completó un cambio del protocolo de gestión de cambios:
- [ ] Verificar que el CHG-XXX en `docs/changes/pending/` está marcado como completado
- [ ] Mover resumen a `docs/changes/CHANGE_LOG.md`
- [ ] Eliminar el archivo de `pending/`

---

## 6. SESSION_LOG.md — reglas del documento

### Estructura del archivo

```markdown
# Session Log

> Registro cronológico de sesiones de implementación. Cada entrada documenta
> qué se hizo, qué cambió, y qué quedó pendiente.

---

## YYYY-MM-DD — [Sesión más reciente arriba]
...

## YYYY-MM-DD — [Sesión anterior]
...
```

### Reglas

- **Orden:** sesión más reciente arriba (cronológico inverso)
- **Una entrada por sesión:** no agrupar múltiples sesiones en una entrada
- **Formato consistente:** usar siempre la plantilla de la sección 3
- **Limpieza:** cuando el archivo supere ~50 entradas, archivar las más antiguas
  en `docs/SESSION_LOG_ARCHIVE.md` y mantener solo las últimas 20

### Cuándo consultar el SESSION_LOG

Al iniciar una nueva sesión, la AI (o el humano) debería leer las últimas
2-3 entradas del SESSION_LOG para:
- Saber qué se hizo en la sesión anterior
- Retomar pendientes
- No duplicar trabajo ya hecho

**Tip:** Agregar al AGENTS.md del proyecto:
```markdown
### Inicio de sesión
Al comenzar cualquier sesión de implementación, leer las últimas 3 entradas
de `docs/SESSION_LOG.md` para tener contexto de sesiones anteriores.
```

---

## 7. División de responsabilidades

| Tarea | ¿Quién? | ¿Por qué? |
|-------|---------|-----------|
| Escribir resumen de sesión | AI | Tiene el contexto fresco de todo lo que hizo |
| Actualizar docs del proyecto | AI | Sabe qué archivos modificó |
| Agregar anti-patrones | AI (propone) + Humano (valida) | La AI puede proponer pero el humano decide si es real |
| Verificar precisión de docs | Humano | La AI puede inventar o ser imprecisa |
| Cruzar con git diff | Humano | Verificación objetiva de qué cambió |
| Ejecutar tests | Humano (o CI) | Validación definitiva |
| Hacer commit | Humano | Decisión de qué entra y qué no |
| Sincronizar Notion | Humano | Requiere criterio de qué es relevante para el equipo |
| Cerrar CHG-XXX | Humano | Decisión de lifecycle de documentación |

---

## 8. Modo rápido (sesiones cortas)

Para sesiones menores a 30 minutos o cambios muy pequeños, el protocolo
completo puede ser excesivo. Usar este checklist reducido:

- [ ] Tests pasan
- [ ] Agregar entrada mínima al SESSION_LOG (1-2 líneas: qué se hizo + pendiente)
- [ ] Commit con mensaje descriptivo
- [ ] Si se descubrió un gotcha → agregar a "What NOT to Do"

No es necesario pedir a la AI que actualice toda la documentación si el
cambio fue menor. Usar criterio.

---

## 9. Inicio de sesión (el complemento)

Este protocolo funciona en par con un **ritual de inicio de sesión**:

```
Al comenzar una sesión de implementación:

1. Leer las últimas 2-3 entradas de docs/SESSION_LOG.md
2. Verificar si hay pendientes de la sesión anterior
3. Si se va a trabajar en un cambio: leer el CHG-XXX correspondiente
4. Si es un feature nuevo: seguir el Protocolo de Desarrollo de Features
```

Agregar esto al AGENTS.md del proyecto para que la AI lo haga automáticamente.

---

## 10. Cómo usar este protocolo

### Como skill de Claude Code
Copiar a `.claude/skills/session-closure/SKILL.md`. Claude lo cargará al
detectar que la sesión está terminando o cuando le pidas cerrar.

### Como referencia en AGENTS.md
```markdown
## Cierre de sesión
Al terminar cualquier sesión de implementación, seguir el protocolo en
docs/SESSION_CLOSURE_PROTOCOL.md. Incluye: documentar → verificar → commit.
```

### Para herramientas agnósticas
Los principios (documentar qué se hizo, verificar, commitear junto) aplican
sin importar la herramienta. El prompt de cierre se adapta al formato de cada una.

---

## 11. Checklist imprimible

```
CIERRE DE SESIÓN — CHECKLIST

Fase A (AI documenta):
□ Entrada en SESSION_LOG.md con resumen, archivos, pendientes
□ Docs del proyecto actualizados (si aplica)
□ Anti-patrones agregados a "What NOT to Do" (si aplica)

Fase B (Humano verifica):
□ Resumen de sesión es correcto (cruzar con git diff)
□ Docs actualizados son precisos (leer secciones modificadas)
□ Anti-patrones son reales (no genéricos)
□ Tests pasan (suite completa)
□ Nada quedó sin documentar

Fase C (Humano cierra):
□ Commit de código + docs juntos
□ Notion sincronizado (si aplica)
□ CHG-XXX cerrado (si aplica)
```
