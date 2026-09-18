---
name: information-architecture
description: "Arquitectura de información del producto: qué es una cosa, cómo se llama en cada capa y dónde vive. Reglas de naming (un concepto, un lema), navegación principal vs. configuración, agrupación, modelo de contenido (qué muestra una lista, cuándo un detalle lleva pestañas), relaciones entre módulos y cuándo un cambio de estructura es cambio formal. Activar al diseñar la ESTRUCTURA y el ETIQUETADO de un feature —crear un módulo o ruta, mover algo, renombrar, definir pestañas o columnas, agregar un ítem a la navegación— ANTES de protocolo-ux (comportamiento) y de tu ux-patterns (implementación)."
---

## Cuándo activar

Activar **antes** de `protocolo-ux` cuando la tarea involucra:

- Crear un módulo nuevo o una ruta nueva
- Cambiar dónde vive algo (navegación principal ↔ configuración, lista ↔ detalle)
- Renombrar un recurso, una URL, una etiqueta de menú o una clave de i18n
- Definir las pestañas internas de un detalle
- Agregar un ítem a la navegación
- Decidir cómo se navega entre dos módulos relacionados
- Definir qué columnas muestra una lista o qué ve una tarjeta en móvil
- Auditar una sección del producto que «se siente confusa»

**La capa que cubre cada skill:**

| Skill | Pregunta que responde |
|---|---|
| `information-architecture` (esta) | **¿Qué es esto, cómo se llama y dónde vive?** |
| `protocolo-ux` | ¿Cómo se comporta el usuario al usarlo? |
| tu `ux-patterns` | ¿Con qué tokens, componentes y código lo construyo? |

Las tres se activan en ese orden. Esta skill no reemplaza a las otras dos: decide
la estructura sobre la que ellas trabajan.

---

## Pilares

Seis principios que no dependen del producto. Cuando una decisión de estructura
se discute, se discute contra uno de estos:

1. **LATCH.** Toda información se organiza por *Location*, *Alphabet*, *Time*,
   *Category* o *Hierarchy*. Antes de listar algo, decidir cuál.
2. **Rastro de información** (*information scent*). La etiqueta de un menú
   predice su contenido. Si hay que entrar para saber qué hay, la etiqueta falla.
3. **Ley de Hick.** El tiempo de decisión crece con el número de opciones del
   primer nivel. Hasta 7 por nivel; si crece, agrupar.
4. **Miller (7±2).** Límite de elementos que se sostienen a la vez en un grupo.
5. **Morville.** Un recurso bien diseñado es encontrable, útil, usable,
   creíble, accesible, valioso y deseable. Si falla en encontrable, el resto
   no se ve.
6. **Capas de ritmo** (*pace layering*). Lo que cambia rápido (los datos) no
   vive junto a lo que cambia lento (la configuración estructural). Por eso la
   configuración es su propio universo.

---

## Un concepto, un lema

> Un recurso bien nombrado se llama igual en la base de datos, la API, la URL,
> el i18n, la navegación y los permisos. Si diverge, alguien sufre: el usuario,
> el desarrollador nuevo, o quien vuelva en seis meses.

**Regla de oro:** el nombre del concepto es uno solo. Cada capa cambia la forma
sintáctica, nunca el lema.

| Capa | Convención típica | Correcto | Incorrecto |
|---|---|---|---|
| Modelo de datos | PascalCase | `QuickConsultation` | `quickConsultation` |
| Tabla | snake_case, plural | `quick_consultations` | `quickConsultation` |
| Recurso de permiso | snake_case, plural si es colección | `quick_consultations` | `quick-consultation` |
| Endpoint | kebab-case, plural | `/api/quick-consultations` | `/api/quick_consultation` |
| URL de la interfaz | kebab-case, plural | `/quick-consultations` | `/quick-screening` |
| Clave i18n de primer nivel | camelCase | `quickConsultations` | `quick-consultation` |
| Clave de navegación | kebab-case | `quick-consultations` | `quickConsultation` |
| Etiqueta visible | Sentence case en el idioma del usuario | «Validación simplificada» | «Quick Consultations» |

Las convenciones de la tabla son las habituales; las de tu proyecto pueden ser
otras. Lo que no cambia es la regla: **una forma por capa, un lema para todas**.

**Singular o plural.** Plural cuando el recurso es una colección de entidades
(`counterparts`, `alerts`). Singular cuando es único por cuenta o es un
registro (`audit_log`, `branding`). El sufijo `_config` sólo cuando el recurso
es la *configuración de* otro recurso, no la lista de ese recurso.

**Cuando el nombre de producto y el técnico divergen.** Pasa: el producto
rebautiza algo que el código ya nombró. La regla es una tabla de mapeo **en un
solo sitio** (esta skill, adaptada) y ninguna carpeta nueva con el nombre de
producto: un módulo paralelo por un renombre es la entropía más cara que hay.
El renombre técnico completo, si se decide, es cambio formal.

**Nombres prohibidos:**

- «Herramientas», «Tools»: vacío de rastro. Agrupar por dominio.
- «Otros», «Misc»: la taxonomía no se decidió.
- Nombres que contengan el rol del usuario («Admin», «Manager»): los roles
  deciden visibilidad, no el nombre del recurso.

**La etiqueta visible es copy.** Elegir entre «Áreas», «Equipos» o
«Departamentos» lo decide `ux-writer` con su glosario. La regla de esta skill
es que el lema **no cambia entre pantallas**: si es «Áreas», no aparece como
«Departamento» en otra parte.

---

## Dónde vive

### Navegación principal vs. configuración

La frecuencia de uso decide, no el rol del usuario.

| Navegación principal | Configuración |
|---|---|
| Trabajo diario o semanal | Configuración inicial u ocasional |
| Datos en movimiento (registros) | Estructura estable (catálogos, reglas) |
| El resultado del producto | Cómo se comporta el producto |

Si dudas: *¿el usuario abre esto cada día?* Si la respuesta no es un sí claro,
va en configuración.

**Casos límite se resuelven una vez y se escriben.** Un registro de auditoría
que los responsables consultan durante su trabajo va en la navegación aunque
«parezca» sistema; un log operativo de uso esporádico va en configuración
aunque «parezca» dato. Cada caso resuelto entra en la tabla de la sección de
adaptación, con su razón.

### Agrupación

- Hasta 7 ítems visibles por nivel. Al crecer, **agrupar por dominio**, no por
  jerarquía técnica.
- Una sola sección principal sin etiqueta (inicio + recursos primarios). Varias
  secciones sin etiqueta fragmentan la jerarquía.
- Un grupo con un solo ítem se justifica sólo si el dominio va a crecer. Si el
  ítem queda huérfano, se funde con el grupo más cercano.
- Las URL de configuración son **planas**: `/settings/users`, nunca
  `/settings/people/users`. Los grupos son etiqueta visual del hub, no
  jerarquía de URL.

### «Próximamente»

- Mostrar deshabilitado **sólo si** el usuario tiene el permiso: cuando se
  active, aparece habilitado sin sorpresa. Sin permiso, no existe.
- Si lo no implementado supera el 30 % de un grupo o son 3 ítems seguidos, se
  pliega en una subsección propia para no contaminar la navegación diaria.
- Nunca un `href` real para lo deshabilitado.

---

## Modelo de contenido

### Lista

Muestra **lo mínimo para decidir si entrar al detalle**, no todas las columnas.
En este orden de prioridad:

1. Identificador humano (nombre, razón social, número)
2. Estado actual (badge)
3. Flags críticos (riesgo, alerta activa, vencimiento)
4. Última actualización o asignación
5. Acciones (última columna; el comportamiento lo fija `protocolo-ux`)

Desde la lista sólo se **crea** y se **entra**. Las operaciones de negocio
(aprobar, asignar, ejecutar) viven en el detalle, donde hay contexto. Excepción:
acciones masivas con selección múltiple.

### Detalle

```
Encabezado
├── Identidad (nombre, id, tipo, flags)
├── Estado (visible siempre)
└── Acciones primarias (una o dos)

Cuerpo
├── Pestañas, si hay 3 a 5 secciones heterogéneas
│   o scroll con anclas, si hay 2 o menos
└── Cada sección: título + contenido
```

| Secciones | Estructura |
|---|---|
| ≤ 2 | Scroll vertical con anclas |
| 3 a 5 | Pestañas |
| 6+ | Repensar: hay sub-entidades que merecen ruta propia o drawer |

Las pestañas canónicas de cada entidad se definen en la spec del módulo. Un
detalle cuyas pestañas no están escritas las inventa cada pantalla.

### Drawer

Para sub-contenido que necesita el contexto del padre visible: vista previa de
un documento, historial de un campo, detalle de un elemento dentro de un
resultado. **No** para crear o editar (eso es página) ni para información que
el usuario vaya a querer enlazar después (un drawer no tiene URL).

---

## Navegación entre módulos

Toda relación entre entidades tiene **una dirección canónica**. Si de A se
navega a B, ¿se navega de B a A? Se decide y se escribe.

```
Entidad principal → sus procesos (integrados en el detalle, no módulos aparte)
Entidad principal → sus alertas, sus solicitudes, su línea de tiempo
Alerta → entidad principal (siempre tiene dueño)
Solicitud ↔ entidad principal (bidireccional, declarada)
```

Reglas:

- Una entidad hija **siempre** muestra el enlace de retorno al padre.
- Una entidad padre lista a sus hijas de forma agregada; no replica su detalle.
- **No hay rutas huérfanas:** toda ruta es alcanzable desde la navegación o
  desde un padre.

---

## Cuándo es cambio estructural

La arquitectura de información no es inmutable, pero cambiarla tiene costo que
no se ve en el diff: URL activas, marcadores, integraciones, documentación,
i18n, tests de extremo a extremo.

**Es cambio formal** (skill `protocolo-cambios`), y si la razón puede
preguntarse en seis meses, fila en el `docs/ADR.md`:

- Renombrar un recurso, URL o permiso ya en producción
- Mover algo entre navegación principal y configuración
- Cambiar de capa (lista ↔ detalle) un recurso existente
- Reorganizar los grupos de la navegación o de la configuración
- Modificar el vocabulario de acciones o alcances de permisos

**No lo es:**

- Nombrar algo en un feature que aún no llegó a la rama publicada
- Agregar un ítem siguiendo la taxonomía vigente
- Escribir una decisión que ya existía y no estaba documentada

---

## Frameworks rápidos

**Card sorting mental** (cuando no está claro dónde va algo):

1. Listar todos los ítems del nivel donde se va a insertar el nuevo.
2. Para cada par (existente, nuevo), preguntar: *¿están más relacionados entre
   sí que con cualquier otro?*
3. Dos o tres vecinos claros → va ahí.
4. Sin vecinos claros → candidato a grupo nuevo, o a no estar ahí.

**Test de los cinco segundos:** mostrar el menú a alguien que no conoce el
feature durante cinco segundos y pedirle que diga dónde buscaría «X». Si tarda
más, la etiqueta no tiene rastro.

**Compromisos típicos:**

| Decisión | A favor de A | A favor de B |
|---|---|---|
| Pestaña (A) vs. ruta propia (B) | Parte del mismo expediente, contexto compartido | Contenido pesado, URL compartible, navegación profunda |
| Modal (A) vs. página (B) | ≤ 4 campos, acción única, importa el contexto del padre | Wizard, validaciones complejas, riesgo de perder datos |
| Navegación principal (A) vs. configuración (B) | Trabajo diario, registros en movimiento | Configuración inicial, estructura estable |
| Agrupar (A) vs. lista plana (B) | Más de 7 ítems, dominios identificables | 7 o menos, todos del mismo dominio |

---

## Checklist antes de implementar

**Naming**
- [ ] El recurso se llama igual en modelo, tabla, permiso, endpoint, URL, i18n
      y navegación, con la sintaxis de cada capa.
- [ ] Singular o plural según la convención.
- [ ] La etiqueta visible pasó por `ux-writer` y existe en todos los idiomas.

**Ubicación**
- [ ] Lista en la capa de navegación; detalle y edición en la capa de foco.
- [ ] Navegación principal o configuración según frecuencia, no según rol.
- [ ] Si va a la navegación, su grupo tiene rastro (no «Herramientas»).

**Modelo de contenido**
- [ ] La lista muestra hasta 6 columnas, las necesarias para decidir entrar.
- [ ] El detalle tiene pestañas si hay 3 o más secciones; scroll si hay 2 o menos.
- [ ] Las acciones de negocio viven en el detalle, no en la lista.

**Relaciones**
- [ ] Cada relación tiene dirección canónica escrita.
- [ ] Las hijas enlazan al padre. No hay rutas huérfanas.

**Permisos**
- [ ] Recurso × acción × alcance sigue la matriz del producto.
- [ ] No se introdujo una acción nueva fuera del vocabulario controlado.

**Deuda**
- [ ] Si el feature toca un área con deuda de estructura conocida, quedó escrito
      si la deuda se resuelve, se conserva o crece.

---

## Qué NO hacer

- NO crear un módulo, carpeta o tabla con el nombre de producto cuando ya existe
  con el nombre técnico. Se mapea; no se duplica.
- NO decidir la ubicación por el rol del usuario. Es por frecuencia.
- NO poner «Herramientas» ni «Otros» como grupo.
- NO anidar URL de configuración por grupo.
- NO usar un drawer para crear o editar.
- NO renombrar nada en producción sin cambio formal.
- NO extender la taxonomía de acciones o alcances «de paso» para que un feature
  encaje.

---

## Adaptación a tu proyecto

Esta skill trae los principios y las reglas; tu proyecto le pone el mapa. Al
copiarla, agrega estas cinco secciones al final, y mantenlas: son lo que hace
que la skill responda «dónde vive» con una ruta y no con un criterio.

1. **Sitemap canónico.** Las rutas agrupadas por capa (pública, navegación,
   foco), con la etiqueta visible al lado del identificador técnico. Toda ruta
   nueva tiene que encajar acá. Indica cuál es la fuente de verdad en tiempo de
   ejecución (el archivo que define la navegación) para que el sitemap se
   verifique contra ella y no al revés.
2. **Taxonomía.** Los módulos del producto y su carpeta en el código; los
   recursos, el vocabulario cerrado de acciones (`view`, `create`, `edit`,
   `delete`, `approve`, `assign`, …) y los alcances. Si tienes una matriz de
   permisos, apunta a ella en vez de copiarla.
3. **Tabla producto → técnico.** Cada concepto cuyo nombre visible difiere del
   identificador técnico, y qué capas afecta. Es la tabla que evita el módulo
   paralelo.
4. **Casos límite resueltos.** La tabla de recursos donde la regla
   «diario vs. ocasional» no decidió sola, con la decisión y la razón.
5. **Deuda de estructura conocida.** Numerada, con estado. No bloquea features;
   obliga a decir, al tocar el área, qué pasa con ella. Táchala cuando se
   resuelva; no la borres: el tachado es la evidencia de que se pagó.

Si tu producto es un sitio de contenido y no una aplicación, la sección
«Modelo de contenido» se reduce a lista y detalle sin pestañas, y la de
permisos desaparece; los pilares y las reglas de naming aplican igual.

Skills relacionadas: `protocolo-ux` (el comportamiento sobre esta estructura),
`ux-writer` (la etiqueta visible), `protocolo-cambios` (cuando la estructura
cambia en producción).
