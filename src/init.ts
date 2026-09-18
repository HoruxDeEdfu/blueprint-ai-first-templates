// `init`: configura un repo para la metodología en un comando. Escanea, escribe
// AI-FIRST.md y el ADR, instala las skills en `.agents/skills/`, crea la
// estructura de `docs/` que los protocolos asumen y mantiene un bloque
// delimitado en AGENTS.md. Es el `init` completo de docs/specs/init-completo.md,
// montado encima del mínimo de ADR-003 (ADR-018).
//
// Lo que NO hace, y por qué: no entrevista ni reescribe skills instaladas
// (hueco 2 del mapa). Reescribir obliga a saber qué escribió la herramienta y
// qué editó el humano, y eso pide el manifiesto que ADR-003 dejó pendiente.
// Esta versión no actualiza nada, así que no lo necesita: crea lo que falta y
// reporta lo que ya estaba. La única excepción es el bloque de AGENTS.md, donde
// las marcas hacen de manifiesto: dentro escribe la herramienta; fuera, nadie.
//
// Regla de oro: nunca sobreescribe. Ni archivos, ni carpetas, ni enlaces. Lo
// que ya existe se salta y se reporta como tal; saltar no es error (ADR-017).
// Una skill que existe se salta ENTERA, no se fusiona (ADR-014). Correrlo dos
// veces deja el repo igual.

import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
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

  // Si no hay ADR, va a docs/: aunque el repo no tenga la carpeta, `iniciar` la
  // crea en la misma corrida para el registro de sesión y el de cambios
  // (pregunta abierta 1 de la spec, decidida por Charlie el 2026-09-18).
  const adrExistente = ['ADR.md', 'docs/ADR.md'].find((c) => archivos.has(c));
  const rutaAdr = adrExistente ?? 'docs/ADR.md';
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

/** La carpeta del cambio en curso: lo que `init` crea y lo que `alcance.spec` apunta. */
export const CARPETA_PENDING = 'docs/changes/pending/';

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
  l.push('# Alcance de la sesión en curso: la spec del cambio abierto (CHG-XXX), que vive');
  l.push('# en la carpeta que init acaba de crear. Requiere que la spec liste archivos en');
  l.push('# una sección «Archivos» o «Alcance», con rutas entre acentos graves. Sin spec');
  l.push('# activa el check se omite, que es lo correcto: no hay alcance que exceder.');
  l.push('alcance:');
  l.push(`  spec: ${CARPETA_PENDING}`);
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

// Las cabeceras del manual, las mismas que llevan los archivos de este repo.
export const SESSION_LOG_INICIAL = `# Session Log

> Registro cronológico de sesiones de implementación. Cada entrada documenta
> qué se hizo, qué cambió, y qué quedó pendiente.
>
> Lo escribe \`protocolo-cierre\` (Fase A); lo verifica el humano (Fase B). Sesión
> más reciente arriba. Es cronología: el estado de hoy vive en el handoff y el
> porqué de cada decisión en el registro de decisiones. Cuando pase de ~50
> entradas, las viejas se archivan en \`docs/SESSION_LOG_ARCHIVE.md\` y acá quedan
> las últimas 20.

---
`;

export const CHANGE_LOG_INICIAL = `# Registro de cambios

> Resumen permanente de cada cambio cerrado con \`protocolo-cambios\`: fecha, tipo,
> archivos, resumen y lecciones. El documento CHG-XXX vive en \`pending/\` mientras
> el cambio está en curso y se elimina al cerrarlo; acá queda su resumen.

---
`;

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

/** Las cinco sin interfaz. `skills/README.md` dice «no instales las diez el primer día». */
export const SKILLS_POR_DEFECTO = ['protocolo-features', 'protocolo-cambios', 'protocolo-cierre', 'version-bump', 'test-fix'];

export const CARPETA_SKILLS = '.agents/skills';
export const ENLACE_CLAUDE = '.claude/skills';

/**
 * La carpeta `skills/` del propio paquete, resuelta desde este módulo: desde
 * `dist/src/init.js` es `../../skills/`, tanto instalado en `node_modules` como
 * en este repo. No depende del directorio de trabajo.
 */
export function carpetaSkillsDelPaquete(): string {
  return fileURLToPath(new URL('../../skills/', import.meta.url));
}

/**
 * Los nombres de las skills de una carpeta: cada subcarpeta con un SKILL.md.
 * Sigue enlaces, porque en el repo del paquete las instaladas son enlaces.
 */
export function skillsDelPaquete(origen: string = carpetaSkillsDelPaquete()): string[] {
  return readdirSync(origen)
    .filter((n) => !n.startsWith('.') && existsSync(join(origen, n, 'SKILL.md')))
    .sort();
}

function existeAlgo(ruta: string): boolean {
  // lstat, no stat: un enlace roto también es «algo en su sitio» y no se pisa.
  try {
    lstatSync(ruta);
    return true;
  } catch {
    return false;
  }
}

function esEnlace(ruta: string): boolean {
  try {
    return lstatSync(ruta).isSymbolicLink();
  } catch {
    return false;
  }
}

/** Resuelve `--skills`: `todas`, una lista con comas, o nada (las cinco por defecto). */
export function elegirSkills(seleccion: string[] | 'todas' | undefined, disponibles: string[]): string[] {
  if (seleccion === undefined) return SKILLS_POR_DEFECTO.filter((s) => disponibles.includes(s));
  if (seleccion === 'todas') return disponibles;
  const nombres = [...new Set(seleccion.map((s) => s.trim()).filter(Boolean))];
  if (nombres.length === 0) throw new ErrorAiFirst('--skills necesita al menos un nombre, o «todas».');
  const desconocidas = nombres.filter((n) => !disponibles.includes(n));
  if (desconocidas.length > 0) {
    throw new ErrorAiFirst(
      `El paquete no trae ${desconocidas.length === 1 ? 'la skill' : 'las skills'} «${desconocidas.join('», «')}». Disponibles: ${disponibles.join(', ')}.`,
    );
  }
  return nombres;
}

// ---------------------------------------------------------------------------
// El bloque de AGENTS.md
// ---------------------------------------------------------------------------

export const MARCA_INICIO = '<!-- ai-first:inicio -->';
export const MARCA_FIN = '<!-- ai-first:fin -->';

// Cuándo se invoca cada skill, en una línea. Es referencia, no regla: la regla
// vive en cada SKILL.md. El orden es el del flujo de trabajo.
const CUANDO_SE_INVOCA: Record<string, string> = {
  'protocolo-features': 'Comando, módulo o feature nuevo, antes de escribir código',
  'protocolo-cambios': 'Algo que ya funciona tiene que cambiar, incluidos los documentos de gobierno; con su CHG aunque sea flujo corto',
  'test-fix': 'Después de implementar, o cuando la suite falla',
  'protocolo-cierre': 'Al cerrar cualquier tramo con commits, y otra vez si después hubo más trabajo',
  'version-bump': 'Después de `protocolo-cierre`, para decidir el número de versión',
  'information-architecture': 'Al crear, mover o renombrar un módulo, ruta o ítem de navegación',
  'protocolo-ux': 'Al diseñar un feature con interfaz, antes de codear',
  'ux-writer': 'Al escribir cualquier texto visible',
  i18n: 'Al agregar textos, plantillas o catálogos',
  'ux-audit': 'Antes de mergear frontend',
};

export interface DatosBloque {
  /** Skills del paquete presentes en `.agents/skills/`, con cómo llegaron. */
  skills: { nombre: string; enlace: boolean }[];
  /** A dónde apuntan los enlaces, ya formateado para la prosa del bloque. */
  origenEnlaces: string;
  rutaAdr: string;
}

export function generarBloqueAgents(d: DatosBloque): string {
  const orden = Object.keys(CUANDO_SE_INVOCA);
  const skills = [...d.skills].sort((a, b) => {
    const ia = orden.indexOf(a.nombre);
    const ib = orden.indexOf(b.nombre);
    return (ia === -1 ? orden.length : ia) - (ib === -1 ? orden.length : ib) || a.nombre.localeCompare(b.nombre);
  });
  const enlazadas = skills.filter((s) => s.enlace).length;
  const como =
    skills.length === 0
      ? ''
      : enlazadas === 0
        ? 'copiadas del paquete `@falcux/ai-first`'
        : enlazadas === skills.length
          ? `como enlaces simbólicos a ${d.origenEnlaces}`
          : `unas copiadas del paquete y otras enlazadas a ${d.origenEnlaces}`;

  const l: string[] = [];
  // H3: el bloque suele caer dentro de una sección ajena y no debe abrir otra.
  l.push('### Metodología AI-First');
  l.push('');
  l.push('> Este bloque lo mantiene `ai-first init`; edita fuera de él. Cada corrida lo');
  l.push('> reescribe con lo que encuentra instalado.');
  l.push('');
  if (skills.length === 0) {
    l.push(`Todavía no hay skills del paquete en \`${CARPETA_SKILLS}/\`.`);
  } else {
    l.push(`Las skills están en \`${CARPETA_SKILLS}/\`, ${como}.`);
    l.push(`Claude Code las lee por \`${ENLACE_CLAUDE}\`. Se invocan **antes** de tocar nada, no después:`);
    l.push('');
    l.push('| Skill | Cuándo |');
    l.push('|---|---|');
    for (const s of skills) l.push(`| \`${s.nombre}\` | ${CUANDO_SE_INVOCA[s.nombre] ?? 'Ver su SKILL.md'} |`);
  }
  l.push('');
  l.push('Dónde escribe cada una, en el vocabulario del manual:');
  l.push('');
  l.push('| El manual dice | Acá es |');
  l.push('|---|---|');
  l.push('| Registro de sesión | `docs/SESSION_LOG.md` |');
  l.push(`| Registro de decisiones | \`${d.rutaAdr}\` |`);
  l.push(`| Cambio en curso / registro de cambios | \`${CARPETA_PENDING}\` → \`docs/changes/CHANGE_LOG.md\` |`);
  return l.join('\n');
}

/**
 * Devuelve el AGENTS.md con el bloque puesto: creado si no existía, añadido al
 * final si no tenía marcas, o con el interior de las marcas reemplazado. Fuera
 * de las marcas no cambia una letra. Con una sola marca, o con las marcas al
 * revés, lanza: un bloque roto se arregla a mano (regla 6 de la spec).
 */
export function ponerBloqueAgents(texto: string | undefined, bloque: string, punteroAlTemplate: string): string {
  const conMarcas = `${MARCA_INICIO}\n${bloque}\n${MARCA_FIN}`;
  if (texto === undefined) {
    return `# AGENTS.md\n\n> Contexto para cualquier agente. Para completarlo, parte de ${punteroAlTemplate}.\n\n${conMarcas}\n`;
  }
  const i = texto.indexOf(MARCA_INICIO);
  const f = texto.indexOf(MARCA_FIN);
  if (i === -1 && f === -1) {
    const separador = texto === '' ? '' : texto.endsWith('\n') ? '\n' : '\n\n';
    return `${texto}${separador}${conMarcas}\n`;
  }
  if (i === -1 || f === -1) {
    throw new ErrorAiFirst(`AGENTS.md tiene la marca ${i === -1 ? MARCA_FIN : MARCA_INICIO} sin su pareja. Arréglalo a mano y vuelve a correr init.`);
  }
  if (f < i) throw new ErrorAiFirst(`AGENTS.md tiene ${MARCA_FIN} antes de ${MARCA_INICIO}. Arréglalo a mano y vuelve a correr init.`);
  return texto.slice(0, i) + conMarcas + texto.slice(f + MARCA_FIN.length);
}

// ---------------------------------------------------------------------------
// iniciar
// ---------------------------------------------------------------------------

export type EstadoItem = 'escrito' | 'saltado' | 'sugerido';

export interface ItemInstalado {
  ruta: string;
  estado: EstadoItem;
  /** Por qué se saltó cuando no es «ya existe», o qué se sugiere. */
  razon?: string;
}

export interface OpcionesInit {
  raiz: string;
  hoy?: string;
  /** Enlaces simbólicos relativos en vez de copias. Para el repo del paquete y los monorepos. */
  enlazar?: boolean;
  /** `--skills`: lista de nombres, `todas`, o nada (las cinco por defecto). */
  skills?: string[] | 'todas';
  /** De dónde salen las skills. Por defecto, la carpeta del paquete. */
  origenSkills?: string;
}

export interface ResultadoInit {
  escaneo: Escaneo;
  /** Cada ítem en el orden en que se procesó. */
  items: ItemInstalado[];
  escritos: string[];
  /** Lo que ya existía y no se tocó. */
  saltados: string[];
  /** Lo que no se escribe porque el archivo ya existía; la razón dice qué añadir. */
  sugeridos: string[];
}

export async function iniciar(opciones: OpcionesInit): Promise<ResultadoInit> {
  const { raiz, enlazar = false } = opciones;
  if (!esRepoGit(raiz)) throw new ErrorAiFirst(`${raiz} no es un repositorio git.`);

  const hoy = opciones.hoy ?? new Date().toISOString().slice(0, 10);
  const origenSkills = opciones.origenSkills ?? carpetaSkillsDelPaquete();
  const disponibles = skillsDelPaquete(origenSkills);

  // Todo lo que puede fallar por uso, antes de escribir nada: un nombre de
  // skill que no existe y un bloque roto en AGENTS.md. Así un error deja el
  // repo como estaba.
  const elegidas = elegirSkills(opciones.skills, disponibles);
  const rutaAgents = join(raiz, 'AGENTS.md');
  const agentsAntes = existsSync(rutaAgents) ? readFileSync(rutaAgents, 'utf8') : undefined;
  ponerBloqueAgents(agentsAntes, '', '');

  const escaneo = escanear(raiz);
  // AGENTS.md va a existir al terminar esta corrida, igual que el ADR: se
  // declara. El registro de sesión y el de cambios no entran: son cronología
  // que nombra lo ya retirado y el check 4 lo cobraría para siempre (ADR-015).
  escaneo.artefactos['agents'] ??= 'AGENTS.md';
  const items: ItemInstalado[] = [];

  const escribirSiFalta = (ruta: string, contenido: string) => {
    const absoluta = join(raiz, ruta);
    if (existeAlgo(absoluta)) {
      items.push({ ruta, estado: 'saltado' });
      return false;
    }
    mkdirSync(dirname(absoluta), { recursive: true });
    writeFileSync(absoluta, contenido, 'utf8');
    items.push({ ruta, estado: 'escrito' });
    return true;
  };

  // 1. AI-FIRST.md, y el alcance sugerido si ya existía.
  const rutaAiFirst = join(raiz, NOMBRE_ARCHIVO);
  if (existsSync(rutaAiFirst)) {
    items.push({ ruta: NOMBRE_ARCHIVO, estado: 'saltado' });
    items.push(sugerirAlcance(readFileSync(rutaAiFirst, 'utf8')));
  } else {
    const aiFirst = generarAiFirst(escaneo, hoy);
    interpretar(aiFirst); // Lo que init escribe tiene que poder leerlo audit. Si no, es un bug de init.
    escribirSiFalta(NOMBRE_ARCHIVO, aiFirst);
  }

  // 2. El ADR.
  if (escaneo.adrExiste) items.push({ ruta: escaneo.rutaAdr, estado: 'saltado' });
  else escribirSiFalta(escaneo.rutaAdr, generarAdr(escaneo.proyecto));

  // 3. La estructura de docs/ que los protocolos asumen.
  escribirSiFalta('docs/SESSION_LOG.md', SESSION_LOG_INICIAL);
  escribirSiFalta('docs/changes/CHANGE_LOG.md', CHANGE_LOG_INICIAL);
  escribirSiFalta(`${CARPETA_PENDING}.gitkeep`, '');

  // 4. Las skills: salta entera la que exista, dice cuál (ADR-014).
  const carpetaSkills = join(raiz, CARPETA_SKILLS);
  for (const nombre of elegidas) {
    const ruta = `${CARPETA_SKILLS}/${nombre}`;
    const destino = join(carpetaSkills, nombre);
    if (existeAlgo(destino)) {
      items.push({ ruta, estado: 'saltado' });
      continue;
    }
    mkdirSync(carpetaSkills, { recursive: true });
    const fuente = join(origenSkills, nombre);
    if (enlazar) {
      // Relativo, nunca absoluto: viaja en git. Entre rutas reales, porque el
      // kernel resuelve cada `..` sobre el camino real: si la raíz vive bajo
      // un enlace —`/var` → `/private/var` en macOS— la cuenta textual de
      // `..` sale corrida y el enlace nace roto.
      symlinkSync(relative(realpathSync(dirname(destino)), realpathSync(fuente)), destino, 'dir');
    } else {
      cpSync(fuente, destino, { recursive: true, filter: (src) => basename(src) !== '.DS_Store' });
    }
    items.push({ ruta, estado: 'escrito' });
  }

  // 5. El enlace para Claude Code, sólo si no hay nada en su sitio (ADR-008).
  const rutaEnlaceClaude = join(raiz, ENLACE_CLAUDE);
  if (existeAlgo(rutaEnlaceClaude)) {
    // Un directorio real ahí es de quien lo puso: `ln -s` habría dejado un
    // `.claude/skills/skills` que no lee nadie.
    items.push(
      esEnlace(rutaEnlaceClaude)
        ? { ruta: ENLACE_CLAUDE, estado: 'saltado' }
        : { ruta: ENLACE_CLAUDE, estado: 'saltado', razon: 'es un directorio real, no un enlace; se deja como está' },
    );
  } else {
    mkdirSync(dirname(rutaEnlaceClaude), { recursive: true });
    symlinkSync(relative(dirname(rutaEnlaceClaude), carpetaSkills), rutaEnlaceClaude, 'dir');
    items.push({ ruta: ENLACE_CLAUDE, estado: 'escrito' });
  }

  // 6. El bloque de AGENTS.md, con lo que de verdad quedó instalado.
  const instaladas = existsSync(carpetaSkills)
    ? skillsDelPaquete(carpetaSkills)
        .filter((n) => disponibles.includes(n))
        .map((nombre) => ({ nombre, enlace: esEnlace(join(carpetaSkills, nombre)) }))
    : [];
  const bloque = generarBloqueAgents({
    skills: instaladas,
    origenEnlaces: origenEnlaces(raiz, origenSkills),
    rutaAdr: escaneo.rutaAdr,
  });
  const agentsDespues = ponerBloqueAgents(agentsAntes, bloque, punteroAlTemplate(raiz, origenSkills));
  if (agentsDespues === agentsAntes) {
    items.push({ ruta: 'AGENTS.md', estado: 'saltado', razon: 'el bloque ya está al día' });
  } else {
    writeFileSync(rutaAgents, agentsDespues, 'utf8');
    items.push({ ruta: 'AGENTS.md', estado: 'escrito' });
  }

  return {
    escaneo,
    items,
    escritos: items.filter((i) => i.estado === 'escrito').map((i) => i.ruta),
    saltados: items.filter((i) => i.estado === 'saltado').map((i) => i.ruta),
    sugeridos: items.filter((i) => i.estado === 'sugerido').map((i) => i.ruta),
  };
}

/**
 * En un AI-FIRST.md que ya existía no se toca nada: si `alcance.spec` no está,
 * se sugiere la línea; si ya está, se dice y no se sugiere nada.
 */
function sugerirAlcance(texto: string): ItemInstalado {
  let declarado = false;
  try {
    declarado = interpretar(texto).alcance.spec !== undefined;
  } catch {
    // Un AI-FIRST.md que audit no puede leer no es asunto de init: se sugiere igual.
  }
  return declarado
    ? { ruta: `${NOMBRE_ARCHIVO} (alcance.spec)`, estado: 'saltado', razon: 'ya declarado' }
    : {
        ruta: `${NOMBRE_ARCHIVO} (alcance.spec)`,
        estado: 'sugerido',
        razon: `añade al frontmatter «alcance:» con «spec: ${CARPETA_PENDING}» para que el check 3 lea el cambio en curso`,
      };
}

/**
 * Cómo nombrar en el bloque la carpeta a la que apuntan los enlaces. Dentro del
 * repo, la ruta entre acentos graves; fuera, en prosa: una ruta con `..` no la
 * resuelve el check 4 y no le dice nada a quien lee.
 */
function origenEnlaces(raiz: string, origenSkills: string): string {
  const relativa = relative(realpathSync(raiz), realpathSync(origenSkills)).replace(/\\/g, '/');
  if (relativa === '') return '`./`';
  if (relativa.startsWith('..')) return 'la carpeta skills del paquete `@falcux/ai-first`';
  return `\`${relativa}/\``;
}

/**
 * Cómo nombrar el template de AGENTS.md desde el repo. Si el paquete está
 * dentro del repo (`node_modules/`, o este mismo repo) va la ruta entre acentos
 * graves, que el check 4 puede resolver; si está fuera —la caché de npx—, va en
 * prosa, porque una ruta con `..` no la resuelve nadie.
 */
function punteroAlTemplate(raiz: string, origenSkills: string): string {
  const template = join(dirname(origenSkills.replace(/\/$/, '')), 'templates', 'AGENTS_MD_TEMPLATE.md');
  const relativa = relative(raiz, template).replace(/\\/g, '/');
  if (relativa.startsWith('..')) return 'AGENTS_MD_TEMPLATE.md, en la carpeta templates del paquete @falcux/ai-first';
  return `\`${relativa}\``;
}
