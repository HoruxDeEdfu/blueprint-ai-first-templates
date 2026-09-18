#!/usr/bin/env node
// Punto de entrada de `npx @falcux/ai-first`.
//
// Dos comandos hoy: `init` (mínimo) y `audit`. Los otros tres del mapa v1
// —sync, adr, handoff— están mapeados en docs/HANDOFF.md y no escritos: se anuncian
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
import { iniciar } from './init.js';
import { reporteHumano, reporteJson } from './reporte.js';

const AYUDA = `ai-first — gobierno del contexto para proyectos AI-First

Uso:
  ai-first init  [--raiz <dir>]
  ai-first audit [opciones]

init escanea el repo y escribe AI-FIRST.md con lo que encuentra —Zonas Prohibidas
sugeridas, superficies de decisión, documentos existentes— y un ADR.md vacío.
No toca nada más y nunca sobreescribe: lo que ya existe se salta, se reporta
como saltado y el comando sigue. Las skills y los templates se copian a mano
por ahora.

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

const NO_ESCRITOS = new Set(['sync', 'adr', 'handoff']);

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
    process.stderr.write(`«${comando}» está mapeado pero todavía no existe. Ver docs/HANDOFF.md, Parte B.\n`);
    return 2;
  }

  const raiz = resolve(values.raiz ?? process.cwd());

  if (comando === 'init') {
    const { escaneo, escritos, saltados } = await iniciar({ raiz });
    const salida = [
      `ai-first init — ${escaneo.proyecto}`,
      '',
      ...escritos.map((e) => `  escrito  ${e}`),
      ...saltados.map((s) => `  saltado  ${s} (ya existe)`),
      '',
      `  ${escaneo.zonas.length} Zona${escaneo.zonas.length === 1 ? '' : 's'} Prohibida${escaneo.zonas.length === 1 ? '' : 's'} sugerida${escaneo.zonas.length === 1 ? '' : 's'}: ${escaneo.zonas.map((z) => z.ruta).join(', ')}`,
      `  ${escaneo.superficies.length} superficie${escaneo.superficies.length === 1 ? '' : 's'} de decisión: ${escaneo.superficies.join(', ') || '—'}`,
      `  ${Object.keys(escaneo.artefactos).length} artefactos declarados`,
      '',
      'Revisa AI-FIRST.md —sobre todo las razones de cada zona— y luego corre `ai-first audit`.',
      '',
    ];
    process.stdout.write(salida.join('\n'));
    return 0;
  }

  if (comando !== 'audit') {
    process.stderr.write(`Comando desconocido: «${comando}».\n\n${AYUDA}`);
    return 2;
  }
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
