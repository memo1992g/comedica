import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttentionTypeList from '../attention-type-list/attention-type-list';
import PreviousManagementList from '../previous-management-list/previous-management-list';
import type { AttentionType, PreviousManagement } from '../../data/mock-data';
import styles from './styles/search-panel.module.css';

type SubTab = 'tipos' | 'gestiones';

interface SearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  activeSubTab: SubTab;
  onSubTabChange: (tab: SubTab) => void;
  attentionTypes: AttentionType[];
  selectedTypeId: string | null;
  onSelectType: (type: AttentionType) => void;
  previousManagements: PreviousManagement[];
  verificationState: 'pending' | 'completed';
  hasUser: boolean;
}

export default function SearchPanel({
  searchQuery, onSearchChange, onSearchSubmit, activeSubTab, onSubTabChange,
  attentionTypes, selectedTypeId, onSelectType,
  previousManagements, verificationState, hasUser,
}: SearchPanelProps) {
  const renderContent = () => {
    if (verificationState === 'completed') {
      return (
        <div className={styles.verificationCompleted}>
          <CheckCircle2 size={48} className={styles.verificationIcon} />
          <p className={styles.verificationText}>Verificación completada</p>
          <p className={styles.verificationHint}>
            Si desea hacer otra gestión, ingrese de nuevo su número de asociado o DUI.
          </p>
        </div>
      );
    }

    if (!hasUser) {
      return (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            Ingrese un ID o DUI válido y presione Enter para buscar
          </p>
          <p className={styles.emptyHint}>
            ID: 5 o 6 dígitos | DUI: formato 01234567-8
          </p>
        </div>
      );
    }

    if (activeSubTab === 'tipos') {
      return (
        <AttentionTypeList
          types={attentionTypes}
          selectedTypeId={selectedTypeId}
          onSelectType={onSelectType}
        />
      );
    }

    return <PreviousManagementList managements={previousManagements} />;
  };

  return (
    <div className={styles.searchPanel}>
      <div className={styles.searchHeader}>
        <div className={styles.searchInputWrapper}>
          <Search size={16} className={styles.searchIconLeft} />
          <input
            type="text"
            placeholder="Buscar por número de asociado o DUI"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit();
              }
            }}
          />
        </div>
      </div>

      <div className={styles.subTabsWrapper}>
        <Tabs value={activeSubTab} onValueChange={(v) => onSubTabChange(v as SubTab)}>
          <TabsList className={styles.subTabs}>
            <TabsTrigger value="tipos" className={styles.subTab}>
              Tipos de atención
            </TabsTrigger>
            <TabsTrigger value="gestiones" className={styles.subTab}>
              Gestiones previas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </div>
  );
}
