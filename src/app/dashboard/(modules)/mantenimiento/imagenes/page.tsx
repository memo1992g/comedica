'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Trash2, Image as ImageIcon, Monitor, Smartphone } from 'lucide-react';
import { maintenanceService, SecurityImage } from '@/lib/api/maintenance.service';
import { Modal, ModalBody, ModalFooter } from '@/components/parametros/Modal';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import modalStyles from '@/components/parametros/Modal.module.css';
import styles from '../atencion-soporte/page.module.css';

export default function ImagenesPage() {
  const router = useRouter();
  const [images, setImages] = useState<SecurityImage[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<SecurityImage | null>(null);
  
  const [formData, setFormData] = useState({ name: '', type: 'mobile' as 'mobile' | 'desktop', filename: '', size: '256 KB', dimensions: '1080x1920' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await maintenanceService.getSecurityImages();
      setImages(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', type: 'mobile', filename: '', size: '256 KB', dimensions: '1080x1920' });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await maintenanceService.uploadSecurityImage(formData);
      await loadImages();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    setIsLoading(true);
    try {
      await maintenanceService.deleteSecurityImage(imageToDelete.id);
      await loadImages();
      setImageToDelete(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const mobileImages = images.filter(img => img.type === 'mobile');
  const desktopImages = images.filter(img => img.type === 'desktop');

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <a href="/mantenimiento">Mantenimiento de</a>
        <ChevronRight size={16} />
        <span>Imágenes de seguridad</span>
      </div>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Imágenes de Seguridad</h1>
          <p>Gestión de imágenes para aplicaciones móviles y desktop</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/mantenimiento/imagenes/historial')}>Historial</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}><Plus size={18} />Cargar Imagen</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Mobile */}
        <div className={styles.panel}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={20} style={{ color: '#233269' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Versión Mobile</h3>
          </div>
          {mobileImages.map((img) => (
            <div key={img.id} style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{img.name}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {img.dimensions} • {img.size}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  {formatDate(img.uploadedAt)} por {img.uploadedBy}
                </div>
              </div>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setImageToDelete(img)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {mobileImages.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <ImageIcon size={40} style={{ opacity: 0.5, margin: '0 auto 8px' }} />
              <div>No hay imágenes mobile</div>
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className={styles.panel}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={20} style={{ color: '#233269' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Versión Desktop</h3>
          </div>
          {desktopImages.map((img) => (
            <div key={img.id} style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{img.name}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {img.dimensions} • {img.size}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  {formatDate(img.uploadedAt)} por {img.uploadedBy}
                </div>
              </div>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setImageToDelete(img)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {desktopImages.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <ImageIcon size={40} style={{ opacity: 0.5, margin: '0 auto 8px' }} />
              <div>No hay imágenes desktop</div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nueva Imagen de Seguridad" subtitle="Complete los campos para crear una imagen de seguridad.">
        <ModalBody>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Tipo <span style={{ color: '#dc2626' }}>*</span></label>
              <select className={modalStyles.formInput} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'mobile' | 'desktop', dimensions: e.target.value === 'mobile' ? '1080x1920' : '1920x1080' })}>
                <option value="mobile">Mobile (1080x1920)</option>
                <option value="desktop">Desktop (1920x1080)</option>
              </select>
            </div>
          </div>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Nombre <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" className={modalStyles.formInput} placeholder="Ej. Escudo Protector" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
          </div>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Archivo <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" className={modalStyles.formInput} placeholder="nombre_archivo.png" value={formData.filename} onChange={(e) => setFormData({ ...formData, filename: e.target.value })} />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>PNG o JPG • Dimensiones: {formData.dimensions}</p>
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '13px', color: '#1e40af', fontWeight: 500, marginBottom: '4px' }}>Estado</div>
            <div style={{ fontSize: '13px', color: '#3b82f6' }}>✓ Habilitado</div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className={`${modalStyles.btn} ${modalStyles.btnSecondary}`} onClick={() => setShowAddModal(false)}>Cancelar</button>
          <button className={`${modalStyles.btn} ${modalStyles.btnPrimary}`} onClick={handleSave} disabled={!formData.name || !formData.filename || isLoading}>{isLoading ? 'Guardando...' : 'Guardar cambios'}</button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal isOpen={!!imageToDelete} onClose={() => setImageToDelete(null)} onConfirm={handleDelete} title="¿Eliminar imagen?" message={`¿Está seguro de eliminar la imagen "${imageToDelete?.name}"? Esta acción no se puede deshacer.`} type="danger" confirmText="Eliminar" cancelText="Cancelar" isLoading={isLoading} />
    </div>
  );
}
