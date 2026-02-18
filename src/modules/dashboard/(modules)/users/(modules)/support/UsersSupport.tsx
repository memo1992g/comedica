'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import SearchPanel from './components/search-panel/search-panel';
import UserSupportDetail from './components/user-support-detail/user-support-detail';
import SecurityVerificationModal from './components/security-verification-modal/security-verification-modal';
import ConfirmationModal from './components/confirmation-modal/confirmation-modal';
import HistoryTable from './components/history-table/history-table';
import {
  mockSupportUsers, attentionTypes, mockPreviousManagements,
  mockSupportHistory,
  type SupportUser, type AttentionType,
} from './data/mock-data';
import styles from './styles/users-support.module.css';
import { userManagementService } from '@/lib/api/user-management.service';

type SubTab = 'tipos' | 'gestiones';
type View = 'main' | 'history-table';

const ATTENTION_ACTION_MAP: Record<string, 'block' | 'unblock' | 'inactivate' | null> = {
  Bloqueo: 'block',
  Desbloqueo: 'unblock',
  'Soporte general': 'inactivate',
};

export default function UsersSupport() {
  const [view, setView] = useState<View>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('tipos');
  const [selectedUser, setSelectedUser] = useState<SupportUser | null>(null);
  const [selectedType, setSelectedType] = useState<AttentionType | null>(null);
  const [verificationState, setVerificationState] = useState<'pending' | 'completed'>('pending');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);

    const trimmed = query.trim();
    if (!trimmed) {
      setSelectedUser(null);
      setQueryError(null);
      setVerificationState('pending');
      setSelectedType(null);
      return;
    }

    const localMatch = mockSupportUsers.find((u) => u.id.includes(trimmed) || u.dui.includes(trimmed));
    if (!/^\d{5,}$/.test(trimmed)) {
      setSelectedUser(localMatch ?? null);
      setQueryError(null);
      return;
    }

    try {
      setQueryError(null);
      const profile = await userManagementService.consultUser(Number(trimmed));
      setSelectedUser(userManagementService.toSupportUser(profile));
    } catch (error) {
      setSelectedUser(localMatch ?? null);
      setQueryError(error instanceof Error ? error.message : 'No fue posible consultar el usuario');
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
        await userManagementService.blockUser(selectedUser.username);
      } else if (action === 'unblock') {
        await userManagementService.unblockUser(selectedUser.username);
      } else {
        await userManagementService.inactivateUser(selectedUser.username);
      }

      setShowConfirmationModal(false);
      setVerificationState('pending');
      setSelectedType(null);
      setSearchQuery('');
      setSelectedUser(null);
    } catch (error) {
      setQueryError(error instanceof Error ? error.message : 'No fue posible ejecutar la gestión');
      setShowConfirmationModal(false);
    }
  };

  if (view === 'history-table') {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <HistoryTable
            data={mockSupportHistory}
            onBack={() => setView('main')}
          />
        </div>
      </div>
    );
  }

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
            onClick={() => setView('history-table')}
          >
            Historial
          </Button>
        </div>

        <div className={styles.mainLayout}>
          <div className={styles.leftPanel}>
            <SearchPanel
              searchQuery={searchQuery}
              onSearchChange={(value) => { void handleSearchChange(value); }}
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
              attentionTypes={attentionTypes}
              selectedTypeId={selectedType?.id ?? null}
              onSelectType={handleSelectType}
              previousManagements={mockPreviousManagements}
              verificationState={verificationState}
              hasUser={!!selectedUser}
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
