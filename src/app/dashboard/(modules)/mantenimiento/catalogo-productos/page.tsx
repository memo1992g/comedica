'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Search, Package } from 'lucide-react';
import {
  createProduct,
  deleteProduct,
  getProductCatalog,
  type Product,
  updateProduct,
} from '@/lib/api/maintenance.service';
import { Modal, ModalBody, ModalFooter } from '@/components/parametros/Modal';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import modalStyles from '@/components/parametros/Modal.module.css';
import styles from './page.module.css';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleDateString('es-SV');
}

export default function CatalogoProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Productos' | 'Tarjetas'>('Productos');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'Activo' as 'Activo' | 'Inactivo',
    category: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProductCatalog({ page: 1, pageSize: 200 });
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormData({ code: '', name: '', description: '', status: 'Activo', category: '' });
    setShowAddModal(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      description: product.description,
      status: product.status,
      category: product.category,
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
      } else {
        await createProduct(formData);
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
      await deleteProduct(productToDelete.id);
      await loadProducts();
      setProductToDelete(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase();

    return products
      .filter((item) => item.category === activeTab)
      .filter((item) => {
        if (!searchLower) return true;
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.code.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      });
  }, [activeTab, products, searchQuery]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Catálogo de Productos</h1>
          <p>Mantenimiento del catálogo de productos y tarjetas para clientes</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleAdd}
          >
            <Plus size={18} /> Nuevo Producto
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => router.push('/dashboard/mantenimiento/catalogo-productos/historial')}
          >
            Historial
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'Productos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('Productos')}
        >
          Productos
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Tarjetas' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('Tarjetas')}
        >
          Tarjetas
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por nombre o descripción"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <article key={product.id} className={styles.card}>
              <div className={styles.cardImageWrap}>
                {product.publicUrl ? (
                  <img
                    src={product.publicUrl}
                    alt={product.name}
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder}>Sin imagen</div>
                )}
              </div>

              <div className={styles.cardBody}>
                <h3>{product.name}</h3>
                <p className={product.status === 'Activo' ? styles.statusActive : styles.statusInactive}>
                  {product.status}
                </p>
                <p className={styles.description}>{product.description || 'Sin descripción'}</p>
                <div className={styles.cardFooter}>
                  <span>Modificado: {formatDate(product.updatedAt)}</span>
                  <button className={styles.iconBtn} onClick={() => handleEdit(product)}>
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Package size={44} style={{ opacity: 0.5 }} />
          <h3>No se encontraron productos</h3>
        </div>
      )}

      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
        subtitle="Complete los campos para crear un producto del catálogo."
      >
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
                  <option value="Productos">Productos</option>
                  <option value="Tarjetas">Tarjetas</option>
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
