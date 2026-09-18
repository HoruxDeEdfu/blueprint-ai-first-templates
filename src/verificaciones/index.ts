// Las cinco verificaciones, en el orden de docs/SPEC-PAQUETE.md §6. El orden es
// también el del reporte.

import { alcanceExcedido } from './alcance-excedido.js';
import { artefactoHuerfano } from './artefacto-huerfano.js';
import { decisionSinAdr } from './decision-sin-adr.js';
import { inventarioComponentes } from './inventario-componentes.js';
import type { Verificacion } from './tipos.js';
import { zonaProhibida } from './zona-prohibida.js';

export const VERIFICACIONES: readonly Verificacion[] = [
  zonaProhibida,
  decisionSinAdr,
  alcanceExcedido,
  artefactoHuerfano,
  inventarioComponentes,
];

export * from './tipos.js';
