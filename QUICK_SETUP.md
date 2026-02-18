# 🚀 SETUP RÁPIDO - 3 Minutos

## Paso 1: Extraer (30 seg)
```bash
tar -xzf comedica-semana1-COMPLETO.tar.gz
cd comedica-backoffice
```

## Paso 2: Instalar (2 min)
```bash
npm install
```

## Paso 3: Ejecutar (30 seg)

**Terminal 1 - Mock Server:**
```bash
npm run mock
```

**Terminal 2 - Aplicación:**
```bash
npm run dev
```

## Paso 4: Probar (30 seg)

Abrir: http://localhost:3000

**Credenciales:**
- Usuario: `admin`
- Contraseña: `Admin123!`

## ✅ Listo!

Deberías ver:
1. Página de login
2. Formulario con validaciones
3. Al ingresar → Dashboard

---

## 🎯 Lo que verás funcionando:

✅ Login con validaciones
✅ Cambio de contraseña
✅ Dashboard con stats
✅ Sidebar navegable
✅ Header con usuario
✅ Animaciones suaves
✅ Responsive design

---

## 📱 URLs disponibles:

- `/` → Redirect a login
- `/auth/login` → Login
- `/auth/first-password-change` → Cambio contraseña
- `/dashboard` → Dashboard principal

---

## 🔌 API Mock funcionando en:

`http://localhost:3001/api`

Endpoints:
- POST `/auth/login`
- POST `/auth/logout`
- POST `/auth/first-password-change`
- GET `/auth/session`

---

## ⚡ Tips:

1. Si el puerto está ocupado:
   ```bash
   lsof -ti:3000 | xargs kill
   lsof -ti:3001 | xargs kill
   ```

2. Si hay errores de módulos:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Para ver logs del mock:
   - Terminal 1 muestra todas las requests

---

**Todo funcionando en < 5 minutos** ⚡
