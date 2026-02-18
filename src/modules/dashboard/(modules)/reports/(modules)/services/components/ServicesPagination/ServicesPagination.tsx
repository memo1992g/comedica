'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CustomDatePicker } from '@/components/common/CustomDatePicker/CustomDatePicker';
import styles from './ServicesPagination.module.css';

interface ServicesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (query: string) => void;
  onDateFilter: (date: Date | null) => void;
  onFilterChange?: (value: string) => void;
  searchQuery: string;
}

export default function ServicesPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onDateFilter,
  onFilterChange,
  searchQuery,
}: ServicesPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const [filterValue, setFilterValue] = useState('all');

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.leftSection}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        
        <CustomDatePicker
          iconOnly
          className={styles.calendarButton}
          onChange={(date) => onDateFilter(date)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <button className={styles.filterButton} type="button">
              <Filter size={16} className={styles.filterIcon} />
            </button>
          </PopoverTrigger>
          <PopoverContent className={styles.filterPopover} align="start">
            <div className={styles.filterList}>
              {[
                { value: 'all', label: 'Todos los registros' },
                { value: 'servicios', label: 'Servicios' },
                { value: 'eventos', label: 'Eventos' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  data-active={filterValue === option.value}
                  className={styles.filterOption}
                  onClick={() => {
                    setFilterValue(option.value);
                    onFilterChange?.(option.value);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.pageSelector}>
          <span className={styles.pageLabel}>Página</span>
          <div className={styles.pageDropdown}>
            <span>{currentPage}</span>
            <ChevronDown size={16} />
          </div>
        </div>

        <span className={styles.itemsInfo}>
          {startItem}-{endItem} de {totalItems}
        </span>

        <div className={styles.navigationButtons}>
          <button
            className={styles.navButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className={styles.navButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
