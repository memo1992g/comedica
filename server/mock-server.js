const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Base de datos en memoria
let users = [
  {
    id: '1',
    username: 'admin',
    password: 'Admin123!', // En producción nunca guardar contraseñas en texto plano
    email: 'admin@comedica.com',
    fullName: 'Administrador Principal',
    role: 'admin',
    associateNumber: '00001',
    dui: '00000000-0',
    phone: '7777-7777',
    createdAt: '2026-01-01T00:00:00Z',
    lastPasswordChange: '2026-01-01T00:00:00Z',
    requiresPasswordChange: false,
    status: 'active',
  },
  {
    id: '2',
    username: 'nuevo',
    password: 'Temporal123!',
    email: 'nuevo@comedica.com',
    fullName: 'Usuario Nuevo',
    role: 'operator',
    createdAt: '2026-01-20T00:00:00Z',
    requiresPasswordChange: true,
    status: 'pending_activation',
  },
];

// Middleware para validar token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token no proporcionado' 
    });
  }

  // Simulación simple - en producción usar JWT
  const user = users.find(u => `token-${u.id}` === token);
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido' 
    });
  }

  req.user = user;
  next();
}

// ==================== AUTH ENDPOINTS ====================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Simular delay de red
  setTimeout(() => {
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
    }

    // Generar token (simulado)
    const token = `token-${user.id}`;

    // Remover contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        requiresPasswordChange: user.requiresPasswordChange,
      },
    });
  }, 1000);
});

// POST /api/auth/logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
});

// POST /api/auth/first-password-change
app.post('/api/auth/first-password-change', authenticateToken, (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  setTimeout(() => {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Las contraseñas no coinciden',
      });
    }

    // Validar fuerza de contraseña
    const isValid = 
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /\d/.test(newPassword) &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña no cumple con los requisitos',
      });
    }

    // Actualizar usuario
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        requiresPasswordChange: false,
        lastPasswordChange: new Date().toISOString(),
        status: 'active',
      };
    }

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });
  }, 1500);
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  setTimeout(() => {
    const user = users.find(u => u.id === req.user.id);

    if (user.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña actual es incorrecta',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Las contraseñas no coinciden',
      });
    }

    // Actualizar contraseña
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        lastPasswordChange: new Date().toISOString(),
      };
    }

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });
  }, 1500);
});

// GET /api/auth/session
app.get('/api/auth/session', authenticateToken, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  
  res.json({
    success: true,
    data: userWithoutPassword,
  });
});

// GET /api/auth/password-status
app.get('/api/auth/password-status', authenticateToken, (req, res) => {
  const user = req.user;
  const lastChange = new Date(user.lastPasswordChange || user.createdAt);
  const now = new Date();
  const daysSinceChange = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));
  const expirationDays = 60; // Configurable
  const daysUntilExpiration = expirationDays - daysSinceChange;

  res.json({
    success: true,
    data: {
      expired: daysUntilExpiration <= 0,
      daysUntilExpiration: Math.max(0, daysUntilExpiration),
    },
  });
});

// ==================== DASHBOARD ENDPOINTS ====================
// ==================== DASHBOARD ENDPOINTS ====================

const dashboardLastUpdated = '12/1/2026, 11:01 p.m.';

const dashboardOverview = {
  lastUpdated: dashboardLastUpdated,
  cards: {
    totalTransactions: { value: 50, deltaText: '+12.5% más que el mes pasado' },
    totalAmount: { value: '$12,583.80', deltaText: '+8.2% más que el mes pasado', deltaType: 'up' },
    avgPerTx: { value: '$251.68', deltaText: '-2.1% menos que el mes pasado', deltaType: 'down' },
    mostUsed: { value: 'Abono', subtitle: 'Mayor volumen de operaciones' },
  },
};

let transactions = [
  { id: 'TRX-1001', date: '2024-01-18', associate: 'AS-1006', client: 'María García', category: 'Préstamos', type: 'Transferencia', amount: '$13.07', status: 'Inactivo' },
  { id: 'TRX-1002', date: '2024-01-15', associate: 'AS-1004', client: 'Carlos López', category: 'Préstamos', type: 'Pago', amount: '$77.82', status: 'Inactivo' },
  { id: 'TRX-1003', date: '2024-01-30', associate: 'AS-1003', client: 'Juan Pérez', category: 'Préstamos', type: 'Transferencia', amount: '$34.80', status: 'Inactivo' },
  { id: 'TRX-1004', date: '2024-01-02', associate: 'AS-1001', client: 'Carlos López', category: 'Remesas', type: 'Abono', amount: '$38.72', status: 'Inactivo' },
  { id: 'TRX-1005', date: '2024-01-07', associate: 'AS-1008', client: 'Juan Pérez', category: 'Tarjetas', type: 'Pago', amount: '$220.92', status: 'Inactivo' },
  // agregá más si querés (hasta 50) para que “1-5 de 50” sea real
];

const distribution = [
  { label: 'Pagos', value: 32, color: '#233269' },
  { label: 'Pagos de colectores', value: 18, color: '#2f4ea0' },
  { label: 'Transferencias 365 - Entrantes', value: 14, color: '#5173d6' },
  { label: 'Transferencias 365 - Salientes', value: 12, color: '#8aa7ff' },
  { label: 'Transferencias COMEDICA', value: 24, color: '#3b5db9' },
];

const volume = [
  { label: 'Transf. COMEDICA', value: 2200 },
  { label: 'Transf. 365 Entrantes', value: 945 },
  { label: 'Transf. 365 Salientes', value: 787 },
  { label: 'Pagos', value: 2756 },
  { label: 'Pagos de colectores', value: 1180 },
];

// GET /api/dashboard/overview
app.get('/api/dashboard/overview', authenticateToken, (req, res) => {
  res.json({ success: true, data: dashboardOverview });
});

// GET /api/dashboard/distribution
app.get('/api/dashboard/distribution', authenticateToken, (req, res) => {
  res.json({ success: true, data: distribution });
});

// GET /api/dashboard/volume
app.get('/api/dashboard/volume', authenticateToken, (req, res) => {
  res.json({ success: true, data: volume });
});

// GET /api/dashboard/transactions?search=&page=1&pageSize=5
app.get('/api/dashboard/transactions', authenticateToken, (req, res) => {
  const search = (req.query.search || '').toString().toLowerCase();
  const page = parseInt(req.query.page || '1', 10);
  const pageSize = parseInt(req.query.pageSize || '5', 10);

  let filtered = transactions;

  if (search) {
    filtered = transactions.filter((t) =>
      [t.id, t.date, t.associate, t.client, t.category, t.type, t.amount, t.status]
        .join(' ')
        .toLowerCase()
        .includes(search)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  res.json({ success: true, data: { data, total } });
});

// ==================== PARAMETERS ENDPOINTS ====================
const setupParametersRoutes = require('./parameters-routes');
setupParametersRoutes(app, authenticateToken);

// ==================== MAINTENANCE ENDPOINTS ====================
const setupMaintenanceRoutes = require('./maintenance-routes');
setupMaintenanceRoutes(app, authenticateToken);

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🚀 Mock Server de BackOffice Comédica                ║
║                                                        ║
║  📍 URL: http://localhost:${PORT}                        ║
║  🔐 Credenciales de prueba:                            ║
║     Usuario: admin                                     ║
║     Contraseña: Admin123!                              ║
║                                                        ║
║  📚 Endpoints disponibles:                             ║
║     POST /api/auth/login                               ║
║     POST /api/auth/logout                              ║
║     POST /api/auth/first-password-change               ║
║     POST /api/auth/change-password                     ║
║     GET  /api/auth/session                             ║
║     GET  /api/auth/password-status                     ║
║     GET  /api/dashboard/stats                          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
