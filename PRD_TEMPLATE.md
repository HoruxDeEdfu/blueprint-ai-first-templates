# PRD: {Nombre del producto}

> **Versión:** 1.0
> **Fecha:** {YYYY-MM-DD}
> **Autor:** {Nombre}
> **Estado:** Borrador | En revisión | Aprobado

---

## 1. Visión del producto

### En una línea
{Descripción concisa del producto en una oración}

### Problema
{¿Qué dolor existe hoy? Describir desde la perspectiva del usuario, no desde la técnica. Estructurar como barreras concretas — cada barrera debería apuntar a una persona de la audiencia}

### Solución
{¿Cómo este producto resuelve ese dolor? Describir como comportamiento esperado, no como lista de features. "El usuario hace X → obtiene Y" no "el sistema tiene la feature Z"}

---

## 2. Audiencia

| Persona | Dolor principal | Trigger de compra | Job-to-be-done |
|---------|----------------|-------------------|----------------|
| {Persona 1} | {Dolor en sus palabras} | {Qué lo hace pagar} | {Qué "trabajo" contrata al producto para hacer} |
| {Persona 2} | {Dolor en sus palabras} | {Qué lo hace pagar} | {Qué "trabajo" contrata al producto para hacer} |

### Persona principal (early adopter)
{¿Quién llega primero? ¿Por qué? ¿Cómo descubre el producto?}

### Persona secundaria (escala) [OPCIONAL]
{¿Quién convierte una adopción individual en una compra de equipo/empresa?}

---

## 3. Propuesta de valor

### Diferenciador principal
{¿Por qué este producto y no la alternativa más obvia?}

### Anti-prompt defensibility [OPCIONAL]
{¿Por qué un prompt genérico de AI NO puede reemplazar este producto? Ser específico. Omitir esta sección si el producto no compite con LLMs}

### Alternativas y limitaciones

| Alternativa | Limitación | Este producto resuelve |
|-------------|-----------|----------------------|
| {Alternativa 1} | {Por qué no es suficiente} | {Cómo lo resuelve} |
| {Alternativa 2} | {Por qué no es suficiente} | {Cómo lo resuelve} |

---

## 4. Comportamiento esperado

> Describir comportamiento esperado, no solo features.
> "El usuario puede registrar una decisión en 30 segundos" > "formulario de decisiones"

### Flujo principal
{Describir paso a paso qué hace el usuario, qué ve, qué resultado obtiene — desde que llega hasta que tiene su entregable. Cada paso describe comportamiento observable, no implementación técnica}

### Flujos secundarios
{Flujos alternativos: usuario que vuelve, usuario que edita, error recovery, onboarding, etc.}

### Estados del sistema
- **Loading:** {Qué ve el usuario mientras espera}
- **Empty:** {Primera vez, sin datos}
- **Error:** {Qué pasa cuando algo falla — el usuario nunca debería perder su trabajo}
- **Success:** {Resultado exitoso — qué obtiene}

---

## 5. Alcance por fase

> Definir explícitamente qué NO se incluye en esta fase.
> Cada línea en "NO incluye" es algo que alguien podría asumir que sí está.

### Fase 1 — MVP
**Incluye:**
- {Comportamiento 1}
- {Comportamiento 2}

**NO incluye:**
- {Lo que queda explícitamente fuera — ser generoso con esta lista}

**Criterios de aceptación del MVP:**
- [ ] {Criterio verificable 1 — debe poder responderse con sí/no}
- [ ] {Criterio verificable 2}

### Fase 2 — {Nombre}
**Incluye:**
- {Comportamiento}

### Fase 3 — {Nombre} [OPCIONAL]
**Incluye:**
- {Comportamiento}

---

## 6. Modelo de negocio

### Estrategia de monetización
{Freemium / Subscription / One-time / Open core — justificar la elección. Explicar por qué la recurrencia (si aplica) se justifica con valor continuo real, no con retención artificial}

### Qué es gratis vs pago

| Gratis | Pago |
|--------|------|
| {Feature/entregable — lo que demuestra valor} | {Feature/entregable — lo que justifica el pago} |

### Pricing [OPCIONAL]
{Si ya hay definición de precios. Incluir breakeven estimado con costos reales de infraestructura}

---

## 7. Métricas de éxito

### North Star Metric
{La métrica que define si el producto funciona. No es vanity (visitas, signups) — es valor entregado. ¿El usuario logró lo que vino a hacer?}

### KPIs por fase

| Fase | Métrica | Target | Cómo se mide |
|------|---------|--------|--------------|
| MVP | {Métrica} | {Número} | {Herramienta/método} |

### Señales de product-market fit
- {Señal 1 — comportamientos orgánicos que no puedes forzar}
- {Señal 2}

---

## 8. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| {Riesgo 1} | Alta/Media/Baja | Alto/Medio/Bajo | {Cómo se mitiga — debe ser accionable, no "esperamos que no pase"} |

---

## 9. Ecosistema y dependencias [OPCIONAL]

{¿Este producto vive solo o es parte de un ecosistema? ¿Qué otros productos/servicios lo alimentan o se alimentan de él? ¿Qué debe existir antes de que este producto se lance?}

---

## 10. Lo que este PRD NO decide

Siguiendo la cadena de artefactos, este PRD define QUÉ se construye y PARA QUIÉN. Las siguientes decisiones se delegan a sus artefactos correspondientes:

- **Arquitectura técnica:** Se define en `docs/ARQUITECTURA.md`
- **Modelos de datos:** Se definen en el schema del ORM
- **Reglas para AI coding agents:** Se definen en `AGENTS.md`
- **Patrones de diseño visual:** Se definen en `GUIA_DISEÑO.md`
