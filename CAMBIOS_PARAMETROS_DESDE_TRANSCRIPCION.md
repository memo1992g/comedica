# Cambios de Parámetros extraídos de la transcripción

Fecha de extracción: 2026-02-24
Alcance: **solo módulo Parámetros** (incluye submódulos y su integración esperada con banca en línea).

## 1) Límites y montos

### 1.1 Correcciones funcionales
- Corregir comportamiento de búsqueda donde aparece un usuario/cliente por defecto como "cliente 0".
- Corregir edición de montos con valor inicial incómodo (cero prefijado) que impide una entrada natural del dato.
- Validar que al guardar cambios los datos persistan y se reflejen inmediatamente en pantalla.

### 1.2 Historial y trazabilidad
- Corregir historial del módulo para que traiga datos reales (actualmente se reporta vacío/repetido).
- Homologar comportamiento del historial en todas las pantallas de Parámetros (patrón de falla repetido).

### 1.3 Integración con banca en línea
- Verificar que parámetros de **límites por usuario** y **límites generales** sí impacten en banca en línea.
- Caso de prueba clave: modificar un límite en BackOffice y validar efecto real en operación de banca.

### Criterios de aceptación
1. Al buscar por asociado/usuario, no aparece un "cliente 0" por defecto sin contexto.
2. Los campos de monto permiten edición limpia (sin prefijos forzados molestos).
3. Guardar actualiza UI y backend (valor consistente tras recargar).
4. El historial lista registros reales y navegables.

---

## 2) Parámetros de seguridad / generales

### 2.1 Parámetros con impacto operativo
- Validar consumo e impacto de:
  - Tiempo de sesión (segundos).
  - Vigencia de contraseña.
  - Longitud mínima/máxima de usuario.
- Confirmar que origen de datos venga del microservicio de parámetros correcto y con mapeo vigente.

### 2.2 Integración cruzada
- Verificar explícitamente que estos parámetros sean leídos por banca en línea (no solo guardados en BackOffice).
- Definir prueba de extremo a extremo: cambiar valor en BackOffice → validar efecto observable en banca.

### Criterios de aceptación
1. El guardado responde 200 y el valor persiste.
2. El valor se refleja en siguiente consulta del mismo módulo.
3. Existe evidencia de consumo en banca (flujo validado por QA).

---

## 3) Transfer365 / Transfer365 CARD (dentro de Parámetros)

### 3.1 CRUD general
- Corregir inactivación: actualmente se reporta que "guarda" pero el estado no cambia a inactivo en tabla.
- Corregir actualización de nombre/descripción: cambio se guarda pero no se refleja en tabla general en tiempo real.
- Corregir comportamiento de guardado en CARD cuando no hay efecto visible tras "Guardar".

### 3.2 Consistencia visual de datos
- Asegurar que la tabla general se refresque tras crear/editar/inactivar (optimista o refetch explícito).
- Alinear mensajes de feedback (éxito/error) a la operación realmente ejecutada.

### Criterios de aceptación
1. Inactivar cambia estado visual y persistido al primer intento.
2. Editar refleja cambios en la tabla sin requerir abrir detalle individual.
3. Guardar en CARD muestra confirmación y datos actualizados.

---

## 4) Solicitud de Soft Token (Parámetros)

### 4.1 Catalogación y contenido
- Revisar duplicidades/rótulos confusos en reglas (ej. textos repetidos o combinaciones no esperadas como "cambio de contraseña / cuenta de ahorro propia" cuando no corresponde).
- Mantener únicamente categorías válidas y no redundantes según definición funcional.

### 4.2 Regla antifraude y parametrización
- Confirmar que la lógica de solicitud de soft token se rija por umbrales/reglas definidas en servicios.
- Asegurar comportamiento esperado en casos umbral (p. ej., montos superiores al umbral requerido).

### Criterios de aceptación
1. Catálogo sin duplicados semánticos ni etiquetas ambiguas.
2. Reglas aplicadas de forma consistente por escenario.
3. Evidencia de prueba de umbral (caso pasa/no pasa).

---

## 5) Priorización sugerida para ejecución (Parámetros)

## P0 (crítico: bloquear pruebas)
1. Historial sin datos en Parámetros.
2. Inactivación/edición no reflejada en Transfer365.
3. Persistencia visual tras Guardar (límites y montos).

## P1 (alto)
4. Corrección de UX de inputs numéricos (cero prefijado y edición).
5. Limpieza de catálogo/etiquetas en Soft Token.
6. Validación E2E con banca para tiempo de sesión y vigencia.

## P2 (medio)
7. Homologar mensajes y estados de feedback en todo el módulo.
8. Matriz de pruebas repetible por submódulo de Parámetros.

---

## 6) Matriz mínima de pruebas (solo Parámetros)

1. **Límites y montos**
   - Editar monto, guardar, refrescar, reconsultar y validar historial.
2. **Parámetros generales/seguridad**
   - Cambiar tiempo de sesión y validar efecto en banca.
3. **Transfer365**
   - Inactivar institución, confirmar estado en listado y en recarga.
4. **Transfer365 CARD**
   - Editar registro, guardar y validar reflejo inmediato en tabla.
5. **Soft Token**
   - Validar catálogo sin duplicidades y prueba de regla umbral.

---

## 7) Entregables recomendados para cerrar Parámetros

- Checklist QA por submódulo con evidencia.
- Registro de incidencias con severidad (P0/P1/P2).
- Confirmación funcional cruzada BackOffice ↔ banca en línea para parámetros críticos.
