'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Globe, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { getLocalInstitutions, getCARDInstitutions, createLocalInstitution, updateLocalInstitution, deleteLocalInstitution, createCARDInstitution, updateCARDInstitution, deleteCARDInstitution } from '@/lib/api/parameters.service';
import { LocalInstitutionModal } from '@/components/parametros/LocalInstitutionModal';
import { CARDInstitutionModal } from '@/components/parametros/CARDInstitutionModal';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import styles from './page.module.css';

type TabType = 'local' | 'card';

export default function RedTransfer365Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('local');
  
  // Estado instituciones locales
  const [localInstitutions, setLocalInstitutions] = useState<any[]>([]);
  const [totalLocal, setTotalLocal] = useState(0);
  const [searchLocal, setSearchLocal] = useState('');
  const [pageLocal, setPageLocal] = useState(1);
  
  // Estado instituciones CA-RD
  const [cardInstitutions, setCardInstitutions] = useState<any[]>([]);
  const [totalCard, setTotalCard] = useState(0);
  const [searchCard, setSearchCard] = useState('');
  const [pageCard, setPageCard] = useState(1);
  
  // Modales
  const [isAddingLocal, setIsAddingLocal] = useState(false);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<any | null>(null);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  
  const [institutionToDelete, setInstitutionToDelete] = useState<{ type: 'local' | 'card'; data: any } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 10;

  const loadLocalInstitutions = useCallback(async () => {
    try {
      const response = await getLocalInstitutions({
        search: searchLocal,
        page: pageLocal,
        pageSize,
      });
      setLocalInstitutions(response.data);
      setTotalLocal(response.total);
    } catch (error) {
      console.error('Error al cargar instituciones locales:', error);
    }
  }, [searchLocal, pageLocal]);

  const loadCardInstitutions = useCallback(async () => {
    try {
      const response = await getCARDInstitutions({
        search: searchCard,
        page: pageCard,
        pageSize,
      });
      setCardInstitutions(response.data);
      setTotalCard(response.total);
    } catch (error) {
      console.error('Error al cargar instituciones CA-RD:', error);
    }
  }, [searchCard, pageCard]);

  const refreshInstitutions = useCallback(async (type: TabType) => {
    // doble consulta para cubrir consistencia eventual del backend
    if (type === 'local') {
      await loadLocalInstitutions();
      await new Promise((resolve) => setTimeout(resolve, 250));
      await loadLocalInstitutions();
      return;
    }

    await loadCardInstitutions();
    await new Promise((resolve) => setTimeout(resolve, 250));
    await loadCardInstitutions();
  }, [loadLocalInstitutions, loadCardInstitutions]);

  useEffect(() => {
    if (activeTab === 'local') {
      loadLocalInstitutions();
    }
  }, [activeTab, loadLocalInstitutions]);

  useEffect(() => {
    if (activeTab === 'card') {
      loadCardInstitutions();
    }
  }, [activeTab, loadCardInstitutions]);

  const handleSaveLocal = async (institution: any) => {
    if (selectedLocal) {
      await updateLocalInstitution(selectedLocal.id, institution);
    } else {
      await createLocalInstitution(institution);
    }
    await refreshInstitutions('local');
    setIsAddingLocal(false);
    setIsEditingLocal(false);
    setSelectedLocal(null);
  };

  const handleSaveCard = async (institution: any) => {
    if (selectedCard) {
      await updateCARDInstitution(selectedCard.id, institution);
    } else {
      await createCARDInstitution(institution);
    }
    await refreshInstitutions('card');
    setIsAddingCard(false);
    setIsEditingCard(false);
    setSelectedCard(null);
  };

  const handleDelete = async () => {
    if (!institutionToDelete) return;
    
    setIsDeleting(true);
    try {
      if (institutionToDelete.type === 'local') {
        await deleteLocalInstitution(institutionToDelete.data.id);
        await refreshInstitutions('local');
      } else {
        await deleteCARDInstitution(institutionToDelete.data.id);
        await refreshInstitutions('card');
      }
      setInstitutionToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPagesLocal = Math.ceil(totalLocal / pageSize);
  const totalPagesCard = Math.ceil(totalCard / pageSize);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Red Transfer365</h1>
          <p>Administración de instituciones bancarias participantes</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => router.push('/dashboard/parametros/transfer365/historial')}
          >
            Historial
          </button>
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              if (activeTab === 'local') {
                setIsAddingLocal(true);
              } else {
                setIsAddingCard(true);
              }
            }}
          >
            <Plus size={18} />
            Agregar Institución
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'local' ? styles.active : ''}`}
          onClick={() => setActiveTab('local')}
        >
          <Building2 size={20} />
          Red Transfer365
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'card' ? styles.active : ''}`}
          onClick={() => setActiveTab('card')}
        >
          <Globe size={20} />
          Red Transfer365 CA-RD
        </button>
      </div>

      {/* Content */}
      <div className={styles.mainContent} style={{ width: '100%' }}>
        {activeTab === 'local' ? (
          <>
            {/* Búsqueda */}
            <div className={styles.searchBar}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar por nombre o BIC"
                value={searchLocal}
                onChange={(e) => {
                  setSearchLocal(e.target.value);
                  setPageLocal(1);
                }}
              />
            </div>

            {/* Tabla Local */}
            <div className={styles.panel}>
              {localInstitutions.length > 0 ? (
                <>
                  <table className={styles.userTable}>
                    <thead>
                      <tr>
                        <th>BIC</th>
                        <th>Nombre Corto</th>
                        <th>Estado</th>
                        <th>Institución</th>
                        <th>Productos</th>
                        <th>Accione</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localInstitutions.map((inst) => (
                        <tr key={inst.id}>
                          <td>
                            <div className={styles.userName}>{inst.bic}</div>
                          </td>
                          <td>{inst.shortName}</td>
                          <td>
                            <span
                              className={`${styles.limitBadge} ${
                                inst.status === 'Activo'
                                  ? styles.personalizado
                                  : styles.general
                              }`}
                              style={{
                                background: inst.status === 'Activo' ? '#d1fae5' : '#f3f4f6',
                                color: inst.status === 'Activo' ? '#065f46' : '#374151',
                              }}
                            >
                              {inst.status}
                            </span>
                          </td>
                          <td>
                            <div className={styles.userName}>{inst.fullName}</div>
                            <div className={styles.userCode}>{inst.institution}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {inst.products?.map((prod: string) => (
                                <span
                                  key={prod}
                                  style={{
                                    padding: '2px 8px',
                                    background: '#f3f4f6',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                  }}
                                >
                                  {prod}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.iconBtn}
                                onClick={() => {
                                  setSelectedLocal(inst);
                                  setIsEditingLocal(true);
                                }}
                                title="Editar"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className={`${styles.iconBtn} ${styles.danger}`}
                                onClick={() => setInstitutionToDelete({ type: 'local', data: inst })}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginación */}
                  <div className={styles.pagination}>
                    <div className={styles.pageInfo}>
                      Página {pageLocal} de {totalPagesLocal} · 1-{Math.min(pageLocal * pageSize, totalLocal)} de {totalLocal}
                    </div>
                    <div className={styles.pageControls}>
                      <button
                        className={styles.pageBtn}
                        onClick={() => setPageLocal((p) => Math.max(1, p - 1))}
                        disabled={pageLocal === 1}
                      >
                        ‹
                      </button>
                      <button className={`${styles.pageBtn} ${styles.active}`}>
                        {pageLocal}
                      </button>
                      <button
                        className={styles.pageBtn}
                        onClick={() => setPageLocal((p) => Math.min(totalPagesLocal, p + 1))}
                        disabled={pageLocal === totalPagesLocal}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                  <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>No se encontraron instituciones</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Búsqueda CA-RD */}
            <div className={styles.searchBar}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar por nombre o BIC"
                value={searchCard}
                onChange={(e) => {
                  setSearchCard(e.target.value);
                  setPageCard(1);
                }}
              />
            </div>

            {/* Tabla CA-RD */}
            <div className={styles.panel}>
              {cardInstitutions.length > 0 ? (
                <>
                  <table className={styles.userTable}>
                    <thead>
                      <tr>
                        <th>BIC</th>
                        <th>Institución</th>
                        <th>Estado</th>
                        <th>País</th>
                        <th>Accione</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardInstitutions.map((inst) => (
                        <tr key={inst.id}>
                          <td>
                            <div className={styles.userName}>{inst.bic}</div>
                          </td>
                          <td>{inst.fullName}</td>
                          <td>
                            <span
                              className={`${styles.limitBadge} ${
                                inst.status === 'Activo'
                                  ? styles.personalizado
                                  : styles.general
                              }`}
                              style={{
                                background: inst.status === 'Activo' ? '#d1fae5' : '#f3f4f6',
                                color: inst.status === 'Activo' ? '#065f46' : '#374151',
                              }}
                            >
                              {inst.status}
                            </span>
                          </td>
                          <td>{inst.country}</td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.iconBtn}
                                onClick={() => {
                                  setSelectedCard(inst);
                                  setIsEditingCard(true);
                                }}
                                title="Editar"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className={`${styles.iconBtn} ${styles.danger}`}
                                onClick={() => setInstitutionToDelete({ type: 'card', data: inst })}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginación */}
                  <div className={styles.pagination}>
                    <div className={styles.pageInfo}>
                      Página {pageCard} · 1-{Math.min(pageCard * pageSize, totalCard)} de {totalCard}
                    </div>
                    <div className={styles.pageControls}>
                      <button
                        className={styles.pageBtn}
                        onClick={() => setPageCard((p) => Math.max(1, p - 1))}
                        disabled={pageCard === 1}
                      >
                        ‹
                      </button>
                      <button className={`${styles.pageBtn} ${styles.active}`}>
                        {pageCard}
                      </button>
                      <button
                        className={styles.pageBtn}
                        onClick={() => setPageCard((p) => Math.min(totalPagesCard, p + 1))}
                        disabled={pageCard === totalPagesCard}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                  <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>No se encontraron instituciones</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      <LocalInstitutionModal
        isOpen={isAddingLocal}
        onClose={() => setIsAddingLocal(false)}
        onSave={handleSaveLocal}
        mode="create"
      />

      <LocalInstitutionModal
        isOpen={isEditingLocal}
        onClose={() => {
          setIsEditingLocal(false);
          setSelectedLocal(null);
        }}
        onSave={handleSaveLocal}
        institution={selectedLocal}
        mode="edit"
      />

      <CARDInstitutionModal
        isOpen={isAddingCard}
        onClose={() => setIsAddingCard(false)}
        onSave={handleSaveCard}
        mode="create"
      />

      <CARDInstitutionModal
        isOpen={isEditingCard}
        onClose={() => {
          setIsEditingCard(false);
          setSelectedCard(null);
        }}
        onSave={handleSaveCard}
        institution={selectedCard}
        mode="edit"
      />

      <ConfirmationModal
        isOpen={!!institutionToDelete}
        onClose={() => setInstitutionToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar institución?"
        message={`Esta acción eliminará permanentemente la institución "${institutionToDelete?.data?.fullName || institutionToDelete?.data?.institution}". No se puede deshacer.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
}
