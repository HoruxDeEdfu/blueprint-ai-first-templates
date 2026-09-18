# Registro de cambios

> Resumen permanente de cada cambio cerrado con `protocolo-cambios`: fecha, tipo,
> archivos, resumen y lecciones. El documento CHG-XXX vive en `pending/` mientras
> el cambio está en curso y se elimina al cerrarlo; acá queda su resumen.
>
> No confundir con el `CHANGELOG.md` de la raíz, que —cuando exista— dirá qué
> cambió en cada versión publicada del paquete, para quien lo instala.

---

## CHG-001 — `init` salta lo que ya existe y sigue, en vez de detenerse

- **Fecha:** 2026-09-18 (abierto y cerrado el mismo día)
- **Tipo:** cambio de requerimiento, flujo corto
- **Decisión:** ADR-017, que supera la parte de ADR-003 que decía «si
  `AI-FIRST.md` existe, se detiene»
- **Archivos:** `src/init.ts`, `src/cli.ts`, `test/init.test.ts`

**Resumen.** `iniciar` ya no lanza cuando `AI-FIRST.md` existe: el resultado
gana `saltados` junto a `escritos`, y ahí van tanto `AI-FIRST.md` como el ADR
que ya estaba —que antes se saltaba sin decirlo—. El CLI imprime una línea por
archivo, «escrito» o «saltado (ya existe)», y sale con 0. Su ayuda deja de
prometer el error. Nunca sobreescribir sigue entero. Era el prerrequisito del
`init` completo (`docs/specs/init-completo.md`), que tiene que poder correr
sobre un repo ya configurado.

**Pruebas.** La que fijaba el error pasa a comprobar que salta, que
`AI-FIRST.md` no cambia ni un byte y que el ADR que falta sí se escribe. Una
nueva cubre el repo con los dos archivos presentes: nada escrito, dos saltados,
sin error. La del ADR existente comprueba que aparece en `saltados`. Suite en
61 pruebas.

**Lecciones.** El check 2 compara el árbol de trabajo contra HEAD: si la fila
del ADR entra en un commit y el código en el siguiente, el `audit:self` previo
al segundo commit da P1 aunque la decisión esté escrita. Se verifica con
`--base` sobre un rango que incluya los dos, o se meten fila y código en el
mismo commit.
