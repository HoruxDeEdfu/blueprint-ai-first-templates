#!/usr/bin/env node
/**
 * Fidelidad de skeletons — check S-11 de la Capa 1 de ux-audit.
 *
 * El skeleton se escribe una vez, con la estructura que la pantalla tenía ese
 * día. Los evolutivos agregan una columna, un tab o un botón y nadie abre el
 * archivo de carga hermano: la deriva no se ve en code review porque los dos
 * archivos nunca aparecen juntos en el diff. Este check los pone lado a lado.
 *
 * Es el único check de la Capa 1 que no se resuelve con una expresión regular:
 * hay que comparar las columnas que el skeleton declara contra las que la tabla
 * real tiene.
 *
 * Qué compara (solo lo medible sin ambigüedad):
 *   1. `columns` declarado en el skeleton vs. cabeceras reales de la tabla.
 *   2. Presencia de la clase de retraso en los skeletons ad-hoc (los compartidos ya la traen).
 *   3. Ancho máximo del skeleton vs. el del contenedor de la página (aviso).
 *
 * Lo que NO cubre y sigue siendo checklist humano: cantidad de tabs y de
 * acciones del header (se generan desde arrays y el conteo estático miente),
 * y la fidelidad de las composiciones custom.
 *
 * Escrito para Next.js App Router (un `loading.tsx` por ruta) con componentes
 * de tabla estilo shadcn. Todo lo que depende del stack está en CONFIG.
 *
 * Uso:  node .agents/skills/ux-audit/checks/fidelidad-skeletons.mjs [ruta]
 * Sale con código 1 si hay al menos una deriva.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';

// ── Configuración ─────────────────────────────────────────────────────────────
const CONFIG = {
  /** Carpeta de rutas de la app. */
  appDir: 'apps/web/app',
  /** Nombre del archivo de carga por ruta. */
  loadingFile: 'loading.tsx',
  /** Subcarpetas de una ruta que sí se recorren (las demás son otras páginas). */
  componentDirs: ['_components'],
  /** Import que identifica a los skeletons compartidos (ya traen el retraso). */
  sharedSkeletonsImport: '@/components/skeletons',
  /** Clase que retrasa la aparición del skeleton ~200 ms. */
  delayClass: 'skeleton-delayed',
  /** Componentes de skeleton de listado y sus props por defecto. Si cambian allá, cambian acá. */
  skeletonDefaults: {
    ListPageSkeleton: { columns: 5, maxWidth: '6xl' },
    ListCardSkeleton: { columns: 5 },
    TableSkeleton: { columns: 5 },
  },
  /** Cabecera de tabla y celdas de cabecera que cuentan como columna. */
  tableHeaderOpen: '<TableHeader>',
  tableHeaderClose: '</TableHeader>',
  headCells: ['TableHead', 'ActionsHead'],
  /** Valores válidos del ancho máximo (clases max-w-*). */
  maxWidths: ['3xl', '4xl', '5xl', '6xl', '7xl'],
};
// ──────────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const APP_DIR = join(ROOT, CONFIG.appDir);
const SCOPE = process.argv[2] ? join(ROOT, process.argv[2]) : APP_DIR;
const SKELETON_NAMES = Object.keys(CONFIG.skeletonDefaults);
const HEAD_CELL_RE = new RegExp(`<(${CONFIG.headCells.join('|')})\\b`, 'g');
const ACTIONS_RE = new RegExp(`<${CONFIG.headCells[CONFIG.headCells.length - 1]}\\b`, 'g');

const RESET = '\x1b[0m';
const c = (code, s) => (process.stdout.isTTY ? `\x1b[${code}m${s}${RESET}` : s);
const red = (s) => c('31', s);
const yellow = (s) => c('33', s);
const green = (s) => c('32', s);
const dim = (s) => c('2', s);
const bold = (s) => c('1', s);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === 'dist') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** Archivos .tsx de la ruta: page.tsx + lo que cuelga de sus carpetas de componentes. */
function routeFiles(routeDir) {
  const files = [];
  for (const entry of readdirSync(routeDir)) {
    const full = join(routeDir, entry);
    if (statSync(full).isDirectory()) {
      // Un subdirectorio de ruta es OTRA página con su propio archivo de carga;
      // contar sus tablas contaminaría esta comparación.
      if (CONFIG.componentDirs.includes(entry)) files.push(...walk(full));
      continue;
    }
    if (entry.endsWith('.tsx')) files.push(full);
  }
  return files;
}

/** Props del primer skeleton de listado que monta el archivo de carga. */
function parseSkeletonUsage(src) {
  const match = src.match(new RegExp(`<(${SKELETON_NAMES.join('|')})\\b([\\s\\S]*?)/>`));
  if (!match) return null;
  const [, component, rawProps] = match;
  const num = (name) => {
    const m = rawProps.match(new RegExp(`\\b${name}=\\{(\\d+)\\}`));
    return m ? Number(m[1]) : undefined;
  };
  const str = (name) => {
    const m = rawProps.match(new RegExp(`\\b${name}="([^"]+)"`));
    return m ? m[1] : undefined;
  };
  const defaults = CONFIG.skeletonDefaults[component] ?? {};
  return {
    component,
    columns: num('columns') ?? defaults.columns,
    columnsExplicit: num('columns') !== undefined,
    maxWidth: str('maxWidth') ?? defaults.maxWidth,
    maxWidthExplicit: str('maxWidth') !== undefined,
  };
}

/**
 * Columnas reales por tabla: se cuenta dentro de la PRIMERA cabecera de cada archivo.
 * La celda de acciones cuenta como columna: es la que más veces quedó fuera del skeleton.
 *
 * Las columnas condicionales (`{mostrar ? <TableHead…> : null}`) dan un RANGO, no un
 * número: el skeleton es válido en cualquier punto del rango porque no sabe qué verá
 * el usuario. Marcar deriva ahí sería ruido, y un check ruidoso se deja de correr.
 */
function realTables(files) {
  const tables = [];
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const start = src.indexOf(CONFIG.tableHeaderOpen);
    if (start === -1) continue;
    const end = src.indexOf(CONFIG.tableHeaderClose, start);
    if (end === -1) continue;
    const header = src.slice(start, end);

    let fixed = 0;
    let conditional = 0;
    for (const line of header.split('\n')) {
      const cells = (line.match(HEAD_CELL_RE) ?? []).length;
      if (cells === 0) continue;
      const guard = /[?&|]{1,2}\s*(<|\()/.test(line) || /\{\s*\w+\s*&&/.test(line);
      if (guard) conditional += cells;
      else fixed += cells;
    }
    if (fixed + conditional === 0) continue;

    const actions = (header.match(ACTIONS_RE) ?? []).length;
    tables.push({ file: basename(file), min: fixed, max: fixed + conditional, conditional, actions });
  }
  return tables;
}

const describeTable = (t) => {
  const range = t.conditional ? `${t.min}–${t.max}` : `${t.max}`;
  const parts = [];
  if (t.actions) parts.push('incluye acciones');
  if (t.conditional) parts.push(`${t.conditional} condicional${t.conditional > 1 ? 'es' : ''}`);
  return `${range}${parts.length ? ` (${parts.join(', ')})` : ''} en ${t.file}`;
};

/** max-w-* del contenedor raíz de la página (primera aparición). */
function realMaxWidth(files) {
  const re = new RegExp(`max-w-(${CONFIG.maxWidths.join('|')})`);
  for (const file of files) {
    if (basename(file) !== 'page.tsx') continue;
    const m = readFileSync(file, 'utf8').match(re);
    if (m) return m[1];
  }
  return undefined;
}

let drift = 0;
let notices = 0;
const clean = [];

function report(rel, problems) {
  if (problems.length === 0) {
    clean.push(rel);
    return;
  }
  const hasDrift = problems.some((p) => p.level === 'drift');
  if (hasDrift) drift += 1;
  else notices += 1;

  console.log(`\n${hasDrift ? red('●') : yellow('○')} ${bold(rel)}`);
  for (const p of problems) {
    const tag = p.level === 'drift' ? red('DERIVA ') : yellow('aviso  ');
    console.log(`  ${tag} ${p.text}`);
  }
}

const loadingFiles = walk(SCOPE).filter((f) => basename(f) === CONFIG.loadingFile);

for (const loadingFile of loadingFiles.sort()) {
  const routeDir = dirname(loadingFile);
  const rel = relative(ROOT, routeDir);
  const src = readFileSync(loadingFile, 'utf8');
  const usesShared = src.includes(CONFIG.sharedSkeletonsImport);
  const usage = parseSkeletonUsage(src);
  const files = routeFiles(routeDir);
  const problems = [];

  // 1 — Columnas
  if (usage?.columns !== undefined) {
    const tables = realTables(files);
    const fits = (t) => usage.columns >= t.min && usage.columns <= t.max;
    if (tables.length > 0 && !tables.some(fits)) {
      problems.push({
        level: 'drift',
        text: `columns=${usage.columns}${usage.columnsExplicit ? '' : ' (default)'} — tabla real: ${tables.map(describeTable).join(', ')}`,
      });
    }
  }

  // 2 — Retraso de aparición
  if (!usesShared && !src.includes(CONFIG.delayClass)) {
    problems.push({
      level: 'drift',
      text: `skeleton ad-hoc sin la clase \`${CONFIG.delayClass}\` — aparecerá sin el retraso`,
    });
  }

  // 3 — Ancho del contenedor (aviso: la página puede tener varios max-w)
  if (usage?.maxWidth) {
    const real = realMaxWidth(files);
    if (real && real !== usage.maxWidth) {
      problems.push({
        level: 'notice',
        text: `maxWidth="${usage.maxWidth}"${usage.maxWidthExplicit ? '' : ' (default)'} — la página usa max-w-${real}`,
      });
    }
  }

  report(rel, problems);
}

/**
 * Estados de carga inline (`{loading ? <TableSkeleton …/> : <Table>…}`): no viven
 * en un archivo de carga, así que la pasada de arriba no los ve, y derivan igual.
 * En el proyecto de origen, tres tablas declaraban una columna menos que su propia
 * tabla, en el MISMO archivo.
 */
const inlineFiles = walk(SCOPE).filter(
  (f) => f.endsWith('.tsx') && basename(f) !== CONFIG.loadingFile && !f.includes('/components/skeletons/'),
);

for (const file of inlineFiles.sort()) {
  const src = readFileSync(file, 'utf8');
  if (!src.includes('<TableSkeleton')) continue;
  const m = src.match(/<TableSkeleton\b([\s\S]*?)\/>/);
  if (!m) continue;
  const declared = m[1].match(/\bcolumns=\{(\d+)\}/);
  const columns = declared ? Number(declared[1]) : CONFIG.skeletonDefaults.TableSkeleton.columns;

  // Tabla del propio archivo; si no la tiene, la de su directorio (contenedor + tabla en archivos separados).
  let tables = realTables([file]);
  if (tables.length === 0) {
    tables = realTables(
      readdirSync(dirname(file))
        .filter((e) => e.endsWith('.tsx'))
        .map((e) => join(dirname(file), e)),
    );
  }
  if (tables.length === 0) continue;

  const rel = relative(ROOT, file);
  const fits = (t) => columns >= t.min && columns <= t.max;
  if (tables.some(fits)) {
    clean.push(rel);
    continue;
  }
  report(rel, [
    {
      level: 'drift',
      text: `columns=${columns}${declared ? '' : ' (default)'} — tabla real: ${tables.map(describeTable).join(', ')}`,
    },
  ]);
}

console.log(
  `\n${dim('─'.repeat(64))}\n` +
    `${loadingFiles.length} ${CONFIG.loadingFile} + estados de carga inline · ` +
    `${drift ? red(`${drift} con deriva`) : green('0 con deriva')} · ` +
    `${notices} con avisos · ${clean.length} limpios`,
);

if (drift > 0) {
  console.log(
    dim(
      '\nAl corregir: la fuente de verdad es la pantalla, no el skeleton.\n' +
        'Ajustar el skeleton a la estructura actual — no al revés.',
    ),
  );
}

process.exit(drift > 0 ? 1 : 0);
