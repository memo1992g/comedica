'use client';

import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from './TablePagination.module.css';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

export default function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  canPreviousPage,
  canNextPage,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationContent}>
        <div className={styles.pageSelector}>
          <span className={styles.pageLabel}>Página</span>
          <Select
            value={String(currentPage)}
            onValueChange={(value) => onPageChange(Number(value))}
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue />
              <ChevronDown className={styles.selectIcon} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={String(page)}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={styles.rangeText}>
          {startItem}-{endItem} de {totalItems}
        </div>

        <div className={styles.navigationButtons}>
          <button
            className={styles.navButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPreviousPage}
            aria-label="Página anterior"
          >
            <ChevronLeft className={styles.navIcon} />
          </button>
          <button
            className={styles.navButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNextPage}
            aria-label="Página siguiente"
          >
            <ChevronRight className={styles.navIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
