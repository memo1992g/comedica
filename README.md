# 🚀 BackOffice Comédica - Semana 1

## ✅ Proyecto COMPLETO y FUNCIONAL

Este es el código completo de la Semana 1 del cronograma (19-23 enero).

### 🎯 HUs Implementadas

- ✅ HU01: Primer inicio de sesión
- ✅ HU02: Login estándar  
- ✅ HU03: Cambio de contraseña voluntario
- ✅ HU04: Cambio por vencimiento
- ✅ HU05: Dashboard principal

## 🚀 Quick Start

```bash
# 1. Extraer proyecto
tar -xzf comedica-semana1-COMPLETO.tar.gz
cd comedica-backoffice

# 2. Instalar dependencias
npm install

# 3. Iniciar mock server (Terminal 1)
npm run mock

# 4. Iniciar app (Terminal 2)
npm run dev
```

Abrir: http://localhost:3000

## 🔐 Credenciales

**Admin (directo a dashboard):**
- Usuario: `admin`
- Contraseña: `Admin123!`

**Nuevo (requiere cambio):**
- Usuario: `nuevo`
- Contraseña: `Temporal123!`

## 📁 Estructura

```
src/
├── app/              # Páginas Next.js
├── components/       # Componentes React
├── lib/             # API y utilidades
├── store/           # Zustand state
└── types/           # TypeScript types

server/
└── mock-server.js   # API mock
```

## 🎨 Stack

- Next.js 14 + TypeScript
- Tailwind CSS + Framer Motion
- Zustand + React Hook Form
- Express (mock API)

## 📝 Endpoints Mock

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/first-password-change
POST /api/auth/change-password
GET  /api/auth/session
GET  /api/dashboard/stats
```

