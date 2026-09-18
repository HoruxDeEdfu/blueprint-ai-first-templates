// El contrato de una verificación. Tres estados y sólo tres: aprobado,
// hallazgos u omitido. Un check que no puede correr se reporta omitido, nunca
// aprobado (docs/SPEC-PAQUETE.md §5, notas de diseño).

import type { AiFirst } from '../ai-first-md.js';

export type Severidad = 'P0' | 'P1' | 'P2';

export interface Hallazgo {
  severidad: Severidad;
  /** Una línea, para el reporte. */
  mensaje: string;
  /** Archivo al que se refiere, si aplica. */
  ruta?: string;
  /** Líneas adicionales, ya formateadas, para el modo detallado. */
  detalle?: string[];
}

export type Resultado =
  | { check: string; estado: 'aprobado' }
  | { check: string; estado: 'omitido'; razon: string }
  | { check: string; estado: 'hallazgos'; hallazgos: Hallazgo[] };

export interface Contexto {
  raiz: string;
  aiFirst: AiFirst;
  /** Ref contra la que se compara. Sin ella, árbol de trabajo contra HEAD. */
  base?: string;
  /** Archivos tocados en el modo elegido, relativos a la raíz. */
  cambiados: string[];
}

export interface Verificacion {
  id: string;
  nombre: string;
  severidad: Severidad;
  correr(ctx: Contexto): Promise<Resultado>;
}

export function aprobado(check: string): Resultado {
  return { check, estado: 'aprobado' };
}

export function omitido(check: string, razon: string): Resultado {
  return { check, estado: 'omitido', razon };
}

export function conHallazgos(check: string, hallazgos: Hallazgo[]): Resultado {
  return hallazgos.length === 0 ? aprobado(check) : { check, estado: 'hallazgos', hallazgos };
}
