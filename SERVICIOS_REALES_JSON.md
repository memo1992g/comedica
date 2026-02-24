# Servicios reales disponibles en `json/` y recomendación de arranque (Parámetros)

Fecha: 2026-02-24

## 1) Base URLs detectadas en colecciones

- `https://bo-comedica-service-dev.echotechs.net/api` (BackOffice general / Proxy Parámetros / Usuarios / Notificaciones).
- `https://bel-comedica-service-dev.echotechs.net/api` (colección BEL de Marcelo).

## 2) ¿Con qué podemos empezar primero?

Para desbloquear **Parámetros** rápido, empezar por este orden:

1. `params/get-params` (lectura de parámetros).
2. `params/save` (creación/alta de parámetro).
3. `params/edit` (actualización).
4. `t365/get-banks` y `t365/get-banks-CARD` (consulta de tablas Transfer365).
5. `t365/bank-modify` y `t365/bank-modify-CARD` (activar/inactivar/editar y reflejar en listado).
6. `sft/get-devices` (catálogo de Soft Token, si aplica al flujo actual).

## 3) Endpoints reales encontrados en `json/` (enfocados a Parámetros y dependencias)

## 3.1 Proxy Parámetros (colección dedicada)
- `POST /params/get-params`
- `POST /params/save`
- `PUT /params/edit`

## 3.2 Parámetros / Transfer365 / Soft Token (colección BEL)
- `POST /api/params/get-params`
- `POST /api/params/save`
- `POST /api/params/edit`
- `POST /api/t365/get-banks`
- `POST /api/t365/bank-create`
- `POST /api/t365/bank-modify`
- `POST /api/t365/get-banks-CARD`
- `POST /api/t365/bank-create-CARD`
- `POST /api/t365/bank-modify-CARD`
- `POST /api/sft/get-devices`

## 3.3 Soporte/mantenimiento (relacionados con parámetros operativos)
- `GET /list-support-catalog`
- `POST /create-support-catalog`
- `PUT /update-support-catalog/{id}`
- `DELETE /delete-support-catalog/{id}`
- `GET /list-security-questions`
- `POST /create-security-question`
- `PUT /update-security-question/{id}`
- `DELETE /delete-security-question/{id}`
- `POST /products`
- `GET /get-pimage`
- `POST /update-pimage`
- `DELETE /delete-pimage`

## 4) Validación contra código actual (qué ya está conectado)

Ya hay integración implementada en el código para varios de esos endpoints:

- `params/get-params`, `params/save`, `params/edit`.
- `t365/get-banks`, `t365/get-banks-CARD`.
- `t365/bank-create`, `t365/bank-create-CARD`.
- `t365/bank-modify`, `t365/bank-modify-CARD`.
- `products`, `get-pimage`, `list-support-catalog`, `list-security-questions`.

## 5) Plan de ejecución corto (3 bloques)

### Bloque A (día 1)
- Ajustar refresco de UI en Transfer365 después de `bank-modify`.
- Verificar mapeo de estado activo/inactivo (`A/I`, `1/0`) en tabla y detalle.

### Bloque B (día 1-2)
- Validar persistencia en `params/edit` para límites y montos + recarga inmediata.
- Confirmar historial con datos reales para evitar pantallas vacías.

### Bloque C (día 2)
- Revisar catálogo de Soft Token y reglas con `sft/get-devices`.
- Cerrar matriz de pruebas E2E BackOffice ↔ banca para parámetros críticos.

## 6) Recomendación práctica

Si el objetivo es estabilizar lo reportado en la reunión, el primer ticket debería ser:

**"Parámetros - Transfer365: inactivar/editar refleja en tabla general tras guardar"**

porque depende de servicios que ya existen en colecciones y ya están integrados parcialmente en el código.
