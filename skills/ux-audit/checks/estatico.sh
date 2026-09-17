#!/usr/bin/env bash
# ux-audit — Capa 1: análisis estático. Checks S-01 a S-09 de la tabla del SKILL.md.
#
# Lo que se puede detectar con un grep no debería consumir juicio de nadie.
# Escrito para React + Tailwind + una librería de i18n con `t()`; los patrones
# se traducen a otro stack cambiando las expresiones regulares, no la estructura.
#
# Uso:  bash .agents/skills/ux-audit/checks/estatico.sh [ruta]
#       Ruta por defecto: la de UX_AUDIT_TARGET, o apps/web.
# Sale con 1 si hay al menos un crítico; con 0 si sólo hay warnings o nada.
#
# ── Configuración ────────────────────────────────────────────────────────────
# Toda regla estática tiene excepciones legítimas (paneles decorativos de marca,
# un componente que usa color fijo por diseño, la vista previa de branding de
# un tenant). Si no se declaran, el script cría alarmas que el equipo aprende a
# ignorar, y un check ignorado no existe. Declararlas acá, con su razón al lado.

TARGET="${1:-${UX_AUDIT_TARGET:-apps/web}}"

# Fragmentos de ruta exentos de S-01, S-02, S-03 y S-08 (uno por línea).
EXENTOS_COLOR=(
  "(auth)"          # paneles decorativos de marca en el login
  "color-bar"       # barra de color de marca, fija por diseño
  "branding-form"   # vista previa del color que el usuario elige: inline por naturaleza
)

# Librería de iconos oficial (S-04 marca cualquier otra).
ICONOS_OFICIAL="lucide-react"
ICONOS_PROHIBIDOS="from '@heroicons|from 'react-icons|from '@phosphor-icons|from '@tabler/icons|from \"@heroicons|from \"react-icons|from \"@phosphor-icons|from \"@tabler/icons"

# Peso tipográfico que la guía de diseño prohíbe (S-05). Vacío para desactivar.
PESO_PROHIBIDO="font-bold"

# Props booleanas de permiso que nunca deben ir hardcodeadas (S-07).
PROPS_PERMISO="hasPermission|canView|canEdit|canDelete|canCreate|isAdmin|isPlatform"
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SEARCH_DIR="$ROOT/$TARGET"
[ -d "$SEARCH_DIR" ] || { echo "No existe $SEARCH_DIR"; exit 2; }

RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'; BOLD='\033[1m'; NC='\033[0m'
CRITICAL=0; WARNINGS=0

header()   { echo -e "\n${BOLD}$1${NC}"; }
critical() { echo -e "  ${RED}[CRITICAL]${NC} $1"; CRITICAL=$((CRITICAL+1)); }
warn()     { echo -e "  ${YELLOW}[WARNING]${NC}  $1"; WARNINGS=$((WARNINGS+1)); }
ok()       { echo -e "  ${GREEN}[OK]${NC}       $1"; }

# grep sobre el objetivo, sin build ni dependencias.
buscar() { grep -rn --include="*.tsx" --include="*.ts" -E "$1" "$SEARCH_DIR" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist 2>/dev/null || true; }

# Quita las rutas exentas de color.
sin_exentos() {
  local out; out="$(cat)"
  for e in "${EXENTOS_COLOR[@]}"; do out="$(echo "$out" | grep -vF "$e" || true)"; done
  echo "$out"
}

reportar() { # $1 nivel  $2 texto  $3 mensaje si vacío
  local nivel="$1" hallazgos="$2" limpio="$3"
  if [ -n "$hallazgos" ]; then
    while IFS= read -r line; do [ -n "$line" ] && "$nivel" "$line"; done <<< "$hallazgos"
  else
    ok "$limpio"
  fi
}

header "ux-audit — Capa 1, análisis estático"
echo "  Directorio: $SEARCH_DIR"
echo "  $(date '+%Y-%m-%d %H:%M')"

# ─── S-01: colores fuera del sistema de tokens ───────────────────────────────
header "S-01 · Colores de paleta cruda (bg-gray-500, text-slate-…)"
reportar critical "$(buscar 'class(Name)?=.*\b(bg|text|border|ring|shadow)-(slate|gray|neutral|zinc|stone)-[0-9]+' | sin_exentos)" \
  "Sin colores de paleta cruda"

header "S-01b · bg-black / bg-white / text-black / text-white"
reportar critical "$(buscar 'class(Name)?=.*\b(bg-black|bg-white|text-black|text-white)\b' | sin_exentos)" \
  "Sin blanco/negro absolutos en UI funcional"

# ─── S-02: estilos de color inline ───────────────────────────────────────────
# Solo valores literales (hex, rgb, hsl, oklch). var(--token) es correcto.
header "S-02 · Colores inline (style={{ color: '#…' }})"
reportar critical "$(buscar "style=\{[^}]*(color|background)\s*:\s*'(#|rgb|hsl|oklch)[^']*'" | sin_exentos)" \
  "Sin colores literales en style="

# ─── S-03: hexadecimales en JSX ──────────────────────────────────────────────
# fill= y stroke= con hex son colores de marca de terceros en SVG inline (logo de un proveedor): exentos.
header "S-03 · Hexadecimales en JSX"
reportar critical "$(buscar '"#[0-9a-fA-F]{3,8}"' | grep -v 'fill=' | grep -v 'stroke=' | sin_exentos)" \
  "Sin hexadecimales en JSX"

# ─── S-04: librería de iconos distinta a la oficial ──────────────────────────
header "S-04 · Iconos fuera de $ICONOS_OFICIAL"
reportar critical "$(buscar "$ICONOS_PROHIBIDOS")" "Solo $ICONOS_OFICIAL en uso"

# ─── S-05: peso tipográfico prohibido ────────────────────────────────────────
if [ -n "$PESO_PROHIBIDO" ]; then
  header "S-05 · $PESO_PROHIBIDO (la guía de diseño lo prohíbe)"
  reportar warn "$(buscar "\b$PESO_PROHIBIDO\b")" "Sin $PESO_PROHIBIDO"
  header "S-05b · font-weight 700/bold inline o en CSS modules"
  FW="$(buscar "fontWeight.*['\"]?(700|bold)['\"]?")"
  FWCSS="$(grep -rn --include="*.css" --include="*.module.css" -E 'font-weight\s*:\s*(700|bold)' "$SEARCH_DIR" --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null | grep -v globals.css || true)"
  reportar warn "$(printf '%s\n%s' "$FW" "$FWCSS" | sed '/^$/d')" "Sin font-weight 700 fuera de los tokens"
fi

# ─── S-06: strings visibles sin i18n ─────────────────────────────────────────
# Heurística: texto entre tags que empieza en mayúscula y tiene 4+ letras. Falsos
# positivos conocidos: tipos TypeScript (Promise<void>) y comentarios. Se revisa a mano.
header "S-06 · Texto visible sin pasar por t()"
I18N="$(buscar '>\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑa-z ]{4,}\s*<' \
  | grep -v 't(' | grep -v '//.*>' | grep -v 'Promise<' | grep -v 'Parameters<' \
  | grep -v ': string' | grep -v ': number' | grep -v 'typeof ' || true)"
if [ -n "$I18N" ]; then
  COUNT=$(echo "$I18N" | wc -l | tr -d ' ')
  warn "Posibles strings sin i18n ($COUNT). Verificar a mano:"
  echo "$I18N" | head -20
  [ "$COUNT" -gt 20 ] && echo "  … y $((COUNT-20)) más."
else
  ok "Sin strings visibles hardcodeados detectados (verificar a mano igual)"
fi

# ─── S-07: permisos hardcodeados ─────────────────────────────────────────────
header "S-07 · Permisos hardcodeados como true"
reportar critical "$(buscar "($PROPS_PERMISO)\s*=\s*\{?\s*true\s*\}?")" "Sin permisos hardcodeados"

# ─── S-08: dark mode resuelto a mano ─────────────────────────────────────────
header "S-08 · dark: con colores crudos (se salta los tokens)"
reportar critical "$(buscar 'dark:(bg|text|border)-(slate|gray|neutral|zinc|stone|black|white)' | sin_exentos)" \
  "Sin dark: con colores crudos"

# ─── S-09: texto «Cargando» en vez de skeleton ───────────────────────────────
header "S-09 · Texto 'Cargando' / 'Loading' visible (usar skeleton)"
reportar warn "$(buscar '(>|\")\s*(Cargando|Loading)(\.\.\.|…)?\s*(<|\")' | grep -v '//' || true)" \
  "Sin texto de carga visible"

# ─── Resumen ─────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────────"
echo -e "${BOLD}Resumen Capa 1${NC}"
echo -e "  ${RED}Críticos:${NC} $CRITICAL"
echo -e "  ${YELLOW}Warnings:${NC}  $WARNINGS"
echo -e "  S-10 (rutas sin guard), S-11 (skeletons: checks/fidelidad-skeletons.mjs) y S-12 (componentes duplicados) no los cubre este script."

if [ "$CRITICAL" -gt 0 ]; then
  echo -e "\n${RED}Bloqueado: resolver los críticos antes del merge${NC}"; exit 1
elif [ "$WARNINGS" -gt 0 ]; then
  echo -e "\n${YELLOW}Warnings: corregir antes del release${NC}"; exit 0
else
  echo -e "\n${GREEN}Capa 1 sin hallazgos${NC}"; exit 0
fi
