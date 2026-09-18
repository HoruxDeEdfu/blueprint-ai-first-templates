# TECH_NOTES.md — Template reutilizable

> Este template define la estructura del catálogo de cicatrices técnicas de un
> proyecto construido con AI coding agents: lo que costó horas resolver y ya
> está resuelto, guardado para que ninguna sesión futura lo pague dos veces.
>
> **Principio:** Este archivo guarda **cicatrices, no reglas**. Una regla que la
> AI violaría hoy va al `AGENTS.md`; el porqué de una decisión va al `docs/ADR.md`;
> acá va el síntoma que engañó, la causa que nadie vio y la solución que sirvió,
> con fecha, para poder podarlo cuando la librería cambie de versión.
>
> **No se carga cada turno.** Es referencia bajo demanda: el `AGENTS.md` manda
> acá con «Ver TECH_NOTES §{stack}» y la AI lo abre sólo cuando lo necesita.
> Por eso puede crecer sin límite de líneas, a diferencia del `AGENTS.md`.

---

## Cómo usar este template

1. Copiar este archivo como `docs/TECH_NOTES.md` en el proyecto
2. Reemplazar los placeholders `{...}` y borrar el ejemplo de la sección 2
3. Declararlo en `AI-FIRST.md` bajo `artefactos.tech_notes` para que el
   detector verifique que las rutas que menciona existen
4. Agregar una entrada **al cerrar la sesión** en que apareció la cicatriz,
   siguiendo el enrutamiento del protocolo de cierre: un aprendizaje va a **un**
   destino, no a todos
5. Eliminar las notas del final (`# Notas sobre el template`) cuando el
   documento esté en uso

---

# TECH_NOTES — {Nombre del Proyecto}

> Catálogo de cicatrices técnicas ya resueltas. **No se carga cada turno**; es
> referencia bajo demanda.
>
> **Cuándo consultar:** al configurar un stack nuevo, al reproducir un bug de
> setup, al migrar una librería, o cuando el `AGENTS.md` mande acá con
> «Ver TECH_NOTES §{stack}».
>
> **Cuándo NO agregar acá:** una regla activa del proyecto va al `AGENTS.md`,
> sección «Qué NO hacer». El filtro: *¿remover esto haría que la próxima sesión
> cometa un error ahora mismo?* Si la respuesta es inmediata, es regla. Si hay
> que pensarla, es cicatriz y va acá.
>
> **Formato:** cada entrada cita la fecha en que apareció, el síntoma observado,
> la causa y la solución. Así se puede podar cuando la librería o la versión se
> deprecia.

---

## 1. Cómo se lee este archivo

- **Las entradas nuevas van arriba.** Lo más reciente es lo más probable que
  vuelva a pasar; lo viejo baja solo.
- **El título es el síntoma, no la causa.** Quien llega acá viene con un error
  en pantalla y busca por lo que ve. Empezar el título por el stack permite
  buscarlo con `grep` sin leer el resto.
- **Una entrada, una cicatriz.** Si un mismo fix enseña dos cosas distintas,
  son dos entradas.
- **Cada entrada trae fecha y origen** ({sesión, cambio o incidente}). Sin fecha
  no se puede saber si aplica a la versión actual.

### 1.1 Índice por stack [OPCIONAL — cuando pase de ~30 entradas]

| Stack | Entradas |
|---|---|
| {ORM} | {títulos abreviados o anclas} |
| {Framework frontend} | {…} |
| {Framework backend} | {…} |
| {Testing} | {…} |
| {Infraestructura / CI} | {…} |

---

## 2. Cicatrices

<!-- Entradas nuevas ARRIBA. Borrar el ejemplo al agregar la primera real. -->

## {Stack}: {síntoma o regla en una línea} ({fecha}, {sesión N / CHG-XXX})

**Síntoma:** {qué se vio: el mensaje de error literal, el comportamiento
observado, en qué ambiente. Textual, para que `grep` lo encuentre.}

**Causa:** {qué pasaba de verdad, y por qué el síntoma no lo delataba.}

**Solución:** {qué se hizo. Comando, cambio de configuración o patrón de
código, en bloque de código si es más de una línea.}

**Cómo distinguirlo de {el error parecido}:** {si hay otro fallo con el mismo
síntoma y otra causa, cómo saber cuál de los dos es. Opcional, pero es la parte
que más tiempo ahorra.}

**Regla:** {si la cicatriz deja una regla operativa —«después de X, correr Y»—,
una sola línea. Si la regla es activa y la AI la violaría hoy, va también al
`AGENTS.md` y acá queda el porqué.}

---

### Ejemplo de entrada completa

```markdown
## Prisma 7: `prisma generate` actualiza los TIPOS pero no el cliente que corre (2026-09-14, sesión 616, CHG-377)

**Síntoma:** después de agregar una columna y correr `prisma generate`,
`tsc --noEmit` pasa limpio pero un script revienta en runtime con
`Unknown field 'has_finding' for select statement on model 'Record'`.
El mismo campo que TypeScript acepta, el cliente no lo conoce.

**Causa:** el `package.json` del paquete resuelve `types` a `generated/` y
`default` a `dist/`. `prisma generate` reescribe `generated/`; `dist/` sólo
se actualiza con el build del paquete. Tipos y runtime salen de archivos
distintos, así que el typecheck no puede detectar el desfase.

**Solución:** después de `prisma generate`, `pnpm --filter @proyecto/prisma build`.

**Cómo distinguirlo del otro error parecido:** si el mensaje viene del
validador del cliente («Unknown field … Available options are marked
with ?») falta el build. Si viene del adaptador de Postgres, el cliente ya
conoce el campo y lo que falta es la migración aplicada en esa base.
```

---

## 3. Poda

Este archivo tiene permiso de crecer, pero no de mentir. Una entrada se borra
cuando:

- la librería o la versión que la causó ya no está en el proyecto;
- el fix quedó automatizado (un script, un hook, un test) y ya nadie puede
  volver a pisar la trampa;
- una entrada más nueva la supera. En ese caso la nueva dice «supera a la del
  {fecha}» y la vieja se borra, al revés que en el `docs/ADR.md`, donde la fila
  vieja se queda.

Revisar la poda al cambiar una versión mayor de cualquier dependencia. Es el
momento en que más entradas caducan a la vez.

---

# Notas sobre el template

## Qué va acá y qué no

| Tipo de aprendizaje | Destino |
|---|---|
| Invariante arquitectónico **activo**, que la AI violaría hoy | `AGENTS.md`, sección «Qué NO hacer» |
| **Por qué** se eligió algo y qué se descartó | `docs/ADR.md`, fila nueva |
| Cicatriz de stack: fix de una librería, una versión, un entorno | **Este archivo**, una entrada |
| Regla visual, microinteracción o UX | Guía de diseño, sección «Gotchas» |
| Decisión de un módulo específico | La spec de ese módulo |

Las cinco filas son las del protocolo de cierre. Un aprendizaje va a **un**
destino. Si termina en dos, uno de los dos va a quedar desactualizado.

## De dónde sale este formato

En un proyecto real de cinco meses, este archivo recibió 150 commits y llegó a
unas 1.600 líneas con más de cien entradas: es el segundo documento más editado
del repositorio, después del inventario de componentes. Pasó por dos formatos:

1. **Viñetas agrupadas por stack** («pnpm 10», «Zod 4», «Prisma 7»), una línea
   por gotcha. Funciona los primeros dos meses. Después las viñetas crecen
   hasta ser párrafos, y una viñeta no tiene dónde poner el síntoma literal ni
   la fecha.
2. **Una entrada por cicatriz**, con título largo (stack + síntoma + fecha +
   origen) y cuerpo en Síntoma / Causa / Solución. Es el formato que se
   sostuvo. El título largo parece feo hasta que se busca con `grep` un
   mensaje de error a las once de la noche.

Este template arranca directamente en el segundo formato.

## Por qué el título lleva fecha y origen

Sin fecha, una entrada sobre «Next.js» no dice si aplica a la versión 14 o a
la 16, y nadie se anima a borrarla. Con fecha, y con el cambio o la sesión que
la originó, se puede seguir el hilo hasta el commit que la resolvió y decidir
con evidencia si sigue viva. La poda es lo que separa un catálogo de una
lista de miedos acumulados.

## Por qué no se carga cada turno

El `AGENTS.md` tiene techo porque cada línea que la AI lee en cada turno
compite con las demás. Este archivo no tiene techo porque **no se lee en cada
turno**: se abre cuando hay un síntoma que buscar. Esa asimetría es lo que
permite mover al `AGENTS.md` sólo las reglas activas y dejar acá todo lo
demás sin perderlo. Mezclar los dos —reglas activas acá, o cicatrices en el
`AGENTS.md`— rompe las dos cosas a la vez.
