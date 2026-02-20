'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { getSecurityQuestions, createSecurityQuestion, updateSecurityQuestion, deleteSecurityQuestion, type SecurityQuestion } from '@/lib/api/maintenance.service';
import { Modal, ModalBody, ModalFooter } from '@/components/parametros/Modal';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import modalStyles from '@/components/parametros/Modal.module.css';
import styles from '../atencion-soporte/page.module.css';

export default function CuestionarioSeguridadPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SecurityQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<SecurityQuestion | null>(null);
  
  const [formData, setFormData] = useState({ code: '', question: '', status: 'Activo' as 'Activo' | 'Inactivo' });
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadQuestions();
  }, [searchQuery, currentPage]);

  const loadQuestions = async () => {
    try {
      const response = await getSecurityQuestions({ search: searchQuery, page: currentPage, pageSize });
      setQuestions(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAdd = () => {
    setFormData({ code: '', question: '', status: 'Activo' });
    setShowAddModal(true);
  };

  const handleEdit = (question: SecurityQuestion) => {
    setSelectedQuestion(question);
    setFormData({ code: question.code, question: question.question, status: question.status });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (selectedQuestion) {
        await updateSecurityQuestion(selectedQuestion.id, formData);
      } else {
        await createSecurityQuestion(formData);
      }
      await loadQuestions();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    setIsLoading(true);
    try {
      await deleteSecurityQuestion(questionToDelete.id);
      await loadQuestions();
      setQuestionToDelete(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Cuestionario de Seguridad para Soporte Telefónico</h1>
          <p>Gestión de preguntas de seguridad para atención telefónica</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/mantenimiento/cuestionario-seguridad/historial')}>Historial</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}><Plus size={18} />Agregar Pregunta</button>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input type="text" className={styles.searchInput} placeholder="Buscar pregunta..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
      </div>

      <div className={styles.panel}>
        {questions.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pregunta</th>
                  <th>Estado</th>
                  <th>Creación</th>
                  <th>Modificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td>{question.code}</td>
                    <td>{question.question}</td>
                    <td><span className={`${styles.statusBadge} ${question.status === 'Activo' ? styles.statusActive : styles.statusInactive}`}>{question.status}</span></td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{question.createdBy}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{formatDate(question.createdAt)}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{question.modifiedBy}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{formatDate(question.modifiedAt)}</div>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.iconBtn} onClick={() => handleEdit(question)}><Pencil size={16} /></button>
                        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setQuestionToDelete(question)}><Trash2 size={16} /></button>
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
            <h3>No se encontraron preguntas</h3>
          </div>
        )}
      </div>

      <Modal isOpen={showAddModal || showEditModal} onClose={() => { setShowAddModal(false); setShowEditModal(false); }} title={selectedQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'} subtitle="Complete la información de la pregunta de seguridad.">
        <ModalBody>
          <div className={modalStyles.formSection}>
            <div className={modalStyles.formGrid}>
              <div className={modalStyles.formField}>
                <label className={modalStyles.formLabel}>Código <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="text" className={modalStyles.formInput} placeholder="0001" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={!!selectedQuestion} />
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
              <label className={modalStyles.formLabel}>Pregunta <span style={{ color: '#dc2626' }}>*</span></label>
              <textarea className={modalStyles.formInput} placeholder="¿Cuál es tu pregunta de seguridad?" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className={`${modalStyles.btn} ${modalStyles.btnSecondary}`} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancelar</button>
          <button className={`${modalStyles.btn} ${modalStyles.btnPrimary}`} onClick={handleSave} disabled={!formData.code || !formData.question || isLoading}>{isLoading ? 'Guardando...' : selectedQuestion ? 'Actualizar' : 'Crear Pregunta'}</button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal isOpen={!!questionToDelete} onClose={() => setQuestionToDelete(null)} onConfirm={handleDelete} title="¿Eliminar pregunta de seguridad?" message={`¿Está seguro de eliminar esta pregunta de seguridad? Esta acción no se puede deshacer.`} type="danger" confirmText="Sí, eliminar" cancelText="Cancelar" isLoading={isLoading} />
    </div>
  );
}
