'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import ServicesHeader from './components/ServicesHeader/ServicesHeader';
import ServicesTabs from './components/ServicesTabs/ServicesTabs';
import ServicesStats from './components/ServicesStats/ServicesStats';
import ServicesPagination from './components/ServicesPagination/ServicesPagination';
import { useServicesData } from './hooks/use-services-data';
import { useServicesActions } from './hooks/use-services-actions';
import ReportTableSkeleton from '@/components/common/ReportTableSkeleton/ReportTableSkeleton';
import { ServicesTab } from './types/service-types';
import styles from './styles/ReportsServices.module.css';
import './styles/CustomTableOverrides.css';

interface DateRangeFilter {
  from: Date | null;
  to: Date | null;
}

const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);

const SEARCH_PLACEHOLDERS: Record<ServicesTab, string> = {
  servicios: 'Buscar por nombre de cliente...',
  eventos: 'Buscar por nombre...',
  seguros_comedica: 'Buscar por póliza...',
  ministerio_hacienda: 'Buscar por cuenta de origen...',
};

export default function ReportsServices() {
  const [activeTab, setActiveTab] = useState<ServicesTab>('servicios');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    from: startOfYear,
    to: today,
  });

  const {
    data: apiData,
    totalElements,
    totalPages: backendTotalPages,
    extras,
    isLoading,
    error: apiError,
    fetchReport,
  } = useServicesActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isRangePartial =
    (dateRange.from && !dateRange.to) || (!dateRange.from && dateRange.to);

  const requestFilters = useMemo(() => {
    const filters: Record<string, string | undefined> = {};

    if (dateRange.from && dateRange.to) {
      filters.fechaDesde = dateRange.from.toISOString().split('T')[0];
      filters.fechaHasta = dateRange.to.toISOString().split('T')[0];
    }

    const trimmed = debouncedSearch.trim();
    if (trimmed) {
      switch (activeTab) {
        case 'servicios':
          filters.nombreCliente = trimmed;
          break;
        case 'eventos':
          filters.nombre = trimmed;
          break;
        case 'seguros_comedica':
          filters.poliza = trimmed;
          break;
        case 'ministerio_hacienda':
          filters.cuentaOrigen = trimmed;
          break;
      }
    }

    return filters;
  }, [dateRange, debouncedSearch, activeTab]);

  useEffect(() => {
    if (isRangePartial) return;
    fetchReport(activeTab, requestFilters, currentPage - 1, itemsPerPage);
  }, [activeTab, requestFilters, currentPage, itemsPerPage, isRangePartial, fetchReport]);

  const totalPages = Math.max(1, backendTotalPages);

  const { table } = useServicesData({
    activeTab,
    data: apiData,
    currentPage,
    itemsPerPage,
    totalPages,
  });

  const statsTransactions = extras?.totalTransacciones ?? totalElements;
  const statsAmount = extras?.montoTotal ?? 0;

  const handleTabChange = (newTab: ServicesTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const handleDateFilter = (range: DateRangeFilter) => {
    const isRangeCleared = !range.from && !range.to;
    setDateRange(
      isRangeCleared ? { from: startOfYear, to: today } : range,
    );
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <ServicesHeader onExport={() => console.log('Exportar Excel')} />

          <ServicesTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {isLoading ? (
            <ReportTableSkeleton rows={8} columns={5} showStats />
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
                  <ServicesStats
                    totalTransactions={statsTransactions}
                    totalAmount={statsAmount}
                  />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
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
              </AnimatePresence>
            </>
          )}

          <ServicesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalElements}
            itemsPerPage={itemsPerPage}
            dateRange={dateRange}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={setSearchQuery}
            onDateFilter={handleDateFilter}
            searchQuery={searchQuery}
            searchPlaceholder={SEARCH_PLACEHOLDERS[activeTab]}
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
