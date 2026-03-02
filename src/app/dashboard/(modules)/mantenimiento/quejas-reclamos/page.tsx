'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Plus, Search, X } from 'lucide-react';
import styles from './page.module.css';

type TabType = 'corresponsales' | 'canales';

interface ComplaintRow {
  id: string;
  canal: string;
  tipo: string;
  dui: string;
  nombre: string;
  fechaPresenta: string;
  descripcion: string;
  monto: string;
  reclamo: string;
  resolucion: string;
  fechaResolucion: string;
}

const EMPTY_ROWS: ComplaintRow[] = [];

export default function QuejasReclamosPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('corresponsales');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return EMPTY_ROWS;
    return EMPTY_ROWS.filter((item) =>
      [item.id, item.canal, item.tipo, item.dui, item.nombre, item.descripcion]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>Mantenimiento de &gt; <span>Quejas y Reclamos</span></div>

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div>
            <h1>Quejas y Reclamos Corresponsales</h1>
            <p>Gestión de quejas y reclamos de corresponsales financieros</p>
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={`${styles.btn} ${styles.btnIcon}`}>
              <Download size={16} />
            </button>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowModal(true)}>
              <Plus size={16} /> Ingresar queja
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => router.push('/dashboard/mantenimiento/quejas-reclamos/historial')}
            >
              Historial
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'corresponsales' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('corresponsales')}
          >
            Ingreso de reclamos - Corresponsales
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'canales' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('canales')}
          >
            Reporte de quejas - Canales
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Canal</th>
                <th>Tipo</th>
                <th>DUI</th>
                <th>Nombre</th>
                <th>F. Presenta</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Reclamo</th>
                <th>Resolución</th>
                <th>F. Resolución</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length > 0 ? (
                filteredRows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.canal}</td>
                    <td>{item.tipo}</td>
                    <td>{item.dui}</td>
                    <td>{item.nombre}</td>
                    <td>{item.fechaPresenta}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.monto}</td>
                    <td>{item.reclamo}</td>
                    <td>{item.resolucion}</td>
                    <td>{item.fechaResolucion}</td>
                    <td>-</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className={styles.emptyCell}>
                    <Search size={24} color="#c5c8d4" />
                    <p>Realice una búsqueda</p>
                    <small>Ingrese un término para ver los resultados</small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar reclamo..."
            className={styles.searchInput}
          />
          <button type="button" className={styles.filterBtn}>⌄</button>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} type="button" onClick={() => setShowModal(false)}>
              <X size={16} />
            </button>
            <h2>Nueva Queja</h2>
            <p className={styles.modalSub}>Complete la información de la queja.</p>

            <div className={styles.formGrid}>
              <label>Canal *</label><input placeholder="Seleccione un canal" disabled />
              <label>Tipo *</label><input placeholder="Seleccione tipo" disabled />
              <label>Fecha presenta *</label><input placeholder="dd/mm/aaaa" disabled />
              <label>Fecha resolución</label><input placeholder="dd/mm/aaaa" disabled />
              <label>Monto *</label><input placeholder="$0.00" disabled />
              <label>Estado reclamo *</label><input value="En Trámite" disabled />
              <label>Estado Resolución</label><input value="Sin resolución" disabled />
              <label>Descripción *</label><textarea placeholder="Describe la queja o reclamo" disabled />
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>Crear Queja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
