'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import FinancialCorrespondentsHeader from './components/FinancialCorrespondentsHeader/FinancialCorrespondentsHeader';
import FinancialCorrespondentsStats from './components/FinancialCorrespondentsStats/FinancialCorrespondentsStats';
import FinancialCorrespondentsPagination from './components/FinancialCorrespondentsPagination/FinancialCorrespondentsPagination';
import { useFinancialCorrespondentsData } from './hooks/use-financial-correspondents-data';
import { useFinancialCorrespondentsActions } from './hooks/use-financial-correspondents-actions';
import ReportTableSkeleton from '@/components/common/ReportTableSkeleton/ReportTableSkeleton';
import styles from './styles/ReportsFinancialCorrespondents.module.css';
import './styles/CustomTableOverrides.css';

interface DateRangeFilter {
  from: Date | null;
  to: Date | null;
}

const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);

export default function ReportsFinancialCorrespondents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    from: startOfYear,
    to: today,
  });

  const { data: apiData, isLoading, error: apiError, fetchReport } =
    useFinancialCorrespondentsActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isRangePartial =
    (dateRange.from && !dateRange.to) || (!dateRange.from && dateRange.to);

  const dateFilters = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return {};
    return {
      fechaDesde: dateRange.from.toISOString().split('T')[0],
      fechaHasta: dateRange.to.toISOString().split('T')[0],
    };
  }, [dateRange]);

  useEffect(() => {
    if (isRangePartial) return;
    fetchReport(dateFilters);
  }, [dateFilters, isRangePartial, fetchReport]);

  const { table, totalTransactions, totalAmount, totalPages } =
    useFinancialCorrespondentsData({
      data: apiData,
      searchQuery: debouncedSearch,
      filterValue,
      currentPage,
      itemsPerPage,
    });

  const handleDateFilter = (range: DateRangeFilter) => {
    const isRangeCleared = !range.from && !range.to;
    setDateRange(isRangeCleared ? { from: startOfYear, to: today } : range);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.max(totalPages, 1)) return;
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <FinancialCorrespondentsHeader onExport={() => console.log('Exportar Excel')} />

          {isLoading ? (
            <ReportTableSkeleton rows={8} columns={7} showStats />
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.2 }}
                  className={styles.statsSection}
                >
                  <FinancialCorrespondentsStats
                    totalTransactions={totalTransactions}
                    totalAmount={totalAmount}
                  />
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={styles.tableWrapper}
              >
                <div className={styles.tableSection} data-custom-table>
                  <CustomTable
                    table={table}
                    enableColumnReordering={false}
                    enableRowExpansion={false}
                    stickyHeader={false}
                    showScrollIndicators={false}
                    scroll={{ y: 500 }}
                  />
                </div>
              </motion.div>
            </>
          )}

          <FinancialCorrespondentsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalTransactions}
            itemsPerPage={itemsPerPage}
            dateRange={dateRange}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={setSearchQuery}
            onDateFilter={handleDateFilter}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
          />
          {apiError && (
            <p style={{ color: 'red', padding: '8px 16px', fontSize: 14 }}>
              {apiError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
