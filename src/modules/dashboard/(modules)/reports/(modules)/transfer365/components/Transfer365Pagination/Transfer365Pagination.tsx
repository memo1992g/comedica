'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomDatePicker } from '@/components/common/CustomDatePicker/CustomDatePicker';
import styles from './Transfer365Pagination.module.css';

interface Transfer365PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  dateRange?: { from: Date | null; to: Date | null };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (query: string) => void;
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  onFilterChange?: (value: string) => void;
  searchQuery: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showPageControls?: boolean;
}

export default function Transfer365Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  dateRange,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onDateRangeChange,
  onFilterChange,
  searchQuery,
  showSearch = true,
  showFilter = true,
  showPageControls = true,
}: Readonly<Transfer365PaginationProps>) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const [filterValue, setFilterValue] = useState('all');

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.leftSection}>
        {showSearch && (
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar por cuenta de origen..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}

        <div className={styles.dateRangeContainer}>
          <CustomDatePicker
            selectionMode="range"
            disableFutureDates
            className={styles.dateRangeButton}
            rangeValue={{
              from: dateRange?.from ?? undefined,
              to: dateRange?.to ?? undefined,
            }}
            onRangeChange={(range) =>
              onDateRangeChange({ from: range?.from ?? null, to: range?.to ?? null })
            }
          />
        </div>

        {showFilter && (
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
        )}
      </div>

      {showPageControls && (
        <div className={styles.rightSection}>
          <div className={styles.pageSelector}>
            <span className={styles.label}>Items por página</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      )}
    </div>
  );
}
