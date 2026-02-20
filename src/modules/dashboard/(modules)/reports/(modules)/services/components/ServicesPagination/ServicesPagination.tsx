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
import styles from './ServicesPagination.module.css';

interface DateRangeFilter {
  from: Date | null;
  to: Date | null;
}

interface ServicesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  dateRange?: DateRangeFilter;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (query: string) => void;
  onDateFilter: (range: DateRangeFilter) => void;
  onFilterChange?: (value: string) => void;
  searchQuery: string;
  searchPlaceholder?: string;
}

export default function ServicesPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  dateRange,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onDateFilter,
  onFilterChange,
  searchQuery,
  searchPlaceholder = 'Buscar...',
}: Readonly<ServicesPaginationProps>) {
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
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

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
              onDateFilter({
                from: range?.from ?? null,
                to: range?.to ?? null,
              })
            }
          />
        </div>

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
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={styles.itemsInfo}>
          {totalItems === 0 ? 0 : startItem}-{endItem} de {totalItems}
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
