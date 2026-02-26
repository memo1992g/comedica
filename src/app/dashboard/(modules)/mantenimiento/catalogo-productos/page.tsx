'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Search, Package, UploadCloud } from 'lucide-react';
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
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-SV');
}

export default function CatalogoProductosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  const [previewImage, setPreviewImage] = useState('');
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

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setPreviewImage('');
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormData({ code: '', name: '', description: '', status: 'Activo', category: activeTab });
    setPreviewImage('');
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
    setPreviewImage(product.publicUrl ?? '');
    setShowEditModal(true);
  };

  const handleImagePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);
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
      closeModal();
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

  const modalTitle = selectedProduct ? 'Editar Producto' : 'Nuevo Producto';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Catálogo de Productos</h1>
          <p>Mantenimiento del catálogo de productos y tarjetas para clientes</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>
            <Plus size={16} /> Nuevo Producto
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
        <button className={`${styles.tab} ${activeTab === 'Productos' ? styles.tabActive : ''}`} onClick={() => setActiveTab('Productos')}>
          Productos
        </button>
        <button className={`${styles.tab} ${activeTab === 'Tarjetas' ? styles.tabActive : ''}`} onClick={() => setActiveTab('Tarjetas')}>
          Tarjetas
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} />
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
                  <img src={product.publicUrl} alt={product.name} className={styles.cardImage} />
                ) : (
                  <div className={styles.cardImagePlaceholder}>Sin imagen</div>
                )}
              </div>

              <div className={styles.cardBody}>
                <h3>{product.name}</h3>
                <p className={product.status === 'Activo' ? styles.statusActive : styles.statusInactive}>{product.status}</p>
                <p className={styles.description}>{product.description || 'Sin descripción'}</p>
                <div className={styles.cardFooter}>
                  <span>Modificado: {formatDate(product.updatedAt)}</span>
                  <button className={styles.iconBtn} onClick={() => handleEdit(product)}>
                    <Pencil size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Package size={40} style={{ opacity: 0.5 }} />
          <h3>No se encontraron productos</h3>
        </div>
      )}

      <Modal
        size="large"
        isOpen={showAddModal || showEditModal}
        onClose={closeModal}
        title={modalTitle}
        subtitle="Complete los campos para crear un producto del catálogo."
      >
        <ModalBody>
          <div className={styles.modalGrid}>
            <div>
              <label className={styles.modalLabel}>Imagen del Producto <span>*</span></label>
              <p className={styles.modalHint}>Formatos aceptados: PNG, JPG</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className={styles.hiddenInput}
                onChange={handleImagePick}
              />
              <button className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className={styles.uploadPreview} />
                ) : (
                  <UploadCloud size={30} className={styles.uploadIcon} />
                )}
                <div className={styles.uploadTitle}>Subir imagen</div>
                <div className={styles.uploadSub}>PNG o JPG</div>
              </button>
            </div>

            <div className={styles.modalFormCol}>
              <div className={modalStyles.formField}>
                <label className={styles.modalLabel}>Nombre <span>*</span></label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Ej. Aportaciones"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={modalStyles.formField}>
                <label className={styles.modalLabel}>Descripción <span>*</span></label>
                <textarea
                  className={`${styles.modalInput} ${styles.modalTextarea}`}
                  placeholder="Describa el producto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className={styles.statusRow}>
                <span className={styles.modalLabel}>Estado</span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={formData.status === 'Activo'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Activo' : 'Inactivo' })}
                  />
                  <span className={styles.slider} />
                  <span className={styles.switchText}>{formData.status === 'Activo' ? 'Habilitado' : 'Deshabilitado'}</span>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className={`${modalStyles.btn} ${modalStyles.btnSecondary}`} onClick={closeModal}>Cancelar</button>
          <button
            className={`${modalStyles.btn} ${modalStyles.btnPrimary}`}
            onClick={handleSave}
            disabled={!formData.name || !formData.description || isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar producto?"
        message={`¿Está seguro de eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isLoading}
      />
    </div>
  );
}
