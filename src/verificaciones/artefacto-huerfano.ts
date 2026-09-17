// Check 4 — Artefacto huérfano (P2).
//
// Resuelve cada ruta referenciada desde los documentos declarados en
// `artefactos` y verifica que el destino exista. Determinista.
//
// Dos cosas cuentan como huérfano: un artefacto declarado que no existe, y una
// ruta mencionada dentro de un artefacto —en un enlace o entre acentos graves—
// que no resuelve. Los bloques de código no se miran: ahí las rutas son ejemplos.
//
// Cómo resuelve, en orden:
//
//   1. Desde la raíz del repo y desde la carpeta del documento.
//   2. Si el token es un nombre sin carpeta (`expediente.ts`), por nombre de
//      archivo en todo el repo: la prosa nombra archivos, no los ubica.
//   3. Si el token tiene carpeta y su PRIMER segmento no existe en la raíz
//      (`docs/ADR.md` en un repo sin `docs/`), se asume que habla de otro árbol
//      —otro proyecto, un ejemplo, un repo externo— y no se reporta. Un check
//      que no puede verificar algo no lo cuenta como fallo.
//
// Esas reglas salieron de correr el detector contra un repo real; sin la 2 y la
// 3 producía 63 hallazgos, y menos de cinco eran ciertos.

import { readFile, stat } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { listarArchivos } from '../git.js';
import { normalizarRuta, referenciasARutas } from '../markdown.js';
import { conHallazgos, omitido, type Hallazgo, type Verificacion } from './tipos.js';

async function existe(ruta: string): Promise<boolean> {
  try {
    await stat(ruta);
    return true;
  } catch {
    return false;
  }
}

type Veredicto = 'existe' | 'falta' | 'ajeno';

class Resolutor {
  private nombres: Set<string> | undefined;

  constructor(private readonly raiz: string) {}

  /** Nombres de archivo y de carpeta de todo el repo, sin ruta. */
  private indiceDeNombres(): Set<string> {
    if (!this.nombres) {
      this.nombres = new Set<string>();
      for (const ruta of listarArchivos(this.raiz)) {
        this.nombres.add(basename(ruta));
        for (const segmento of dirname(ruta).split('/')) if (segmento && segmento !== '.') this.nombres.add(segmento);
      }
    }
    return this.nombres;
  }

  async resolver(documento: string, referencia: string): Promise<Veredicto> {
    const limpia = normalizarRuta(referencia);
    if (limpia === '' || limpia === '.') return 'existe';

    if (await existe(resolve(this.raiz, limpia))) return 'existe';
    if (await existe(resolve(this.raiz, dirname(documento), limpia))) return 'existe';

    if (!limpia.includes('/')) {
      return this.indiceDeNombres().has(limpia) ? 'existe' : 'falta';
    }

    const primerSegmento = limpia.split('/')[0] as string;
    if (primerSegmento === '.' || primerSegmento === '..') return 'falta';
    return (await existe(resolve(this.raiz, primerSegmento))) ? 'falta' : 'ajeno';
  }
}

export const artefactoHuerfano: Verificacion = {
  id: 'artefacto-huerfano',
  nombre: 'Artefacto huérfano',
  severidad: 'P2',

  async correr(ctx) {
    const entradas = Object.entries(ctx.aiFirst.artefactos).filter(([, v]) => v !== undefined) as [string, string][];
    if (entradas.length === 0) return omitido(this.id, 'no hay «artefactos» declarados');

    const resolutor = new Resolutor(ctx.raiz);
    const hallazgos: Hallazgo[] = [];

    for (const [clave, ruta] of entradas) {
      const absoluta = resolve(ctx.raiz, ruta);
      if (!(await existe(absoluta))) {
        hallazgos.push({
          severidad: 'P2',
          ruta,
          mensaje: `«artefactos.${clave}» apunta a ${ruta}, que no existe`,
        });
        continue;
      }

      // Los directorios sólo tienen que existir; los documentos se recorren.
      if ((await stat(absoluta)).isDirectory()) continue;

      const texto = await readFile(absoluta, 'utf8');
      const vistas = new Set<string>();
      for (const ref of referenciasARutas(texto)) {
        const limpia = normalizarRuta(ref.texto);
        if (vistas.has(limpia)) continue;
        vistas.add(limpia);
        if ((await resolutor.resolver(ruta, ref.texto)) !== 'falta') continue;
        hallazgos.push({
          severidad: 'P2',
          ruta: `${ruta}:${ref.linea}`,
          mensaje: `${ruta} menciona ${ref.texto}, que no existe`,
        });
      }
    }

    return conHallazgos(this.id, hallazgos);
  },
};
