// El reporte humano y el JSON. Sobrio: sin color salvo en una terminal, y sin
// más iconos que los tres estados.

import type { InformeAudit } from './audit.js';
import { VERIFICACIONES, type Resultado } from './verificaciones/index.js';

const MARCAS = { aprobado: '✓', omitido: '–', hallazgos: '✗' } as const;

function pintor(color: boolean) {
  const envolver = (codigo: string) => (t: string) => (color ? `[${codigo}m${t}[0m` : t);
  return { tenue: envolver('2'), negrita: envolver('1'), rojo: envolver('31'), ambar: envolver('33') };
}

function nombreDe(check: string): string {
  return VERIFICACIONES.find((v) => v.id === check)?.nombre ?? check;
}

export function reporteHumano(informe: InformeAudit, opciones: { color?: boolean } = {}): string {
  const p = pintor(opciones.color ?? false);
  const lineas: string[] = [];

  const proyecto = informe.aiFirst.proyecto ?? '(sin nombre)';
  const modo = informe.modo === 'rango' ? `rango ${informe.base}...HEAD` : 'árbol de trabajo contra HEAD';
  lineas.push(p.negrita(`ai-first audit — ${proyecto}`));
  lineas.push(p.tenue(`${modo} · ${informe.cambiados.length} archivo${informe.cambiados.length === 1 ? '' : 's'} tocado${informe.cambiados.length === 1 ? '' : 's'}`));
  lineas.push('');

  for (const r of informe.resultados) lineas.push(...lineasDe(r, p));

  lineas.push('');
  const { p0, p1, p2 } = informe.conteo;
  const resumen = `Entropía: ${informe.entropia} / 100`;
  const desglose = p.tenue(`(${p0} P0 · ${p1} P1 · ${p2} P2)`);
  lineas.push(`${informe.entropia === 0 ? resumen : p.negrita(resumen)} ${desglose}`);

  return lineas.join('\n');
}

function lineasDe(r: Resultado, p: ReturnType<typeof pintor>): string[] {
  const marca = MARCAS[r.estado];
  const nombre = nombreDe(r.check);
  if (r.estado === 'aprobado') return [`${marca} ${nombre}`];
  if (r.estado === 'omitido') return [`${p.tenue(marca)} ${nombre} ${p.tenue(`— omitido: ${r.razon}`)}`];

  const salida = [`${p.rojo(marca)} ${nombre}`];
  for (const h of r.hallazgos) {
    const sev = h.severidad === 'P0' ? p.rojo(h.severidad) : p.ambar(h.severidad);
    salida.push(`    ${sev}  ${h.mensaje}`);
    for (const d of h.detalle ?? []) salida.push(p.tenue(`          ${d}`));
  }
  return salida;
}

export function reporteJson(informe: InformeAudit): string {
  const { aiFirst, ...resto } = informe;
  return JSON.stringify({ proyecto: aiFirst.proyecto ?? null, ...resto }, null, 2);
}
