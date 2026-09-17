---
# Versión del FORMATO de este archivo, no del proyecto.
formato: 1
proyecto: falcux-ai-first
fase: exploracion
actualizado: 2026-09-17

verificacion: pnpm test

zonas_prohibidas:
  - ruta: skills/
    razon: copia generada; sync-skills.yml del repo del sitio la sobreescribe con rsync --delete a cada publicacion
    desde: 2026-09-17

# Cambiar la forma del contrato o de la interfaz es decisión. Las dependencias
# de producción las vigila el check 2 sin declararlas.
superficies_de_decision:
  - src/cli.ts
  - src/ai-first-md.ts
  - src/puntaje.ts
  - SPEC-PAQUETE.md

# Sólo documentos que hablan de ESTE repo. SPEC-PAQUETE.md no entra: describe un
# proyecto genérico y sus rutas de ejemplo no tienen por qué existir acá.
artefactos:
  adr: ADR.md
  readme: README.md
---

# AI-FIRST.md — `@falcux/ai-first`

> Qué gobierna a este proyecto. Acá está el mapa que las herramientas
> verifican; este paquete es la herramienta, así que se audita a sí mismo con
> `pnpm run audit:self`.

## Notas

Por qué `skills/` es Zona Prohibida: la fuente de verdad de las skills es el
repo del sitio. Lo que hay acá se regenera en cada publicación de `prod`, y un
cambio hecho a mano desaparece sin aviso en la siguiente sincronización.

Por qué `src/puntaje.ts` es superficie de decisión: los pesos 40 / 20 / 8
están calibrados contra el único ejemplo publicado en la landing. Cambiarlos
cambia lo que la landing promete.
