# Deuda de copy conocida

Este archivo registra la **línea base** del copy existente medida contra la skill: cuánto hay de cada desviación, dónde, y qué se decidió hacer con ello. Es la memoria que evita medir dos veces y discutir tres.

**Regla vigente:** la skill gobierna lo nuevo. La deuda **no se reescribe en campaña**; queda documentada y disponible por lotes cuando quien decide el producto lo pida.

Los conteos son la línea base: si vuelven a medirse y **subieron**, la skill no se está aplicando. Es la métrica de enforcement más barata que existe.

---

## Cómo medir

Sobre el archivo de mensajes del idioma principal (`messages/es.json` o equivalente). Cada familia tiene una búsqueda mecánica; el juicio viene después, sobre la lista.

| Familia | Qué buscar | Regla que viola |
|---|---|---|
| Término central en conflicto | Los 2 o 3 términos del glosario que se confunden, en las mismas pantallas | Glosario: sujeto ≠ proceso ≠ evidencia |
| Sinónimos del término canónico | Cada término de la columna «No escribir» del glosario | Un solo término para una sola cosa |
| Familias de verbos | `Eliminar`/`Borrar`/`Remover`, `Agregar`/`Añadir`, `Desactivar`/`Deshabilitar`, `Ver`/`Consultar`/`Revisar` | Un acto, un verbo |
| Segunda persona | Pronombres (`tú`, `tus`, `usted`), **imperativos de 2ª** (`Selecciona`, `Carga`), clíticos (`Corrígelas`, `Publícalo`), futuro de 2ª (`Recibirás`) | Redacción impersonal |
| Primera persona plural | `pudimos`, `enviaremos`, `nuestra` | Redacción impersonal |
| Exclamaciones | `¡` y `!` | Sin exclamaciones fuera de temperatura cálida |
| Title Case | Strings de 2-3 palabras con más de una mayúscula inicial | Sentence case |
| Elipsis ASCII | `...` | Elipsis unicode `…` |
| Idénticos ES == EN | Claves cuyo valor coincide en los dos idiomas | Probablemente sin traducir (revisar: hay legítimos) |
| Contracciones negativas en EN | `can't`, `don't`, `couldn't`, `won't` | Reglas del inglés |
| Trazabilidad interna | Números de ticket, `seed`, `script`, `backend`, `frontend`, nombres de fase | Nada de comentarios de código en copy visible |

**Sobre la segunda persona:** medir solo el pronombre literal subestima la deuda varias veces. El imperativo es la forma «tú» del verbo y tutea igual que el pronombre; en la medición de origen fue el grupo más grande. Buscar las cuatro formas y deduplicar.

**Lo que ninguna búsqueda sobre `messages` ve:** el `<title>` del navegador, los strings hardcodeados en componentes, los textos que el backend escribe en historiales o notificaciones. Se auditan aparte.

## Plantilla de registro

Una sección por familia, con la fecha de medición, el conteo, ejemplos con su clave, y la decisión.

### {N}. {Familia} — {impacto: alto / medio / bajo}

Medido el {fecha}: **{conteo}** strings.

| Dónde | Dice | Debería decir |
|---|---|---|
| `{clave}` | {texto actual} | {texto corregido} |

**Decisión:** {gobierna lo nuevo / lote aprobado el {fecha} / pendiente de quien decide}.

## Orden sugerido para los lotes

Cuando se apruebe reescribir, ir del lote más mecánico al que más criterio exige:

1. **Sinónimos del término canónico** (`coincidencia` → `hallazgo`, o el par que sea tuyo): acotado, mecánico, cero juicio. Buen primer candidato.
2. **Verbos huérfanos** (`Añadir` → `Agregar`, `Deshabilitar` → `Desactivar`): igual de mecánico.
3. **Exclamaciones y elipsis ASCII**: mecánico, pero revisar la temperatura de cada pantalla.
4. **Trazabilidad interna**: pocas ocurrencias, reescritura corta, alto valor.
5. **Segunda persona**: el lote más disperso y el que más criterio exige; cada string se reescribe, no se sustituye.
6. **Inglés como calco**: toca todas las claves y exige fijar la voz antes. No abordarlo primero.

Nunca un barrido completo: un error de criterio se propagaría a todo el producto de golpe. Cada lote va con el diff a la vista y el visto bueno **antes** de tocar archivos.

## Copy escrito el mismo día que la skill

Registrar aparte los strings que se escribieron **después** de adoptar la skill y aun así la violan. Son la evidencia de que el gate no está en el flujo: la skill existía, pero nadie la cargó antes de escribir. Cada caso aquí es un argumento para el ítem del checklist de merge (ver §Enforcement de la skill).
