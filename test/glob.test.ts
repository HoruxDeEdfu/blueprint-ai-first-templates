import assert from 'node:assert/strict';
import { test } from 'node:test';
import { coincide } from '../src/glob.js';

test('prefijo de directorio: todo lo que esté debajo', () => {
  assert.ok(coincide('migrations/', 'migrations/001.sql'));
  assert.ok(coincide('migrations/', 'migrations/2026/001.sql'));
  assert.ok(!coincide('migrations/', 'src/migrations.ts'));
  assert.ok(!coincide('migrations/', 'migrations-old/001.sql'));
});

test('sin barra: nombre de archivo a cualquier profundidad', () => {
  assert.ok(coincide('.env*', '.env'));
  assert.ok(coincide('.env*', '.env.local'));
  assert.ok(coincide('.env*', 'apps/web/.env.production'));
  assert.ok(!coincide('.env*', 'src/environment.ts'));
  assert.ok(coincide('package.json', 'packages/ui/package.json'));
});

test('con barra: ruta completa, * no cruza directorios y ** sí', () => {
  assert.ok(coincide('packages/*/src/index.ts', 'packages/ui/src/index.ts'));
  assert.ok(!coincide('packages/*/src/index.ts', 'packages/ui/lib/src/index.ts'));
  assert.ok(coincide('**/*.config.*', 'astro.config.mjs'));
  assert.ok(coincide('**/*.config.*', 'apps/web/vite.config.ts'));
  assert.ok(!coincide('**/*.config.*', 'src/config.ts'));
  assert.ok(coincide('src/lib/queue.ts', 'src/lib/queue.ts'));
  assert.ok(!coincide('src/lib/queue.ts', 'src/lib/queue.test.ts'));
});

test('los caracteres especiales de regex se escapan', () => {
  assert.ok(!coincide('a.b', 'aXb'));
  assert.ok(coincide('a.b', 'dir/a.b'));
  assert.ok(coincide('lib/(grupo)/x.ts', 'lib/(grupo)/x.ts'));
});
