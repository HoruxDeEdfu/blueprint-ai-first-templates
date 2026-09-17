// Repos git desechables para las pruebas. Cada prueba construye el suyo en un
// directorio temporal y lo borra al final.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export interface Repo {
  raiz: string;
  escribir(ruta: string, contenido: string): void;
  borrar(ruta: string): void;
  git(...args: string[]): string;
  commit(mensaje: string): void;
  limpiar(): void;
}

export function crearRepo(): Repo {
  const raiz = mkdtempSync(join(tmpdir(), 'ai-first-'));
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'pruebas@example.com');
  git('config', 'user.name', 'Pruebas');
  git('config', 'commit.gpgsign', 'false');

  return {
    raiz,
    git,
    escribir(ruta, contenido) {
      const absoluta = join(raiz, ruta);
      mkdirSync(dirname(absoluta), { recursive: true });
      writeFileSync(absoluta, contenido, 'utf8');
    },
    borrar(ruta) {
      rmSync(join(raiz, ruta), { recursive: true, force: true });
    },
    commit(mensaje) {
      git('add', '-A');
      git('commit', '-q', '--allow-empty', '-m', mensaje);
    },
    limpiar() {
      rmSync(raiz, { recursive: true, force: true });
    },
  };
}

/** Un AI-FIRST.md mínimo con lo que cada prueba necesite encima. */
export function aiFirstMd(frontmatterExtra = ''): string {
  return `---
formato: 1
proyecto: pruebas
fase: mvp
${frontmatterExtra}
---

# AI-FIRST.md — pruebas
`;
}
