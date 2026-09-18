# Session Log

> Registro cronológico de sesiones de implementación. Cada entrada documenta
> qué se hizo, qué cambió, y qué quedó pendiente.
>
> Lo escribe `protocolo-cierre` (Fase A); lo verifica el humano (Fase B). Sesión
> más reciente arriba. Es cronología: el estado de hoy vive en `docs/HANDOFF.md` y el
> porqué de cada decisión en `docs/ADR.md`. Cuando pase de ~50 entradas, las viejas se
> archivan en `docs/SESSION_LOG_ARCHIVE.md` y acá quedan las últimas 20.

---

## 2026-09-18 (sesión 1) — El repo empieza a usar su propia metodología

### Resumen
Las rutas de las skills se alinearon con el manual, la prosa del repo se mudó a
`docs/`, y cinco skills del paquete quedaron instaladas en `.agents/skills/` por
enlace. Es la primera entrada de este registro: existe porque esta sesión lo creó.

### Skills y templates — publicado en `prod` (c7170e3)
- `protocolo-cierre`, `protocolo-cambios`, `version-bump` y cinco templates: el
  registro de sesión y el de cambios pasan a `docs/`. El mismo documento se
  nombraba con y sin prefijo por toda la colección (ADR-015).
- Las 29 menciones del registro de decisiones en skills y templates pasan a
  `docs/ADR.md` (ADR-016).
- `AGENTS.md` y `AI-FIRST.md`: el ejemplo del 68 está en la portada del sitio,
  no en la landing comercial, que es otro repo.

### Estructura del repo — publicado en `prod` (c7170e3)
- `HANDOFF.md`, `ADR.md` y `SPEC-PAQUETE.md` → `docs/`, con `git mv`.
  `AI-FIRST.md` se queda en la raíz: el detector lo abre por nombre.
- `artefactos` y `superficies_de_decision` apuntan a las rutas nuevas. Nueve
  comentarios de `src/` y el mensaje del CLI para comandos mapeados, también.
- Seis rutas de otros repos en el handoff y en ADR-010 perdieron los acentos
  graves: el check 4 las cobraba como P2 desde que existe `docs/`.

### La herramienta configurada acá — sin commitear al escribir esto
- Cinco enlaces en `.agents/skills/` hacia `skills/`: `protocolo-features`,
  `protocolo-cambios`, `protocolo-cierre`, `version-bump`, `test-fix`. Cargaron
  en la misma sesión, sin reiniciar.
- `docs/changes/CHANGE_LOG.md` y `docs/changes/pending/` creados;
  `alcance.spec` declarado en `AI-FIRST.md`. El check 3 pasa de «no declarado»
  a «sin spec activa».
- `AGENTS.md`: sección «Cómo se trabaja acá» con la tabla de equivalencias, y
  una regla nueva en «What NOT to do» sobre las rutas ajenas.
- Tags locales `v0.1.0`, `v0.1.1` y `v0.1.2` sobre los commits que salieron a
  npm (975c1c4, 8fb98ed, 93c19e9).

### Coordinación con el sitio
- El sitio adoptó `docs/ADR.md` en sus cuatro menciones y verificó nuestro
  `prod`. De paso corrigió dos errores propios: un aviso que decía que el
  detector estaba sin publicar, y un conteo de 9 templates.
- Sin decidir: el archivado del registro de sesión pasadas ~50 entradas, que el
  manual define y la skill no implementa, y quitar el «sesión N» de las
  entradas. El sitio y esta sesión coinciden en hacer las dos.

### Validación
- typecheck → PASS (tsc corre dentro de `pnpm test`)
- lint      → no ejecutado (no hay script de lint)
- tests     → PASS (60/60, exit 0)
- audit:self → 0 / 100

### Pendiente para la siguiente sesión
- [ ] **El `init` completo.** Los seis pasos que esta sesión hizo a mano son su
      lista de aceptación: enlazar o copiar las skills elegidas, crear
      `docs/changes/pending/` y `docs/changes/CHANGE_LOG.md`, declarar
      `alcance.spec`, abrir `docs/SESSION_LOG.md`, añadir la sección de
      equivalencias a `AGENTS.md`, y no tocar nada que ya exista. Arrancar con
      `/protocolo-features`; es el pendiente que `docs/HANDOFF.md` tiene primero
      después del publish.
- [ ] Decidir las dos divergencias de `protocolo-cierre` con el manual
      (archivado y numeración) e implementarlas. Toca una skill protegida:
      aviso al sitio.
- [ ] `CHANGELOG.md` en la raíz —no confundir con `docs/changes/CHANGE_LOG.md`—
      y, en el sitio, un componente que lea la versión de npm y las notas del
      CHANGELOG. Es la petición con la que arrancó la sesión.
- [ ] Cuatro hallazgos del detector, anotados en `docs/HANDOFF.md` bajo la
      entrada del 2026-09-18.
