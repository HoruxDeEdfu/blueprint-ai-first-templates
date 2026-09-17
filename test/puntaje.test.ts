import assert from 'node:assert/strict';
import { test } from 'node:test';
import { codigoDeSalida, contar, entropia } from '../src/puntaje.js';
import type { Resultado } from '../src/verificaciones/tipos.js';

test('el ejemplo de la landing: 1 P0 + 1 P1 + 1 P2 = 68', () => {
  assert.equal(entropia({ p0: 1, p1: 1, p2: 1 }), 68);
});

test('un solo P0 pone el puntaje en 40', () => {
  assert.equal(entropia({ p0: 1, p1: 0, p2: 0 }), 40);
});

test('el techo es 100', () => {
  assert.equal(entropia({ p0: 3, p1: 0, p2: 0 }), 100);
  assert.equal(entropia({ p0: 0, p1: 0, p2: 20 }), 100);
});

test('sin hallazgos, 0', () => {
  assert.equal(entropia({ p0: 0, p1: 0, p2: 0 }), 0);
});

test('códigos de salida: P0 corta siempre; P1/P2 sólo con --estricto', () => {
  assert.equal(codigoDeSalida({ p0: 0, p1: 0, p2: 0 }, false), 0);
  assert.equal(codigoDeSalida({ p0: 0, p1: 0, p2: 0 }, true), 0);
  assert.equal(codigoDeSalida({ p0: 1, p1: 0, p2: 0 }, false), 1);
  assert.equal(codigoDeSalida({ p0: 0, p1: 1, p2: 0 }, false), 0);
  assert.equal(codigoDeSalida({ p0: 0, p1: 1, p2: 0 }, true), 1);
  assert.equal(codigoDeSalida({ p0: 0, p1: 0, p2: 1 }, false), 0);
  assert.equal(codigoDeSalida({ p0: 0, p1: 0, p2: 1 }, true), 1);
});

test('contar sólo mira los resultados con hallazgos', () => {
  const resultados: Resultado[] = [
    { check: 'a', estado: 'aprobado' },
    { check: 'b', estado: 'omitido', razon: 'x' },
    {
      check: 'c',
      estado: 'hallazgos',
      hallazgos: [
        { severidad: 'P0', mensaje: '' },
        { severidad: 'P2', mensaje: '' },
        { severidad: 'P2', mensaje: '' },
      ],
    },
  ];
  assert.deepEqual(contar(resultados), { p0: 1, p1: 0, p2: 2 });
});
