import React from 'react';
import {
  UserPlus, Lock, Unlock, Search, RefreshCw, Key,
  Smartphone, FileSearch, Shield, Settings, SlidersHorizontal,
} from 'lucide-react';
import type { AttentionType } from '../../data/mock-data';
import styles from './styles/attention-types.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  UserPlus: <UserPlus size={18} />,
  Lock: <Lock size={18} />,
  Unlock: <Unlock size={18} />,
  Search: <Search size={18} />,
  RefreshCw: <RefreshCw size={18} />,
  Key: <Key size={18} />,
  Smartphone: <Smartphone size={18} />,
  FileSearch: <FileSearch size={18} />,
  Shield: <Shield size={18} />,
  Settings: <Settings size={18} />,
  SlidersHorizontal: <SlidersHorizontal size={18} />,
};

interface AttentionTypeListProps {
  types: AttentionType[];
  selectedTypeId: string | null;
  onSelectType: (type: AttentionType) => void;
}

export default function AttentionTypeList({ types, selectedTypeId, onSelectType }: AttentionTypeListProps) {
  return (
    <div>
      <p className={styles.listHeader}>Seleccione el motivo de consulta</p>
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          className={`${styles.typeItem} ${selectedTypeId === type.id ? styles.typeItemActive : ''}`}
          onClick={() => onSelectType(type)}
        >
          <div className={styles.typeIcon}>
            {ICON_MAP[type.icon] ?? <Settings size={18} />}
          </div>
          <div className={styles.typeInfo}>
            <p className={styles.typeName}>{type.name}</p>
            <p className={styles.typeMeta}>
              {type.questions} preguntas • Máx. {type.maxFailures} fallos
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
