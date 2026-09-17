# Patrones por superficie

Cómo se redacta cada tipo de texto. El **comportamiento** (cuándo modal, cuándo página, cuándo toast) vive en la skill `protocolo-ux`; aquí solo el texto.

Todo va en **redacción impersonal**: sin `tú`/`usted`, sin `nosotros`. Ver `voz.md`.

---

## Botón

**Infinitivo + objeto**, sentence case, sin punto. Máximo 3 palabras.

- ✅ `Crear registro` · `Enviar invitación` · `Quitar área` · `Guardar`
- ❌ `Crea un registro` (imperativo) · `Nuevo` (verbo ausente) · `Aceptar` · `Continuar` en una acción concreta

El botón **repite el verbo del título**. Si el diálogo dice «Eliminar lista», el botón dice `Eliminar lista`, no `Confirmar`.

Excepción: el CTA de creación admite sintagma nominal cuando acompaña a un vacío: `Nuevo registro`.

## Título de página o sección

Sustantivo o sintagma nominal, sin verbo, sin punto. Nombra el contenido, no la acción.

- ✅ `Registros` · `Partes relacionadas` · `Listas`
- ❌ `Gestionar registros` · `Aquí puedes ver tus alertas`

## Estado vacío

Tres piezas: **qué falta** (título) + **por qué está vacío o qué se obtiene** (una línea) + **CTA**.

- ✅ Título: `Aún no hay registros` · Cuerpo: `Crear el primero para empezar a gestionar el proceso.` · CTA: `Nuevo registro`
- ❌ `Sin datos` · `No se encontraron resultados`

Vacío por filtros ≠ vacío por ausencia. Se distinguen:

- ✅ `Ningún registro coincide con los filtros aplicados.`

## Mensaje de error

**Qué pasó** + **qué sigue**, sin atribuir culpa a nadie. Los fallos del sistema usan `No fue posible…`.

- ✅ `No fue posible cargar los registros` + `Reintentar`
- ✅ `No fue posible contactar el servicio. La sesión sigue activa.`
- ❌ `Error 500` · `Ha ocurrido un error inesperado` · `Ingresaste un dato inválido` · `No pudimos cargar…`

Error de validación de campo: dice **qué se espera**, no quién se equivocó.

- ✅ `Formato esperado: nombre@empresa.com` · `Requerido`
- ❌ `Correo inválido` · `Debes ingresar un correo`

El detalle técnico nunca se expone al lector; va al log del sistema.

## Estado de carga

Gerundio + objeto, con **elipsis unicode `…`** (nunca tres puntos ASCII).

- ✅ `Cargando…` · `Cargando formulario…` · `Consultando fuentes…`
- ❌ `Cargando...` · `Por favor espera` · `Procesando su solicitud`

Si la espera supera unos segundos, dice **qué** se está haciendo, no solo que se espera: `Consultando 325 fuentes…`. Y si es una pantalla o un bloque completo, la respuesta correcta suele ser un skeleton, no texto (ver `protocolo-ux`).

## Toast

Confirma en pasado, corto, sin punto si es una sola oración. Nunca celebra.

- ✅ `Registro creado` · `Invitación enviada a {email}` · `Copiado`
- ❌ `¡Copiado!` · `¡Guardado con éxito!` · `Operación completada correctamente`

Si la acción tiene una consecuencia que conviene saber, se dice:

- ✅ `Registro creado. Invitación enviada a {email}.`

## Confirmación destructiva

Título con el verbo real y el objeto. Cuerpo con **la consecuencia irreversible**, en concreto. Botón que repite el verbo.

**El título va en pregunta**: `protocolo-ux` lo fija así y esta skill se alinea, no lo pisa.

- ✅ Título: `¿Eliminar lista?` · Cuerpo: `Se eliminará la lista y sus {n} entradas. Esta acción no se puede deshacer.` · Botones: `Cancelar` / `Eliminar lista`
- ❌ Cuerpo: `¿Estás seguro?` · Botón: `Confirmar`

Si el efecto recae sobre un tercero, se nombra:

- ✅ `El link enviado dejará de funcionar. Se requiere enviar uno nuevo.`

## Aviso de solo lectura o bloqueo

Dice **por qué** está bloqueado y **qué sí** se puede hacer.

- ✅ `Registro en revisión. El documento puede consultarse, no editarse.`
- ❌ `Acceso denegado` · `No tienes permisos`

## Label de formulario

Sustantivo, sentence case, sin dos puntos, sin punto, sin posesivo. La ayuda va en un hint aparte, no entre paréntesis.

- ✅ Label: `Número de documento` · Hint: `Sin puntos ni guiones`
- ❌ `Tu número de documento` · `Número de documento (sin puntos ni guiones):`

Hint de consecuencia, cuando el dato afecta a alguien más:

- ✅ `Se enviará el formulario a este correo.`
- ✅ `Solo para uso interno. El destinatario no verá este campo.`

## Placeholder

Ejemplo del formato esperado, nunca una repetición del label ni una instrucción.

- ✅ `900123456` · `nombre@empresa.com`
- ❌ `Ingresa el número de documento`

## Email y notificación

Registro **externo** si el destinatario no tiene cuenta: cero jerga, pero igual de impersonal.

- **Asunto**: concreto, sin marca al frente, sin `Re:`. ✅ `Acme S.A.S. solicita completar el formulario`
- **Primera línea**: quién lo envía y para qué. Nunca `Estimado usuario`.
- **Un solo CTA**, en infinitivo: ✅ `Completar formulario`
- **Cierre**: qué ocurre si no se actúa (vencimiento, próximos pasos). Sin firmas genéricas tipo «El equipo de».

Notificación in-app (campana): una línea, sujeto explícito, en pasado.

- ✅ `Acme S.A.S. envió el formulario`

## aria-label y texto para lectores de pantalla

**Único caso donde los techos de longitud NO aplican.** Un lector de pantalla carece del contexto visual, así que el texto accesible puede necesitar más palabras que su equivalente visible; recortarlo degrada la accesibilidad.

- ✅ `Analizando fuentes; el número de pendientes se actualizará al terminar`
- ❌ Recortarlo a `Analizando` para cumplir el techo

Sigue aplicando todo lo demás: glosario, impersonalidad, sin exclamaciones. En regiones `aria-live`, describir el cambio, no el widget.

## Texto de PDF o informe (registro formal)

Léxico del glosario, registro impersonal y formal. Sin coloquialismos.

- ✅ `Se identificaron 3 resultados en las fuentes consultadas.`
- ✅ `No se identificaron resultados para el sujeto consultado.`
- ❌ `Encontramos 3 cosas` (persona + término fuera del glosario)

## Portal público (registro externo)

Cero jerga del dominio, impersonal, breve.

- ✅ `Acme S.A.S. requiere verificar los datos antes de iniciar la relación comercial. Toma unos 10 minutos.`
- ✅ `Información recibida. Acme S.A.S. revisará los datos.`
- ❌ `¡Gracias por completar el formulario!` (exclamación) · `Tu información fue recibida` (segunda persona)
- ❌ Cualquier término de la columna «Interno» del glosario (§Vocabulario del registro externo)
