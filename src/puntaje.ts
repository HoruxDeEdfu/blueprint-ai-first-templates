// El puntaje de entropía (docs/SPEC-PAQUETE.md §7). Mide entropía, no salud: más
// alto es peor.
//
// Los pesos están calibrados contra el único ejemplo publicado en la landing:
// 1 P0 + 1 P1 + 1 P2 = 40 + 20 + 8 = 68. No se cambian sin avisar.

import type { Resultado, Severidad } from './verificaciones/tipos.js';

export const PESOS: Record<Severidad, number> = { P0: 40, P1: 20, P2: 8 };

export interface Conteo {
  p0: number;
  p1: number;
  p2: number;
}

export function contar(resultados: readonly Resultado[]): Conteo {
  const c: Conteo = { p0: 0, p1: 0, p2: 0 };
  for (const r of resultados) {
    if (r.estado !== 'hallazgos') continue;
    for (const h of r.hallazgos) {
      if (h.severidad === 'P0') c.p0++;
      else if (h.severidad === 'P1') c.p1++;
      else c.p2++;
    }
  }
  return c;
}

export function entropia(c: Conteo): number {
  return Math.min(100, PESOS.P0 * c.p0 + PESOS.P1 * c.p1 + PESOS.P2 * c.p2);
}

/**
 * 0 sin hallazgos; 1 con cualquier P0; 1 también con P1 o P2 bajo `estricto`,
 * y 0 con advertencias si no. Así el mismo comando sirve en un hook local y
 * en integración continua.
 */
export function codigoDeSalida(c: Conteo, estricto: boolean): 0 | 1 {
  if (c.p0 > 0) return 1;
  if (estricto && (c.p1 > 0 || c.p2 > 0)) return 1;
  return 0;
}
