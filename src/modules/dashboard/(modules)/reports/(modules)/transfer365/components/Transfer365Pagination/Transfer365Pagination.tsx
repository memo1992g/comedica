'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CustomDatePicker } from '@/components/common/CustomDatePicker/CustomDatePicker';
import styles from './Transfer365Pagination.module.css';

interface Transfer365PaginationProps {
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

export default function Transfer365Pagination({
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
}: Transfer365PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const [filterValue, setFilterValue] = useState('all');

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.leftSection}>
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <CustomDatePicker
          iconOnly
          className={styles.dateButton}
          onChange={(date) => onDateFilter?.(date)}
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
                { value: 'saliente', label: 'Transacciones Salientes' },
                { value: 'entrante', label: 'Transacciones Entrantes' },
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
          <span className={styles.label}>Página</span>
          <select
            className={styles.select}
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.pageInfo}>
          {startItem}-{endItem} de {totalItems}
        </div>

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
