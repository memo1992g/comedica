# 📊 Módulo de Parámetros - Límites y Montos

## 🎯 Descripción

Módulo completo para la gestión de límites transaccionales generales y personalizados por usuario, con sistema completo de auditoría y confirmación de cambios.

## ✨ Funcionalidades Implementadas

### 1. **Configuración General de Límites**
- ✅ Parámetros de Canales Electrónicos
  - Máximo por transacción
  - Máximo diario
  - Máximo mensual
- ✅ Parámetros de Punto Xpress
  - Cuentas de Ahorro (máximo por transacción, cantidad mensual)
  - Cuentas Corriente (máximo por transacción, cantidad mensual)

### 2. **Gestión de Límites por Usuario**
- ✅ Tabla completa con búsqueda y paginación
- ✅ Tipos de límites: General o Personalizado
- ✅ Edición individual de límites por usuario
- ✅ Eliminación de límites personalizados (vuelve a generales)
- ✅ Indicadores visuales de última actualización

### 3. **Sistema de Confirmación**
- ✅ Modal de vista previa antes de guardar cambios
- ✅ Resumen de cambios con valores antiguos vs nuevos
- ✅ Confirmación adicional para cambios generales
- ✅ Confirmación de eliminación de límites personalizados

### 4. **Historial de Auditoría**
- ✅ Panel resumido en sidebar (últimas 5 acciones)
- ✅ Página completa con historial detallado
- ✅ Búsqueda y filtrado
- ✅ Visualización de cambios con valores antes/después
- ✅ Identificación de usuario que hizo el cambio y usuario afectado

## 📁 Estructura de Archivos

```
src/
├── app/
│   └── parametros/
│       └── limites-y-montos/
│           ├── page.tsx                 # Página principal
│           ├── page.module.css          # Estilos página principal
│           └── historial/
│               ├── page.tsx             # Página historial completo
│               └── page.module.css      # Estilos historial
│
├── components/
│   └── parametros/
│       ├── Modal.tsx                    # Modal genérico
│       ├── Modal.module.css             # Estilos modales
│       ├── ConfirmationModal.tsx        # Modal confirmación
│       ├── EditGeneralLimitsModal.tsx   # Modal límites generales
│       └── EditUserLimitsModal.tsx      # Modal límites usuario
│
├── lib/
│   └── api/
│       └── parameters.service.ts        # Servicio API parámetros
│
├── types/
│   └── index.ts                         # Tipos TypeScript actualizados
│
└── server/
    ├── parameters-data.js               # Datos mock
    ├── parameters-routes.js             # Rutas API
    └── mock-server.js                   # Servidor actualizado
```

## 🚀 Cómo Usar

### Iniciar el Proyecto

```bash
# Terminal 1 - Mock Server
npm run mock

# Terminal 2 - Aplicación
npm run dev
```

### Navegar al Módulo

1. Abrir: `http://localhost:3000`
2. Login con credenciales:
   - Usuario: `admin`
   - Contraseña: `Admin123!`
3. En el sidebar, expandir **Parámetros**
4. Click en **Límites y Montos**

### Flujos de Uso

#### **Editar Límites Generales:**
1. Click en "Guardar Cambios" en el header
2. Modificar los valores en el modal
3. Click "Continuar" para ver preview
4. Revisar cambios en el panel de confirmación
5. Click "Guardar Cambios" para aplicar
6. Ver cambio reflejado en historial

#### **Editar Límites de Usuario:**
1. Ir a pestaña "Límites por usuario"
2. Click en ícono de lápiz en la fila del usuario
3. Modificar límites personalizados
4. Click "Guardar cambios"
5. El badge cambia a "Personalizado"

#### **Eliminar Límites Personalizados:**
1. En tabla de usuarios, click en ícono de papelera (solo visible para personalizados)
2. Confirmar en modal de eliminación
3. El usuario vuelve a usar límites generales
4. Badge cambia a "General"

#### **Ver Historial:**
1. En panel lateral, click "Ver todo"
   - O click en botón "Historial" en header
2. Ver tabla completa con todas las acciones
3. Usar búsqueda para filtrar por usuario/acción
4. Ver detalles de cada cambio

## 🎨 Características de UI/UX

### Pestañas
- **Configuración general:** Vista y edición de límites globales
- **Límites por usuario:** Tabla con gestión individual

### Panel de Auditoría (Sidebar)
- Muestra últimas 5 acciones
- Usuario que realizó el cambio
- Fecha y hora
- Valores modificados (antes → después)
- Link a historial completo

### Modales
- **Diseño consistente** con header, body y footer
- **Animaciones suaves** de entrada/salida
- **Cierre con ESC** o click fuera
- **Indicadores de carga** durante guardado
- **Preview de cambios** antes de confirmar

### Tabla de Usuarios
- **Búsqueda en tiempo real**
- **Badges visuales** (General/Personalizado)
- **Paginación** (20 items por página)
- **Acciones contextuales** (editar/eliminar)
- **Última actualización** visible

## 🔌 API Endpoints Disponibles

```
GET    /api/parameters/limits/general          # Obtener límites generales
PUT    /api/parameters/limits/general          # Actualizar límites generales

GET    /api/parameters/limits/users            # Obtener límites de usuarios
PUT    /api/parameters/limits/users/:userId    # Actualizar límite de usuario
DELETE /api/parameters/limits/users/:userId    # Eliminar límite personalizado

GET    /api/parameters/audit                   # Historial completo
GET    /api/parameters/audit/recent            # Últimas N acciones
```

## 📊 Datos Mock Disponibles

### Límites Generales
- Canales Electrónicos: $1,000 / $2,000 / $10,000
- Punto Xpress Ahorro: $500 / 30 transacciones
- Punto Xpress Corriente: $800 / 50 transacciones

### Usuarios de Ejemplo
- Roberto Gómez (12345) - Personalizado
- Ana Silva (78912) - Personalizado
- Lucía Torres (31711) - General
- Carlos Pérez (45678) - Personalizado
- María Rodríguez (98765) - General

## 🎯 Validaciones Implementadas

- ✅ Cambios detectados automáticamente
- ✅ Botón "Continuar" deshabilitado si no hay cambios
- ✅ Loading states en todos los botones de acción
- ✅ Confirmación obligatoria para acciones destructivas
- ✅ Formato de moneda consistente
- ✅ Paginación con límites de páginas

## 🔒 Características de Seguridad

- ✅ **Auditoría completa** de todas las acciones
- ✅ **Registro de usuario** que realiza cambio
- ✅ **Registro de usuario afectado** por el cambio
- ✅ **Timestamp preciso** de cada acción
- ✅ **Trazabilidad** de valores antes/después
- ✅ **Autenticación** requerida en todos los endpoints

## 🎨 Paleta de Colores

```css
--primary: #233269           /* Azul oscuro principal */
--primary-light: #2f4ea0     /* Azul medio */
--primary-lighter: #5173d6   /* Azul claro */
--success: #16a34a           /* Verde para valores nuevos */
--danger: #dc2626            /* Rojo para eliminación */
--gray-50: #f9fafb           /* Fondo suave */
--gray-100: #f3f4f6          /* Fondo campos */
--gray-200: #e5e7eb          /* Bordes */
--gray-400: #9ca3af          /* Texto deshabilitado */
--gray-600: #6b7280          /* Texto secundario */
--gray-700: #374151          /* Texto normal */
```

## 📱 Responsive

- ✅ Desktop (1200px+): Layout completo con sidebar
- ✅ Tablet (768px-1200px): Sidebar abajo del contenido
- ✅ Mobile (< 768px): Stack vertical, modales fullscreen

## 🚧 Próximas Mejoras Sugeridas

- [ ] Exportar historial a Excel/PDF
- [ ] Filtro por rango de fechas en historial
- [ ] Notificaciones push cuando se cambian límites
- [ ] Comparación lado a lado de límites
- [ ] Importación masiva de límites por CSV
- [ ] Límites específicos por tipo de transacción
- [ ] Dashboard con gráficos de uso de límites
- [ ] Alertas cuando usuarios se acercan a límites

## 🐛 Troubleshooting

**Problema:** No se ven los cambios en el historial
- **Solución:** Verificar que el mock server esté corriendo en puerto 3001

**Problema:** Error al guardar cambios
- **Solución:** Revisar console del navegador y logs del servidor mock

**Problema:** Paginación no funciona
- **Solución:** Verificar que `totalUsers` se está actualizando correctamente

**Problema:** Modal no cierra con ESC
- **Solución:** Verificar que no hay otros listeners de keyboard activos

## 📞 Soporte

Para dudas o problemas con la implementación:
1. Revisar los logs del mock server
2. Verificar network tab en DevTools
3. Revisar errores en console del navegador

---

**Desarrollado para:** BackOffice Comédica  
**Semana:** 3 (2-6 febrero 2026)  
**Estado:** ✅ Completo y Funcional
