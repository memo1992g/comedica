'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Search, Package, UploadCloud } from 'lucide-react';
import { getSecurityImages, uploadSecurityImage, type SecurityImage } from '@/lib/api/maintenance.service';
import { Modal, ModalBody, ModalFooter } from '@/components/parametros/Modal';
import modalStyles from '@/components/parametros/Modal.module.css';
import styles from './page.module.css';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-SV');
}

export default function ImagenesPage() {
  const router = useRouter();
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<SecurityImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'APP' | 'WEB'>('APP');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SecurityImage | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Activo' as 'Activo' | 'Inactivo',
  });
  const [desktopPreview, setDesktopPreview] = useState('');
  const [mobilePreview, setMobilePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await getSecurityImages();
      setImages(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openAddModal = () => {
    setSelectedImage(null);
    setFormData({ name: '', description: '', status: 'Activo' });
    setDesktopPreview('');
    setMobilePreview('');
    setShowAddModal(true);
  };

  const openEditModal = (image: SecurityImage) => {
    setSelectedImage(image);
    setFormData({
      name: image.name,
      description: image.description || 'Información de seguridad en Comédica en Línea y Móvil',
      status: image.status ?? 'Activo',
    });
    if (image.clazz === 'WEB') {
      setDesktopPreview(image.url);
      setMobilePreview('');
    } else {
      setMobilePreview(image.url);
      setDesktopPreview('');
    }
    setShowAddModal(true);
  };

  const handlePickDesktop = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setDesktopPreview(URL.createObjectURL(file));
  };

  const handlePickMobile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setMobilePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await uploadSecurityImage({
        name: formData.name,
        type: activeTab === 'WEB' ? 'desktop' : 'mobile',
        filename: formData.name,
      });
      await loadImages();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return images
      .filter((image) => (image.clazz ?? 'APP') === activeTab)
      .filter((image) => {
        if (!query) return true;
        return (
          image.name.toLowerCase().includes(query) ||
          (image.description ?? '').toLowerCase().includes(query)
        );
      });
  }, [activeTab, images, searchQuery]);

  const modalTitle = selectedImage ? 'Editar Imagen de Seguridad' : 'Nueva Imagen de Seguridad';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Imágenes</h1>
          <p>Administración de la galería de imágenes para validación y control</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openAddModal}>
            <Plus size={16} /> Nueva Imagen
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/dashboard/mantenimiento/imagenes/historial')}>
            Historial
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'APP' ? styles.tabActive : ''}`} onClick={() => setActiveTab('APP')}>
          Imágenes de Seguridad
        </button>
        <button className={`${styles.tab} ${activeTab === 'WEB' ? styles.tabActive : ''}`} onClick={() => setActiveTab('WEB')}>
          Imágenes de Inicio Web
        </button>
      </div>

      <div className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Buscar por nombre o descripción"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredImages.length > 0 ? (
        <div className={styles.grid}>
          {filteredImages.map((image) => (
            <article key={image.id} className={styles.card}>
              <div className={styles.cardImageWrap}>
                {image.url ? (
                  <img src={image.url} alt={image.name} className={styles.cardImage} />
                ) : (
                  <div className={styles.cardImagePlaceholder}>Sin imagen</div>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3>{image.name}</h3>
                <p className={styles.statusActive}>{image.status ?? 'Activo'}</p>
                <p className={styles.description}>{image.description ?? 'Información de seguridad en Comédica en Línea y Móvil'}</p>
                <div className={styles.cardFooter}>
                  <span>Modificado: {formatDate(image.uploadedAt)}</span>
                  <button className={styles.iconBtn} onClick={() => openEditModal(image)}>
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
          <h3>No se encontraron imágenes</h3>
        </div>
      )}

      <Modal
        size="large"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={modalTitle}
        subtitle="Complete los campos para crear una imagen de seguridad."
      >
        <ModalBody>
          <div className={styles.modalGrid}>
            <div className={styles.uploadColumn}>
              <div>
                <label className={styles.modalLabel}>Versión Desktop</label>
                <p className={styles.modalHint}>Dimensiones recomendadas: 860x120px</p>
                <input ref={desktopInputRef} className={styles.hiddenInput} type="file" accept="image/png,image/jpeg" onChange={handlePickDesktop} />
                <button className={styles.uploadBox} onClick={() => desktopInputRef.current?.click()}>
                  {desktopPreview ? <img src={desktopPreview} alt="Desktop preview" className={styles.uploadPreview} /> : <UploadCloud size={28} className={styles.uploadIcon} />}
                  <div className={styles.uploadTitle}>Subir versión Desktop</div>
                  <div className={styles.uploadSub}>PNG o JPG</div>
                </button>
              </div>

              <div>
                <label className={styles.modalLabel}>Versión Mobile</label>
                <p className={styles.modalHint}>Dimensiones recomendadas: 448x102px</p>
                <input ref={mobileInputRef} className={styles.hiddenInput} type="file" accept="image/png,image/jpeg" onChange={handlePickMobile} />
                <button className={styles.uploadBox} onClick={() => mobileInputRef.current?.click()}>
                  {mobilePreview ? <img src={mobilePreview} alt="Mobile preview" className={styles.uploadPreview} /> : <UploadCloud size={28} className={styles.uploadIcon} />}
                  <div className={styles.uploadTitle}>Subir versión Mobile</div>
                  <div className={styles.uploadSub}>PNG o JPG</div>
                </button>
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={modalStyles.formField}>
                <label className={styles.modalLabel}>Nombre <span>*</span></label>
                <input className={styles.modalInput} placeholder="Ej. Escudo Protector" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className={modalStyles.formField}>
                <label className={styles.modalLabel}>Descripción <span>*</span></label>
                <textarea className={`${styles.modalInput} ${styles.modalTextarea}`} placeholder="Describa el propósito de esta imagen..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className={styles.statusRow}>
                <span className={styles.modalLabel}>Estado</span>
                <label className={styles.switch}>
                  <input type="checkbox" checked={formData.status === 'Activo'} onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Activo' : 'Inactivo' })} />
                  <span className={styles.slider} />
                  <span className={styles.switchText}>{formData.status === 'Activo' ? 'Habilitado' : 'Deshabilitado'}</span>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className={`${modalStyles.btn} ${modalStyles.btnSecondary}`} onClick={() => setShowAddModal(false)}>Cancelar</button>
          <button className={`${modalStyles.btn} ${modalStyles.btnPrimary}`} onClick={handleSave} disabled={!formData.name || !formData.description || isLoading}>{isLoading ? 'Guardando...' : 'Guardar cambios'}</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
