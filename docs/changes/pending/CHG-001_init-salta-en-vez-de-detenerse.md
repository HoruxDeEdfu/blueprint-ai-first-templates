# CHG-001: `init` salta lo que ya existe y sigue, en vez de detenerse

## Metadata

- **Fecha:** 2026-09-18
- **Solicitado por:** Descubrimiento propio, al configurar este repo a mano el
  2026-09-18 y al escribir la spec `docs/specs/init-completo.md`
- **Tipo:** Cambio de requerimiento
- **Estado:** Pendiente
- **Flujo:** corto
- **Migración de datos:** ninguna
- **Relación con otros cambios:** prerrequisito del feature `init` completo
  (`docs/specs/init-completo.md`, Dependencias)

## 1. Qué cambia

`ai-first init` sobre un repo que ya tiene `AI-FIRST.md` deja de terminar con
error. Reporta el archivo como **saltado (ya existe)**, sigue con el ADR —que
hoy ya salta si existe— y sale con 0. El mensaje de error actual desaparece;
en su lugar hay una línea de reporte por archivo.

## 2. Por qué cambia

El `init` completo (spec validada) se monta encima del mínimo y tiene que
poder correr sobre un repo ya configurado para añadir lo que falte: es el
criterio de aceptación número uno de la spec, y la regla de `AGENTS.md`
—«si el `init` completo no configura este repo, no está terminado»—. Con el
comportamiento de hoy, correrlo sobre este repo muere en la primera línea.

| Evidencia | Estado |
|---|---|
| `iniciar` en `src/init.ts` lanza `ErrorAiFirst` si `AI-FIRST.md` existe | Comprobado: líneas 240-243 |
| El ADR ya tiene la conducta deseada: si existe, no se escribe y no es error | Comprobado: `escaneo.adrExiste` |
| Prueba que fija el comportamiento actual | `test/init.test.ts`, «init nunca sobreescribe AI-FIRST.md», línea 95 |

## 3. Estado actual

`src/init.ts`, función `iniciar`: tras comprobar que es repo git, si
`existsSync(join(raiz, 'AI-FIRST.md'))` lanza
`ErrorAiFirst('Ya existe AI-FIRST.md. init no sobreescribe: edítalo a mano o bórralo antes.')`.
El CLI lo traduce a salida 2. La prueba de la línea 95 espera ese error con
`assert.rejects`. El ADR, en cambio, se salta sin error cuando existe y no
aparece en `escritos`.

## 4. Estado deseado

`iniciar` no lanza cuando `AI-FIRST.md` existe. En su lugar, el resultado
incorpora lo saltado: `ResultadoInit` gana `saltados: string[]` junto a
`escritos`, y `AI-FIRST.md` aparece ahí. El ADR existente pasa también a
`saltados`, que hoy simplemente no se menciona. Salida 0. El CLI imprime una
línea por archivo: `escrito AI-FIRST.md` / `saltado docs/ADR.md (ya existe)`.

**Lo que explícitamente no cambia:** nunca se sobreescribe nada (la regla de
ADR-003 sigue entera); qué se escanea y qué se genera; la validación con
`interpretar` antes de escribir; el error cuando no es un repo git.

## 5. Alternativas consideradas

- **Una flag `--continuar`:** mantiene el error por defecto y sigue sólo si se
  pide. Descartada: obliga al adoptante a saber que existe, y el caso «ya
  tengo `AI-FIRST.md`» va a ser el normal en cuanto el `init` instale skills.
- **Un subcomando nuevo (`init skills`, `setup`):** separa el mínimo del
  completo. Descartada en la spec: ADR-003 ya dijo que el completo se monta
  encima del mínimo, no al lado; dos comandos que hacen mitades de lo mismo
  son la clase de cosa que hay que explicar.

## 6. ¿Es una decisión arquitectónica?

Sí. Supera la parte de ADR-003 que dice «si `AI-FIRST.md` existe, se detiene».
Es difícil de revertir una vez publicado —quien corra `init` dos veces y espere
el error no lo tendrá— y tuvo alternativas reales.

**Decisión:** sí → ADR-017

## Archivos afectados

- [ ] `src/init.ts` — `iniciar` deja de lanzar; `ResultadoInit` gana `saltados`
- [ ] `test/init.test.ts` — la prueba de la línea 95 pasa a comprobar que salta
  y sale bien; la del ADR existente comprueba que aparece en `saltados`
- [ ] `src/cli.ts` — imprime escritos y saltados; la ayuda deja de prometer el error
