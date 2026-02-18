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
import { mockTransactions } from './data/mock-data';
import styles from './styles/ReportsTransfer365.module.css';
import './styles/CustomTableOverrides.css';

export default function ReportsTransfer365() {
  const [activeTab, setActiveTab] = useState<Transfer365Tab>('transfer365');
  const [prevTab, setPrevTab] = useState<Transfer365Tab>('transfer365');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: apiData, balanceData, isLoading, error: apiError, fetchReport } = useTransfer365Actions();

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, fetchReport]);

  const reportData = apiData.length > 0 ? apiData : mockTransactions;

  const { filteredData, totalTransactions, totalAmount } = useTransfer365Data({
    data: reportData,
    searchQuery,
    filterValue,
  });

  const isCuadreTab = activeTab === 'cuadre' || activeTab === 'cuadre-card';
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);
  const shouldAnimate = (prevTab !== 'cuadre' && prevTab !== 'cuadre-card') && !isCuadreTab;

  const columns = useMemo(
    () =>
      getCustomTableColumns({
        columns: transfer365Columns,
        enableRowSelection: false,
        enableRowExpansion: false,
      }),
    []
  );

  const { table } = useCustomTable({
    data: filteredData,
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const handleTabChange = (newTab: Transfer365Tab) => { setPrevTab(activeTab); setActiveTab(newTab); };
  const handleFilterChange = (value: string) => { setFilterValue(value); setCurrentPage(1); };
  const handlePageSizeChange = (size: number) => { setItemsPerPage(size); setCurrentPage(1); };

  const handleDateFilter = (date: Date | null) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      fetchReport(activeTab, { fechaDesde: dateStr, fechaHasta: dateStr });
    } else {
      fetchReport(activeTab);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.innerContent}>
        <Transfer365Header onExport={() => console.log('Exportar Excel')} />
        <Transfer365Tabs activeTab={activeTab} onTabChange={handleTabChange} />

        {isLoading ? (
          <ReportTableSkeleton rows={8} columns={5} showStats />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {!isCuadreTab && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.2 }}
                  className={styles.statsSection}
                >
                  <Transfer365Stats totalTransactions={totalTransactions} totalAmount={totalAmount} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              {isCuadreTab ? (
                <motion.div
                  key={activeTab}
                  initial={shouldAnimate ? { opacity: 0, x: 40 } : { opacity: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldAnimate ? { opacity: 0, x: -40 } : { opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className={styles.tableWrapper}
                >
                  <div className={styles.squareSection}>
                    <Transfer365SquareTable data={balanceData} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={shouldAnimate ? { opacity: 0, x: 40 } : { opacity: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldAnimate ? { opacity: 0, x: -40 } : { opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
                  <Transfer365Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalTransactions}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                    onSearch={setSearchQuery}
                    onDateFilter={handleDateFilter}
                    onFilterChange={handleFilterChange}
                    searchQuery={searchQuery}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
