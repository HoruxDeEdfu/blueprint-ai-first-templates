// Check 1 — Zona Prohibida tocada (P0).
//
// `git diff --name-only` contra los patrones declarados. Determinista, cero
// falsos positivos. Corta el flujo.
//
// La unidad del hallazgo es la zona, no el archivo: tocar tres migraciones es
// una Zona Prohibida tocada, con tres archivos en el detalle. Así el puntaje
// mide cuántas fronteras se cruzaron, no cuántos archivos hay detrás de cada una.

import { coincide } from '../glob.js';
import { conHallazgos, omitido, type Hallazgo, type Verificacion } from './tipos.js';

export const zonaProhibida: Verificacion = {
  id: 'zona-prohibida',
  nombre: 'Zona Prohibida tocada',
  severidad: 'P0',

  async correr(ctx) {
    const zonas = ctx.aiFirst.zonas_prohibidas;
    if (zonas.length === 0) return omitido(this.id, 'no hay «zonas_prohibidas» declaradas');

    const hallazgos: Hallazgo[] = [];
    for (const zona of zonas) {
      const tocados = ctx.cambiados.filter((r) => coincide(zona.ruta, r));
      if (tocados.length === 0) continue;
      hallazgos.push({
        severidad: 'P0',
        ruta: zona.ruta,
        mensaje: zona.razon ? `Zona Prohibida «${zona.ruta}» tocada — ${zona.razon}` : `Zona Prohibida «${zona.ruta}» tocada`,
        detalle: tocados,
      });
    }
    return conHallazgos(this.id, hallazgos);
  },
};
