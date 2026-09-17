// `audit`: lee AI-FIRST.md, pregunta a git qué cambió, corre las cinco
// verificaciones y resume. No compila nada ni toca la red.

import { ErrorAiFirst, leer, registrarAuditoria, type AiFirst } from './ai-first-md.js';
import { archivosCambiados, esRepoGit, existeRef } from './git.js';
import { codigoDeSalida, contar, entropia, type Conteo } from './puntaje.js';
import { VERIFICACIONES, type Contexto, type Resultado } from './verificaciones/index.js';

export interface OpcionesAudit {
  raiz: string;
  base?: string;
  estricto?: boolean;
  /** Escribe `auditoria` en el frontmatter. Sólo a pedido: ver SPEC-PAQUETE.md §5. */
  registrar?: boolean;
  /** Fecha para `auditoria.fecha`; por defecto, hoy en ISO. Inyectable para las pruebas. */
  hoy?: string;
}

export interface InformeAudit {
  aiFirst: AiFirst;
  modo: 'arbol' | 'rango';
  base?: string;
  cambiados: string[];
  resultados: Resultado[];
  conteo: Conteo;
  entropia: number;
  codigoDeSalida: 0 | 1;
}

export async function auditar(opciones: OpcionesAudit): Promise<InformeAudit> {
  const { raiz, base } = opciones;

  if (!esRepoGit(raiz)) throw new ErrorAiFirst(`${raiz} no es un repositorio git.`);
  if (base && !existeRef(raiz, base)) throw new ErrorAiFirst(`La ref «${base}» no existe en este repositorio.`);

  const aiFirst = await leer(raiz);
  const cambiados = archivosCambiados(raiz, base);
  const ctx: Contexto = base ? { raiz, aiFirst, base, cambiados } : { raiz, aiFirst, cambiados };

  const resultados: Resultado[] = [];
  for (const v of VERIFICACIONES) resultados.push(await v.correr(ctx));

  const conteo = contar(resultados);
  const puntaje = entropia(conteo);

  if (opciones.registrar) {
    await registrarAuditoria(raiz, {
      fecha: opciones.hoy ?? new Date().toISOString().slice(0, 10),
      entropia: puntaje,
      hallazgos: conteo,
    });
  }

  const informe: InformeAudit = {
    aiFirst,
    modo: base ? 'rango' : 'arbol',
    cambiados,
    resultados,
    conteo,
    entropia: puntaje,
    codigoDeSalida: codigoDeSalida(conteo, opciones.estricto ?? false),
  };
  if (base) informe.base = base;
  return informe;
}
