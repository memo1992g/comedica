import React from 'react';
import { Search, Calendar } from 'lucide-react';
import styles from './styles/ReportsFilters.module.css';

interface ReportsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilter: () => void;
}

export default function ReportsFilters({ 
  searchQuery, 
  onSearchChange, 
  onFilter 
}: ReportsFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      <button 
        className={styles.filterButton}
        onClick={onFilter}
        aria-label="Filtrar por fecha"
      >
        <Calendar size={16} />
      </button>
    </div>
  );
}
