---
name: i18n
description: "Las tres capas de internacionalización: strings de interfaz en el frontend, plantillas bilingües de email y notificación en el backend, y campos de etiqueta por idioma en la base de datos para datos dinámicos (roles, estados, catálogos). Activar al agregar cualquier string visible, plantilla de comunicación, campo de catálogo, o al formatear fechas, números y monedas."
---

## Propósito

Un producto multilingüe **de verdad** no se resuelve solo con un archivo de traducciones. Los strings de la interfaz son la capa visible y la más fácil; las otras dos son las que se olvidan y las que rompen la experiencia.

```
Capa 1 — Frontend   strings de la interfaz
Capa 2 — Backend    plantillas de email y notificación
Capa 3 — Datos      etiquetas de catálogos en la base de datos
```

El síntoma de haber resuelto solo la Capa 1: la interfaz está impecable en inglés, pero el email de notificación llega en español y el estado del registro se muestra como `PENDING_REVIEW`.

## Cuándo activar

- Al agregar strings visibles
- Al escribir plantillas de email o notificación
- Al crear modelos con campos de etiqueta visibles al usuario
- Al mostrar fechas, números o monedas

---

## Capa 1 — Frontend

- Rutas con segmento de idioma, con un idioma por defecto explícito.
- Mensajes en archivos por idioma, organizados en **namespaces por feature** — no un archivo plano de 5.000 claves.
- Formateo de fechas, números y monedas mediante la librería de i18n, **nunca** con métodos nativos sin pasar el locale.

> Un `toLocaleString()` sin locale explícito usa el del navegador, no el del usuario. En un producto donde el idioma es una preferencia guardada, eso produce una pantalla mitad en cada idioma.

---

## Capa 2 — Backend

Las plantillas de comunicación tienen su texto por idioma (asunto y cuerpo) más una declaración de las variables que aceptan.

**La regla que más se rompe:** el mensaje se renderiza en el idioma del **destinatario**, nunca en el del actor que disparó la acción.

Si un analista que usa la interfaz en inglés aprueba el registro de alguien que eligió español, el email sale en español. El idioma pertenece a quien lee, no a quien actúa.

Los documentos generados (PDF, Excel) se emiten en el idioma de quien los solicita.

---

## Capa 3 — Datos

Todo catálogo y toda configuración que el usuario ve necesitan **una etiqueta por idioma** en la base de datos: roles, estados, niveles, severidades, tipos de documento, campos de formulario configurables.

- Ambas etiquetas son **obligatorias**. Una etiqueta faltante en los seeds es un bug que solo aparece al cambiar de idioma — es decir, casi nunca en desarrollo y siempre en la demo.
- **El backend resuelve la etiqueta y entrega el texto ya resuelto al frontend.** El frontend no debe tener un mapa de traducciones de datos dinámicos: se desincroniza el día que alguien agrega un estado por configuración.

---

## Paridad de claves

Ningún string nuevo se entrega en un solo idioma. La paridad se verifica, no se confía: un check que compare el conjunto de claves entre idiomas y falle ante huérfanas es de los más baratos de escribir y de los que más deuda evitan.

---

## Qué NO hacer

- NO hardcodear strings, ni en componentes ni en plantillas de email.
- NO omitir una etiqueta de idioma en seeds o configuraciones — todas son obligatorias.
- NO usar el idioma del actor para notificar a otra persona.
- NO formatear fechas o números sin pasar el locale explícitamente.
- NO traducir datos dinámicos en el frontend — eso lo resuelve el backend.
- NO agregar un idioma nuevo sin actualizar la documentación de producto.

---

## Adaptación a tu proyecto

1. Reemplaza los nombres de librería por los de tu stack. **Las tres capas son independientes del stack** — el error de resolver solo la primera es universal.
2. Si tu producto es monolingüe hoy pero podría no serlo: aplicar la Capa 1 desde el inicio cuesta poco. Retrofitear las Capas 2 y 3 sobre un producto en producción cuesta mucho.
3. Define desde el inicio dónde vive la preferencia de idioma: en el usuario, en la organización, o en ambos con precedencia explícita.

Skills relacionados: `ux-writer` (qué dice el texto; este skill cubre dónde vive).
