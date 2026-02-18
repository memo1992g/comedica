// Importar datos
const parametersData = require('./parameters-data');

function setupParametersRoutes(app, authenticateToken) {
  // GET /api/parameters/limits/general
  app.get('/api/parameters/limits/general', authenticateToken, (req, res) => {
    res.json({
      success: true,
      data: parametersData.generalLimits,
    });
  });

  // PUT /api/parameters/limits/general
  app.put('/api/parameters/limits/general', authenticateToken, (req, res) => {
    const { limits } = req.body;

    setTimeout(() => {
      // Simular actualización
      limits.forEach((limit) => {
        const index = parametersData.generalLimits.findIndex((l) => l.id === limit.id);
        if (index !== -1) {
          // Guardar valores anteriores para auditoría
          const oldLimit = parametersData.generalLimits[index];
          
          parametersData.generalLimits[index] = {
            ...parametersData.generalLimits[index],
            ...limit,
            updatedAt: new Date().toISOString(),
            updatedBy: req.user.fullName,
          };

          // Agregar a auditoría
          parametersData.auditLog.unshift({
            id: `audit-${Date.now()}`,
            userId: req.user.id,
            userName: req.user.fullName,
            userRole: req.user.role,
            affectedUser: null,
            action: 'Modificación de límites generales',
            module: 'Límites y Montos',
            details: `${limit.category} - Actualización`,
            changes: [
              { field: 'Máximo por transacción', oldValue: oldLimit.maxPerTransaction, newValue: limit.maxPerTransaction },
            ],
            timestamp: new Date().toISOString(),
          });
        }
      });

      res.json({
        success: true,
        message: 'Límites actualizados correctamente',
      });
    }, 1000);
  });

  // GET /api/parameters/limits/users
  app.get('/api/parameters/limits/users', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '20', 10);

    let filtered = parametersData.userLimits;

    if (search) {
      filtered = parametersData.userLimits.filter((u) =>
        [u.userName, u.userCode, u.limitType].join(' ').toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    res.json({ success: true, data: { data, total } });
  });

  // PUT /api/parameters/limits/users/:userId
  app.put('/api/parameters/limits/users/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;
    const { limits } = req.body;

    setTimeout(() => {
      const index = parametersData.userLimits.findIndex((u) => u.userId === userId);
      
      if (index !== -1) {
        const oldUser = parametersData.userLimits[index];
        
        parametersData.userLimits[index] = {
          ...parametersData.userLimits[index],
          limits,
          limitType: 'personalizado',
          lastUpdate: new Date().toISOString().split('T')[0],
        };

        // Agregar a auditoría
        parametersData.auditLog.unshift({
          id: `audit-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          affectedUser: parametersData.userLimits[index].userName,
          action: `Actualización de límites de usuario: ${parametersData.userLimits[index].userName}`,
          module: 'Límites y Montos',
          details: 'Límites personalizados actualizados',
          changes: [],
          timestamp: new Date().toISOString(),
        });

        res.json({
          success: true,
          message: 'Límites de usuario actualizados correctamente',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
        });
      }
    }, 1000);
  });

  // DELETE /api/parameters/limits/users/:userId
  app.delete('/api/parameters/limits/users/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;

    setTimeout(() => {
      const index = parametersData.userLimits.findIndex((u) => u.userId === userId);
      
      if (index !== -1) {
        parametersData.userLimits[index] = {
          ...parametersData.userLimits[index],
          limits: {},
          limitType: 'general',
          lastUpdate: undefined,
        };

        // Agregar a auditoría
        parametersData.auditLog.unshift({
          id: `audit-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          affectedUser: parametersData.userLimits[index].userName,
          action: `Eliminación de límites personalizados: ${parametersData.userLimits[index].userName}`,
          module: 'Límites y Montos',
          details: 'El usuario volvió a usar límites generales',
          changes: [],
          timestamp: new Date().toISOString(),
        });

        res.json({
          success: true,
          message: 'Límites personalizados eliminados correctamente',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
        });
      }
    }, 1000);
  });

  // GET /api/parameters/audit
  app.get('/api/parameters/audit', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '20', 10);

    let filtered = parametersData.auditLog;

    if (search) {
      filtered = parametersData.auditLog.filter((log) =>
        [log.userName, log.action, log.details, log.affectedUser || '']
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

  // GET /api/parameters/audit/recent
  app.get('/api/parameters/audit/recent', authenticateToken, (req, res) => {
    const limit = parseInt(req.query.limit || '5', 10);
    const data = parametersData.auditLog.slice(0, limit);

    res.json({ success: true, data });
  });

  // GET /api/parameters/security
  app.get('/api/parameters/security', authenticateToken, (req, res) => {
    res.json({
      success: true,
      data: parametersData.securityConfig,
    });
  });

  // PUT /api/parameters/security
  app.put('/api/parameters/security', authenticateToken, (req, res) => {
    const { config } = req.body;

    setTimeout(() => {
      const oldConfig = { ...parametersData.securityConfig };
      
      parametersData.securityConfig = {
        ...parametersData.securityConfig,
        ...config,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user.fullName,
      };

      // Agregar a auditoría
      const changes = [];
      Object.keys(config).forEach((key) => {
        if (oldConfig[key] !== config[key]) {
          changes.push({
            field: key,
            oldValue: oldConfig[key],
            newValue: config[key],
          });
        }
      });

      if (changes.length > 0) {
        parametersData.auditLog.unshift({
          id: `audit-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          affectedUser: null,
          action: 'Actualización de parámetros de seguridad',
          module: 'Configuraciones de Seguridad',
          details: 'Actualización de configuración general',
          changes,
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        message: 'Configuración actualizada correctamente',
      });
    }, 1000);
  });

  // ==================== TRANSFER365 ENDPOINTS ====================

  // GET /api/parameters/transfer365/local
  app.get('/api/parameters/transfer365/local', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '10', 10);

    let filtered = parametersData.transfer365Institutions;

    if (search) {
      filtered = parametersData.transfer365Institutions.filter((inst) =>
        [inst.bic, inst.shortName, inst.fullName, inst.institution]
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

  // GET /api/parameters/transfer365/card
  app.get('/api/parameters/transfer365/card', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '10', 10);

    let filtered = parametersData.transfer365CARDInstitutions;

    if (search) {
      filtered = parametersData.transfer365CARDInstitutions.filter((inst) =>
        [inst.bic, inst.fullName, inst.country]
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

  // POST /api/parameters/transfer365/local
  app.post('/api/parameters/transfer365/local', authenticateToken, (req, res) => {
    const { institution } = req.body;

    setTimeout(() => {
      const newInst = {
        id: `inst-${Date.now()}`,
        ...institution,
      };

      parametersData.transfer365Institutions.push(newInst);

      // Agregar a auditoría
      parametersData.auditLog.unshift({
        id: `audit-${Date.now()}`,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        affectedUser: null,
        action: `Actualización de Institución: ${institution.fullName}`,
        module: 'Red Transfer365',
        details: `Productos: ${institution.products?.join(', ') || 'N/A'}`,
        changes: [
          { field: 'Estado', oldValue: 'N/A', newValue: institution.status },
        ],
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: 'Institución creada correctamente',
        data: newInst,
      });
    }, 1000);
  });

  // POST /api/parameters/transfer365/card
  app.post('/api/parameters/transfer365/card', authenticateToken, (req, res) => {
    const { institution } = req.body;

    setTimeout(() => {
      const newInst = {
        id: `inst-ca-${Date.now()}`,
        ...institution,
      };

      parametersData.transfer365CARDInstitutions.push(newInst);

      // Agregar a auditoría
      parametersData.auditLog.unshift({
        id: `audit-${Date.now()}`,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        affectedUser: null,
        action: `Actualización de Institución: ${institution.fullName}`,
        module: 'Red Transfer365',
        details: `País: ${institution.country}`,
        changes: [
          { field: 'Estado', oldValue: 'N/A', newValue: institution.status },
        ],
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: 'Institución creada correctamente',
        data: newInst,
      });
    }, 1000);
  });

  // PUT /api/parameters/transfer365/local/:id
  app.put('/api/parameters/transfer365/local/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { institution } = req.body;

    setTimeout(() => {
      const index = parametersData.transfer365Institutions.findIndex((i) => i.id === id);
      
      if (index !== -1) {
        const oldInst = parametersData.transfer365Institutions[index];
        
        parametersData.transfer365Institutions[index] = {
          ...parametersData.transfer365Institutions[index],
          ...institution,
        };

        // Agregar a auditoría
        const changes = [];
        if (oldInst.status !== institution.status) {
          changes.push({
            field: 'Estado',
            oldValue: oldInst.status,
            newValue: institution.status,
          });
        }

        parametersData.auditLog.unshift({
          id: `audit-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          affectedUser: null,
          action: `Actualización de Institución: ${institution.fullName}`,
          module: 'Red Transfer365',
          details: `Estado: ${oldInst.status} → ${institution.status}`,
          changes,
          timestamp: new Date().toISOString(),
        });

        res.json({
          success: true,
          message: 'Institución actualizada correctamente',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Institución no encontrada',
        });
      }
    }, 1000);
  });

  // PUT /api/parameters/transfer365/card/:id
  app.put('/api/parameters/transfer365/card/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { institution } = req.body;

    setTimeout(() => {
      const index = parametersData.transfer365CARDInstitutions.findIndex((i) => i.id === id);
      
      if (index !== -1) {
        const oldInst = parametersData.transfer365CARDInstitutions[index];
        
        parametersData.transfer365CARDInstitutions[index] = {
          ...parametersData.transfer365CARDInstitutions[index],
          ...institution,
        };

        // Agregar a auditoría
        const changes = [];
        if (oldInst.status !== institution.status) {
          changes.push({
            field: 'Estado',
            oldValue: oldInst.status,
            newValue: institution.status,
          });
        }

        parametersData.auditLog.unshift({
          id: `audit-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          affectedUser: null,
          action: `Actualización de Institución: ${institution.fullName}`,
          module: 'Red Transfer365',
          details: `Estado: ${oldInst.status} → ${institution.status}`,
          changes,
          timestamp: new Date().toISOString(),
        });

        res.json({
          success: true,
          message: 'Institución actualizada correctamente',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Institución no encontrada',
        });
      }
    }, 1000);
  });

  // DELETE /api/parameters/transfer365/local/:id
  app.delete('/api/parameters/transfer365/local/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    setTimeout(() => {
      const index = parametersData.transfer365Institutions.findIndex((i) => i.id === id);
      
      if (index !== -1) {
        const inst = parametersData.transfer365Institutions[index];
        parametersData.transfer365Institutions.splice(index, 1);

        // Agregar a auditoría
        parametersData.auditLog.unshift({
          id: `audit-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          affectedUser: null,
          action: `Eliminación de Institución: ${inst.fullName}`,
          module: 'Red Transfer365',
          details: 'Institución eliminada permanentemente',
          changes: [],
          timestamp: new Date().toISOString(),
        });

        res.json({
          success: true,
          message: 'Institución eliminada correctamente',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Institución no encontrada',
        });
      }
    }, 1000);
  });

  // DELETE /api/parameters/transfer365/card/:id
  app.delete('/api/parameters/transfer365/card/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    setTimeout(() => {
      const index = parametersData.transfer365CARDInstitutions.findIndex((i) => i.id === id);
      
      if (index !== -1) {
        const inst = parametersData.transfer365CARDInstitutions[index];
        parametersData.transfer365CARDInstitutions.splice(index, 1);

        // Agregar a auditoría
        parametersData.auditLog.unshift({
          id: `audit-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          affectedUser: null,
          action: `Eliminación de Institución: ${inst.fullName}`,
          module: 'Red Transfer365',
          details: 'Institución eliminada permanentemente',
          changes: [],
          timestamp: new Date().toISOString(),
        });

        res.json({
          success: true,
          message: 'Institución eliminada correctamente',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Institución no encontrada',
        });
      }
    }, 1000);
  });
}

module.exports = setupParametersRoutes;
