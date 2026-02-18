'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CustomDatePicker } from '@/components/common/CustomDatePicker/CustomDatePicker';
import styles from './FinancialCorrespondentsPagination.module.css';

interface FinancialCorrespondentsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageSizeChange?: (size: number) => void;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
  onDateFilter?: (date: Date | null) => void;
  onFilterChange?: (value: string) => void;
  searchQuery?: string;
}

export default function FinancialCorrespondentsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageSizeChange,
  onPageChange,
  onSearch,
  onDateFilter,
  onFilterChange,
  searchQuery = '',
}: FinancialCorrespondentsPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const [filterValue, setFilterValue] = useState('all');

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.leftSection}>
        <div className={styles.searchContainer}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        
        <CustomDatePicker
          iconOnly
          className={styles.calendarButton}
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
                { value: 'tc', label: 'TC' },
                { value: 'prestamos', label: 'Préstamos' },
                { value: 'abonos', label: 'Abonos' },
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
        <div className={styles.pageInfo}>
          <span className={styles.pageLabel}>Página</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
          >
            <SelectTrigger className={styles.pageSizeTrigger}>
              <SelectValue className={styles.pageSizeValue} />
            </SelectTrigger>
            <SelectContent className={styles.pageSizeContent}>
              <SelectItem className={styles.pageSizeItem} value="5">
                5
              </SelectItem>
              <SelectItem className={styles.pageSizeItem} value="10">
                10
              </SelectItem>
              <SelectItem className={styles.pageSizeItem} value="25">
                25
              </SelectItem>
              <SelectItem className={styles.pageSizeItem} value="50">
                50
              </SelectItem>
              <SelectItem className={styles.pageSizeItem} value="100">
                100
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.itemsInfo}>
          {totalItems === 0 ? 0 : startItem}-{endItem} de {totalItems}
        </div>

        <div className={styles.navButtons}>
          <button
            className={styles.navButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} className={styles.navIcon} />
          </button>
          <button
            className={styles.navButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} className={styles.navIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
