# Inglés

Voz propia, **no traducción**. El inglés no calca la sintaxis española.

Referentes: la [guía de estilo de GOV.UK](https://www.gov.uk/guidance/style-guide) (plain English en el contexto más regulado que existe), la [guía de voz y tono de Mailchimp](https://styleguide.mailchimp.com/voice-and-tone/), y el vocabulario estándar **de tu dominio en inglés**, que no es la traducción literal del español.

---

## La asimetría con el español es deliberada

El español del producto es **impersonal**. El inglés **sí usa segunda persona**. No es una inconsistencia: son normas distintas de cada lengua.

> GOV.UK, que publica trámites legales y regulatorios: **"Address the user as 'you' where possible."**

En español, `tú` marca cercanía y `usted` marca distancia: hay que elegir, y se elige no elegir. En inglés `you` es neutro: no marca ni cercanía ni distancia. Evitarlo no produce neutralidad, produce burocracia (`The form must be completed by the entity` vs `Complete the form`).

| ES (impersonal) | EN (segunda persona) |
|---|---|
| `La sesión se cerrará en {minutes} min` | `You'll be signed out in {minutes} min` |
| `Contraseña` | `Password` |
| `El documento puede consultarse, no editarse` | `You can view the document, but not edit it` |
| `Se enviará el formulario a este correo` | `We'll send the form to this address` |

**`We` sí se usa en inglés**: es la contraparte natural de `you`, y asume responsabilidad en los errores: `We could not load the records`. (En español ese «nosotros» está prohibido.)

## Reglas

1. **Second person, active voice.** GOV.UK: *"Use the active voice rather than the passive voice."*
2. **Sin contracciones negativas.** GOV.UK: *"Avoid negative contractions like can't and don't. Many users find them harder to read, or misread them as the opposite of what they say. Use cannot, instead of can't."* En un producto con consecuencias, un `don't` mal leído invierte una advertencia.
   - ✅ `We could not verify the document` · `This action cannot be undone`
   - ❌ `We couldn't verify the document` · `Can't scan?`
3. **Contracciones positivas sí** (`you'll`, `it's`, `we'll`): dan ritmo y calidez sin ambigüedad.
4. **Plain English obligatorio.** Evitar: `leverage`, `facilitate`, `utilize`, `in order to`, `pursuant to`, `herein`, `aforementioned`, `commence`, `terminate` (usar `end`), `deliver` (salvo para cosas físicas), `robust`, `seamless`.
5. **Sentence case, sin exclamaciones, sin emoji**, igual que en español.
6. **Los techos de longitud son los mismos**, y el inglés suele salir más corto. Si una cadena EN quedó más larga que la ES, revisar.
7. **La regla de temperatura aplica igual.** Mailchimp lo formula bien: *"We prefer winking to shouting"* y *"If you're unsure, keep a straight face."*

## Glosario EN

Cada término del glosario canónico tiene su equivalente en inglés, **fijado una vez**. La trampa es el falso amigo: la palabra inglesa que se parece a la española y significa otra cosa. Antes de fijar un término, buscar cómo lo llama el estándar del dominio en inglés (la regulación, la norma, los productos de referencia), no el diccionario.

| ES | EN | Nota |
|---|---|---|
| {proceso} | **{term}** | Comprobar el término del sector, no traducir |
| {sujeto} | **{term}** | Caso típico de falso amigo: la palabra que «suena» a la española suele significar *homólogo* o *equivalente*, no la parte de una relación |
| {evidencia} | **case file** | `file` a secas es ambiguo (archivo o expediente) |
| {resultado de una verificación} | **finding** | Un solo término, como en ES; `match` y `hit` son jerga técnica |
| {sigla del dominio en español} | **{sigla en inglés}** | Una sigla española no significa nada en inglés; se usa la del estándar internacional |
| {término legal local} | **{equivalente llano}** | Un término jurídico local no se entiende fuera de su país; se explica en llano |
| alerta | **alert** | Igual |

**Las claves NO cambian.** Los identificadores de traducción son código: solo se traduce el valor visible. Renombrar una clave para que «suene» en inglés rompe el frontend sin mejorar nada.

## Antes / después

| EN hoy | Con voz |
|---|---|
| Your session will close due to inactivity in {minutes} min | You'll be signed out in {minutes} min |
| We couldn't reach the service. Your session is still active — try again in a moment. | We could not reach the service. Your session is still active. |
| These rows will not be processed. Fix them in your file and upload it again to include them. | These rows will not be processed. Fix them and upload the file again. |
| Can't scan? Show the setup key | Cannot scan? Show the setup key |
| Couldn't verify | Could not verify |
| Don't have access? Contact your organization admin. | Need access? Contact your organization admin. |

## Paridad

Ningún string nuevo se entrega en un solo idioma. La paridad de claves se verifica con un check, no de memoria (ver skill `i18n`). Y una cadena idéntica en los dos idiomas no siempre es un error (`PEP`, un nombre propio), pero sí es sospechosa: revisar antes de asumir.
