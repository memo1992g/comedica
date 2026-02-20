'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import Transfer365Header from './components/Transfer365Header/Transfer365Header';
import Transfer365Tabs, { Transfer365Tab } from './components/Transfer365Tabs/Transfer365Tabs';
import Transfer365Stats from './components/Transfer365Stats/Transfer365Stats';
import Transfer365Pagination from './components/Transfer365Pagination/Transfer365Pagination';
import Transfer365SquareTable from './components/Transfer365SquareTable/Transfer365SquareTable';
import { transfer365Columns } from './utils/columns';
import { useTransfer365Data } from './hooks/use-transfer365-data';
import { useTransfer365Actions } from './hooks/use-transfer365-actions';
import ReportTableSkeleton from '@/components/common/ReportTableSkeleton/ReportTableSkeleton';
import styles from './styles/ReportsTransfer365.module.css';
import './styles/CustomTableOverrides.css';

const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);

export default function ReportsTransfer365() {
  const [activeTab, setActiveTab] = useState<Transfer365Tab>('transfer365');
  const [prevTab, setPrevTab] = useState<Transfer365Tab>('transfer365');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({ from: startOfYear, to: today });

  const { data: apiData, balanceData, totalElements, extras, isLoading, error: apiError, fetchReport } = useTransfer365Actions();

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); setCurrentPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const isCuadre = activeTab === 'cuadre' || activeTab === 'cuadre-card';
    const fechaDesde = dateRange.from.toISOString().split('T')[0];
    const fechaHasta = dateRange.to.toISOString().split('T')[0];
    fetchReport(
      activeTab,
      { fechaDesde, fechaHasta, cuentaOrigen: !isCuadre && debouncedSearch.trim() ? debouncedSearch.trim() : undefined },
      currentPage - 1,
      itemsPerPage,
    );
  }, [activeTab, dateRange, debouncedSearch, currentPage, itemsPerPage, fetchReport]);

  const { filteredData } = useTransfer365Data({ data: apiData, searchQuery: '', filterValue });

  const isCuadreTab = activeTab === 'cuadre' || activeTab === 'cuadre-card';
  const totalPages = Math.max(1, Math.ceil(totalElements / itemsPerPage));
  const shouldAnimate = (prevTab !== 'cuadre' && prevTab !== 'cuadre-card') && !isCuadreTab;

  const columns = useMemo(
    () => getCustomTableColumns({ columns: transfer365Columns, enableRowSelection: false, enableRowExpansion: false }),
    [],
  );

  const { table } = useCustomTable({
    data: filteredData,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const handleTabChange = (newTab: Transfer365Tab) => {
    setPrevTab(activeTab); setActiveTab(newTab); setCurrentPage(1); setSearchQuery(''); setDebouncedSearch('');
  };

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    if (range.from && range.to) { setDateRange({ from: range.from, to: range.to }); setCurrentPage(1); }
  };

  const motionInitial = shouldAnimate ? { opacity: 0, x: 40 } : { opacity: 0 };
  const motionExit = shouldAnimate ? { opacity: 0, x: -40 } : { opacity: 0 };

  return (
    <div className={styles.content}>
      <div className={styles.innerContent}>
        <Transfer365Header onExport={() => console.log('Exportar Excel')} />
        <Transfer365Tabs activeTab={activeTab} onTabChange={handleTabChange} />

        {isLoading ? (
          <ReportTableSkeleton rows={8} columns={5} showStats={!isCuadreTab} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {!isCuadreTab && (
                <motion.div key="stats" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.2 }} className={styles.statsSection}>
                  <Transfer365Stats
                    totalTransacciones={extras?.totalTransacciones ?? totalElements}
                    totalEntrante={extras?.totalEntrante ?? 0}
                    totalSaliente={extras?.totalSaliente ?? 0}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              {isCuadreTab ? (
                <motion.div key={activeTab}
                  initial={motionInitial} animate={{ opacity: 1, x: 0 }} exit={motionExit}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }} className={styles.tableWrapper}>
                  <div className={styles.squareSection}><Transfer365SquareTable data={balanceData} /></div>
                </motion.div>
              ) : (
                <motion.div key={activeTab}
                  initial={motionInitial} animate={{ opacity: 1, x: 0 }} exit={motionExit}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }} className={styles.tableWrapper}>
                  <div className={styles.tableSection} data-custom-table>
                    <CustomTable table={table} enableColumnReordering={false} enableRowExpansion={false}
                      stickyHeader={false} showScrollIndicators={false} scroll={{ y: 500 }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <Transfer365Pagination
          currentPage={currentPage} totalPages={totalPages} totalItems={totalElements}
          itemsPerPage={itemsPerPage} dateRange={dateRange}
          onPageChange={setCurrentPage} onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
          onSearch={setSearchQuery} onDateRangeChange={handleDateRangeChange}
          onFilterChange={(v) => { setFilterValue(v); setCurrentPage(1); }} searchQuery={searchQuery}
          showSearch={!isCuadreTab} showFilter={!isCuadreTab} showPageControls={!isCuadreTab}
        />
        {apiError && <p style={{ color: 'red', padding: '8px 16px', fontSize: 14 }}>{apiError}</p>}
      </div>
    </div>
  );
}

