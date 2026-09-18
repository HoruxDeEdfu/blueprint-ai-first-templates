# ARQUITECTURA.md — Template reutilizable

> Este template define la estructura del documento de arquitectura de un
> proyecto construido con AI coding agents: el plano técnico que implementa el
> PRD. Es el eslabón 2 de la cadena de artefactos.
>
> **Principio:** Este es un **documento de estado**: describe cómo es el sistema
> hoy, y cuando algo cambia, se sobreescribe. El **porqué** de cada decisión no
> vive acá sino en el `ADR.md`, que se agrega y nunca se edita. Los dos se
> necesitan: sin arquitectura la AI no sabe dónde poner el código; sin ADR
> nadie sabe por qué está ahí.
>
> **Relación con otros documentos:**
> - `docs/PRD.md` decide **qué** se construye; este documento decide **cómo**
> - `AGENTS.md` lleva las **reglas activas** derivadas de esta arquitectura, no la arquitectura
> - Las specs por módulo detallan **cada módulo**; acá va el mapa entre ellos
> - `ADR.md` guarda **por qué** se eligió cada cosa y qué se descartó

---

## Cómo usar este template

1. Copiar como `docs/ARQUITECTURA.md` en el proyecto
2. Llenar las secciones **[OBLIGATORIO]** antes de la primera sesión de
   implementación; las **[CRECE CON EL PROYECTO]** se llenan a medida que los
   módulos existen
3. Declararlo en `AI-FIRST.md` bajo `artefactos.arquitectura` para que el
   detector verifique que las rutas que menciona existen
4. Cada vez que este documento cambie una decisión, escribir la fila
   correspondiente en `ADR.md` en el mismo commit y apuntarla desde §10
5. Eliminar las notas del final (`# Notas sobre el template`) cuando el
   documento esté en uso

---

# ARQUITECTURA — {Nombre del Proyecto}

> **Proyecto:** {nombre y una línea de qué es}
> **Stack:** {resumen en una línea: frontend + backend + datos + infra}
> **Patrón:** {ej. Clean Architecture en 3 capas, monorepo}
> **Última revisión:** {YYYY-MM-DD}
> **PRD de referencia:** `docs/PRD.md`

---

## 1. Stack tecnológico [OBLIGATORIO]

Una línea por capa, con versión mayor. Las versiones exactas viven en el
manifiesto del paquete; acá va lo que cambia cómo se escribe el código.

| Capa | Tecnología | Versión | Nota |
|---|---|---|---|
| Frontend | {framework, UI, estilos, i18n} | {N} | {…} |
| Backend | {framework, validación, ORM} | {N} | {…} |
| Datos | {motor, hosting} | {N} | {…} |
| Auth | {proveedor → mecanismo → estrategia} | — | {…} |
| Jobs / colas | {…} | {N} | {…} |
| Almacenamiento | {…} | — | {…} |
| Infra | {hosting frontend, backend, CI/CD} | — | {…} |
| Monorepo | {gestor de paquetes, orquestador} | {N} | {…} |

---

## 2. Arquitectura general [OBLIGATORIO]

Un diagrama de cajas, en texto, que muestre las piezas y cómo se hablan. Lo
que la AI necesita saber antes de tocar cualquier módulo: qué hay, qué llama a
qué, y por dónde entra un request.

```
┌──────────────────────────────────────────┐
│               FRONTEND                    │
│   {framework}   ·   {módulos visibles}    │
└──────────────┬───────────────────────────┘
               │ {protocolo: REST / SSE / …}
               ▼
┌──────────────────────────────────────────┐
│               BACKEND                     │
│   {módulos}   ·   {pilares transversales} │
└──────┬───────────────┬───────────────────┘
       ▼               ▼
   {base de datos}   {servicios externos}
```

---

## 3. Estructura del repositorio [OBLIGATORIO]

> El árbol vive **acá**, no en el `AGENTS.md`: es derivable de `ls`, así que
> en el archivo que la AI lee en cada turno sólo ocupa presupuesto. Acá se lee
> cuando hace falta y con las anotaciones que `ls` no da.

```
{nombre}/
├── apps/
│   ├── web/                    → {qué es, qué framework}
│   │   ├── app/                → {convención de rutas, grupos de layout}
│   │   ├── components/         → {componentes privados de la app}
│   │   └── lib/                → {utilidades, cliente API}
│   └── api/                    → {qué es, qué framework}
│       └── src/
│           ├── modules/        → {un módulo por dominio, ver §4}
│           └── common/         → {infraestructura transversal, ver §5}
├── packages/
│   ├── ui/                     → {librería de componentes compartidos}
│   ├── shared/                 → {schemas, tipos, constantes}
│   └── {orm}/                  → {schema y migraciones}
├── docs/                       → {ver §12}
└── AGENTS.md                   → {reglas activas para la AI}
```

Los comandos del día a día viven en el manifiesto del paquete, no acá.

---

## 4. Patrón por módulo y reglas de dependencia [OBLIGATORIO]

### 4.1 Anatomía de un módulo

Cada módulo de negocio sigue la misma estructura interna. Ésta es la que la AI
copia al crear uno nuevo, así que tiene que estar completa.

```
modules/{nombre_del_modulo}/
├── domain/               → entidades, value objects, puertos, servicios de dominio
├── application/          → casos de uso, DTOs, handlers de eventos
├── infrastructure/       → controladores, repositorios, adaptadores externos
└── {nombre_del_modulo}.module.ts
```

### 4.2 Reglas de dependencia (estrictas)

```
Infrastructure → Application → Domain
```

- **Domain** no importa nada de las otras capas ni de librerías externas.
- **Application** importa de Domain. No importa de Infrastructure: accede a
  repositorios y servicios externos por interfaces (puertos).
- **Infrastructure** implementa los puertos. Es la única capa que conoce el
  ORM, el framework y los servicios externos.

Estas tres líneas se repiten en el `AGENTS.md` como reglas activas. Acá está
el detalle; allá, la prohibición.

---

## 5. Pilares transversales [OBLIGATORIO si existen]

> Los sistemas que no son módulos de negocio pero sin los cuales ningún módulo
> funciona: multi-tenancy, permisos, auditoría, motores de orquestación. Se
> implementan **antes** que cualquier módulo de negocio.

| Pilar | Qué garantiza | Dónde vive | Cómo lo usa un módulo |
|---|---|---|---|
| {Multi-tenancy} | {aislamiento de datos por tenant} | {ruta} | {middleware, filtro automático} |
| {Permisos} | {quién puede qué} | {ruta} | {decorador, guard} |
| {Auditoría} | {trazabilidad de acciones} | {ruta} | {decorador, interceptor} |
| {…} | {…} | {…} | {…} |

Cada pilar tiene su sección de detalle en §7 cuando la implementación lo
justifique.

---

## 6. Mapa de módulos [OBLIGATORIO] [CRECE CON EL PROYECTO]

### 6.1 Módulos de negocio

| Módulo | Sección del PRD | Responsabilidad | Spec |
|---|---|---|---|
| `{modulo}` | §{n} | {una o dos líneas} | `docs/specs/{modulo}.md` |

Una fila por módulo. El detalle (modelo de datos, endpoints, reglas) vive en
la spec; acá va lo justo para decidir **en qué módulo** cae un feature.

### 6.2 Dependencias entre módulos

```
{modulo_a} ──→ {modulo_b}, {modulo_c}
{modulo_b} ──→ {modulo_c}
{modulo_c} ──→ (ninguna)
```

Un módulo nuevo entra acá antes de escribirse. Una flecha nueva entre módulos
existentes es, casi siempre, una decisión: fila en el `ADR.md`.

---

## 7. Detalle por pilar e integración [CRECE CON EL PROYECTO]

> Una subsección por pilar de §5 y por servicio externo. Se agregan cuando la
> implementación existe, no antes. Cada subsección responde: estrategia,
> flujo principal, modelo de datos involucrado, patrón de resiliencia si aplica.

### 7.1 {Pilar o integración}

**Estrategia:** {una frase}
**Flujo:** {pasos numerados o diagrama corto}
**Datos:** {modelos involucrados, en prosa}
**Resiliencia:** {reintentos, timeouts, degradación} [si aplica]

---

## 8. Datos y almacenamiento [OBLIGATORIO]

- **Esquema:** vive en `{ruta_del_schema}`. Es el contrato de datos; este
  documento no lo copia.
- **Convenciones de modelado:** {naming, campos obligatorios por modelo,
  soft delete, timestamps}
- **Migraciones:** {quién las corre, contra qué ambiente, en qué orden}
- **Archivos y binarios:** {dónde, estructura de carpetas, reglas de acceso} [si aplica]

---

## 9. Seguridad [OBLIGATORIO]

| Capa | Mecanismo |
|---|---|
| Transporte | {…} |
| Autenticación | {…} |
| Autorización | {…} |
| Aislamiento de datos | {…} |
| Endpoints públicos | {lista explícita y por qué son públicos} |
| Secretos | {dónde viven, cómo rotan} |

---

## 10. Decisiones vigentes → `ADR.md` [OBLIGATORIO]

> Este documento dice **qué** está en vigor; el `ADR.md` dice **por qué** y qué
> se descartó. Acá no se justifica nada: se apunta.

| Decisión vigente | Fila del ADR |
|---|---|
| {REST sobre GraphQL} | ADR-{nnn} |
| {Middleware sobre RLS} | ADR-{nnn} |
| {Monorepo} | ADR-{nnn} |

Cuando una decisión cambia: se reescribe la fila de esta tabla, se actualiza
la sección afectada, y se **agrega** una fila nueva al ADR que supera a la
anterior. La fila vieja del ADR se queda. Ésa es la asimetría entre los dos
documentos.

---

## 11. Ambientes [OBLIGATORIO]

| Ambiente | Frontend | Backend | Base de datos | Otros |
|---|---|---|---|---|
| Development | {…} | {…} | {…} | {…} |
| QA / Staging | {…} | {…} | {…} | {…} |
| Production | {…} | {…} | {…} | {…} |

- **Qué comparten y qué no:** {si dev y QA comparten base, decirlo, y con qué
  riesgos operativos y mitigaciones}
- **Flujo de despliegue:** {rama → ambiente, quién aprueba}
- **Variables de entorno:** {dónde está la lista canónica; acá no se copian}

---

## 12. Documentos relacionados [OBLIGATORIO]

| Documento | Relación con esta arquitectura |
|---|---|
| `docs/PRD.md` | Fuente de verdad funcional; esta arquitectura lo implementa |
| `docs/specs/` | Una spec por módulo; el detalle de cada fila de §6 |
| `docs/GUIA_DISENO.md` | Referencia visual; el frontend la implementa |
| `docs/COMPONENT_LIBRARY.md` | Inventario de componentes UI compartidos |
| `docs/TECH_NOTES.md` | Cicatrices técnicas del stack |
| `ADR.md` | Por qué se decidió cada cosa de §10 |
| `AGENTS.md` | Reglas activas para la AI, derivadas de acá |
| `{ruta_del_schema}` | Contrato de datos |

---

# Notas sobre el template

## Documento de estado, no registro

En un proyecto real de cinco meses este archivo recibió 31 commits, contra 150
del catálogo de cicatrices y 163 del inventario de componentes. Cambia poco, y
eso es sano: describe una estructura que se decidió al principio y se sostuvo.
Cuando cambió, se sobreescribió: la sección de ambientes pasó de tres proyectos
a dos, la tabla de módulos ganó filas y perdió una que salió de alcance. Nada
de eso dejó rastro del estado anterior, porque no es su trabajo.

El problema apareció con las decisiones. El documento original tenía una
tabla «Decisiones técnicas y justificaciones» con tres columnas: decisión,
alternativas, justificación. Cuando una decisión cambiaba, la fila se
reescribía y la justificación anterior desaparecía. Seis meses después nadie
podía responder «¿por qué elegimos esto y no aquello?» sin excavar 27.000
líneas de log de sesiones. Por eso §10 de este template **apunta** al ADR en
vez de justificar: la tabla de estado dice qué rige; el ADR, que sólo se
agrega, guarda el resto.

## Por qué el árbol del repositorio está acá y no en el AGENTS.md

El template de `AGENTS.md` de esta metodología dejó de incluir la estructura
del repo y los comandos: son derivables de `ls` y del manifiesto del paquete,
y cada línea del `AGENTS.md` compite por atención en cada turno. Pero el
árbol **anotado** —qué es cada carpeta, qué convención sigue— sí hace falta en
algún lado que la AI pueda abrir cuando lo necesite. Ese lado es éste.

## Qué no va acá

| Esto | Va en |
|---|---|
| Endpoints, modelos y reglas de **un** módulo | La spec de ese módulo |
| El schema de datos | El archivo del ORM |
| Los comandos | El manifiesto del paquete |
| Reglas que la AI violaría hoy | `AGENTS.md` |
| Por qué se eligió X y no Y | `ADR.md` |
| Un fix de una librería | `docs/TECH_NOTES.md` |
| Tokens, colores, tipografía | La guía de diseño |

Si una sección de este documento supera las 100 líneas, casi seguro está
absorbiendo algo de la tabla anterior.

## Secciones mínimas para arrancar

Un prototipo puede vivir con §1, §2, §3, §6.1 y §10. Un MVP suma §4, §8, §9 y
§11. Los pilares (§5, §7) aparecen cuando hay más de un módulo compartiendo
infraestructura, que es cuando la AI empieza a reimplementarla por módulo.
