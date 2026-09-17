// Check 5 — Inventario de componentes desactualizado (P2).
//
// Componentes agregados o eliminados en `componentes_dir` que no aparecen en
// `inventario_componentes`. Compara nombres de archivo contra menciones; es por
// nombre, así que un renombre sin actualizar el inventario también lo caza.
//
// Dos direcciones:
//   - un componente en disco que el inventario no menciona → sin inventariar;
//   - un encabezado del inventario con forma de componente (PascalCase) que no
//     existe en disco → inventariado pero inexistente. Se limita a encabezados
//     para no confundir un tipo o una prop mencionados al pasar con un
//     componente que se borró.

import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, extname, join, relative, resolve } from 'node:path';
import { encabezados } from '../markdown.js';
import { conHallazgos, omitido, type Hallazgo, type Verificacion } from './tipos.js';

const EXTENSIONES = new Set(['.astro', '.tsx', '.jsx', '.vue', '.svelte', '.ts', '.js']);
const AUXILIAR = /\.(test|spec|stories|d)\.[a-z]+$/i;
const PASCAL_CASE = /^[A-Z][A-Za-z0-9]+$/;

async function componentesEn(dir: string): Promise<Map<string, string>> {
  const nombres = new Map<string, string>(); // nombre → ruta relativa al dir
  async function recorrer(actual: string): Promise<void> {
    for (const entrada of await readdir(actual, { withFileTypes: true })) {
      if (entrada.name.startsWith('.') || entrada.name.startsWith('_') || entrada.name === 'node_modules') continue;
      const ruta = join(actual, entrada.name);
      if (entrada.isDirectory()) {
        await recorrer(ruta);
        continue;
      }
      if (!EXTENSIONES.has(extname(entrada.name)) || AUXILIAR.test(entrada.name)) continue;
      let nombre = basename(entrada.name, extname(entrada.name));
      // `Boton/index.tsx` es el componente `Boton`. Un `index` en la raíz del
      // directorio es el barril de exportación, no un componente.
      if (nombre === 'index') {
        if (actual === dir) continue;
        nombre = basename(actual);
      }
      if (!nombres.has(nombre)) nombres.set(nombre, relative(dir, ruta));
    }
  }
  await recorrer(dir);
  return nombres;
}

function mencionaNombre(texto: string, nombre: string): boolean {
  const escapado = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z0-9_])${escapado}([^A-Za-z0-9_]|$)`).test(texto);
}

export const inventarioComponentes: Verificacion = {
  id: 'inventario-componentes',
  nombre: 'Inventario de componentes desactualizado',
  severidad: 'P2',

  async correr(ctx) {
    const { inventario_componentes: inventario, componentes_dir: dir } = ctx.aiFirst.artefactos;
    if (!inventario || !dir) {
      return omitido(this.id, 'faltan «artefactos.inventario_componentes» o «artefactos.componentes_dir»');
    }

    const dirAbsoluto = resolve(ctx.raiz, dir);
    const inventarioAbsoluto = resolve(ctx.raiz, inventario);
    try {
      if (!(await stat(dirAbsoluto)).isDirectory()) return omitido(this.id, `${dir} no es un directorio`);
    } catch {
      return omitido(this.id, `${dir} no existe`);
    }
    let texto: string;
    try {
      texto = await readFile(inventarioAbsoluto, 'utf8');
    } catch {
      return omitido(this.id, `${inventario} no existe (lo reporta el check de artefactos huérfanos)`);
    }

    const componentes = await componentesEn(dirAbsoluto);
    const hallazgos: Hallazgo[] = [];

    for (const [nombre, ruta] of componentes) {
      if (mencionaNombre(texto, nombre)) continue;
      hallazgos.push({
        severidad: 'P2',
        ruta: join(dir, ruta),
        mensaje: `${nombre} existe en ${dir} y no aparece en ${basename(inventario)}`,
      });
    }

    // Un encabezado afirma que existe un componente si va entre acentos graves
    // o ángulos (`Boton`, <Boton>), o si tiene joroba interna (BotonPrimario).
    // Una palabra capitalizada suelta —«Formularios», «Componentes»— es un
    // título de sección en español, no una afirmación, y se deja pasar. El
    // título del documento (nivel 1) nunca cuenta.
    for (const enc of encabezados(texto)) {
      if (enc.nivel === 1) continue;
      const marcado = /^(`[^`]+`|<[^>]+>)$/.test(enc.texto);
      const titulo = enc.texto.replace(/^[`<]+|[`>/]+$/g, '').trim();
      if (!PASCAL_CASE.test(titulo) || componentes.has(titulo)) continue;
      if (!marcado && !/[a-z0-9][A-Z]/.test(titulo)) continue;
      hallazgos.push({
        severidad: 'P2',
        ruta: `${inventario}:${enc.linea}`,
        mensaje: `${basename(inventario)} documenta ${titulo}, que ya no existe en ${dir}`,
      });
    }

    return conHallazgos(this.id, hallazgos);
  },
};
