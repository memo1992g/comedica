'use client';

import { useRouter } from 'next/navigation';
import MainTabs from './components/main-tabs/main-tabs';
import SearchPanel from './components/search-panel/search-panel';
import UserDetailInfo from './components/user-detail-info/user-detail-info';
import UserStatePanel from './components/user-state-panel/user-state-panel';
import SecurityModal from './components/security-modal/security-modal';
import {
  mockUsers,
  mockSearchHistory,
} from './data/mock-data';
import { useUsersConsultations } from './hooks/use-users-consultations';
import styles from './styles/users-consultations.module.css';

export default function UsersConsultations() {
  const router = useRouter();

  const {
    activeTab,
    activeSubTab,
    searchQuery,
    selectedUser,
    showSecurityModal,
    tabRefs,
    indicatorStyle,
    isSearching,
    searchError,
    setActiveSubTab,
    setSearchQuery,
    setSelectedUser,
    setShowSecurityModal,
    handleHistorySelect,
    handleSaveState,
    handleVerify,
    handleTabChange,
  } = useUsersConsultations();

  const usersForList = selectedUser
    ? [selectedUser, ...mockUsers.filter((user) => user.id !== selectedUser.id)]
    : mockUsers;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Consulta de Usuarios</h2>
          <p className={styles.subtitle}>
            Ingrese los parámetros de búsqueda para visualizar la información del usuario
          </p>
          {isSearching && <p className={styles.subtitle}>Consultando usuario en servicio real...</p>}
          {searchError && <p className={styles.subtitle}>{searchError}</p>}
        </div>

        <MainTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabRefs={tabRefs}
          indicatorStyle={indicatorStyle}
          showHistoryButton={activeTab === 'estados'}
          onHistoryClick={() => router.push('/dashboard/usuarios/consulta-usuarios/historial')}
        />

        <div className={styles.mainLayout}>
          <div className={styles.leftPanel}>
            <SearchPanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeSubTab={activeSubTab}
              onSubTabChange={setActiveSubTab}
              users={usersForList}
              selectedUserId={selectedUser?.id ?? null}
              onSelectUser={setSelectedUser}
              searchHistory={mockSearchHistory}
              onHistorySelect={handleHistorySelect}
            />
          </div>

          <div className={styles.rightPanel}>
            {activeTab === 'usuarios' ? (
              <UserDetailInfo user={selectedUser} />
            ) : (
              <UserStatePanel user={selectedUser} onSave={handleSaveState} />
            )}
          </div>
        </div>
      </div>

      {showSecurityModal && (
        <SecurityModal
          onClose={() => setShowSecurityModal(false)}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
}
