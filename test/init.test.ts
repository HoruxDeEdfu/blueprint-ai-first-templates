import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { interpretar } from '../src/ai-first-md.js';
import { auditar } from '../src/audit.js';
import { iniciar } from '../src/init.js';
import { crearRepo, type Repo } from './ayuda.js';

async function conRepo(fn: (repo: Repo) => Promise<void>) {
  const repo = crearRepo();
  try {
    await fn(repo);
  } finally {
    repo.limpiar();
  }
}

function proyectoTipico(repo: Repo) {
  repo.escribir('package.json', JSON.stringify({ name: '@acme/crm', scripts: { build: 'tsc', test: 'node --test' } }));
  repo.escribir('pnpm-lock.yaml', '');
  repo.escribir('prisma/migrations/001/migration.sql', 'create table a;');
  repo.escribir('prisma/schema.prisma', 'model A {}');
  repo.escribir('infra/main.tf', 'resource {}');
  repo.escribir('vite.config.ts', 'export default {}');
  repo.escribir('.github/workflows/ci.yml', 'on: push');
  repo.escribir('AGENTS.md', '# Reglas');
  repo.escribir('docs/ARQUITECTURA.md', '# Arq');
  repo.escribir('docs/TECH_NOTES.md', '# Notas');
  repo.escribir('src/components/Boton.tsx', '');
  repo.escribir('LICENSE', 'Apache');
  repo.commit('inicio');
}

test('init escribe AI-FIRST.md con lo que encuentra, y audit lo lee', () =>
  conRepo(async (repo) => {
    proyectoTipico(repo);

    const { escaneo, escritos, saltados } = await iniciar({ raiz: repo.raiz, hoy: '2026-09-17' });
    assert.deepEqual(escritos, ['AI-FIRST.md', 'docs/ADR.md'], 'hay docs/, así que el ADR va ahí');
    assert.deepEqual(saltados, []);

    const texto = readFileSync(join(repo.raiz, 'AI-FIRST.md'), 'utf8');
    const a = interpretar(texto);

    assert.equal(a.proyecto, 'crm', 'sin el scope');
    assert.equal(a.verificacion, 'pnpm run build && pnpm run test');
    assert.equal(a.actualizado, '2026-09-17');

    const rutas = a.zonas_prohibidas.map((z) => z.ruta);
    assert.deepEqual(rutas, ['prisma/migrations/', 'infra/', 'LICENSE', '.env*']);
    assert.ok(a.zonas_prohibidas.every((z) => z.razon && z.desde === '2026-09-17'));

    assert.deepEqual(a.superficies_de_decision, ['**/*.config.*', '**/schema.prisma', '.github/workflows/*.yml']);

    assert.equal(a.artefactos.agents, 'AGENTS.md');
    assert.equal(a.artefactos.arquitectura, 'docs/ARQUITECTURA.md');
    assert.equal(a.artefactos.tech_notes, 'docs/TECH_NOTES.md');
    assert.equal(a.artefactos.adr, 'docs/ADR.md');
    assert.equal(a.artefactos.componentes_dir, undefined, 'sólo sugerido en comentario');
    assert.match(texto, /# componentes_dir: "src\/components\/"/);
    assert.equal(escaneo.componentesDir, 'src/components/');

    assert.match(texto, /# Versión del FORMATO/, 'conserva los comentarios que explican cada bloque');
    assert.match(texto, /Por qué `prisma\/migrations\/` es Zona Prohibida/);

    const informe = await auditar({ raiz: repo.raiz });
    assert.equal(informe.entropia, 0, `lo que init escribe debe auditar limpio:\n${JSON.stringify(informe.resultados, null, 2)}`);
    assert.equal(informe.resultados.find((r) => r.check === 'decision-sin-adr')?.estado, 'aprobado');
  }));

test('init en un repo vacío escribe un esqueleto válido con .env* como única zona', () =>
  conRepo(async (repo) => {
    repo.escribir('README.md', '# Hola');
    repo.commit('inicio');

    const { escritos } = await iniciar({ raiz: repo.raiz, hoy: '2026-09-17' });
    assert.deepEqual(escritos, ['AI-FIRST.md', 'ADR.md']);

    const texto = readFileSync(join(repo.raiz, 'AI-FIRST.md'), 'utf8');
    const a = interpretar(texto);
    assert.deepEqual(a.zonas_prohibidas.map((z) => z.ruta), ['.env*']);
    assert.deepEqual(a.superficies_de_decision, []);
    assert.match(texto, /# superficies_de_decision:/, 'las sugiere comentadas');
    assert.equal(a.verificacion, undefined);
    assert.match(texto, /# verificacion: /);
    assert.equal(a.artefactos.adr, 'ADR.md');

    const adr = readFileSync(join(repo.raiz, 'ADR.md'), 'utf8');
    assert.match(adr, /^# Registro de decisiones/);
    assert.match(adr, /ADR-001/, 'trae el formato de ejemplo, comentado');

    assert.equal((await auditar({ raiz: repo.raiz })).entropia, 0);
  }));

test('init nunca sobreescribe AI-FIRST.md: lo salta, lo reporta y sigue', () =>
  conRepo(async (repo) => {
    const original = '---\nformato: 1\nproyecto: mio\n---\n';
    repo.escribir('AI-FIRST.md', original);
    repo.commit('inicio');

    const { escritos, saltados } = await iniciar({ raiz: repo.raiz });
    assert.deepEqual(saltados, ['AI-FIRST.md']);
    assert.deepEqual(escritos, ['ADR.md'], 'saltar no detiene: el ADR que falta sí se escribe');
    assert.equal(readFileSync(join(repo.raiz, 'AI-FIRST.md'), 'utf8'), original, 'ni un byte distinto');
    assert.ok(existsSync(join(repo.raiz, 'ADR.md')));
  }));

test('init con AI-FIRST.md y ADR ya presentes no escribe nada y no es error', () =>
  conRepo(async (repo) => {
    repo.escribir('AI-FIRST.md', '---\nformato: 1\nproyecto: mio\n---\n');
    repo.escribir('docs/ADR.md', '# Mis decisiones\n');
    repo.commit('inicio');

    const { escritos, saltados } = await iniciar({ raiz: repo.raiz });
    assert.deepEqual(escritos, []);
    assert.deepEqual(saltados, ['AI-FIRST.md', 'docs/ADR.md']);
    assert.equal(readFileSync(join(repo.raiz, 'docs/ADR.md'), 'utf8'), '# Mis decisiones\n');
  }));

test('init respeta un ADR.md que ya existe y lo declara', () =>
  conRepo(async (repo) => {
    repo.escribir('docs/ADR.md', '# Mis decisiones\n\n## ADR-001 — Algo\n');
    repo.commit('inicio');

    const { escritos, saltados } = await iniciar({ raiz: repo.raiz });
    assert.deepEqual(escritos, ['AI-FIRST.md']);
    assert.deepEqual(saltados, ['docs/ADR.md'], 'el ADR existente se reporta como saltado');
    assert.match(readFileSync(join(repo.raiz, 'docs/ADR.md'), 'utf8'), /^# Mis decisiones/);
    const a = interpretar(readFileSync(join(repo.raiz, 'AI-FIRST.md'), 'utf8'));
    assert.equal(a.artefactos.adr, 'docs/ADR.md');
  }));

test('init sin package.json usa el nombre de la carpeta y detecta npm por defecto', () =>
  conRepo(async (repo) => {
    repo.escribir('main.py', 'print(1)');
    repo.commit('inicio');

    const { escaneo } = await iniciar({ raiz: repo.raiz });
    assert.equal(escaneo.proyecto, repo.raiz.split('/').pop());
    assert.equal(escaneo.verificacion, undefined);
  }));

test('init con yarn deduce la verificación con yarn', () =>
  conRepo(async (repo) => {
    repo.escribir('package.json', JSON.stringify({ name: 'x', scripts: { test: 'jest' } }));
    repo.escribir('yarn.lock', '');
    repo.commit('inicio');

    const { escaneo } = await iniciar({ raiz: repo.raiz });
    assert.equal(escaneo.verificacion, 'yarn run test');
  }));

test('init fuera de un repo git es error de uso', async () => {
  await assert.rejects(iniciar({ raiz: '/' }), /no es un repositorio git/);
});
