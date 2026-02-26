'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createFinancialCorrespondent, getFinancialCorrespondents, type FinancialCorrespondent } from '@/lib/api/maintenance.service';
import { Modal, ModalBody, ModalFooter } from '@/components/parametros/Modal';
import modalStyles from '@/components/parametros/Modal.module.css';
import styles from './page.module.css';

function formatDate(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-SV');
}

export default function CorresponsalesFinancierosMantenimientoPage() {
  const router = useRouter();
  const [rows, setRows] = useState<FinancialCorrespondent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    internalCode: '',
    codeSsf: '',
    type: 'J',
    name: '',
    comercialName: '',
    assignmentDate: '',
    status: 'A',
    terminationDate: '',
    terminationFlow: '',
    nit: '',
  });

  const load = async () => {
    try {
      const response = await getFinancialCorrespondents({
        fromDate: '2024-01-01',
        toDate: '2030-12-31',
        page: 1,
        pageSize: 10,
      });
      setRows(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cargar corresponsales.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = () => {
    setFormData({
      internalCode: '',
      codeSsf: '',
      type: 'J',
      name: '',
      comercialName: '',
      assignmentDate: '',
      status: 'A',
      terminationDate: '',
      terminationFlow: '',
      nit: '',
    });
    setShowModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createFinancialCorrespondent({
        ...formData,
        address: 'San Salvador',
        municipality: 'San Salvador',
        department: 'San Salvador',
        coordinates: '13.70,-89.20',
        schedule: 'LUN-SAB 8:00a.m. - 7:00 p.m.',
        districtCodePx: 610,
        districtCodeOr: 101,
        creationUser: 'admin',
        creationDate: formData.assignmentDate || new Date().toISOString().split('T')[0],
        modifyUser: 'admin',
        modifyDate: new Date().toISOString().split('T')[0],
      });
      await load();
      setShowModal(false);
      setError(null);
      setSuccessMessage('Corresponsal creado correctamente.');
    } catch (err) {
      setSuccessMessage(null);
      setError(err instanceof Error ? err.message : 'No fue posible crear corresponsal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Corresponsales Financieros</h1>
          <p>Gestión de información y datos de corresponsales financieros</p>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={openModal}><Plus size={16} /> Agregar Corresponsal</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => router.push('/dashboard/reportes/corresponsales-financieros')}>Historial</button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Código Interno</th><th>Código SSF</th><th>Tipo</th><th>Nombre</th>
              <th>Nombre Comercial</th><th>Fecha Asignación</th><th>Estatus</th><th>Fecha Terminación</th>
              <th>Causa Terminación</th><th>NIT</th><th>Dirección</th><th>Municipio</th><th>Departamento</th><th>Coordenadas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{String(row.id).padStart(4, '0')}</td>
                <td>{row.internalCode}</td>
                <td>{row.codeSsf}</td>
                <td>{row.type === 'J' ? 'Jurídico' : 'Natural'}</td>
                <td>{row.name}</td>
                <td>{row.comercialName}</td>
                <td>{formatDate(row.assignmentDate)}</td>
                <td className={row.status === 'A' ? styles.active : styles.inactive}>{row.status === 'A' ? 'Activo' : 'Inactivo'}</td>
                <td>{formatDate(row.terminationDate)}</td>
                <td>{row.terminationFlow || '-'}</td>
                <td>{row.nit}</td>
                <td>{row.address}</td>
                <td>{row.municipality}</td>
                <td>{row.department}</td>
                <td>{row.coordinates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Corresponsal" subtitle="Complete la información del corresponsal financiero.">
        <ModalBody>
          <div className={styles.formGrid}>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Código Interno <span>*</span></label><input className={modalStyles.formInput} value={formData.internalCode} onChange={(e)=>setFormData({...formData, internalCode:e.target.value})}/></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Código SSF <span>*</span></label><input className={modalStyles.formInput} value={formData.codeSsf} onChange={(e)=>setFormData({...formData, codeSsf:e.target.value})}/></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Tipo <span>*</span></label><select className={modalStyles.formInput} value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})}><option value="J">Jurídico</option><option value="N">Natural</option></select></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Nombre <span>*</span></label><input className={modalStyles.formInput} value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})}/></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Nombre Comercial <span>*</span></label><input className={modalStyles.formInput} value={formData.comercialName} onChange={(e)=>setFormData({...formData, comercialName:e.target.value})}/></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Fecha Asignación <span>*</span></label><input type="date" className={modalStyles.formInput} value={formData.assignmentDate} onChange={(e)=>setFormData({...formData, assignmentDate:e.target.value})}/></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Estatus <span>*</span></label><select className={modalStyles.formInput} value={formData.status} onChange={(e)=>setFormData({...formData, status:e.target.value})}><option value="A">Activo</option><option value="I">Inactivo</option></select></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Fecha Terminación</label><input type="date" className={modalStyles.formInput} value={formData.terminationDate} onChange={(e)=>setFormData({...formData, terminationDate:e.target.value})}/></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>Causa Terminación</label><textarea className={modalStyles.formInput} rows={3} value={formData.terminationFlow} onChange={(e)=>setFormData({...formData, terminationFlow:e.target.value})}/></div>
            <div className={modalStyles.formField}><label className={modalStyles.formLabel}>NIT <span>*</span></label><input className={modalStyles.formInput} value={formData.nit} onChange={(e)=>setFormData({...formData, nit:e.target.value})}/></div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className={`${modalStyles.btn} ${modalStyles.btnSecondary}`} onClick={() => setShowModal(false)}>Cancelar</button>
          <button className={`${modalStyles.btn} ${modalStyles.btnPrimary}`} onClick={handleCreate} disabled={isLoading || !formData.internalCode || !formData.codeSsf || !formData.name || !formData.comercialName || !formData.assignmentDate || !formData.nit}>{isLoading ? 'Guardando...' : 'Crear Corresponsal'}</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
