// Check 2 — Decisión sin fila en ADR (P1).
//
// El más difícil de los cinco, porque «se tomó una decisión arquitectónica» no
// es detectable con regex. Se resuelve declarándolo en vez de adivinarlo, con
// dos señales:
//
//   - cambió un archivo listado en `superficies_de_decision`, o
//   - un `package.json` agregó o quitó una dependencia de producción.
//
// Si hay señal y el ADR no ganó una fila en el mismo rango → P1.
//
// Es una heurística y produce falsos positivos. Se silencia agregando la fila,
// o con `<!-- ai-first: sin-decision -->` en el cuerpo del commit. La anotación
// sólo puede leerse en modo rango (`--base`): sin commits no hay cuerpo donde
// buscarla, y en ese modo el P1 es una advertencia que no corta salvo con
// `--estricto`.

import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { coincideAlguno } from '../glob.js';
import { contenidoEn, cuerposDeCommits, lineasAgregadas } from '../git.js';
import { conHallazgos, omitido, type Verificacion } from './tipos.js';

export const MARCA_SILENCIO = /ai-first:\s*sin-decision/i;
const FILA_ADR = /^\s*#{2,3}\s+ADR-\d+/;

function dependenciasDe(json: string | undefined): Set<string> {
  if (!json) return new Set();
  try {
    const datos = JSON.parse(json) as { dependencies?: Record<string, string> };
    return new Set(Object.keys(datos.dependencies ?? {}));
  } catch {
    return new Set();
  }
}

async function cambiosDeDependencias(raiz: string, ruta: string, base?: string): Promise<string[]> {
  const antes = dependenciasDe(contenidoEn(raiz, base ?? 'HEAD', ruta));
  let despues: Set<string>;
  if (base) {
    despues = dependenciasDe(contenidoEn(raiz, 'HEAD', ruta));
  } else {
    try {
      despues = dependenciasDe(await readFile(join(raiz, ruta), 'utf8'));
    } catch {
      despues = new Set();
    }
  }
  const salida: string[] = [];
  for (const d of despues) if (!antes.has(d)) salida.push(`${ruta}: +${d}`);
  for (const d of antes) if (!despues.has(d)) salida.push(`${ruta}: -${d}`);
  return salida;
}

export const decisionSinAdr: Verificacion = {
  id: 'decision-sin-adr',
  nombre: 'Decisión sin fila en ADR',
  severidad: 'P1',

  async correr(ctx) {
    const adr = ctx.aiFirst.artefactos.adr;
    if (!adr) return omitido(this.id, 'no hay «artefactos.adr» declarado');

    const señales: string[] = [];

    for (const ruta of ctx.cambiados) {
      const patron = coincideAlguno(ctx.aiFirst.superficies_de_decision, ruta);
      if (patron) señales.push(`${ruta} (superficie «${patron}»)`);
    }
    for (const ruta of ctx.cambiados) {
      if (basename(ruta) !== 'package.json') continue;
      señales.push(...(await cambiosDeDependencias(ctx.raiz, ruta, ctx.base)));
    }

    if (señales.length === 0) return conHallazgos(this.id, []);

    if (ctx.base && cuerposDeCommits(ctx.raiz, ctx.base).some((c) => MARCA_SILENCIO.test(c))) {
      return conHallazgos(this.id, []);
    }

    const ganoFila = lineasAgregadas(ctx.raiz, adr, ctx.base).some((l) => FILA_ADR.test(l));
    if (ganoFila) return conHallazgos(this.id, []);

    return conHallazgos(this.id, [
      {
        severidad: 'P1',
        ruta: adr,
        mensaje: `Hay señales de decisión arquitectónica y ${basename(adr)} no ganó ninguna fila`,
        detalle: [...señales, 'Silenciar: agregar la fila al ADR, o «<!-- ai-first: sin-decision -->» en el cuerpo del commit.'],
      },
    ]);
  },
};
