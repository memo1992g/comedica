# Análisis técnico actualizado del proyecto Comédica

Fecha: 2026-02-24

## 1) Resumen ejecutivo

El proyecto está bien encaminado como **MVP funcional** de backoffice en Next.js 14 con arquitectura modular por dominio (usuarios, reportes, parámetros, mantenimiento y gestiones), pero presenta señales claras de transición entre entorno mock y entorno real.

Conclusión general:
- ✅ Base funcional sólida (app compila y build productivo exitoso).
- ⚠️ Deuda técnica media en frontend (warnings de hooks/accesibilidad/performance).
- ⚠️ Riesgo alto de seguridad/consistencia en autenticación por uso de estado mock en `authStore`.
- ✅ Estructura extensible para escalar módulos.

## 2) Hallazgos clave

### 2.1 Arquitectura y organización

- La estructura del código separa bien `actions`, `services`, `modules`, `components` y `lib/api`, lo que facilita el mantenimiento por dominio.
- Se utiliza App Router de Next.js con rutas funcionales para múltiples módulos del dashboard.

**Lectura:** La base es escalable para crecimiento de funcionalidades y equipos por frente.

### 2.2 Autenticación y sesión

- El middleware protege `/dashboard` y redirige según cookie de autenticación.
- `authStore` actualmente crea un usuario/token mock al iniciar sesión y redirige sin consumir realmente `authService.login`.
- `apiClient` sí está configurado para consumir backend, inyectar Bearer token y manejar errores 401/403/500.

**Riesgo:** Hay una brecha entre el flujo de autenticación “visual” y la integración real de backend.

### 2.3 Integración backend y entorno mock

- Hay mock server Express para auth y endpoints de dashboard.
- Next.js reescribe `/api/*` a `http://localhost:3001/api/*`, lo que simplifica el desarrollo local.

**Riesgo de despliegue:** Si no se parametriza por ambiente (dev/qa/prod), puede haber dependencia accidental del mock o de URLs no esperadas.

### 2.4 Calidad estática (lint/build)

Resultado de validación:
- `npm run lint` finaliza OK pero con warnings (hooks, `<img>`, accesibilidad).
- `npm run build` finaliza OK y genera páginas estáticas correctamente.

Warnings más relevantes:
- Dependencias faltantes en hooks (`useEffect`, `useMemo`).
- Uso de `<img>` en vez de `next/image` en varias vistas.
- Un caso de imagen sin `alt`.

## 3) Prioridades recomendadas

### Prioridad alta (1-2 sprints)

1. **Unificar login real con `authService.login`** en `authStore`.
2. **Asegurar cookie/token con estrategia consistente** (evitar divergencia entre storage, cookie y estado).
3. **Corregir hooks con dependencias faltantes** para prevenir bugs sutiles por cierres obsoletos.

### Prioridad media

4. Migrar imágenes clave a `next/image` (login/sidebar) para mejorar performance.
5. Corregir accesibilidad de imágenes (`alt`) y revisar componentes críticos.
6. Parametrizar `API_BASE_URL` y rewrites por variables de entorno.

### Prioridad baja

7. Estandarizar convenciones de módulos y tipos para reducir duplicidad futura.
8. Añadir una capa de pruebas mínimas (auth flow y rutas protegidas).

## 4) Riesgos técnicos actuales

- **Seguridad funcional:** flujo de login mock en cliente puede ocultar errores de integración/auth real.
- **Confiabilidad UI:** warnings de hooks pueden generar comportamiento no determinístico.
- **Mantenibilidad:** al crecer el proyecto, los warnings acumulados elevan costo de cambio.

## 5) Plan de acción sugerido (rápido)

Semana 1:
- Integrar login real + pruebas manuales de sesión/redirect.
- Corregir todos los warnings `react-hooks/exhaustive-deps` de rutas críticas.

Semana 2:
- Migrar imágenes críticas a `next/image`.
- Ajustar accesibilidad y limpieza de warnings restantes.

Semana 3:
- Introducir pruebas de humo (lint/build + rutas auth/dashboard) en CI.

## 6) Estado actual resumido

- Estado funcional: **Operativo en entorno local con mock**.
- Preparación para producción: **Parcial**, requiere cerrar brechas de auth real, calidad estática y configuración por ambiente.
