'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import SearchPanel from './components/search-panel/search-panel';
import UserSupportDetail from './components/user-support-detail/user-support-detail';
import SecurityVerificationModal from './components/security-verification-modal/security-verification-modal';
import ConfirmationModal from './components/confirmation-modal/confirmation-modal';
import {
  mockPreviousManagements,
  type SupportUser, type AttentionType,
} from './data/mock-data';
import styles from './styles/users-support.module.css';
import { consultUser, blockUser, unblockUser, inactivateUser } from '@/lib/api/user-management.service';
import { toSupportUser } from '@/lib/api/types/user-management.types';
import { getSupportReasons } from '@/lib/api/maintenance.service';
import type { SupportReason } from '@/lib/api/types/maintenance.types';

type SubTab = 'tipos' | 'gestiones';

const ATTENTION_ACTION_MAP: Record<string, 'block' | 'unblock' | 'inactivate' | null> = {
  Bloqueo: 'block',
  Desbloqueo: 'unblock',
  'Soporte general': 'inactivate',
};

const ICON_BY_CODE: Record<string, AttentionType['icon']> = {
  SOP003: 'UserPlus',
  SOP004: 'Unlock',
  SOP005: 'Lock',
  SOP006: 'Search',
  SOP007: 'RefreshCw',
  SOP008: 'RefreshCw',
  SOP009: 'Key',
  SOP010: 'Smartphone',
  SOP011: 'FileSearch',
  SOP012: 'Shield',
  SOP013: 'Settings',
};

function toAttentionType(item: SupportReason): AttentionType {
  return {
    id: item.id,
    name: item.description,
    questions: item.questions,
    maxFailures: item.failures,
    icon: ICON_BY_CODE[item.code] ?? 'Settings',
  };
}

function isValidSearchQuery(value: string): boolean {
  return /^\d{5}$/.test(value) || /^\d{8}-\d$/.test(value);
}

export default function UsersSupport() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('tipos');
  const [selectedUser, setSelectedUser] = useState<SupportUser | null>(null);
  const [selectedType, setSelectedType] = useState<AttentionType | null>(null);
  const [verificationState, setVerificationState] = useState<'pending' | 'completed'>('pending');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [catalogAttentionTypes, setCatalogAttentionTypes] = useState<AttentionType[]>([]);
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);

  const resetSearchState = () => {
    setSelectedUser(null);
    setQueryError(null);
    setVerificationState('pending');
    setSelectedType(null);
    setCatalogAttentionTypes([]);
    setHasSubmittedSearch(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      resetSearchState();
      return;
    }

    setQueryError(null);
    setSelectedType(null);
    setVerificationState('pending');
    setHasSubmittedSearch(false);
    setCatalogAttentionTypes([]);
  };

  const handleSearchSubmit = async () => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      resetSearchState();
      return;
    }

    if (!isValidSearchQuery(trimmed)) {
      setHasSubmittedSearch(false);
      setCatalogAttentionTypes([]);
      setSelectedUser(null);
      setQueryError('Ingrese un ID de 5 dígitos o un DUI válido (01234567-8).');
      return;
    }

    try {
      setQueryError(null);
      const { data } = await getSupportReasons({ page: 1, pageSize: 100 });
      setCatalogAttentionTypes(data.map(toAttentionType));
      setHasSubmittedSearch(true);
    } catch (error) {
      setHasSubmittedSearch(false);
      setCatalogAttentionTypes([]);
      setSelectedUser(null);
      setQueryError(error instanceof Error ? error.message : 'No fue posible cargar los tipos de atención.');
      return;
    }

    if (!/^\d{5}$/.test(trimmed)) {
      setSelectedUser(null);
      return;
    }

    try {
      const profile = await consultUser(Number(trimmed));
      setSelectedUser(toSupportUser(profile));
    } catch (error) {
      setSelectedUser(null);
      setQueryError(error instanceof Error ? error.message : 'No fue posible consultar el usuario.');
    }
  };

  const handleSelectType = (type: AttentionType) => {
    setSelectedType(type);
    setShowSecurityModal(true);
  };

  const handleVerified = () => {
    setShowSecurityModal(false);
    setVerificationState('completed');
  };

  const handleSave = () => setShowConfirmationModal(true);

  const handleConfirmSave = async () => {
    if (!selectedUser?.username || !selectedType) {
      setShowConfirmationModal(false);
      return;
    }

    const action = ATTENTION_ACTION_MAP[selectedType.name] ?? null;
    if (!action) {
      setShowConfirmationModal(false);
      return;
    }

    try {
      if (action === 'block') {
        await blockUser(selectedUser.username);
      } else if (action === 'unblock') {
        await unblockUser(selectedUser.username);
      } else {
        await inactivateUser(selectedUser.username);
      }

      setShowConfirmationModal(false);
      setVerificationState('pending');
      setSelectedType(null);
      setSearchQuery('');
      setSelectedUser(null);
      setCatalogAttentionTypes([]);
      setHasSubmittedSearch(false);
    } catch (error) {
      setQueryError(error instanceof Error ? error.message : 'No fue posible ejecutar la gestión');
      setShowConfirmationModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>Soporte a usuarios</h2>
            <p className={styles.subtitle}>
              Administración de activaciones, bloqueos y desbloqueos de usuarios
            </p>
            {queryError && <p className={styles.subtitle}>{queryError}</p>}
          </div>
          <Button
            variant="outline"
            size="sm"
            className={styles.historyButton}
            onClick={() => router.push('/dashboard/usuarios/soporte-usuarios/historial')}
          >
            Historial
          </Button>
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.leftPanel}>
            <SearchPanel
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearchSubmit={() => { void handleSearchSubmit(); }}
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
              attentionTypes={catalogAttentionTypes}
              selectedTypeId={selectedType?.id ?? null}
              onSelectType={handleSelectType}
              previousManagements={mockPreviousManagements}
              verificationState={verificationState}
              hasUser={hasSubmittedSearch}
            />
          </div>

          <div className={styles.rightPanel}>
            <UserSupportDetail
              user={selectedUser}
              verificationState={verificationState}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>

      {showSecurityModal && selectedType && (
        <SecurityVerificationModal
          attentionType={selectedType}
          onClose={() => setShowSecurityModal(false)}
          onVerified={handleVerified}
        />
      )}

      {showConfirmationModal && selectedUser && (
        <ConfirmationModal
          userName={selectedUser.name}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={() => { void handleConfirmSave(); }}
        />
      )}

    </div>
  );
}
