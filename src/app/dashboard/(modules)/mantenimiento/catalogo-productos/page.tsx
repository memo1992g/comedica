'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { maintenanceService, Product } from '@/lib/api/maintenance.service';
import { Modal, ModalBody, ModalFooter } from '@/components/parametros/Modal';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import modalStyles from '@/components/parametros/Modal.module.css';
import styles from '../atencion-soporte/page.module.css';

export default function CatalogoProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({ code: '', name: '', description: '', status: 'Activo' as 'Activo' | 'Inactivo', category: '' });
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadProducts();
  }, [searchQuery, currentPage]);

  const loadProducts = async () => {
    try {
      const response = await maintenanceService.getProductCatalog({ search: searchQuery, page: currentPage, pageSize });
      setProducts(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAdd = () => {
    setFormData({ code: '', name: '', description: '', status: 'Activo', category: '' });
    setShowAddModal(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ code: product.code, name: product.name, description: product.description, status: product.status, category: product.category });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (selectedProduct) {
        await maintenanceService.updateProduct(selectedProduct.id, formData);
      } else {
        await maintenanceService.createProduct(formData);
      }
      await loadProducts();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsLoading(true);
    try {
      await maintenanceService.deleteProduct(productToDelete.id);
      await loadProducts();
      setProductToDelete(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <a href="/mantenimiento">Mantenimiento de</a>
        <ChevronRight size={16} />
        <span>Catálogo de productos</span>
      </div>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Catálogo de Productos</h1>
          <p>Gestión del catálogo de productos y servicios financieros</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/mantenimiento/catalogo-productos/historial')}>Historial</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}><Plus size={18} />Agregar Producto</button>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input type="text" className={styles.searchInput} placeholder="Buscar por código, nombre o descripción..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
      </div>

      <div className={styles.panel}>
        {products.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ fontWeight: 500 }}>{product.code}</td>
                    <td>{product.name}</td>
                    <td style={{ maxWidth: '400px', fontSize: '13px', color: '#6b7280' }}>{product.description}</td>
                    <td>
                      <span style={{ padding: '4px 10px', background: '#f3f4f6', borderRadius: '6px', fontSize: '12px' }}>
                        {product.category}
                      </span>
                    </td>
                    <td><span className={`${styles.statusBadge} ${product.status === 'Activo' ? styles.statusActive : styles.statusInactive}`}>{product.status}</span></td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.iconBtn} onClick={() => handleEdit(product)}><Pencil size={16} /></button>
                        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setProductToDelete(product)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <div className={styles.pageInfo}>Página {currentPage} · 1-{Math.min(currentPage * pageSize, total)} de {total}</div>
              <div className={styles.pageControls}>
                <button className={styles.pageBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
                <button className={`${styles.pageBtn} ${styles.active}`}>{currentPage}</button>
                <button className={styles.pageBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <Package size={48} style={{ opacity: 0.5 }} />
            <h3>No se encontraron productos</h3>
          </div>
        )}
      </div>

      <Modal isOpen={showAddModal || showEditModal} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'} subtitle="Complete los campos para crear un producto del catálogo.">
        <ModalBody>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formGrid}>
              <div className={modalStyles.formField}>
                <label className={modalStyles.formLabel}>Código <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="text" className={modalStyles.formInput} placeholder="AHO-001" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={!!selectedProduct} />
              </div>
              <div className={modalStyles.formField}>
                <label className={modalStyles.formLabel}>Categoría <span style={{ color: '#dc2626' }}>*</span></label>
                <select className={modalStyles.formInput} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  <option value="Ahorros">Ahorros</option>
                  <option value="Corriente">Corriente</option>
                  <option value="Tarjetas">Tarjetas</option>
                  <option value="Préstamos">Préstamos</option>
                  <option value="Inversiones">Inversiones</option>
                </select>
              </div>
            </div>
          </div>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Nombre <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" className={modalStyles.formInput} placeholder="Ej. Aportaciones" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
          </div>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Descripción <span style={{ color: '#dc2626' }}>*</span></label>
              <textarea className={modalStyles.formInput} placeholder="Describa el producto..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Estado</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.status === 'Activo'} onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Activo' : 'Inactivo' })} style={{ width: '40px', height: '20px' }} />
                  <span style={{ fontSize: '14px', color: formData.status === 'Activo' ? '#10b981' : '#6b7280', fontWeight: 500 }}>
                    {formData.status === 'Activo' ? 'Habilitado' : 'Deshabilitado'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className={`${modalStyles.btn} ${modalStyles.btnSecondary}`} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancelar</button>
          <button className={`${modalStyles.btn} ${modalStyles.btnPrimary}`} onClick={handleSave} disabled={!formData.code || !formData.name || !formData.category || isLoading}>{isLoading ? 'Guardando...' : 'Guardar cambios'}</button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={handleDelete} title="¿Eliminar producto?" message={`¿Está seguro de eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`} type="danger" confirmText="Eliminar" cancelText="Cancelar" isLoading={isLoading} />
    </div>
  );
}
