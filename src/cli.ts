#!/usr/bin/env node
// Punto de entrada de `npx @falcux/ai-first`.
//
// Hoy existe un solo comando, `audit`. Los otros cuatro del mapa v1 —init,
// sync, adr, handoff— están mapeados en HANDOFF.md y no escritos: se anuncian
// como tales en vez de fingir que corren.
//
// Códigos de salida:
//   0  sin hallazgos, o sólo P1/P2 sin `--estricto`
//   1  algún P0, o P1/P2 con `--estricto`
//   2  error de uso: no hay AI-FIRST.md, formato desconocido, no es un repo git

import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { ErrorAiFirst } from './ai-first-md.js';
import { auditar } from './audit.js';
import { reporteHumano, reporteJson } from './reporte.js';

const AYUDA = `ai-first — gobierno del contexto para proyectos AI-First

Uso:
  ai-first audit [opciones]

Opciones de audit:
  --base <ref>     Compara el rango <ref>...HEAD (CI). Sin ella, compara el árbol
                   de trabajo contra HEAD (hook local).
  --estricto       Sale con 1 también ante P1 o P2. Sin ella, sólo ante P0.
  --registrar      Escribe el resultado en «auditoria» del frontmatter de AI-FIRST.md.
  --json           Salida en JSON en vez del reporte legible.
  --raiz <dir>     Raíz del repositorio. Por defecto, el directorio actual.
  -h, --help       Esta ayuda.

Puntaje: entropía = min(100, 40·P0 + 20·P1 + 8·P2). Más alto es peor.
`;

const NO_ESCRITOS = new Set(['init', 'sync', 'adr', 'handoff']);

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      base: { type: 'string' },
      estricto: { type: 'boolean', default: false },
      registrar: { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
      raiz: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  const comando = positionals[0];

  if (values.help || comando === undefined) {
    process.stdout.write(AYUDA);
    return comando === undefined && !values.help ? 2 : 0;
  }

  if (NO_ESCRITOS.has(comando)) {
    process.stderr.write(`«${comando}» está mapeado pero todavía no existe. Ver HANDOFF.md, Parte B.\n`);
    return 2;
  }

  if (comando !== 'audit') {
    process.stderr.write(`Comando desconocido: «${comando}».\n\n${AYUDA}`);
    return 2;
  }

  const raiz = resolve(values.raiz ?? process.cwd());
  const opciones: Parameters<typeof auditar>[0] = { raiz, estricto: values.estricto, registrar: values.registrar };
  if (values.base) opciones.base = values.base;

  const informe = await auditar(opciones);

  if (values.json) process.stdout.write(reporteJson(informe) + '\n');
  else process.stdout.write(reporteHumano(informe, { color: process.stdout.isTTY ?? false }) + '\n');

  return informe.codigoDeSalida;
}

main(process.argv.slice(2)).then(
  (codigo) => process.exit(codigo),
  (error: unknown) => {
    const mensaje = error instanceof ErrorAiFirst ? error.message : error instanceof Error ? error.stack ?? error.message : String(error);
    process.stderr.write(`ai-first: ${mensaje}\n`);
    process.exit(2);
  },
);
