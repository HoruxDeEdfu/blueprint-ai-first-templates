# SPEC por módulo — Template reutilizable

> Este template define la spec de **un** módulo: la fuente de verdad sobre
> **cómo se construye**, autocontenida, que la AI carga sólo cuando trabaja en
> ese módulo. El **qué** y el **para quién** viven en el PRD; el **porqué** de
> las decisiones, en el `ADR.md`; el mapa entre módulos, en la arquitectura.
>
> **Principio:** Una spec se escribe para que el agente no necesite cargar el
> PRD completo ni adivinar. Si un implementador con la spec abierta tiene que
> preguntar algo, la spec está incompleta. Si supera ~120 líneas, está
> absorbiendo algo de otro documento o el módulo son dos.
>
> **Carga bajo demanda.** El `AGENTS.md` no la incluye: apunta a la carpeta.
> El agente abre `docs/specs/{modulo}.md` al empezar a trabajar en ese módulo
> y no antes. Por eso puede ser prescriptiva sin costar presupuesto en cada turno.

---

## Cómo usar este template

1. Copiar como `docs/specs/{modulo}.md`, un archivo por módulo del mapa de la
   arquitectura. Nombre en kebab-case, igual que el módulo en el código
2. Llenar las secciones **[OBLIGATORIO]** antes de implementar: son las que el
   protocolo de features verifica en su paso 1. Las **[OPCIONAL]** se agregan
   si el módulo las necesita; las **[CRECE]** se llenan durante y después.
   Las secciones no van numeradas: el detector busca la que **empieza** por
   «Archivos»
3. Mantener `docs/specs/README.md` como índice (apéndice al final de este
   template)
4. Cuando un cambio (CHG) cierra, actualizar la spec: el cambio deja de ser
   cambio y pasa a ser el estado del módulo
5. Si el módulo supera las 120 líneas, dividir en una carpeta
   `docs/specs/{modulo}/` con una spec por submódulo y dejar la general como índice
6. Eliminar las notas del final (`# Notas sobre el template`) en la copia

---

# {Nombre del Módulo}

> {Una o dos líneas: qué hace este módulo y por qué existe.}

- **Referencia PRD:** §{secciones que cubre}
- **Estado:** {borrador / vigente / en cambio: CHG-XXX}
- **Versión de la spec:** {n} — ver changelog al final
- **Código backend:** `{ruta_del_modulo_backend}`
- **Código frontend:** `{ruta_del_modulo_frontend}` [si aplica]

## Contexto de negocio [OBLIGATORIO]

{Descripción funcional extraída del PRD, no copiada. Incluir:
- qué problema resuelve;
- quién lo usa (roles);
- cómo se relaciona con otros módulos;
- el flujo principal, paso a paso, desde la perspectiva del usuario.}

**Flujo principal:** {paso 1} → {paso 2} → {paso 3} → {resultado}.

## Alcance [OBLIGATORIO]

**Incluye:**
- {lo que este módulo hace}

**No incluye:**
- {lo que parece de este módulo y vive en otro, o lo que quedó fuera del
  producto a propósito, con el CHG o la fecha de esa decisión}

**No debe tocar:** {módulos, tablas o rutas que este módulo consume pero no
modifica. Si alguna es Zona Prohibida en `AI-FIRST.md`, decirlo.}

## Modelo de datos [OBLIGATORIO si el módulo persiste datos]

{Sólo los modelos de este módulo, extraídos del schema. Sin las relaciones
hacia módulos externos, que se describen en prosa.}

```
// Copiar sólo los modelos relevantes, en la sintaxis del ORM del proyecto
model {Entidad} {
  // campos relevantes, con el comentario que explique lo no obvio
}
```

**Relaciones clave:** {en prosa: qué apunta a qué y qué pasa al borrar.}

**Invariantes:** {lo que la base garantiza y lo que garantiza el código.}

## Permisos [OPCIONAL — si el producto tiene roles]

{Sólo las filas que aplican a este módulo. La matriz completa vive en su
propio documento.}

| Recurso | Acción | {Rol A} | {Rol B} | {Rol C} | Alcance |
|---|---|:---:|:---:|:---:|---|
| `{recurso}` | {ver / crear / editar / borrar} | {✓ / ✗ / condicional} | {…} | {…} | {propio / área / todo} |

## API y contratos [OPCIONAL — si el módulo expone endpoints]

| Método | Ruta | Descripción | Permiso |
|---|---|---|---|
| GET | `/{recurso}` | Listar | `{recurso}.view` |
| POST | `/{recurso}` | Crear | `{recurso}.create` |
| GET | `/{recurso}/:id` | Detalle | `{recurso}.view` |
| PUT | `/{recurso}/:id` | Actualizar | `{recurso}.edit` |

**Schemas de validación:** {dónde viven; qué se valida en el borde y qué en el dominio.}

## Interfaz [OPCIONAL — si el módulo tiene UI]

### Páginas y componentes

| Pantalla o componente | Ruta o ubicación | Capa de navegación | Descripción |
|---|---|---|---|
| {Listado} | `{ruta}` | {explorar} | {listado con filtros} |
| {Detalle} | `{ruta}` | {detalle} | {…} |
| {Creación} | `{ruta}` | {crear} | {…} |

Los componentes compartidos que use se toman del inventario; los que cree,
entran al inventario en el mismo commit.

### Estados

| Estado | Qué se muestra |
|---|---|
| Cargando | {…} |
| Vacío | {…} |
| Error | {…} |
| Éxito | {…} |

### Copy [OPCIONAL]

{Textos visibles listos para implementar, en cada idioma del producto, o la
referencia a las claves de i18n. Siguen el glosario del proyecto.}

### Accesibilidad [OPCIONAL]

{Foco, teclado, ARIA, contraste, movimiento reducido: lo específico de este
módulo. Lo general está en la guía de diseño.}

## Dependencias [OBLIGATORIO]

- **Depende de:** {módulos que consume, y para qué}
- **Dependientes:** {módulos que lo consumen}
- **Servicios externos:** {APIs, colas, almacenamiento} [si aplica]

Una flecha nueva acá es una flecha nueva en el mapa de módulos de la
arquitectura y, casi siempre, una decisión para el ADR.

## Reglas de negocio [OBLIGATORIO]

{Las reglas que el agente debe respetar al implementar. Lista corta,
imperativa, una regla por línea. Si una regla nació de un cambio, citarlo.}

- {Regla 1}
- {Regla 2} (CHG-XXX)
- {Regla N}

## Archivos del módulo [OBLIGATORIO]

> Rutas entre acentos graves. Es lo que define el alcance de una sesión que
> trabaje en este módulo y lo que el detector compara contra los archivos
> tocados cuando `alcance.spec` apunta a esta spec.

- `{ruta_del_modulo_backend}/**`
- `{ruta_del_modulo_frontend}/**`
- `{ruta_de_schemas_compartidos}`
- `{ruta_de_mensajes_i18n}` [si aplica]

## Criterios de aceptación [OBLIGATORIO]

{Concretos y verificables. Extraídos del PRD, sólo los de este módulo. Cada
uno tiene que poder convertirse en un test o en una comprobación manual
escrita.}

- [ ] {Criterio 1}
- [ ] {Criterio 2}
- [ ] {Criterio N}

## Estado de implementación [CRECE]

### Implementado

- {qué existe, con el CHG o la sesión que lo trajo}

### Pendiente

- {qué falta, y si está bloqueado por algo}

## Notas de implementación [CRECE]

{Lo que el agente necesita saber y no está en las secciones anteriores: casos
borde, trampas de este módulo, decisiones locales que no ameritan ADR. Es el
destino «decisión de un módulo específico» del protocolo de cierre.}

## Preguntas abiertas [OPCIONAL]

1. {Pregunta} — **Respuesta:** {pendiente / lo decidido, con fecha}

---

## Changelog de esta spec

| Versión | Fecha | Cambio | Origen |
|---|---|---|---|
| {n} | {YYYY-MM-DD} | {qué sección cambió y por qué} | {CHG-XXX / sesión} |

---

## Apéndice — El índice `docs/specs/README.md`

Una carpeta de specs sin índice es una carpeta que la AI recorre entera. El
README de la carpeta lleva esto, y nada más:

```markdown
# Specs por módulo

> Documentación técnica de cada módulo. Un archivo por módulo. Cada spec es la
> fuente de verdad sobre **cómo se construye**; el **qué** y el **por qué**
> viven en el PRD y en el ADR.

## Convenciones

- Nombre de archivo: `{modulo}.md`, kebab-case, igual que el módulo en el código.
- Cada spec referencia las secciones del PRD que cubre.
- Los tokens de diseño se nombran, no se definen: la definición está en la guía de diseño.
- La AI carga la spec antes de implementar. Debe ser prescriptiva: sin adivinanzas.
- Cuando una spec cambia, su versión sube y el changelog interno lo anota.
- Más de 120 líneas: dividir en `{modulo}/` con una spec por submódulo.

## Estado

| Módulo | PRD | Spec | Estado | Prioridad |
|---|---|---|---|---|
| {Nombre} | §{n} | `{modulo}.md` | {borrador / vigente} | {alta / media / baja} |
```

---

# Notas sobre el template

## Spec, PRD, arquitectura, ADR y CHG: quién guarda qué

| Pregunta | Documento |
|---|---|
| ¿Qué construimos y para quién? | `docs/PRD.md` |
| ¿Cómo se organiza el sistema y qué módulo hace qué? | `docs/ARQUITECTURA.md` |
| ¿Cómo se construye **este** módulo? | **La spec**, este documento |
| ¿Por qué se eligió esto y no aquello? | `ADR.md` |
| ¿Qué cambió después de implementado, y por qué? | El CHG mientras está abierto; la spec, cuando cierra |

La spec es el único de los cinco que se lee **completo** antes de escribir
código. Por eso tiene techo de líneas: es presupuesto de contexto que se gasta
en cada sesión del módulo.

## De dónde sale este formato

En un proyecto real de cinco meses la carpeta de specs llegó a 26 archivos,
más dos subcarpetas para los módulos que superaron el techo. Tres cosas que
ese volumen enseñó y que este template ya trae:

1. **La spec autocontenida gana a la spec que remite.** Las primeras specs
   decían «ver PRD §4.2»; el agente cargaba el PRD entero, 80.000 caracteres,
   para leer una sección. Extraer lo relevante cuesta diez minutos una vez y
   ahorra tokens en cada sesión después.
2. **El estado de implementación dentro de la spec.** Sin él, la spec describe
   un módulo ideal y el agente no sabe qué existe y qué no; implementa algo
   pendiente creyendo que falta, o rehace algo hecho. Dos listas —implementado,
   pendiente— con el cambio que trajo cada cosa resuelven la mitad de las
   preguntas de una sesión nueva.
3. **Las reglas de negocio citan su cambio.** «Los hits ya no generan alertas
   (CHG-201)» se puede rastrear; «los hits no generan alertas» a secas se
   discute de nuevo cada tres meses.

## Qué no va acá

- **Tokens, colores y tipografía:** guía de diseño.
- **La tabla de props de un componente:** TypeScript, y el inventario para el
  cuándo usarlo.
- **El schema completo:** sólo los modelos de este módulo, y sin las
  relaciones hacia afuera.
- **El porqué de una decisión difícil de revertir:** ADR. La spec dice qué
  rige; puede citar la fila.
- **Un fix de una librería:** TECH_NOTES. La spec no es un catálogo de
  cicatrices, aunque «Notas de implementación» pueda apuntar a una.

## Sobre el check 3 del detector

`alcance.spec` en `AI-FIRST.md` acepta un archivo o una carpeta. Con la carpeta
de cambios pendientes, el alcance de la sesión son los CHG abiertos. Con una
spec de módulo, el alcance son los archivos de «Archivos del módulo»: sirve cuando se implementa
un módulo nuevo y todavía no hay CHG. El detector busca una sección cuyo
título empiece por «Archivos» o «Alcance» y toma las rutas entre acentos
graves, con globs; por eso la sección se llama así, **sin número delante**:
el título tiene que empezar por la palabra. La spec en sí, `AI-FIRST.md` y los
artefactos declarados nunca cuentan como fuera de alcance.
