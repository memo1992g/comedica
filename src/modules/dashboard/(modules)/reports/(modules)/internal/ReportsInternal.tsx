'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import ReportsHeader from './components/ReportsHeader/ReportsHeader';
import ReportsTabs from './components/ReportsTabs/ReportsTabs';
import ReportsStats from './components/ReportsStats/ReportsStats';
import ReportsPagination from './components/ReportsPagination/ReportsPagination';
import ReportsSummaryTable from './components/ReportsSummaryTable/ReportsSummaryTable';
import ReportsContentSkeleton from './components/ReportsContentSkeleton/ReportsContentSkeleton';
import { useReportsData } from './hooks/use-reports-data';
import { useInternalReportActions } from './hooks/use-internal-report-actions';
import styles from './styles/ReportsInternal.module.css';
import './styles/CustomTableOverrides.css';

type ReportTab = 'abonos' | 'cargos' | 'pagos' | 'creditos' | 'consolidado' | 'resumen';

interface DateRangeFilter {
  from: Date | null;
  to: Date | null;
}

const getDefaultDateRange = (): DateRangeFilter => {
  const today = new Date();

  return {
    from: new Date(today.getFullYear(), 0, 1),
    to: today,
  };
};

export default function ReportsInternal() {
  const defaultDateRange = useMemo(() => getDefaultDateRange(), []);
  const [activeTab, setActiveTab] = useState<ReportTab>('cargos');
  const [prevTab, setPrevTab] = useState<ReportTab>('cargos');
  const [selectedRange, setSelectedRange] = useState<DateRangeFilter>(defaultDateRange);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const {
    data: apiData,
    summary,
    summaryRows,
    pagination,
    isLoading,
    fetchReport,
  } = useInternalReportActions();

  useEffect(() => {
    const timeout = globalThis.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      globalThis.clearTimeout(timeout);
    };
  }, [searchQuery]);

  const isRangePartial =
    (selectedRange.from && !selectedRange.to) || (!selectedRange.from && selectedRange.to);

  /* Tabs that send search to backend */
  const BACKEND_SEARCH_TABS: ReportTab[] = ['cargos', 'abonos', 'creditos', 'consolidado', 'resumen'];
  const isBackendSearchTab = BACKEND_SEARCH_TABS.includes(activeTab);
  const backendSearchQuery = isBackendSearchTab ? debouncedSearchQuery.trim() : '';

  /* Tabs with client-side pagination (backend returns all data) */
  const isClientPaginatedTab = activeTab === 'pagos';

  const requestFilters = useMemo(() => {
    const filters: {
      fechaDesde?: string;
      fechaHasta?: string;
      associateNumber?: string;
      debitCustomerId?: string;
      customerToCharge?: string;
    } = {};

    if (selectedRange.from && selectedRange.to) {
      filters.fechaDesde = selectedRange.from.toISOString().split('T')[0];
      filters.fechaHasta = selectedRange.to.toISOString().split('T')[0];
    }

    if (!backendSearchQuery) return filters;

    if (activeTab === 'cargos' || activeTab === 'consolidado' || activeTab === 'resumen') {
      filters.associateNumber = backendSearchQuery;
    } else if (activeTab === 'abonos') {
      filters.debitCustomerId = backendSearchQuery;
    } else if (activeTab === 'creditos') {
      filters.customerToCharge = backendSearchQuery;
    }

    return filters;
  }, [selectedRange, backendSearchQuery, activeTab]);

  /* For client-paginated tabs, don't re-fetch on page/size changes */
  const fetchPage = isClientPaginatedTab ? 1 : currentPage;
  const fetchSize = isClientPaginatedTab ? 10000 : itemsPerPage;

  useEffect(() => {
    if (isRangePartial) return;
    fetchReport(activeTab, requestFilters, fetchPage, fetchSize);
  }, [activeTab, requestFilters, fetchPage, fetchSize, isRangePartial, fetchReport]);

  /* For client-paginated or pagos tabs, apply local search; backend-search tabs already filtered server-side */
  const clientSearchQuery = (isClientPaginatedTab || !isBackendSearchTab) ? searchQuery : '';

  const { table, filteredTransactions } = useReportsData({
    data: apiData,
    searchQuery: clientSearchQuery,
    pageIndex: isClientPaginatedTab ? currentPage - 1 : 0,
    pageSize: isClientPaginatedTab ? itemsPerPage : undefined,
  });

  const statsTransactions = summary.totalTransactions;
  const statsAmount = summary.totalAmount;

  const totalItems = isClientPaginatedTab
    ? filteredTransactions
    : pagination.totalElements || summary.totalTransactions;

  const totalPages = isClientPaginatedTab
    ? Math.max(1, Math.ceil(filteredTransactions / Math.max(itemsPerPage, 1)))
    : Math.max(1, pagination.totalPages);

  const handleTabChange = (newTab: ReportTab) => {
    setPrevTab(activeTab);
    setActiveTab(newTab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const shouldAnimate = prevTab !== 'resumen' && activeTab !== 'resumen';
  const showSkeleton = isLoading;
  const handleExport = () => console.log('Exportar Excel');
  const handleDateFilter = (range: DateRangeFilter) => {
    const isRangeCleared = !range.from && !range.to;
    setSelectedRange(isRangeCleared ? defaultDateRange : range);
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
          <ReportsHeader onExport={handleExport} />

          <ReportsTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {showSkeleton ? (
            <ReportsContentSkeleton rows={8} showStats={activeTab !== 'resumen'} />
          ) : (
            <>
              <AnimatePresence mode="wait">
                {activeTab !== 'resumen' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.2 }}
                    className={styles.statsSection}
                  >
                    <ReportsStats
                      totalTransactions={statsTransactions}
                      totalAmount={statsAmount}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'resumen' ? (
                  <motion.div
                    key="resumen"
                    initial={shouldAnimate ? { opacity: 0, x: 40 } : { opacity: 1 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={shouldAnimate ? { opacity: 0, x: -40 } : { opacity: 1 }}
                    transition={{ duration: shouldAnimate ? 0.25 : 0, ease: [0.4, 0, 0.2, 1] }}
                    className={styles.tableWrapper}
                  >
                    <ReportsSummaryTable data={summaryRows} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={shouldAnimate ? { opacity: 0, x: 40 } : { opacity: 1 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={shouldAnimate ? { opacity: 0, x: -40 } : { opacity: 1 }}
                    transition={{ duration: shouldAnimate ? 0.25 : 0, ease: [0.4, 0, 0.2, 1] }}
                    className={styles.tableWrapper}
                  >
                    <div className={styles.tableSection} data-custom-table>
                      <CustomTable
                        table={table}
                        enableColumnReordering={false}
                        enableRowExpansion={false}
                        stickyHeader={true}
                        showScrollIndicators={false}
                        scroll={{ y: 500 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          <ReportsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            dateRange={selectedRange}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={setSearchQuery}
            onDateFilter={handleDateFilter}
            searchQuery={searchQuery}
            searchPlaceholder={
              activeTab === 'pagos'
                ? 'Buscar...'
                : 'Buscar por número de asociado...'
            }
          />
        </div>
      </div>
    </div>
  );
}
