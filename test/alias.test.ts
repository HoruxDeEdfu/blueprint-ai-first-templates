// El alias `ai-first` sin scope (ADR-002): un segundo paquete en `alias/` que
// depende de `@falcux/ai-first` y expone el mismo bin. Estas pruebas vigilan que
// los dos sigan siendo el mismo paquete con dos nombres: misma versión, mismo
// comando, y que el shim de verdad llegue al CLI real.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { crearRepo } from './ayuda.js';

// Esto corre compilado desde dist/test/, dos niveles bajo la raíz del repo.
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ALIAS = join(RAIZ, 'alias');
const SHIM = join(ALIAS, 'bin', 'ai-first.js');

interface PackageJson {
  name: string;
  version: string;
  private?: boolean;
  bin: Record<string, string>;
  exports?: Record<string, string>;
  files: string[];
  dependencies?: Record<string, string>;
}

function leerPackage(dir: string): PackageJson {
  return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as PackageJson;
}

const raiz = leerPackage(RAIZ);
const alias = leerPackage(ALIAS);

test('el alias se llama ai-first y depende del paquete real por workspace', () => {
  assert.equal(raiz.name, '@falcux/ai-first');
  assert.equal(alias.name, 'ai-first');
  assert.equal(alias.dependencies?.['@falcux/ai-first'], 'workspace:*', 'pnpm lo cambia por la versión exacta al empaquetar');
  assert.equal(Object.keys(alias.dependencies ?? {}).length, 1, 'el alias no trae nada más');
});

test('los dos paquetes van siempre en la misma versión y con el mismo private', () => {
  assert.equal(alias.version, raiz.version, 'ADR-002: el alias apunta siempre a la misma versión');
  assert.equal(alias.private, raiz.private, 'se publican juntos o no se publica ninguno');
});

test('el alias expone el mismo bin, y el raíz exporta el CLI que el shim importa', () => {
  assert.deepEqual(Object.keys(alias.bin), Object.keys(raiz.bin));
  assert.ok(existsSync(join(ALIAS, alias.bin['ai-first']!)));
  assert.ok(alias.files.includes('bin'), 'el shim tiene que viajar en el tarball');

  const shim = readFileSync(SHIM, 'utf8');
  assert.ok(shim.startsWith('#!/usr/bin/env node\n'));
  assert.match(shim, /^import '@falcux\/ai-first\/cli';$/m);
  assert.equal(raiz.exports?.['./cli'], `./${raiz.bin['ai-first']}`, 'el export apunta al mismo archivo que el bin');
});

test('el shim corre el CLI real: --help sale con 0 y muestra la ayuda', () => {
  assert.ok(
    existsSync(join(ALIAS, 'node_modules', '@falcux', 'ai-first')),
    'falta el enlace del workspace: corre `pnpm install`',
  );
  const salida = execFileSync(process.execPath, [SHIM, '--help'], { encoding: 'utf8' });
  assert.match(salida, /^ai-first — gobierno del contexto/);
  assert.match(salida, /ai-first audit \[opciones\]/);
});

test('el shim corre init sobre un repo desechable, igual que el paquete real', () => {
  const repo = crearRepo();
  try {
    repo.escribir('package.json', JSON.stringify({ name: 'demo' }));
    repo.commit('inicio');
    const salida = execFileSync(process.execPath, [SHIM, 'init', '--raiz', repo.raiz], { encoding: 'utf8' });
    assert.match(salida, /escrito\s+AI-FIRST\.md/);
    assert.ok(existsSync(join(repo.raiz, 'AI-FIRST.md')));
  } finally {
    repo.limpiar();
  }
});
