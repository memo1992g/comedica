const maintenanceData = require('./maintenance-data');

/**
 * API Routes para Módulo de Mantenimiento
 * 
 * PREPARADO PARA INTEGRACIÓN CON JAVA BACKEND
 * 
 * Estas rutas mock replican exactamente la estructura que tendrá
 * el backend Java. Para conectar con Java:
 * 
 * 1. Cambiar baseURL en src/lib/api/api-client.ts
 * 2. Mantener las mismas rutas y estructura de respuesta
 * 3. El backend Java debe implementar estos endpoints con la misma firma
 */

function setupMaintenanceRoutes(app, authenticateToken) {

  // ==================== ATENCIÓN Y SOPORTE ====================
  
  /**
   * GET /api/maintenance/support-reasons
   * Lista motivos de atención y soporte con paginación
   * 
   * Query params:
   * - search: string (opcional)
   * - page: number (default: 1)
   * - pageSize: number (default: 20)
   * 
   * Response: { success: boolean, data: { data: SupportReason[], total: number } }
   */
  app.get('/api/maintenance/support-reasons', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '20', 10);

    let filtered = maintenanceData.supportReasons;

    if (search) {
      filtered = maintenanceData.supportReasons.filter((reason) =>
        [reason.code, reason.description]
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

  /**
   * POST /api/maintenance/support-reasons
   * Crea un nuevo motivo de soporte
   * 
   * Body: { reason: SupportReason }
   * Response: { success: boolean, message: string, data: SupportReason }
   */
  app.post('/api/maintenance/support-reasons', authenticateToken, (req, res) => {
    const { reason } = req.body;

    setTimeout(() => {
      const newReason = {
        id: `SOP-${String(maintenanceData.supportReasons.length + 1).padStart(3, '0')}`,
        ...reason,
        createdAt: new Date().toISOString(),
        createdBy: req.user.fullName,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user.fullName,
      };

      maintenanceData.supportReasons.push(newReason);

      // Agregar a auditoría
      maintenanceData.maintenanceAuditLog.unshift({
        id: `MAINT-AUD-${Date.now()}`,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        action: 'Creación de motivo de soporte',
        module: 'Atención y Soporte',
        details: `Motivo: ${reason.description}`,
        changes: [{ field: 'Estado', oldValue: 'N/A', newValue: reason.status }],
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: 'Motivo creado correctamente',
        data: newReason,
      });
    }, 800);
  });

  /**
   * PUT /api/maintenance/support-reasons/:id
   * Actualiza un motivo existente
   */
  app.put('/api/maintenance/support-reasons/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    setTimeout(() => {
      const index = maintenanceData.supportReasons.findIndex((r) => r.id === id);
      
      if (index !== -1) {
        const oldReason = maintenanceData.supportReasons[index];
        
        maintenanceData.supportReasons[index] = {
          ...maintenanceData.supportReasons[index],
          ...reason,
          updatedAt: new Date().toISOString(),
          updatedBy: req.user.fullName,
        };

        // Auditoría
        const changes = [];
        if (oldReason.status !== reason.status) {
          changes.push({ field: 'Estado', oldValue: oldReason.status, newValue: reason.status });
        }

        maintenanceData.maintenanceAuditLog.unshift({
          id: `MAINT-AUD-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          action: 'Actualización de motivo de soporte',
          module: 'Atención y Soporte',
          details: `Motivo: ${reason.description}`,
          changes,
          timestamp: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Motivo actualizado correctamente' });
      } else {
        res.status(404).json({ success: false, error: 'Motivo no encontrado' });
      }
    }, 800);
  });

  /**
   * DELETE /api/maintenance/support-reasons/:id
   * Elimina un motivo
   */
  app.delete('/api/maintenance/support-reasons/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    setTimeout(() => {
      const index = maintenanceData.supportReasons.findIndex((r) => r.id === id);
      
      if (index !== -1) {
        const reason = maintenanceData.supportReasons[index];
        maintenanceData.supportReasons.splice(index, 1);

        maintenanceData.maintenanceAuditLog.unshift({
          id: `MAINT-AUD-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          action: 'Eliminación de motivo de soporte',
          module: 'Atención y Soporte',
          details: `Motivo: ${reason.description}`,
          changes: [],
          timestamp: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Motivo eliminado correctamente' });
      } else {
        res.status(404).json({ success: false, error: 'Motivo no encontrado' });
      }
    }, 800);
  });

  // ==================== CUESTIONARIO DE SEGURIDAD ====================
  
  /**
   * GET /api/maintenance/security-questions
   * Lista preguntas de seguridad
   */
  app.get('/api/maintenance/security-questions', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '20', 10);

    let filtered = maintenanceData.securityQuestions;

    if (search) {
      filtered = maintenanceData.securityQuestions.filter((q) =>
        [q.code, q.question].join(' ').toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    res.json({ success: true, data: { data, total } });
  });

  /**
   * POST /api/maintenance/security-questions
   */
  app.post('/api/maintenance/security-questions', authenticateToken, (req, res) => {
    const { question } = req.body;

    setTimeout(() => {
      const newQuestion = {
        id: `Q${String(maintenanceData.securityQuestions.length + 1).padStart(3, '0')}`,
        ...question,
        createdAt: new Date().toISOString(),
        createdBy: req.user.fullName,
        modifiedAt: new Date().toISOString(),
        modifiedBy: req.user.fullName,
      };

      maintenanceData.securityQuestions.push(newQuestion);

      maintenanceData.maintenanceAuditLog.unshift({
        id: `MAINT-AUD-${Date.now()}`,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        action: 'Creación de pregunta de seguridad',
        module: 'Cuestionario de Seguridad',
        details: `Pregunta: ${question.question}`,
        changes: [{ field: 'Estado', oldValue: 'N/A', newValue: question.status }],
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, message: 'Pregunta creada correctamente', data: newQuestion });
    }, 800);
  });

  /**
   * PUT /api/maintenance/security-questions/:id
   */
  app.put('/api/maintenance/security-questions/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { question } = req.body;

    setTimeout(() => {
      const index = maintenanceData.securityQuestions.findIndex((q) => q.id === id);
      
      if (index !== -1) {
        const oldQuestion = maintenanceData.securityQuestions[index];
        
        maintenanceData.securityQuestions[index] = {
          ...maintenanceData.securityQuestions[index],
          ...question,
          modifiedAt: new Date().toISOString(),
          modifiedBy: req.user.fullName,
        };

        const changes = [];
        if (oldQuestion.status !== question.status) {
          changes.push({ field: 'Estado', oldValue: oldQuestion.status, newValue: question.status });
        }

        maintenanceData.maintenanceAuditLog.unshift({
          id: `MAINT-AUD-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          action: 'Actualización de pregunta de seguridad',
          module: 'Cuestionario de Seguridad',
          details: `Pregunta: ${question.question}`,
          changes,
          timestamp: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Pregunta actualizada correctamente' });
      } else {
        res.status(404).json({ success: false, error: 'Pregunta no encontrada' });
      }
    }, 800);
  });

  /**
   * DELETE /api/maintenance/security-questions/:id
   */
  app.delete('/api/maintenance/security-questions/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    setTimeout(() => {
      const index = maintenanceData.securityQuestions.findIndex((q) => q.id === id);
      
      if (index !== -1) {
        const question = maintenanceData.securityQuestions[index];
        maintenanceData.securityQuestions.splice(index, 1);

        maintenanceData.maintenanceAuditLog.unshift({
          id: `MAINT-AUD-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          action: 'Eliminación de pregunta de seguridad',
          module: 'Cuestionario de Seguridad',
          details: `Pregunta: ${question.question}`,
          changes: [],
          timestamp: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Pregunta eliminada correctamente' });
      } else {
        res.status(404).json({ success: false, error: 'Pregunta no encontrada' });
      }
    }, 800);
  });

  // ==================== IMÁGENES ====================
  
  /**
   * GET /api/maintenance/security-images
   */
  app.get('/api/maintenance/security-images', authenticateToken, (req, res) => {
    const type = req.query.type; // 'mobile' or 'desktop'
    let data = maintenanceData.securityImages;

    if (type) {
      data = data.filter((img) => img.type === type);
    }

    res.json({ success: true, data });
  });

  /**
   * POST /api/maintenance/security-images
   * En producción, este endpoint manejará el upload de archivos
   */
  app.post('/api/maintenance/security-images', authenticateToken, (req, res) => {
    const { image } = req.body;

    setTimeout(() => {
      const newImage = {
        id: `IMG-${String(maintenanceData.securityImages.length + 1).padStart(3, '0')}`,
        ...image,
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user.fullName,
      };

      maintenanceData.securityImages.push(newImage);

      maintenanceData.maintenanceAuditLog.unshift({
        id: `MAINT-AUD-${Date.now()}`,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        action: `Carga de nueva versión ${image.type}`,
        module: 'Imágenes de seguridad',
        details: `Imagen ${image.type === 'mobile' ? 'Mobile' : 'Desktop'}: ${image.name}`,
        changes: [{ field: 'Imagen', oldValue: 'N/A', newValue: image.filename }],
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, message: 'Imagen cargada correctamente', data: newImage });
    }, 800);
  });

  /**
   * DELETE /api/maintenance/security-images/:id
   */
  app.delete('/api/maintenance/security-images/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    setTimeout(() => {
      const index = maintenanceData.securityImages.findIndex((img) => img.id === id);
      
      if (index !== -1) {
        maintenanceData.securityImages.splice(index, 1);
        res.json({ success: true, message: 'Imagen eliminada correctamente' });
      } else {
        res.status(404).json({ success: false, error: 'Imagen no encontrada' });
      }
    }, 800);
  });

  // ==================== CATÁLOGO DE PRODUCTOS ====================
  
  /**
   * GET /api/maintenance/product-catalog
   */
  app.get('/api/maintenance/product-catalog', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '20', 10);

    let filtered = maintenanceData.productCatalog;

    if (search) {
      filtered = maintenanceData.productCatalog.filter((prod) =>
        [prod.code, prod.name, prod.description].join(' ').toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    res.json({ success: true, data: { data, total } });
  });

  /**
   * POST /api/maintenance/product-catalog
   */
  app.post('/api/maintenance/product-catalog', authenticateToken, (req, res) => {
    const { product } = req.body;

    setTimeout(() => {
      const newProduct = {
        id: `PROD-${String(maintenanceData.productCatalog.length + 1).padStart(3, '0')}`,
        ...product,
        createdAt: new Date().toISOString(),
        createdBy: req.user.fullName,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user.fullName,
      };

      maintenanceData.productCatalog.push(newProduct);

      maintenanceData.maintenanceAuditLog.unshift({
        id: `MAINT-AUD-${Date.now()}`,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        action: 'Creación de producto',
        module: 'Catálogo de productos',
        details: `Producto: ${product.name}`,
        changes: [{ field: 'Estado', oldValue: 'N/A', newValue: product.status }],
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, message: 'Producto creado correctamente', data: newProduct });
    }, 800);
  });

  /**
   * PUT /api/maintenance/product-catalog/:id
   */
  app.put('/api/maintenance/product-catalog/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { product } = req.body;

    setTimeout(() => {
      const index = maintenanceData.productCatalog.findIndex((p) => p.id === id);
      
      if (index !== -1) {
        const oldProduct = maintenanceData.productCatalog[index];
        
        maintenanceData.productCatalog[index] = {
          ...maintenanceData.productCatalog[index],
          ...product,
          updatedAt: new Date().toISOString(),
          updatedBy: req.user.fullName,
        };

        const changes = [];
        if (oldProduct.status !== product.status) {
          changes.push({ field: 'Estado', oldValue: oldProduct.status, newValue: product.status });
        }

        maintenanceData.maintenanceAuditLog.unshift({
          id: `MAINT-AUD-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          action: 'Actualización de producto',
          module: 'Catálogo de productos',
          details: `Producto: ${product.name}`,
          changes,
          timestamp: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Producto actualizado correctamente' });
      } else {
        res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }
    }, 800);
  });

  /**
   * DELETE /api/maintenance/product-catalog/:id
   */
  app.delete('/api/maintenance/product-catalog/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    setTimeout(() => {
      const index = maintenanceData.productCatalog.findIndex((p) => p.id === id);
      
      if (index !== -1) {
        const product = maintenanceData.productCatalog[index];
        maintenanceData.productCatalog.splice(index, 1);

        maintenanceData.maintenanceAuditLog.unshift({
          id: `MAINT-AUD-${Date.now()}`,
          userId: req.user.id,
          userName: req.user.fullName,
          userRole: req.user.role,
          action: 'Eliminación de producto',
          module: 'Catálogo de productos',
          details: `Producto: ${product.name}`,
          changes: [],
          timestamp: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Producto eliminado correctamente' });
      } else {
        res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }
    }, 800);
  });

  // ==================== AUDITORÍA ====================
  
  /**
   * GET /api/maintenance/audit
   */
  app.get('/api/maintenance/audit', authenticateToken, (req, res) => {
    const search = (req.query.search || '').toString().toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '20', 10);
    const module = req.query.module;

    let filtered = maintenanceData.maintenanceAuditLog;

    if (module) {
      filtered = filtered.filter((log) => log.module === module);
    }

    if (search) {
      filtered = filtered.filter((log) =>
        [log.userName, log.action, log.details].join(' ').toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    res.json({ success: true, data: { data, total } });
  });
}

module.exports = setupMaintenanceRoutes;
