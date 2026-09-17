#!/usr/bin/env node
// Alias sin scope de `@falcux/ai-first` (ADR-002). No tiene código propio: carga
// el CLI del paquete real, que corre al importarse. El detector vive en un solo
// sitio; esto sólo le presta el nombre corto.
import '@falcux/ai-first/cli';
