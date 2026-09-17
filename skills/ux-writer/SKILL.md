---
name: ux-writer
description: "Contenido, tono y voz del producto: glosario canónico de términos, registros por audiencia, reglas mecánicas de microcopy (botones, títulos, estados vacíos, errores, toasts, confirmaciones) y la regla de temperatura. Activar al escribir o editar CUALQUIER string visible — claves de i18n, plantillas de email y notificación, mensajes de error — y al auditar copy existente."
---

## Propósito

El producto le habla al usuario con **una sola voz** y llama a cada cosa por **un solo nombre**.

Este skill fija dos cosas distintas: **qué palabra** se usa (el glosario, transversal a todas las superficies) y **cómo suena** (la voz y el registro, solo en interfaz y comunicaciones salientes).

División de responsabilidades con sus skills vecinos:

- `i18n` cubre la **mecánica**: dónde vive cada string, cómo se resuelve el idioma.
- `protocolo-ux` cubre el **comportamiento**: cuándo modal, cuándo página.
- Este skill cubre **el texto**.

## Cuándo activar

- Al agregar o editar claves de traducción
- Al escribir plantillas de email o notificación
- Al redactar el texto de un error que el usuario lee
- Al nombrar un módulo, estado, acción, columna o filtro nuevo
- Al auditar o reescribir copy existente

---

## Alcance: dos niveles

| Nivel | Superficies | Qué gobierna |
|-------|-------------|--------------|
| **Voz plena** | Interfaz del producto, emails y notificaciones salientes | Glosario + registro + tono + ritmo |
| **Léxico compartido** | PDFs, exports, errores del API, documentos legales | **Solo el glosario.** El registro ahí es formal — pero una cosa se llama igual en un toast que en un documento firmado |

Un informe formal no dice «encontramos algo raro»; dice «se identificó un hallazgo». Lo que **no** puede hacer es llamarlo «coincidencia» cuando la interfaz lo llama «hallazgo».

---

## Los registros por audiencia

La mayoría de productos le hablan a más de un tipo de persona. Cada una necesita un registro distinto, y mezclarlos es el error de copy más caro.

### Usuario experto (la plataforma interna)

Conoce el dominio. Usa su vocabulario sin glosarlo. Va al grano — trabaja con esto ocho horas al día y no necesita que le expliquen su oficio.

> Aún no se han ejecutado análisis para este registro.

### Usuario externo (portal público, formularios, emails de invitación)

Un tercero que **no eligió estar ahí**, no conoce el producto y no conoce el dominio. **Cero jerga.** Se dice **quién** pide los datos y **para qué**.

> Acme S.A.S. requiere verificar los datos antes de iniciar la relación comercial. Toma unos 10 minutos.

**Regla de corte:** si el string vive en una ruta pública, o viaja en un email hacia alguien que no tiene cuenta, es registro externo.

El registro cambia (cero jerga); la neutralidad **no** cambia. No se tutea al usuario externo por ser externo.

---

## Glosario canónico

**Una fuente única, consultada antes de nombrar cualquier cosa:** `references/glosario.md`. No inferir del copy vecino — el copy vecino puede estar en deriva, y la deriva se imita sola.

El patrón que más se rompe es confundir **el sujeto**, **el proceso** y **la evidencia**. Un ejemplo de cómo resolverlo:

| Término | Nombra | No confundir con |
|---------|--------|------------------|
| **Contraparte** | El sujeto: quien **actúa** | El proceso |
| **Vinculación** | El proceso: lo que se **crea** y avanza | El sujeto |
| **Expediente** | La evidencia: lo que se **consulta** y archiva | El proceso |

> «Nueva vinculación» (se crea un proceso) · «La contraparte está diligenciando» (el sujeto actúa) · «El expediente está bloqueado» (la evidencia)

**Regla de mantenimiento:** un término nuevo entra al glosario **en el mismo commit** que lo introduce. Si no, el glosario queda atrás en una semana y deja de ser fuente de verdad.

---

## Reglas mecánicas

1. **Sentence case en todo** — botones, títulos, labels, columnas. Mayúscula solo para nombres propios y siglas establecidas. No: `Nueva Vinculación`.
2. **Sin signos de exclamación** en temperatura fría y neutra (el 95% del producto). `¡Copiado!` → `Copiado`. **Emoji, nunca** — cada excepción necesita su propia aprobación y no sienta precedente.
3. **Sin punto final** en botones, labels, títulos y textos de una sola oración corta. Con punto en descripciones de dos o más oraciones.
4. **Sin «por favor»** ni fórmulas de cortesía de relleno. La cortesía está en ser claro.
5. **Cifras, no palabras:** `3 hallazgos`, no `tres hallazgos`. Excepción: nombres establecidos donde el número es parte del nombre (`verificación en dos pasos`).
6. **Voz activa, sin personificar el sistema.** Los errores usan **«No fue posible…»**. Nunca se atribuye culpa: ni `Ingresaste un dato inválido` ni `El usuario no diligenció el formulario`.
7. **Puntos suspensivos** solo para un estado en curso (`Esperando respuesta…`), nunca en botones. Siempre la elipsis unicode `…`, nunca tres puntos ASCII.
8. **Redacción impersonal.** Ni `tú`/`usted` ni `nosotros`. Recursos: infinitivo (`Guardar`), pasiva refleja (`Se enviará el formulario`), sintagma nominal (`Contraseña`), `No fue posible…`.
9. **Acciones en infinitivo**, nunca en imperativo: `Crear vinculación`, no `Crea una vinculación`.

---

## Verbos de acción

Un acto, un verbo, siempre en infinitivo. La ambigüedad entre «eliminar» y «quitar» es la que más daño hace: una destruye el dato y la otra no.

| Verbo | Significa | No usar por |
|-------|-----------|-------------|
| **Eliminar** | Destruye el dato de forma permanente | Borrar, Remover |
| **Quitar** | Saca de una selección o asociación; el dato sigue existiendo | Eliminar |
| **Descartar** | Abandona algo no guardado (un borrador, cambios sin aplicar) | Cancelar |
| **Crear** | Da origen a una entidad nueva | «Nuevo/Nueva» como verbo |
| **Agregar** | Suma un elemento a una colección existente | Añadir |
| **Ver** | Abre una vista de solo lectura | Consultar, Revisar |
| **Revisar** | Acto de juicio sobre un caso | Ver |

---

## La regla de temperatura

Casi todas las guías de voz dicen «sé cercano pero profesional» y no ayudan a decidir nada. Esta regla sí decide:

> **La personalidad del texto es inversa a lo que el usuario se juega en ese momento.**

| Temperatura | Cuándo | Cómo suena |
|---|---|---|
| **Fría** | Decisiones con consecuencias, errores, confirmaciones destructivas, bloqueos, documentos formales, alertas | Solo hechos y siguiente paso. Un guiño aquí destruye la confianza |
| **Neutra** | El 90% del producto: labels, tablas, formularios, toasts, estados, filtros | Acción primero, corto, impersonal. Sin adornos ni frialdad de manual |
| **Cálida** | Login, bienvenida, primer estado vacío, onboarding, éxito de un flujo largo, 404, email de invitación | Aquí vive la marca: un guiño, ritmo, calidez explícita |

**La tabla manda por categoría; la prueba resuelve lo no listado:** ¿está por decidirse algo con consecuencias para una persona real, o algo acaba de salir mal? → fría.

---

## Principios de voz

Detalle, excepciones a la impersonalidad y antes/después: `references/voz.md`. En corto:

1. **La acción primero.** `Crear vinculación`, no `Comienza creando tu primera contraparte para gestionar el proceso`. Nunca abrir con relleno (`Aquí puedes…`, `Este módulo permite…`).
2. **Corto de verdad.** Botón ≤ 3 palabras · título ≤ 4 · estado vacío, hint o toast: 1 oración · error o bloqueo: 2 · email: 4.
3. **El enemigo es la complejidad, nunca el lector.** Un error dice qué pasó y qué sigue, sin señalar responsable.
4. **Nombrar humano.** Impersonal no es burocrático: `En revisión`, no `Estado: no conforme`.

---

## Inglés (si el producto es bilingüe)

Detalle, glosario EN y reglas de plain English: `references/ingles.md`. En corto: voz propia, **no traducción**. `Your session will close due to inactivity` es español con palabras inglesas; un nativo escribe `You'll be signed out in 5 min`.

**La asimetría con el español es deliberada: el inglés sí usa segunda persona.** GOV.UK, en el contexto más regulado que existe, lo manda: *«Address the user as "you" where possible.»* En español, `tú`/`usted` obliga a marcar cercanía o distancia; en inglés, `you` es neutro y evitarlo produce burocracia.

- **Sin contracciones negativas** (`can't`, `don't`). GOV.UK: *«Many users find them harder to read, or misread them as the opposite of what they say.»* Un `don't` mal leído invierte una advertencia. Usar `cannot`, `could not`. Las positivas (`you'll`, `we'll`) sí.
- **Plain English:** nada de `leverage`, `facilitate`, `utilize`, `in order to`, `robust`, `seamless`.
- Sentence case, sin exclamaciones ni emoji, y los mismos techos de longitud.

**Paridad total de claves entre idiomas.** Ningún string nuevo se entrega en un solo idioma.

---

## Qué NO hacer

- NO nombrar algo sin consultar el glosario.
- NO usar jerga del dominio en superficies de usuario externo.
- NO usar `Confirmar` o `Aceptar` como botón de una acción destructiva — el botón repite el verbo real (`Eliminar lista`).
- NO tutear ni ustedear en español, en ninguna superficie.
- NO usar imperativo en un botón (`Crea`, `Guarda`) — infinitivo siempre.
- NO culpar a nadie en un mensaje de error.
- NO poner un guiño, una exclamación ni un emoji en temperatura fría.
- NO agregar un término nuevo sin agregarlo al glosario en el mismo commit.
- NO añadir copy que el requerimiento no pidió — un banner, toast o mensaje «que parece buena idea» es una **decisión de producto**: se propone, no se implementa por iniciativa propia.
- NO hacer que el sistema se narre a sí mismo. Las acciones automáticas ocurren en silencio. Si el usuario necesita saber el origen, lo cuenta un dato estructurado (un chip, un timestamp, un actor), nunca un párrafo firmado por «Sistema».
- NO poner trazabilidad interna en copy visible — números de ticket, nombres de scripts, «backend/frontend». **Prueba de fuego:** si la frase le sirve a un desarrollador para entender el código, es un comentario de código disfrazado.

---

## Enforcement

Una skill que sólo se carga cuando alguien se acuerda no gobierna nada. Tres anclas, en orden de eficacia:

1. **El checklist de merge de la guía de diseño** incluye un ítem que remite a esta skill: todo string nuevo pasa por aquí antes del merge. Sin ese ítem, el copy se escribe primero y se revisa nunca.
2. **El gate de copy de `protocolo-features`** (paso 6 de la secuencia de implementación): si el frontend lo escribe un agente separado, la instrucción de cargar esta skill va explícita en su prompt.
3. **La línea base de `references/deuda-conocida.md`**: si los conteos vuelven a medirse y subieron, la skill no se está aplicando. Es la métrica más barata que existe.

Y una regla de coherencia: si la guía de diseño prescribe otra persona gramatical u otro tono en alguna superficie (un panel de bienvenida que «tutea», por ejemplo), **se alinea la guía**, no se hace la excepción en silencio. Dos fuentes que se contradicen son la deriva que esta skill combate.

---

## Auditoría y reescritura

**El skill gobierna lo nuevo.** El copy existente no se reescribe en campaña. La deuda medida vive en `references/deuda-conocida.md`, con el método para medirla.

Cuando toque una reescritura, va **por lotes de una sola familia** (solo los verbos de acción, o solo un término mal usado), con el diff a la vista y aprobación **antes** de tocar archivos. Nunca un barrido completo: un error de criterio se propagaría a todo el producto de golpe.

---

## Referencias

- `references/glosario.md` — Plantilla del glosario canónico: entidades, estados, verbos de acción, términos prohibidos, vocabulario del registro externo.
- `references/voz.md` — Cómo derivar la voz del producto de la de la marca, la redacción impersonal y sus tres excepciones, la regla de temperatura, antes/después.
- `references/superficies.md` — Patrones por tipo de texto: botón, título, vacío, error, carga, toast, confirmación destructiva, label, email, aria-label, PDF, portal.
- `references/ingles.md` — Voz en inglés, la asimetría con el español, glosario EN, plain English.
- `references/deuda-conocida.md` — Cómo medir la deuda de copy, plantilla de registro y orden de los lotes.
- Skill `protocolo-ux` — Comportamiento (cuándo modal, cuándo página). Esta skill no lo duplica.
- Skill `i18n` — Mecánica: dónde vive cada string.

---

## Adaptación a tu proyecto

1. **El glosario es 100% tuyo.** Los términos de ejemplo son de un dominio de compliance — reemplázalos por los tuyos. Lo que se hereda es el método: identificar los términos que se confunden entre sí y resolverlos por escrito.
2. **La regla de temperatura es transferible tal cual.** Solo ajusta qué superficies caen en cada categoría.
3. Define tus registros por audiencia antes de escribir el primer string. Si tu producto solo tiene un tipo de usuario, elimina esa sección.
4. Si el producto es monolingüe, elimina la sección de inglés y `references/ingles.md`.
5. Las referencias son plantillas con ejemplos: se rellenan con el producto real, y `deuda-conocida.md` se llena la primera vez que se mide. Una referencia vacía no le sirve a nadie; una con los términos de otro producto, menos.
