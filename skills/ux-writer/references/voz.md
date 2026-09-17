# Voz

La voz del producto se deriva de la voz de la marca y se adapta al hecho de que esto es una **herramienta de trabajo**, no una landing. Este archivo fija cómo se hace esa derivación; los rasgos concretos son de cada marca.

---

## Los rasgos de la marca

Anotar aquí los rasgos declarados por quien decide el producto, en tres o cuatro líneas, con la forma «X, pero no Y»:

1. **Profesional sin tecnicismos.** El término técnico solo aparece si el lector ya lo usa en su oficio.
2. **{Rasgo de personalidad} en momentos clave** — nunca fuera de lugar. Es un guiño, no un chiste.
3. **Conciso, cero explicativo.** Textos cortos y directos. Se explica solo cuando de verdad hace falta, y en pocas palabras.

## Redacción impersonal

**Regla base del producto en español: no se tutea ni se ustedea.** Ni segunda persona (`tu`, `tú`, `usted`, `puedes`, `revisa`), ni primera persona plural (`enviaremos`, `no pudimos`). El texto describe hechos y acciones, no interpela a nadie.

Aplica a **todas** las superficies, incluidos portal externo y emails. Elegir entre `tú` y `usted` obliga a marcar cercanía o distancia con cada lector; no elegir evita el problema.

Cuatro recursos para lograrlo:

| Recurso | Ejemplo |
|---|---|
| **Infinitivo** en acciones | `Guardar` · `Crear registro` · `Recuperar contraseña` |
| **Pasiva refleja con «se»** | `Se enviará el formulario a este correo` · `No se han ejecutado verificaciones` |
| **Sintagma nominal** para labels y estados | `Contraseña` · `Pendiente de revisión` · `3 resultados` |
| **«No fue posible…»** para errores | `No fue posible cargar los registros` |

**Excepciones categóricas** —no se resuelven caso por caso; son estas tres y ninguna más:

1. **Declaraciones de consentimiento y manifestaciones del titular.** Van en **primera persona**, porque esa es la fórmula jurídica: quien marca la casilla afirma algo sobre sí mismo. Pasarlas a impersonal debilita la declaración y vuelve ambiguo quién declara; es un problema legal, no de estilo.
   - ✅ `Acepto el tratamiento de mis datos personales de acuerdo con lo informado.`
   - ❌ `Se acepta el tratamiento de los datos personales.`
2. **Campos donde el posesivo desambigua** de quién son los datos declarados en un formulario. Si quitarlo no genera ambigüedad, se quita.
3. **El saludo nominal** (`Hola, {nombre}`). Un vocativo no es segunda persona gramatical: no pide nada, no atribuye posesión y no obliga a elegir entre `tú` y `usted`. Lo que sí es deuda es el texto que lo acompaña si tutea (`Aquí verás el estado de tus registros` → `Estado de los registros y las alertas`).

> **Lo impersonal suele ser más corto.** `Tu contraseña` → `Contraseña`. `Puedes consultar el documento pero no editarlo` → `El documento puede consultarse, no editarse`. Si la versión neutra salió más larga y pesada, está mal resuelta: casi siempre falta cortar, no falta persona.

## Cómo suena: cuatro reglas

### 1. La acción primero

- ✅ `Crear registro` · `Nuevo registro`
- ❌ `Comienza creando tu primer registro para gestionar el proceso`

Nunca abrir con relleno (`Aquí puedes…`, `En esta sección…`, `Este módulo permite…`).

### 2. Corto de verdad

| Superficie | Techo |
|---|---|
| Botón | 3 palabras |
| Título | 4 palabras |
| Descripción de vacío, hint, toast | 1 oración |
| Aviso de bloqueo, error, confirmación destructiva | 2 oraciones |
| Cuerpo de email | 4 oraciones |

Si hace falta más, casi siempre es que el texto está explicando algo que la interfaz debería mostrar. Única excepción: el texto para lectores de pantalla (ver `superficies.md`).

### 3. El enemigo es la complejidad, nunca el lector

El producto está del lado de quien lo usa, contra el trabajo tedioso. Eso significa no atribuir culpa jamás:

- ✅ `No fue posible cargar los registros`
- ❌ `Ingresaste un dato inválido` · `El usuario no completó el formulario`

Un error dice **qué pasó** y **qué sigue**, sin señalar responsable.

### 4. Nombrar humano

Impersonal no es burocrático. Se elige la palabra que usaría una persona hablando, no la del manual:

- ✅ `Esperando respuesta` · `En revisión` · `Sin resultados`
- ❌ `Pendiente de recepción documental por parte del tercero` · `Estado: no conforme`

## La regla de temperatura

La personalidad va «en momentos clave». Esta regla decide cuáles:

> **La personalidad del texto es inversa a lo que se juega en ese momento.**

| Temperatura | Cuándo | Cómo suena |
|---|---|---|
| **Fría — cero personalidad** | Resultados de una verificación, decisión de aprobar o rechazar, errores, confirmaciones destructivas, bloqueos, documentos formales, alertas | Solo hechos y siguiente paso. Ni un adjetivo de más. Aquí un guiño destruye la confianza |
| **Neutra — sobria y directa** | El 90 % del producto: labels, tablas, formularios, toasts, estados, filtros | Acción primero, corto, impersonal. Sin adornos ni frialdad de manual |
| **Cálida — cabe el guiño** | Login, bienvenida, vacío de primera vez, onboarding, éxito de un flujo largo, 404, email de invitación | Aquí vive la marca: ritmo, una frase con gracia, calidez explícita |

**La tabla manda por categoría; la prueba resuelve lo que la tabla no lista.** Si una superficie aparece en la tabla, esa es su temperatura y no se discute. Para lo no listado: **¿está por decidirse algo con consecuencias para una persona real, o algo acaba de salir mal?** → fría.

Matiz en destructivas: la tabla las marca frías porque la mayoría destruye trabajo o afecta a terceros. Una destructiva sin consecuencia real (descartar un borrador propio, quitar un filtro guardado) es **neutra**: sigue sin guiño, pero no necesita el peso de una advertencia.

La calidez sin tuteo se logra con **ritmo y elección de palabra**, no con familiaridad:

- ✅ (cálida) `Aún no hay registros. El primero empieza aquí.`
- ✅ (fría) `3 resultados requieren revisión antes de aprobar.`
- ❌ (fría mal calibrada) `¡Ups! Aparecieron algunas cositas 👀`

## Exclamaciones y emoji

El sitio de marketing de la marca los usa porque su copy es de marketing y su público masivo. **La herramienta no.**

- **Prohibidos** en temperatura fría y neutra: el 95 % del producto.
- **Una exclamación** permitida en temperatura cálida, si de verdad aporta. Nunca dos en la misma pantalla.
- **Emoji: nunca** en la aplicación. Si quien decide el producto aprueba uno, es una excepción declarada aquí, con fecha, y no sienta precedente. Va `aria-hidden`: es decoración.

Un toast no celebra: `Registro creado`, no `¡Registro creado!`.

## Cierres de flujo

Las muletillas de cierre de la marca (`…y listo`, `¡Todo listo!`) prometen un final que el sistema muchas veces no garantiza: después del envío viene la revisión, y después de la revisión puede venir una solicitud de más información. Se conserva el impulso (cierre corto, sin ceremonia), no la fórmula. Mejor aún: decir qué sigue.

- ✅ `Información recibida. {Organización} revisará los datos.`
- ❌ `Formulario enviado y listo.` · `¡Todo listo!`

## Qué NO se transfiere del sitio de marketing

El sitio vende a un público masivo. La herramienta es el lugar de trabajo de quien toma decisiones con consecuencias.

| En el sitio | En la herramienta |
|---|---|
| Tuteo imperativo (`Envía`, `Hazlo`) | Impersonal: infinitivo o pasiva refleja |
| Exclamaciones frecuentes | Solo temperatura cálida, una por pantalla |
| Emoji, hashtags | Nunca en la app |
| Metáforas de campaña | No se usan: son de la campaña, no del producto |
| Muletillas de cierre | No se usan: en la herramienta ningún flujo cierra ahí |
| Superlativos y promesa comercial | Nunca. El producto informa, no vende |
| Juego de palabras en titulares | Solo en temperatura cálida |

Lo que **sí** se transfiere completo: la acción primero, brevedad radical, cero tecnicismos, el enemigo es la complejidad, nombrar humano.

> El producto suena más sobrio que la marca. Es deliberado.

## Antes / después

Registrar aquí pares reales del propio producto: son el argumento más rápido cuando alguien discute una regla.

| Hoy | Con voz |
|---|---|
| Comienza creando tu primer registro para gestionar el proceso. | Crear el primero para empezar a gestionar el proceso. |
| Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña. | Se enviará un enlace de recuperación al correo registrado. |
| ¿Olvidaste tu contraseña? | Recuperar contraseña |
| Tu contraseña | Contraseña |
| Tu sesión se cerrará por inactividad en {minutes} min | La sesión se cerrará por inactividad en {minutes} min |
| No pudimos contactar al servicio. Tu sesión sigue activa — reintenta en un momento. | No fue posible contactar el servicio. La sesión sigue activa. |
| Este registro está en revisión. Puedes consultar el documento pero no editarlo. | Registro en revisión. El documento puede consultarse, no editarse. |
| Estas filas no se procesarán. Corrígelas en tu archivo y vuelve a cargarlo. | Estas filas no se procesarán. Para incluirlas, corregir el archivo y cargarlo de nuevo. |
| ¡Gracias por completar el formulario! Tu información fue recibida. | Información recibida. {Organización} revisará los datos. |
| El destinatario ya no podrá usar el link enviado. Tendrás que enviar uno nuevo. | El link enviado dejará de funcionar. Se requiere enviar uno nuevo. |
