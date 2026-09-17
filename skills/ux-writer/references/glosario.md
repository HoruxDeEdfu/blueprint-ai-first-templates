# Glosario canónico

Fuente única de nombres del producto. Consultar **antes** de nombrar cualquier cosa. No inferir del copy vecino: puede estar en deriva (ver `deuda-conocida.md`).

Al introducir un término nuevo al producto, agregarlo aquí **en el mismo commit**. Un glosario que se actualiza «después» queda atrás en una semana y deja de ser fuente de verdad.

> Este archivo es una plantilla con ejemplos. Las tablas de entidades, estados y términos prohibidos son **100 % tuyas**: lo que se hereda es la estructura y el método —identificar los términos que se confunden entre sí y resolverlos por escrito—. La tabla de verbos sí es transferible casi tal cual.

---

## Entidades del dominio

Una fila por concepto que el usuario ve nombrado. Las columnas que más deuda evitan son las dos últimas: el género gramatical fija cómo concuerdan estados y mensajes, y la columna «Prohibido» registra el error que ya se cometió.

| Término | Nombra | Género/número | Prohibido |
|---------|--------|---------------|-----------|
| **{sujeto}** | La persona u organización sobre la que trata el proceso. Es **quien actúa** | {la/el} | Usarlo para el proceso |
| **{proceso}** | El flujo y el módulo. Es lo que se **crea**, avanza y se aprueba | {la/el} | Usarlo para el sujeto |
| **{evidencia}** | El cuerpo documental del proceso. Se **consulta**, bloquea y archiva | {la/el} | Usarlo para el proceso |
| **{resultado}** | El resultado de una verificación, **en cualquier estado** | {la/el} | Los sinónimos técnicos (`match`, `hit`) |
| **{unidad organizacional}** | La unidad que segmenta el acceso a los datos | {la/el} | «departamento», «sucursal» si no son lo mismo |
| **alerta** | Señal que exige atención de una persona | la alerta | «notificación», que es otra cosa: el aviso en la campana |

El patrón que más se rompe es el de las tres primeras filas: **sujeto**, **proceso** y **evidencia** se confunden porque en la conversación cotidiana se usan como sinónimos. En la interfaz no pueden serlo: «Nueva {proceso}» crea algo; «{el sujeto} está diligenciando» describe a alguien; «{la evidencia} está bloqueada» habla de un documento.

## Nombre del producto

**`{Nombre comercial}`** — único nombre en interfaz y comunicaciones salientes.

Los nombres internos (el del repositorio, el de la iniciativa, la sigla del equipo) viven en documentación y código, nunca en pantalla. Revisar también lo que ninguna auditoría de archivos de traducción ve: el `<title>` del navegador, el nombre en el manifiesto de la aplicación, los encabezados de los archivos exportados.

## Estados

Los estados del proceso principal se fijan una vez y son **normativos**: al escribir copy que los mencione no se inventan sinónimos. Concuerdan en género con el sustantivo del proceso.

| Clave | ES | EN |
|-------|----|----|
| `draft` | Borrador | Draft |
| `pending_review` | Pendiente de revisión | Pending review |
| `in_review` | En revisión | In review |
| `approved` | {Aprobada/Aprobado} | Approved |
| `rejected` | {Rechazada/Rechazado} | Rejected |
| `expired` | {Vencida/Vencido} | Expired |
| `{estado}` | … | … |

## Verbos de acción

Un acto, un verbo, **siempre en infinitivo** (nunca imperativo: `Crear`, no `Crea`). Si hay duda entre dos, la pregunta es *qué le pasa al dato*.

| Verbo | Qué le pasa al dato | Ejemplo | En vez de |
|-------|---------------------|---------|-----------|
| **Eliminar** | Se destruye, permanente | Eliminar lista | Borrar, Remover |
| **Quitar** | Sigue existiendo, sale de esta selección o asociación | Quitar área | Eliminar |
| **Descartar** | Nunca se guardó; se abandona | Descartar borrador | Cancelar |
| **Cancelar** | Cierra un diálogo sin actuar. **Solo** eso | Cancelar | Descartar, Cerrar |
| **Crear** | Nace una entidad | Crear {proceso} | «Nueva» como verbo |
| **Agregar** | Se suma a una colección existente | Agregar documento | Añadir |
| **Enviar** | Sale del sistema hacia una persona | Enviar invitación | Remitir |
| **Reenviar** | Se envía de nuevo lo mismo | Reenviar invitación | Enviar otra vez |
| **Ver** | Abre solo lectura, sin juicio | Ver {evidencia} | Consultar, Revisar |
| **Revisar** | Acto de juicio de una persona sobre un caso | Revisar {resultados} | Ver |
| **Validar** / **Verificar** | **Reservados** si en tu dominio son actos técnicos con significado propio | Verificar código | Como sinónimos de «ver» |
| **Aprobar** / **Rechazar** | Decisión final sobre el proceso | Aprobar {proceso} | Aceptar / Denegar |
| **Suspender** | Pausa reversible | Suspender {proceso} | Desactivar |
| **Desactivar** | Apaga una configuración o función | Desactivar monitoreo | Deshabilitar, Inhabilitar |

**`Nuevo` / `Nueva` no son verbos.** Van solo como adjetivo en un CTA de creación donde el sustantivo lo sigue: `Nueva {proceso}`. Nunca solos: un botón que dice `Nuevo` tiene el verbo ausente.

## Términos prohibidos en la interfaz

Registrar el par «no escribir → escribir» con la razón. La razón es lo que evita que alguien lo reintroduzca «porque suena mejor».

| No escribir | Escribir | Por qué |
|-------------|----------|---------|
| {sinónimo técnico del resultado} | {término canónico} | Un solo término para una sola cosa |
| {nombre interno del producto} | {nombre comercial} | Nombre interno |
| usuario final, el usuario | (reformular sin sujeto) / {el sujeto} | Vago; y el lector no se nombra |
| la plataforma, el sistema | (voz activa, o «No fue posible…») | No se personifica el sistema |
| deshabilitar, inhabilitar | desactivar | Un solo verbo |
| añadir | agregar | Un solo verbo |

## Vocabulario del registro externo

En las rutas públicas y en los emails a quien no tiene cuenta, la jerga del dominio **se traduce**. La redacción sigue siendo impersonal: cambia el vocabulario, no la persona gramatical.

| Interno | Externo |
|---------|---------|
| {proceso} / {evidencia} | el proceso, la solicitud |
| {sujeto} | (sin sujeto) / la empresa |
| {verificación técnica} | verificación |
| formulario de {tipo} | formulario |
| diligenciar | completar, llenar |
| {sigla del dominio} | {su expansión}, glosada la primera vez |
| {término legal} | {su equivalente en lenguaje llano} |
