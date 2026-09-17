---
name: ux-patterns
description: "Protocolo de patrones UX para garantizar consistencia en interfaces generadas con AI. Activar SIEMPRE que se trabaje en componentes de UI, layouts, navegación, tablas, formularios, modales o cualquier elemento de interfaz. Aplica tanto para Angular + PrimeNG como para React + Shadcn UI."
---

# Protocolo de patrones UX

> Este documento define los patrones de experiencia de usuario que DEBEN respetarse en toda implementación de interfaz. Si un componente no está listado aquí, buscar el patrón más cercano y seguir sus principios. Ante la duda, preguntar antes de implementar.

## 1. Arquitectura de navegación

### 1.1 Separación por dominio

La navegación se divide en dos dominios. NUNCA mezclarlos en el mismo nivel.

**Sidenav (navegación principal):**
- Contiene SOLO features del negocio — lo que el usuario final usa para cumplir sus objetivos.
- Ejemplos: Decisiones, Proyectos, Reportes, Contrapartes, Documentos.
- Cada ítem del sidenav lleva a una vista de nivel 1 (browse/listado).

**Settings / Avatar del usuario:**
- Contiene SOLO features de administración y gestión del sistema.
- Ejemplos: Gestión de usuarios, Roles y permisos, Configuración de cuenta, Facturación, Integraciones, Preferencias.
- Acceso desde el avatar del usuario o un ícono de configuración, NUNCA desde el sidenav principal.

**Regla de decisión:** Si la feature responde a "¿qué hace el negocio?", va en el sidenav. Si responde a "¿cómo se configura/administra el sistema?", va en settings.

### 1.2 Navegación por capas (layouts contextuales)

La aplicación maneja tres capas de navegación. Cada capa tiene su propio layout. NUNCA mostrar el layout de una capa en el contexto de otra.

**Capa 1 — Browse (exploración):**
- Layout: completo con sidenav visible.
- Propósito: el usuario explora módulos y listados.
- Ejemplo: lista de decisiones, dashboard principal, listado de contrapartes.
- El sidenav permanece visible y funcional.

**Capa 2 — Create / Edit (procesos):**
- Layout: limpio, SIN sidenav.
- Propósito: el usuario está en un flujo de creación o edición paso a paso.
- Navegación: stepper/wizard con indicador de progreso.
- Acciones: "Siguiente", "Anterior", "Cancelar" (con confirmación si hay cambios sin guardar).
- Al completar o cancelar, regresa a Capa 1.
- NUNCA mostrar el sidenav durante un flujo de creación — distrae y rompe el foco.

**Capa 3 — Detail (profundización):**
- Layout: limpio, SIN sidenav.
- Propósito: el usuario está viendo el detalle de un registro o información expandida.
- Navegación: botón "Volver" o "Salir" (iconografía + texto) en la parte superior.
- Al salir, regresa a la vista de origen (Capa 1 o el contexto que lo invocó).
- Puede contener tabs internos para organizar información del detalle.
- NUNCA mostrar el sidenav en la vista de detalle.

**Regla de navegación entre capas:**
```
Capa 1 (Browse) → click en registro → Capa 3 (Detail)
Capa 1 (Browse) → click en "Crear nuevo" → Capa 2 (Create)
Capa 3 (Detail) → click en "Editar" → Capa 2 (Edit)
Capa 2/3 → "Volver" / "Cancelar" → Capa anterior
```

## 2. Patrones de interacción

### 2.1 Tablas y listados

**Acceso al detalle:**
- SIEMPRE usar un ícono de acción (ojo, chevron, o botón "Ver") en la columna de acciones.
- NUNCA hacer el texto de una celda clickeable como mecanismo de navegación al detalle.
- Razón: el texto clickeable no es discoverable y rompe la expectativa de selección.

**Columna de acciones:**
- Posición: SIEMPRE última columna a la derecha.
- Contenido: íconos de acción con tooltip (ver, editar, eliminar).
- Si hay más de 3 acciones, agrupar en un menú contextual (tres puntos verticales).
- Orden consistente: Ver → Editar → Más opciones (menú) → Eliminar.

**Selección en tablas:**
- Checkbox en la primera columna si se requiere selección múltiple.
- Barra de acciones bulk aparece al seleccionar al menos un registro.

**Ordenamiento y filtros:**
- Columnas ordenables muestran ícono de flechas (↕) en el header.
- Filtros van encima de la tabla, nunca dentro del header de columna.

### 2.2 Formularios

**Layout de campos:**
- Máximo 2 columnas en desktop, 1 columna en mobile.
- Labels SIEMPRE encima del campo (top-aligned), nunca inline/placeholder-only.
- Campos obligatorios marcados con asterisco (*) junto al label.

**Validación:**
- Validar al salir del campo (on blur), no en tiempo real mientras el usuario escribe.
- Mensajes de error debajo del campo, en rojo, con texto descriptivo.
- Al enviar formulario con errores, scroll automático al primer campo con error.

**Acciones de formulario:**
- Botón primario (Guardar/Crear/Enviar) a la derecha.
- Botón secundario (Cancelar) a la izquierda del primario.
- Si el formulario tiene cambios sin guardar y el usuario intenta salir, mostrar diálogo de confirmación.

### 2.3 Modales y diálogos

**Cuándo usar modal vs. nueva página:**
- Modal: confirmaciones, formularios cortos (≤5 campos), alertas.
- Nueva página (Capa 2 o 3): formularios largos, vistas de detalle, flujos multi-paso.

**Anatomía del modal:**
- Header: título descriptivo + botón X para cerrar.
- Body: contenido.
- Footer: acciones (Cancelar a la izquierda, Acción primaria a la derecha).
- Cerrar con X, con botón Cancelar, o con click en el overlay — los tres deben funcionar.
- Cerrar con Escape SIEMPRE habilitado.

**Modales de confirmación destructiva:**
- Título claro: "¿Eliminar [nombre del recurso]?"
- Descripción del impacto: "Esta acción no se puede deshacer."
- Botón destructivo en rojo, con texto explícito ("Eliminar", no "Aceptar").

### 2.4 Feedback y estados

**Todo componente que carga datos debe manejar estos 4 estados:**

1. **Loading:** skeleton o spinner. Preferir skeleton para layouts conocidos.
2. **Empty:** mensaje + ilustración/ícono + CTA para crear el primer registro.
3. **Error:** mensaje descriptivo + acción de reintentar.
4. **Success:** los datos se muestran. Transición suave desde skeleton.

**Notificaciones (toast/snackbar):**
- Posición: esquina superior derecha.
- Duración: 5 segundos para info/success, persistente para errores.
- Acciones dentro de toast solo para "Deshacer".

## 3. Layout y espaciado

### 3.1 Sistema de espaciado

Usar múltiplos de 4px como unidad base. Valores permitidos:

| Token     | Valor | Uso                                    |
|-----------|-------|----------------------------------------|
| `space-1` | 4px   | Separación entre ícono y texto         |
| `space-2` | 8px   | Padding interno de badges/pills        |
| `space-3` | 12px  | Gap entre campos de formulario inline  |
| `space-4` | 16px  | Padding interno de cards y secciones   |
| `space-5` | 20px  | Gap entre secciones dentro de una card |
| `space-6` | 24px  | Padding de página, gap entre cards     |
| `space-8` | 32px  | Separación entre secciones principales |

### 3.2 Breakpoints

| Nombre    | Ancho       | Columnas | Comportamiento              |
|-----------|-------------|----------|------------------------------|
| `mobile`  | < 768px     | 1        | Sidenav colapsado/drawer     |
| `tablet`  | 768–1024px  | 1–2      | Sidenav colapsado, contenido adapta |
| `desktop` | > 1024px    | 2–3      | Sidenav visible, layout completo    |

### 3.3 Grid y contenedores

- Contenido principal: máximo 1200px de ancho, centrado.
- Formularios de creación/edición: máximo 800px de ancho, centrado.
- Cards dentro de dashboards: grid responsivo con gap de 24px.

## 4. Reglas cross-stack

Estos principios aplican independientemente de si se usa PrimeNG (Angular) o Shadcn UI (React):

### 4.1 Mapeo de componentes equivalentes

| Patrón              | PrimeNG              | Shadcn UI              |
|----------------------|----------------------|------------------------|
| Tabla de datos       | `p-table`            | `DataTable` (tanstack) |
| Modal                | `p-dialog`           | `Dialog`               |
| Toast/notificación   | `p-toast`            | `Sonner` o `Toast`     |
| Formulario           | Reactive Forms       | React Hook Form        |
| Stepper/wizard       | `p-steps`            | Custom stepper         |
| Menú contextual      | `p-menu`             | `DropdownMenu`         |
| Sidebar/sidenav      | `p-sidebar`          | `Sheet` + custom nav   |

### 4.2 Regla de consistencia cross-stack

Si un patrón de interacción se define en este protocolo, DEBE implementarse de la misma manera conceptual en ambos stacks. La implementación técnica cambia, el comportamiento del usuario NO.

Ejemplo: "El detalle de un registro en tabla se accede con ícono de ojo" aplica tanto si la tabla es `p-table` como si es un `DataTable` de tanstack.

## 5. Checklist de verificación

Antes de dar por terminada cualquier implementación de UI, verificar:

- [ ] ¿La navegación respeta las 3 capas (Browse → Create → Detail)?
- [ ] ¿Las features de admin están en settings, NO en el sidenav?
- [ ] ¿Las tablas usan ícono de acción para navegar al detalle?
- [ ] ¿Los formularios tienen labels visibles (no solo placeholders)?
- [ ] ¿Los 4 estados (loading, empty, error, success) están cubiertos?
- [ ] ¿El espaciado usa múltiplos de 4px?
- [ ] ¿La vista se ve correcta en mobile, tablet y desktop?
- [ ] ¿Los modales se cierran con X, Cancelar, overlay y Escape?
- [ ] ¿El comportamiento de interacción es idéntico al patrón equivalente en el otro stack?

## 6. Cómo usar este protocolo

### Como skill de Claude Code (.claude/skills/ux-patterns/SKILL.md)
Copiar este archivo a `.claude/skills/ux-patterns/SKILL.md`. Claude lo cargará automáticamente cuando trabaje en componentes de UI.

### Como sección en CLAUDE.md
Agregar un resumen de las reglas más críticas (secciones 1 y 2) directamente en el CLAUDE.md del proyecto. No copiar todo el documento — solo los principios que más se violan.

### Como referencia en AGENTS.md (herramienta agnóstica)
Renombrar a `UX_PATTERNS.md` y referenciarlo desde el AGENTS.md: "Para cualquier implementación de UI, consultar UX_PATTERNS.md antes de generar código."

### Para herramientas que no usan archivos .md (Antigravity, Lovable, etc.)
Copiar las secciones relevantes en el prompt inicial o en la descripción del proyecto dentro de la herramienta.
