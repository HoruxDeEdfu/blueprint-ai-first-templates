---
name: test-fix
description: "Corre los tests del alcance que la sesión tocó —unitarios e integración siempre; de extremo a extremo (E2E) sólo bajo decisión explícita—, clasifica cada falla en mecánica (se corrige sin preguntar) o de negocio (se pregunta), aplica la corrección mínima, con un tope de dos rondas, y corre la suite completa una sola vez al final. Activar después de implementar un feature o un cambio, cuando la suite falla y hay que diagnosticar, o como verificación antes del cierre de sesión."
---

## Cuándo activar

- Después de implementar un feature (pasos 8 y 9 de `protocolo-features`)
- Después de aplicar un cambio formal (`protocolo-cambios`)
- Cuando la suite falla y hay que diagnosticar y corregir
- Como verificación de regresión antes de `protocolo-cierre`

**NO activar** sólo para ver si los tests pasan sin intención de corregir: para
eso está el comando de test. Ni para cambios sin superficie de usuario cuando
se trata de la parte E2E: ahí la parte unitaria alcanza.

---

## El principio

**Los tests son la especificación.** Un test que falla dice una de dos cosas:
el código está mal, o el requerimiento cambió y el test quedó viejo. La
primera la corrige el agente. La segunda la decide el humano, porque cambiar un
test para que pase es cambiar lo que el sistema promete.

Esta skill existe para que esa frontera sea explícita: qué se corrige sin
preguntar, qué se pregunta, y cuándo se para.

---

## Secuencia

### Paso 0 — Entorno limpio

Una corrida interrumpida (timeout de un agente, terminal cerrada) puede dejar
procesos de test vivos. No se ven, ocupan memoria, y la corrida siguiente
compite contra ellos y tarda el doble sin causa aparente. Medido en un proyecto
real: con trece procesos huérfanos, la suite pasó de 8 a 17 minutos.

```bash
{comando que mata los workers huérfanos del runner}
```

Es la primera sospecha cuando los tiempos no cuadran.

### Paso 1 — Alcance

Qué tocó la sesión:

```bash
git diff --name-only HEAD   # preparados
git diff --name-only        # sin preparar
git status --short          # incluye sin seguimiento
```

Clasificar los archivos por paquete o módulo: cada uno tiene su comando de test
(ver «Adaptación a tu proyecto»).

### Paso 2 — Correr el alcance, con la salida filtrada

**No correr los tests directamente en el contexto principal.** La salida
completa (tests que pasan, tiempos, cobertura) inunda el contexto y no aporta
nada a la corrección. Se delega a un agente o proceso aparte con este prompt:

```
Ejecuta el siguiente comando y captura la salida completa:
  {comando del paquete con las rutas del paso 1}

Devuelve ÚNICAMENTE los tests fallidos, con este formato exacto y nada más:

FAIL: [nombre completo del test]
Archivo: [ruta del archivo de test]
Error: [mensaje — máximo 5 líneas]
Stack: [líneas del stack que sean del código del proyecto — máximo 8]
---

Si todos pasan, devuelve sólo: ALL_PASS
No incluyas tests que pasan, tiempos, resumen de suite ni cobertura.
```

**El alcance, no todo.** El costo de una suite grande se paga por archivo, en
arrancar procesos y resolver imports, no en ejecutar. Medido: una suite de 348
archivos tardaba 167 s, de los que 39 s eran tests; un módulo solo bajaba a 93.
La suite completa se corre **una sola vez**, en el paso 6, con el alcance ya en
verde.

**Si el runner ofrece «sólo lo cambiado»**, medirlo antes de confiar: en el
mismo proyecto tardaba lo mismo que la suite entera porque construía el grafo
de módulos completo igual.

### Paso 3 — Clasificar cada falla

Por cada test fallido, uno de dos destinos:

#### Se corrige sin preguntar

| Falla | Corrección |
|---|---|
| Error de tipos: tipo incorrecto, import faltante, propiedad renombrada | Alinear |
| Mock obsoleto: cambió la firma del método | Actualizar el mock |
| Aserción de valor simple: campo renombrado, formato o mensaje cambiado | Actualizar la aserción |
| Snapshot viejo tras un refactor sin lógica nueva | Regenerar el snapshot |
| Clave de i18n faltante en el test | Agregarla |
| Ruta de import rota porque el archivo se movió | Corregir la ruta |
| Código nuevo sin test | Escribir el test |

#### Se pregunta antes de tocar

| Falla | Por qué no la decide el agente |
|---|---|
| El test espera A, el código devuelve B, y no está claro cuál es correcto | ¿Cambió el requerimiento o es un bug? Eso es negocio |
| La corrección exige entender una regla de negocio que el código no hace explícita | Adivinarla es inventar la spec |
| Hay dos o más formas válidas de corregir, con costos distintos | Es decisión de diseño |
| El test parece probar lo incorrecto desde el diseño | Cambiar el test es cambiar la promesa |
| Un mismo error raíz rompe cinco o más tests y la causa no es obvia | El diagnóstico manda antes que la corrección |
| La corrección cambiaría una interfaz o contrato que otros módulos usan | Es cambio de contrato |

Formato de la pregunta:

```
Test fallido: {nombre}
Archivo: {ruta}
Error: {mensaje}

El test espera: {X}
El código produce: {Y}

¿Cuál es el comportamiento correcto?
A) {opción, con su consecuencia}
B) {opción, con su consecuencia}
```

### Paso 4 — Corregir

Por cada falla mecánica:

1. Leer el test **y** la implementación.
2. Identificar exactamente qué cambió.
3. Corrección mínima. No refactorizar de paso.
4. No cambiar el comportamiento que el test prueba salvo que sea el punto.

Por cada falla que requirió pregunta: esperar la respuesta.

### Paso 5 — Volver a correr, mismo alcance

Con el patrón del paso 2 y **el mismo alcance**. Si una corrección tocó un
módulo fuera del alcance original, se agrega su ruta.

- `ALL_PASS` → paso 6.
- Fallas nuevas → volver al paso 3.
- **Máximo dos rondas.** Si después de la segunda quedan fallas, se reporta con
  diagnóstico y se para.

Dos rondas alcanzan para lo que esta skill corrige sin preguntar: mocks viejos,
renombres, imports movidos. Una falla que sobrevive a dos intentos ya no es de
esas; es ambigüedad de comportamiento o una decisión de negocio, y la tercera
ronda no converge: adivina. Se reporta y decide el humano.

### Paso 6 — Suite completa, una sola vez

Con el alcance en verde, recién acá se corre todo: la suite completa detecta
regresiones fuera del módulo tocado, y es el único punto donde se paga ese
costo. Mismo patrón de salida filtrada:

```
Ejecuta en secuencia:
  {comando de test completo}
  {typecheck}
  {lint}

Devuelve ÚNICAMENTE fallas y errores, con ruta, línea y mensaje.
Si los tres pasan, devuelve sólo: TESTS_OK / TYPECHECK_OK / LINT_OK
```

Si la suite completa está serializada a propósito (para no saturar la memoria
de la máquina), no paralelizarla a mano.

### Paso 7 — Reportar

```
✓ Tests: {N} pasando, 0 fallando
✓ Typecheck: sin errores
✓ Lint: sin advertencias

Correcciones aplicadas:
- {archivo}: {qué y por qué}

Preguntas que requirieron respuesta: {N}
Rondas: {N}/2
```

Si quedaron fallas:

```
✗ Tests: {N} pasando, {M} fallando — tope de rondas alcanzado

Fallas pendientes:
- {test}: {diagnóstico}

Decisión requerida: {qué decide el humano}
```

---

## La parte E2E

Los tests de extremo a extremo se corren **sólo bajo decisión explícita** del
humano, nunca como consecuencia automática de la parte unitaria: muchas tareas
no los necesitan y la suite retrasa la iteración. Cuando se corren, la parte
unitaria va siempre antes.

**Prerrequisitos.** Los servicios que la suite necesita tienen que estar
arriba. Si no lo están, la skill lo reporta y para; no los arranca a ciegas.

```bash
{comprobación de que la aplicación y la API responden}
```

**Evidencia.** Por cada test fallido: la captura de pantalla, si el runner la
generó, se **lee** antes de diagnosticar y se **borra** después de extraer lo
necesario; lo mismo con las trazas. Al terminar la ronda, limpiar el
directorio de resultados. El mensaje de error dice qué selector o qué aserción
falló; la consola del navegador, si hubo errores de JavaScript.

**Clasificación adicional.** A las tablas del paso 3 se suman:

| Se corrige sin preguntar | Se pregunta |
|---|---|
| Un `data-testid` renombrado o un elemento movido | El test espera que el usuario pueda hacer X y el código lo bloquea: ¿bug o cambio de requerimiento? |
| Un texto visible o una clave de i18n que cambió | Corregir exige elegir entre dos comportamientos de interfaz válidos |
| Una URL, ruta o redirección que cambió | Falla el flujo principal de una funcionalidad central |
| Un timeout en una operación que de verdad tarda más | Un error de autorización inesperado |
| Una fixture con un campo renombrado | Faltan datos de prueba y no es obvio cómo crearlos |

**Dónde se corrige.** Sólo en los archivos de test, **salvo que la falla revele
un bug real**. Si el test está bien y el código falla, se corrige el código, y
entonces se vuelve a la parte unitaria para verificar que la corrección no
rompió nada.

**Tests intocables.** Todo proyecto tiene tests que protegen una invariante de
seguridad o de aislamiento (que un usuario no vea datos de otro, que un rol sin
permiso no ejecute). Esos **no se ajustan**: si fallan, no es una corrección de
E2E, es un incidente. Se listan en la adaptación de esta skill.

---

## Reglas de corrección

- **Mínima.** Arreglar lo que falla, no lo que «se podría mejorar».
- **No cambiar tests para que pasen.** Sólo si el requerimiento cambió, y
  preguntando antes.
- **No suprimir.** Nunca `skip` como solución. Sólo si la funcionalidad se
  quitó del alcance, y entonces se borra el test, no se salta.
- **No mockear todo para evitar el problema.** Los mocks reflejan el contrato
  real.
- **Conservar cobertura.** Código que se borra se lleva sus tests; código que
  se agrega trae los suyos.
- **Respetar la arquitectura.** Si un test de la capa de dominio necesita mocks
  de infraestructura, hay un problema de diseño: se pregunta.
- **Causa raíz.** Si el selector falla porque el componente no renderiza, el
  problema no es el selector.
- **Reportar lo que se encontró de más.** Un bug que el test reveló y no era el
  objetivo se documenta antes de dejarlo pasar.

---

## Qué NO hacer

- NO correr los tests en el contexto principal: siempre con salida filtrada.
- NO correr la suite completa en cada ronda.
- NO pasar de dos rondas.
- NO correr E2E sin que el humano lo pida.
- NO cambiar una aserción de negocio sin preguntar.
- NO tocar un test que protege una invariante de seguridad.
- NO refactorizar mientras se corrige.

---

## Adaptación a tu proyecto

1. **Los comandos.** Por cada paquete o módulo: cómo se corre su suite con
   rutas, cómo se corre un archivo, cómo se regeneran snapshots, cómo se mide
   cobertura. Y los tres del paso 6: suite completa, typecheck, lint.
2. **El runner.** El formato de salida del paso 2 está pensado para runners
   que imprimen `FAIL` por test; si el tuyo imprime otra cosa, ajusta el prompt
   pero conserva la regla: sólo fallas, sin ruido.
3. **La delegación.** Si tu herramienta no tiene subagentes, corre el comando
   con el reporter más escueto y filtra la salida con `grep` antes de leerla.
   El objetivo es el mismo: que al contexto principal lleguen las fallas y nada
   más.
4. **Si la suite es chica** (menos de un minuto entera), el paso 2 puede correr
   todo desde el inicio y el paso 6 sobra. La regla de las dos rondas y la
   clasificación se conservan igual: no dependen del tamaño.
5. **Los tests intocables.** Lista con nombre y qué invariante protege cada uno.
6. **La parte E2E.** Los prerrequisitos concretos (puertos, servicios, datos
   semilla), dónde deja las capturas el runner, y si la suite arranca los
   servidores sola o los reutiliza.
7. **Los pasos de `protocolo-features` a los que responde**, si tu adaptación
   los renumeró.

Skills relacionadas: `protocolo-features` (la invoca en sus pasos 8 y 9),
`protocolo-cambios` (después de aplicar un cambio), `protocolo-cierre` (la
verificación previa al cierre).
