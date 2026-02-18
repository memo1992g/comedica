'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Pencil, Trash2, Search, Check } from 'lucide-react';
import { maintenanceService, SupportReason } from '@/lib/api/maintenance.service';
import { Modal, ModalBody, ModalFooter } from '@/components/parametros/Modal';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import modalStyles from '@/components/parametros/Modal.module.css';
import styles from './page.module.css';

export default function AtencionSoportePage() {
  const router = useRouter();
  const [reasons, setReasons] = useState<SupportReason[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<SupportReason | null>(null);
  const [reasonToDelete, setReasonToDelete] = useState<SupportReason | null>(null);
  
  const [formData, setFormData] = useState({ code: '', description: '', status: 'Activo' as 'Activo' | 'Inactivo', hasQuestionnaire: false, questions: 0, failures: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadReasons();
  }, [searchQuery, currentPage]);

  const loadReasons = async () => {
    try {
      const response = await maintenanceService.getSupportReasons({ search: searchQuery, page: currentPage, pageSize });
      setReasons(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAdd = () => {
    setFormData({ code: '', description: '', status: 'Activo', hasQuestionnaire: false, questions: 0, failures: 0 });
    setShowAddModal(true);
  };

  const handleEdit = (reason: SupportReason) => {
    setSelectedReason(reason);
    setFormData({ code: reason.code, description: reason.description, status: reason.status, hasQuestionnaire: reason.hasQuestionnaire, questions: reason.questions, failures: reason.failures });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (selectedReason) {
        await maintenanceService.updateSupportReason(selectedReason.id, formData);
      } else {
        await maintenanceService.createSupportReason(formData);
      }
      await loadReasons();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedReason(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reasonToDelete) return;
    setIsLoading(true);
    try {
      await maintenanceService.deleteSupportReason(reasonToDelete.id);
      await loadReasons();
      setReasonToDelete(null);
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
        <span>Atención y Soporte</span>
      </div>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Atención y Soporte</h1>
          <p>Administración de catálogo de motivos de atención y soporte</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/mantenimiento/atencion-soporte/historial')}>Historial</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}><Plus size={18} />Agregar Motivo</button>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input type="text" className={styles.searchInput} placeholder="Buscar por código o descripción..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
      </div>

      <div className={styles.panel}>
        {reasons.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Cuestionario</th>
                  <th>Preguntas</th>
                  <th>Fallos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reasons.map((reason) => (
                  <tr key={reason.id}>
                    <td>{reason.code}</td>
                    <td>{reason.description}</td>
                    <td>{reason.hasQuestionnaire ? <Check size={20} className={styles.checkIcon} /> : '-'}</td>
                    <td>{reason.questions || '-'}</td>
                    <td>{reason.failures || '-'}</td>
                    <td><span className={`${styles.statusBadge} ${reason.status === 'Activo' ? styles.statusActive : styles.statusInactive}`}>{reason.status}</span></td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.iconBtn} onClick={() => handleEdit(reason)}><Pencil size={16} /></button>
                        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setReasonToDelete(reason)}><Trash2 size={16} /></button>
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
            <Search size={48} style={{ opacity: 0.5 }} />
            <h3>No se encontraron motivos</h3>
          </div>
        )}
      </div>

      <Modal isOpen={showAddModal || showEditModal} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} title={selectedReason ? 'Editar Motivo' : 'Nuevo Motivo'} subtitle="Complete la información del motivo de atención.">
        <ModalBody>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formGrid}>
              <div className={modalStyles.formField}>
                <label className={modalStyles.formLabel}>Código <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="text" className={modalStyles.formInput} placeholder="SOP-000" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={!!selectedReason} />
              </div>
              <div className={modalStyles.formField}>
                <label className={modalStyles.formLabel}>Estado</label>
                <select className={modalStyles.formInput} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Activo' | 'Inactivo' })}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Descripción <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="text" className={modalStyles.formInput} placeholder="Descripción del motivo" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>
          <div className={modalStyles.formSection}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.hasQuestionnaire} onChange={(e) => setFormData({ ...formData, hasQuestionnaire: e.target.checked })} style={{ width: '18px', height: '18px' }} />
              <span style={{ fontSize: '14px' }}>Requiere Cuestionario</span>
            </label>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Habilitar validación por preguntas de seguridad</p>
          </div>
          {formData.hasQuestionnaire && (
            <div className={modalStyles.formSection}>
              <div className={modalStyles.formGrid}>
                <div className={modalStyles.formField}>
                  <label className={modalStyles.formLabel}>Cantidad de Preguntas</label>
                  <input type="number" className={modalStyles.formInput} min="0" value={formData.questions} onChange={(e) => setFormData({ ...formData, questions: Number(e.target.value) })} />
                </div>
                <div className={modalStyles.formField}>
                  <label className={modalStyles.formLabel}>Límite de Fallos</label>
                  <input type="number" className={modalStyles.formInput} min="0" value={formData.failures} onChange={(e) => setFormData({ ...formData, failures: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className={`${modalStyles.btn} ${modalStyles.btnSecondary}`} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancelar</button>
          <button className={`${modalStyles.btn} ${modalStyles.btnPrimary}`} onClick={handleSave} disabled={!formData.code || !formData.description || isLoading}>{isLoading ? 'Guardando...' : 'Crear Motivo'}</button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal isOpen={!!reasonToDelete} onClose={() => setReasonToDelete(null)} onConfirm={handleDelete} title="¿Eliminar motivo?" message={`¿Está seguro de eliminar el motivo "${reasonToDelete?.description}"? Esta acción no se puede deshacer.`} type="danger" confirmText="Eliminar" cancelText="Cancelar" isLoading={isLoading} />
    </div>
  );
}
