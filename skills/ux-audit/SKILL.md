---
name: ux-audit
description: "Auditoría UX/UI en cuatro capas: análisis estático automatizable (tokens, iconos, i18n, tipografía), validación de patrones de interacción por lectura de código, análisis visual con navegador headless + axe, y juicio subjetivo delegado. Produce un reporte con severidades. Activar antes de mergear un PR de frontend, como gate previo a un release, o ante un reporte de inconsistencia visual."
---

## Cuándo activar

- Antes de mergear un PR que toca la interfaz
- Al recibir un reporte de inconsistencia visual o de comportamiento
- Como gate de calidad antes de un release
- Cuando se agrega un módulo nuevo con interfaz propia

**Complementos:** carga `protocolo-ux` al iniciar. Si tienes un skill `ux-patterns` propio del stack, cárgalo también.

---

## Las 4 capas

```
Capa 1 → Análisis estático        (automatizable, determinista)
Capa 2 → Validación de patrones   (lectura de código + checklist)
Capa 3 → Análisis visual          (navegador headless + axe)
Capa 4 → Juicio subjetivo         (delegado a un agente crítico)
         ↓
         Reporte consolidado
```

Ejecutar **en orden**. Si la Capa 1 arroja hallazgos críticos, reportarlos antes de seguir — no tiene sentido evaluar jerarquía visual en una pantalla que rompe el design system.

Las capas 3 y 4 son opcionales si el scope es solo revisión de código, sin entorno levantado.

---

## Capa 1 — Análisis estático

Lo que se puede detectar con un `grep` no debería consumir juicio de nadie. Esta capa es un script.

| ID | Detecta | Severidad |
|----|---------|-----------|
| S-01 | Colores hardcodeados fuera del sistema de tokens | critical |
| S-02 | Estilos de color inline | critical |
| S-03 | Hexadecimales inline en el marcado | critical |
| S-04 | Iconos de una librería distinta a la oficial del proyecto | critical |
| S-05 | Pesos tipográficos prohibidos por la guía de diseño | warning |
| S-06 | Strings visibles sin pasar por i18n | warning |
| S-07 | Permisos hardcodeados (`canView={true}`) | critical |
| S-08 | Dark mode resuelto a mano, saltándose los tokens | critical |
| S-09 | Texto «Cargando…» visible en vez de un skeleton | warning |
| S-10 | Rutas nuevas sin cobertura del guard de autenticación | critical |
| S-11 | Skeleton derivado: su estructura no coincide con la pantalla real | critical |
| S-12 | Componente propio que duplica uno de la librería compartida | warning |

**Documenta las excepciones reales.** Toda regla estática tiene excepciones legítimas (paneles decorativos de marca, componentes que usan color fijo por diseño). Si no se documentan, el script cría alarmas que el equipo aprende a ignorar — y un check ignorado no existe.

**S-11 merece su propio script.** Es el único de la lista que no se detecta con una expresión regular: requiere comparar las columnas declaradas en el skeleton contra las de la tabla real.

---

## Capa 2 — Validación de patrones

Leer el código del módulo y verificar cada ítem. Marcar ✅ / ❌ / ⚠️.

### Navegación
- [ ] **L-01** Las páginas de listado muestran la navegación principal y no la replican dentro del contenido
- [ ] **L-02** Las páginas de creación/edición la ocultan y ofrecen una salida explícita
- [ ] **L-03** Los wizards multi-paso muestran progreso
- [ ] **L-04** Las features de configuración están fuera de la navegación principal
- [ ] **L-05** El flujo Browse → Detail → Edit respeta la dirección de capas

### Tablas
- [ ] **T-01** La columna de acciones es la última a la derecha
- [ ] **T-02** Con 2+ acciones: menú adosado. Con 1: botón de icono
- [ ] **T-03** No hay texto de celda clickeable como única vía de navegación
- [ ] **T-04** Los filtros están encima de la tabla, no en el header de columna
- [ ] **T-05** El estado vacío tiene icono del módulo + CTA
- [ ] **T-06** El estado de carga replica la estructura de la tabla
- [ ] **T-07** La paginación usa el componente compartido, con labels traducidos
- [ ] **T-08** La selección múltiple tiene checkbox + barra de acciones bulk

### Formularios
- [ ] **F-01** Labels encima del campo, nunca solo placeholder
- [ ] **F-02** Campos obligatorios marcados
- [ ] **F-03** Validación on blur, no en tiempo real
- [ ] **F-04** Al enviar con errores, scroll al primero
- [ ] **F-05** Con cambios sin guardar al salir: confirmación
- [ ] **F-06** Botón primario a la derecha

### Modales
- [ ] **M-01** Modales con ≤ 4 campos o confirmaciones. Más → página nueva
- [ ] **M-02** Los destructivos anuncian el recurso y la irreversibilidad
- [ ] **M-03** El botón destructivo usa el verbo real, no «Aceptar»
- [ ] **M-04** Se cierra con X, Cancelar, overlay y Escape
- [ ] **M-05** Las confirmaciones destructivas **no** son descartables por overlay

### Estados
- [ ] **E-01** Todo componente con datos tiene estado de carga con skeleton
- [ ] **E-02** Estado vacío con icono + título + descripción + CTA
- [ ] **E-03** Estado de error con mensaje descriptivo + «Reintentar»
- [ ] **E-04** Transición suave del skeleton a los datos, sin flash
- [ ] **E-05** El skeleton retrasa su aparición (~200 ms) cuando ocupa un bloque completo, y **no** lo hace si es un fragmento dentro de contenido ya pintado

### Accesibilidad mínima
- [ ] **A-01** Imágenes decorativas con `aria-hidden="true"`
- [ ] **A-02** Iconos de acción sin texto visible tienen `aria-label`
- [ ] **A-03** Cada control de formulario tiene su label asociado
- [ ] **A-04** Los modales tienen título y descripción accesibles
- [ ] **A-05** Las listas de datos usan tabla semántica, no divs apilados
- [ ] **A-06** Los estados vacío y de error tienen `role` apropiado
- [ ] **A-07** Los elementos interactivos tienen foco visible — no se remueve el outline globalmente

### Responsive
- [ ] **R-01** Las tablas se transforman en cards por debajo del breakpoint
- [ ] **R-02** Touch targets ≥ 44px en mobile
- [ ] **R-03** Los elementos fijos al fondo respetan el safe area
- [ ] **R-04** Los filtros son full-width en mobile

### i18n
- [ ] **I-01** Cero strings hardcodeados
- [ ] **I-02** Las claves existen en **todos** los idiomas soportados
- [ ] **I-03** Fechas y números formateados vía la librería de i18n, no con métodos nativos sin locale

---

## Capa 3 — Análisis visual

Solo si hay un entorno levantado. Recorrer cada ruta del módulo en desktop (1280×800) y mobile (390×844).

| ID | Check | Cómo verificar |
|----|-------|----------------|
| V-01 | Dark/light | Alternar el tema y comparar legibilidad en ambos |
| V-02 | Overflow horizontal | `document.body.scrollWidth > window.innerWidth` |
| V-03 | Elementos cortados | Screenshot + inspección de bordes |
| V-04 | Contraste AA | `axe.run()` inyectado en la página |
| V-05 | Foco visible | Recorrer con Tab y verificar el anillo de foco |
| V-06 | Estado vacío real | Probar con dataset vacío |
| V-07 | Estado de carga | Throttle de red para capturar el skeleton |
| V-08 | Responsive | Screenshot a 390px |
| V-09 | Touch targets | Medir los elementos interactivos en mobile |
| V-10 | Conflictos de z-index | Modales, tooltips y dropdowns no quedan bajo otros elementos |

```javascript
const results = await axe.run();
return results.violations.map(v => ({
  impact: v.impact,
  description: v.description,
  nodes: v.nodes.length,
}));
```

---

## Capa 4 — Juicio subjetivo

Las tres capas anteriores verifican **conformidad**. Ninguna responde «¿esta pantalla se entiende?». Eso requiere juicio, y conviene delegarlo a un agente con contexto fresco — quien implementó la pantalla ya no puede verla con ojos nuevos.

Delegar cuando hay screenshots disponibles, cuando la pantalla no está documentada en la guía de diseño, o ante dudas de jerarquía visual.

```
Analiza esta pantalla de [producto y tipo de usuario].

Evalúa:
1. Jerarquía visual — ¿el usuario sabe qué es lo más importante?
2. Flujo de interacción — ¿está claro qué acción tomar? ¿el CTA principal es obvio?
3. Consistencia — ¿los patrones son coherentes con el resto del sistema?
4. Estados — ¿están cubiertos carga, vacío, error y éxito?
5. Densidad — ¿la información está bien organizada para el uso real?

Referencia de diseño: [ruta a la guía]
Contexto de uso: [quién la usa y con qué frecuencia]

Reporta: [critical | warning | suggestion] con una acción concreta.
```

---

## Reporte

```markdown
# Auditoría UX — [Módulo] — [Fecha]

## Resumen
- Críticos: N · Warnings: N · Sugerencias: N
- Estado: ✅ Listo para merge / ⚠️ Requiere correcciones / 🚫 Bloqueado

## Hallazgos

### 🔴 Críticos (bloquean merge)
| ID | Descripción | Archivo:Línea | Acción requerida |
|----|-------------|---------------|------------------|

### ⚠️ Warnings (antes del release)
| ID | Descripción | Archivo:Línea | Acción requerida |
|----|-------------|---------------|------------------|

### 💡 Sugerencias (no bloquean)
| ID | Descripción | Contexto | Acción sugerida |
|----|-------------|----------|-----------------|

## Checklist de patrones
[tabla de Capa 2 con ✅ / ❌ / ⚠️]

## Próximos pasos
1. [acción concreta con responsable]
```

### Severidades

| Severidad | Criterio | Impacto |
|-----------|----------|---------|
| **critical** | Viola una regla dura del design system, rompe accesibilidad fundamental, o es un riesgo de seguridad frontend | Bloquea el merge |
| **warning** | Inconsistencia que degrada la experiencia o crea deuda de UX | Antes del release |
| **suggestion** | Mejora no mandatoria | No bloquea |

**Una severidad que no bloquea nada no es una severidad.** Si los críticos no detienen merges en la práctica, el reporte es decorativo.

---

## Adaptación a tu proyecto

1. **La Capa 1 es la que más rinde y la única que debes escribir tú:** traduce la tabla de checks a expresiones regulares sobre tu stack. Empieza por S-01 (colores) y S-06 (i18n) — suelen ser el 70% de los hallazgos.
2. La Capa 2 se hereda casi tal cual; ajusta los nombres de componentes.
3. Si no tienes navegador headless disponible, elimina la Capa 3 en vez de fingirla.
4. La Capa 4 necesita un agente separado. Sin él, este skill sigue siendo útil — pero no sustituyas el juicio subjetivo por más checklist.

Skills relacionados: `protocolo-ux` (el comportamiento que esta auditoría verifica), `ux-writer` (el texto), `i18n` (la mecánica de idiomas).
