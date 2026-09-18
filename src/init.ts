// `init` mínimo: escanea el repo, sugiere y escribe dos archivos —AI-FIRST.md
// y un ADR.md vacío—. No toca skills, ni AGENTS.md, ni escribe manifiesto:
// nada de lo que instala hay que actualizar después.
//
// Es el primer paso del `init` completo de HANDOFF.md (entrevista, adaptación
// de skills), al que hoy sólo le falta el esquema del manifiesto: la colisión
// de nombres de las skills dejó de bloquearlo en ADR-014, que decide que la
// instalación salte lo que ya existe en vez de renombrar en el origen. Cuando
// ese `init` instale skills, hereda de acá la misma regla de oro.
//
// Regla de oro: nunca sobreescribe. Si AI-FIRST.md existe, se detiene.

import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { NOMBRE_ARCHIVO, interpretar, ErrorAiFirst } from './ai-first-md.js';
import { esRepoGit, listarArchivos } from './git.js';
import { coincide } from './glob.js';

export interface Sugerencia {
  ruta: string;
  razon: string;
}

export interface Escaneo {
  proyecto: string;
  verificacion?: string;
  zonas: Sugerencia[];
  superficies: string[];
  artefactos: Record<string, string>;
  /** Dónde se creará el ADR si no existe. */
  rutaAdr: string;
  adrExiste: boolean;
  componentesDir?: string;
}

// Candidatas, sólo si existen en el repo. La razón la completa el humano; acá
// va una por defecto para que el archivo no nazca con huecos.
const ZONAS_CANDIDATAS: Sugerencia[] = [
  { ruta: 'migrations/', razon: 'esquema de base de datos' },
  { ruta: 'prisma/migrations/', razon: 'esquema de base de datos' },
  { ruta: 'supabase/migrations/', razon: 'esquema de base de datos' },
  { ruta: 'db/migrations/', razon: 'esquema de base de datos' },
  { ruta: 'infra/', razon: 'infraestructura' },
  { ruta: 'terraform/', razon: 'infraestructura' },
  { ruta: 'LICENSE', razon: 'licencia' },
];

const SUPERFICIES_CANDIDATAS = [
  '**/*.config.*',
  '**/schema.prisma',
  'pnpm-workspace.yaml',
  'turbo.json',
  'Dockerfile',
  'docker-compose*.yml',
  'wrangler.*',
  'vercel.json',
  'netlify.toml',
  '.github/workflows/*.yml',
];

// clave de `artefactos` → nombres posibles, en raíz o en docs/.
const ARTEFACTOS_CANDIDATOS: Record<string, string[]> = {
  agents: ['AGENTS.md'],
  arquitectura: ['ARQUITECTURA.md', 'ARCHITECTURE.md'],
  guia_diseno: ['GUIA_DISENO.md', 'GUIA_DISEÑO.md', 'DESIGN.md'],
  tech_notes: ['TECH_NOTES.md'],
  session_log: ['SESSION_LOG.md'],
  change_log: ['CHANGE_LOG.md', 'changes/CHANGE_LOG.md'],
  inventario_componentes: ['COMPONENT_LIBRARY.md', 'COMPONENTES.md', 'COMPONENTS.md'],
};

const COMPONENTES_CANDIDATOS = ['src/components/', 'components/', 'app/components/', 'packages/ui/src/components/'];

function gestorDePaquetes(archivos: Set<string>): string {
  if (archivos.has('pnpm-lock.yaml')) return 'pnpm';
  if (archivos.has('yarn.lock')) return 'yarn';
  if (archivos.has('bun.lockb') || archivos.has('bun.lock')) return 'bun';
  return 'npm';
}

export function escanear(raiz: string): Escaneo {
  const lista = listarArchivos(raiz);
  const archivos = new Set(lista);
  const existeDir = (d: string) => lista.some((a) => a.startsWith(d));

  let proyecto = basename(raiz);
  let verificacion: string | undefined;
  if (archivos.has('package.json')) {
    try {
      const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8')) as {
        name?: string;
        scripts?: Record<string, string>;
      };
      if (pkg.name) proyecto = pkg.name.replace(/^@[^/]+\//, '');
      const gestor = gestorDePaquetes(archivos);
      const pasos = ['build', 'test'].filter((s) => pkg.scripts?.[s]).map((s) => `${gestor} ${s === 'test' && gestor === 'npm' ? 'test' : `run ${s}`}`);
      if (pasos.length > 0) verificacion = pasos.join(' && ');
    } catch {
      // Un package.json roto no detiene el init: simplemente no se deduce nada de él.
    }
  }

  const zonas = ZONAS_CANDIDATAS.filter((z) => (z.ruta.endsWith('/') ? existeDir(z.ruta) : archivos.has(z.ruta)));
  zonas.push({ ruta: '.env*', razon: 'credenciales' });

  const superficies = SUPERFICIES_CANDIDATAS.filter((p) => lista.some((a) => coincide(p, a)));

  const artefactos: Record<string, string> = {};
  for (const [clave, nombres] of Object.entries(ARTEFACTOS_CANDIDATOS)) {
    for (const n of nombres) {
      const candidatas = [n, `docs/${n}`];
      const hallada = candidatas.find((c) => archivos.has(c));
      if (hallada) {
        artefactos[clave] = hallada;
        break;
      }
    }
  }

  const adrExistente = ['ADR.md', 'docs/ADR.md'].find((c) => archivos.has(c));
  const rutaAdr = adrExistente ?? (existeDir('docs/') ? 'docs/ADR.md' : 'ADR.md');
  artefactos['adr'] = rutaAdr;

  const componentesDir = COMPONENTES_CANDIDATOS.find((d) => existeDir(d));

  const salida: Escaneo = { proyecto, zonas, superficies, artefactos, rutaAdr, adrExiste: adrExistente !== undefined };
  if (verificacion) salida.verificacion = verificacion;
  if (componentesDir) salida.componentesDir = componentesDir;
  return salida;
}

// YAML acepta cadenas con comillas dobles al estilo JSON. Se citan todas para
// no pensar en cuál necesita comillas (`*`, `:`, `#`).
const q = (s: string) => JSON.stringify(s);

export function generarAiFirst(e: Escaneo, hoy: string): string {
  const l: string[] = [];
  l.push('---');
  l.push('# Versión del FORMATO de este archivo, no del proyecto.');
  l.push('formato: 1');
  l.push(`proyecto: ${q(e.proyecto)}`);
  l.push('fase: exploracion              # exploracion | mvp | produccion');
  l.push(`actualizado: ${hoy}`);
  l.push('');
  l.push('# El comando que decide si el proyecto está sano. Lo corre el humano, no el');
  l.push('# detector: audit mide documentación, no compila nada.');
  l.push(e.verificacion ? `verificacion: ${q(e.verificacion)}` : '# verificacion: pnpm build && pnpm test');
  l.push('');
  l.push('# Rutas que el agente no modifica sin aprobación explícita. El criterio es el');
  l.push('# costo de revertir un error ahí, no la importancia del archivo. Pocas, o se');
  l.push('# vuelven ruido. Revisa las sugeridas y completa la razón.');
  l.push('zonas_prohibidas:');
  for (const z of e.zonas) {
    l.push(`  - ruta: ${q(z.ruta)}`);
    l.push(`    razon: ${q(z.razon)}`);
    l.push(`    desde: ${hoy}`);
  }
  l.push('');
  l.push('# Superficies donde un cambio se presume decisión arquitectónica. Si una se toca');
  l.push('# y el ADR no gana una fila, audit emite P1. Las dependencias de producción se');
  l.push('# vigilan solas, sin declararlas.');
  if (e.superficies.length > 0) {
    l.push('superficies_de_decision:');
    for (const s of e.superficies) l.push(`  - ${q(s)}`);
  } else {
    l.push('# superficies_de_decision:');
    l.push('#   - "**/*.config.*"');
    l.push('#   - src/lib/queue.ts');
  }
  l.push('');
  l.push('# Alcance de la sesión en curso. Requiere que las specs listen archivos en una');
  l.push('# sección «Archivos» o «Alcance», con rutas entre acentos graves. Sin esto el');
  l.push('# check se omite.');
  l.push('# alcance:');
  l.push('#   spec: docs/changes/pending/');
  l.push('#   tolerancia: 3');
  l.push('');
  l.push('# Documentos que hablan de ESTE repo. audit verifica que lo que mencionan');
  l.push('# exista. Un check sin su artefacto se omite, nunca se aprueba.');
  l.push('artefactos:');
  for (const [k, v] of Object.entries(e.artefactos)) l.push(`  ${k}: ${q(v)}`);
  if (e.componentesDir) {
    l.push(`  # Hay componentes en ${e.componentesDir}. Para vigilar su inventario, descomenta:`);
    if (!e.artefactos['inventario_componentes']) l.push('  # inventario_componentes: docs/COMPONENTES.md');
    l.push(`  # componentes_dir: ${q(e.componentesDir)}`);
  }
  l.push('---');
  l.push('');
  l.push(`# AI-FIRST.md — ${e.proyecto}`);
  l.push('');
  l.push('> Qué gobierna a este proyecto. Las reglas que el agente obedece están en');
  l.push('> `AGENTS.md`; acá está el mapa que las herramientas verifican.');
  l.push('');
  l.push('## Notas');
  l.push('');
  for (const z of e.zonas) {
    l.push(`Por qué ${q(z.ruta).replace(/"/g, '`')} es Zona Prohibida: _(completar: qué cuesta revertir un error ahí)_.`);
    l.push('');
  }
  return l.join('\n');
}

export function generarAdr(proyecto: string): string {
  return `# Registro de decisiones — ${proyecto}

Una fila por decisión, en orden, sin borrar nunca. Una decisión entra si cumple
las tres: es difícil de revertir, tenía alternativas reales que se descartaron,
y alguien va a preguntar por qué dentro de seis meses.

Un ADR no se edita cuando cambias de opinión: se agrega uno nuevo que lo supera
y el viejo queda marcado como superado, con el enlace.

<!--
## ADR-001 — Título de la decisión

- **Fecha:** AAAA-MM-DD
- **Estado:** aceptada
- **Supera a:** —

**Contexto.** Qué pasaba y por qué había que decidir.

**Decisión.** Qué se eligió.

**Alternativas.** Qué se descartó y por qué.

**Consecuencias.** Qué cambia a partir de ahora, incluido lo incómodo.
-->
`;
}

export interface ResultadoInit {
  escaneo: Escaneo;
  escritos: string[];
}

export async function iniciar(opciones: { raiz: string; hoy?: string }): Promise<ResultadoInit> {
  const { raiz } = opciones;
  if (!esRepoGit(raiz)) throw new ErrorAiFirst(`${raiz} no es un repositorio git.`);

  const rutaAiFirst = join(raiz, NOMBRE_ARCHIVO);
  if (existsSync(rutaAiFirst)) {
    throw new ErrorAiFirst(`Ya existe ${NOMBRE_ARCHIVO}. init no sobreescribe: edítalo a mano o bórralo antes.`);
  }

  const hoy = opciones.hoy ?? new Date().toISOString().slice(0, 10);
  const escaneo = escanear(raiz);
  const escritos: string[] = [];

  const aiFirst = generarAiFirst(escaneo, hoy);
  interpretar(aiFirst); // Lo que init escribe tiene que poder leerlo audit. Si no, es un bug de init.
  await writeFile(rutaAiFirst, aiFirst, 'utf8');
  escritos.push(NOMBRE_ARCHIVO);

  if (!escaneo.adrExiste) {
    await writeFile(join(raiz, escaneo.rutaAdr), generarAdr(escaneo.proyecto), 'utf8');
    escritos.push(escaneo.rutaAdr);
  }

  return { escaneo, escritos };
}
