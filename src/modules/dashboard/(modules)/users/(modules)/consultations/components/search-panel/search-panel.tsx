import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UserResult, SearchHistoryEntry } from '../../interfaces/UsersConsultations';
import styles from './styles/search-panel.module.css';

interface SearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSubTab: 'general' | 'history';
  onSubTabChange: (tab: 'general' | 'history') => void;
  users: UserResult[];
  selectedUserId: string | null;
  onSelectUser: (user: UserResult) => void;
  searchHistory: SearchHistoryEntry[];
  onHistorySelect: (query: string) => void;
}

export default function SearchPanel({
  searchQuery, onSearchChange, activeSubTab, onSubTabChange,
  users, selectedUserId, onSelectUser, searchHistory, onHistorySelect,
}: SearchPanelProps) {
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.dui.includes(searchQuery) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.includes(searchQuery)
  );

  return (
    <div className={styles.searchPanel}>
      <div className={styles.searchHeader}>
        <Input
          placeholder="Buscar por nombre, DUI o usuario..."
          leftIcon={<Search size={14} />}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.subTabsWrapper}>
        <Tabs value={activeSubTab} onValueChange={(v) => onSubTabChange(v as 'general' | 'history')}>
          <TabsList className={styles.subTabs}>
            <TabsTrigger value="general" className={styles.subTab}>
              Búsqueda general
            </TabsTrigger>
            <TabsTrigger value="history" className={styles.subTab}>
              Historial de búsqueda
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={styles.resultsHeader}>
        Resultados de búsqueda
      </div>

      <div className={styles.userList}>
        {activeSubTab === 'general' ? (
          filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`${styles.userItem} ${selectedUserId === user.id ? styles.userItemActive : ''}`}
                onClick={() => onSelectUser(user)}
              >
                <div
                  className={styles.avatar}
                  style={{ borderColor: user.avatarColor, color: user.avatarColor }}
                >
                  {user.initials}
                </div>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user.name}</p>
                  <p className={styles.userMeta}>
                    ID: {user.id} · DUI: {user.dui}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyResults}>
              <p className={styles.emptyResultsText}>No se encontraron resultados</p>
            </div>
          )
        ) : (
          searchHistory.map((entry) => (
            <div
              key={entry.id}
              className={styles.historyItem}
              onClick={() => onHistorySelect(entry.query)}
            >
              <span className={styles.historyQuery}>{entry.query}</span>
              <span className={styles.historyTime}>{entry.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
