// Coincidencia de patrones de ruta, sin dependencias.
//
// Las reglas son pocas y explícitas, porque el detector promete correr con
// «git, sistema de archivos y expresiones regulares» y esto es la tercera:
//
//   - `migrations/`      termina en «/»: prefijo de directorio. Coincide con
//                        todo lo que esté debajo, a cualquier profundidad.
//   - `.env*`            sin «/»: se compara contra el nombre del archivo, en
//                        cualquier directorio. Así `.env*` atrapa también a
//                        `apps/web/.env.local`.
//   - `packages/*/src/index.ts`
//                        con «/»: se compara contra la ruta completa desde la
//                        raíz. `*` no cruza directorios; `**` sí.
//
// Las rutas que llegan de git ya vienen relativas a la raíz y con «/», así que
// no se normaliza nada más.

const ESPECIALES = /[.+^${}()|[\]\\]/g;
const MARCA_DOBLE = '';

function segmentoARegex(segmento: string): string {
  let salida = '';
  for (const c of segmento) {
    if (c === '*') salida += '[^/]*';
    else if (c === '?') salida += '[^/]';
    else salida += c.replace(ESPECIALES, '\\$&');
  }
  return salida;
}

export function globARegex(patron: string): RegExp {
  // Prefijo de directorio.
  if (patron.endsWith('/')) {
    const prefijo = patron.slice(0, -1).replace(ESPECIALES, '\\$&');
    return new RegExp(`^${prefijo}(/|$)`);
  }

  // Sin «/»: nombre de archivo a cualquier profundidad.
  if (!patron.includes('/')) {
    return new RegExp(`(^|/)${segmentoARegex(patron)}$`);
  }

  // Con «/»: ruta completa. `**` puede ser cero o más directorios.
  const partes = patron.split('/').map((p) => (p === '**' ? MARCA_DOBLE : segmentoARegex(p)));
  let cuerpo = partes.join('/');
  cuerpo = cuerpo.split(MARCA_DOBLE + '/').join('(?:.*/)?').split(MARCA_DOBLE).join('.*');
  return new RegExp(`^${cuerpo}$`);
}

export function coincide(patron: string, ruta: string): boolean {
  return globARegex(patron).test(ruta);
}

export function coincideAlguno(patrones: readonly string[], ruta: string): string | undefined {
  return patrones.find((p) => coincide(p, ruta));
}
