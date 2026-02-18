'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import ReportsHeader from './components/ReportsHeader/ReportsHeader';
import ReportsTabs from './components/ReportsTabs/ReportsTabs';
import ReportsStats from './components/ReportsStats/ReportsStats';
import ReportsPagination from './components/ReportsPagination/ReportsPagination';
import ReportsSummaryTable from './components/ReportsSummaryTable/ReportsSummaryTable';
import ReportTableSkeleton from '@/components/common/ReportTableSkeleton/ReportTableSkeleton';
import { mockTransactions, mockSummaryData } from './data/mock-data';
import { useReportsData } from './hooks/use-reports-data';
import { useInternalReportActions } from './hooks/use-internal-report-actions';
import styles from './styles/ReportsInternal.module.css';
import './styles/CustomTableOverrides.css';

type ReportTab = 'abonos' | 'cargos' | 'pagos' | 'creditos' | 'consolidado' | 'resumen';

export default function ReportsInternal() {
  const [activeTab, setActiveTab] = useState<ReportTab>('cargos');
  const [prevTab, setPrevTab] = useState<ReportTab>('cargos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: apiData, isLoading, error: apiError, fetchReport } = useInternalReportActions();

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, fetchReport]);

  const reportData = apiData.length > 0 ? apiData : mockTransactions;

  const { table, totalTransactions, totalAmount, totalPages } = useReportsData({
    data: reportData,
    searchQuery,
    currentPage,
    itemsPerPage,
  });

  const handleTabChange = (newTab: ReportTab) => {
    setPrevTab(activeTab);
    setActiveTab(newTab);
  };

  const shouldAnimate = prevTab !== 'resumen' && activeTab !== 'resumen';
  const handleExport = () => console.log('Exportar Excel');
  const handleDateFilter = (date: Date | null) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      fetchReport(activeTab, { fechaDesde: dateStr, fechaHasta: dateStr });
    } else {
      fetchReport(activeTab);
    }
  };
  const handlePageChange = (page: number) => setCurrentPage(page);
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

          {isLoading ? (
            <ReportTableSkeleton rows={8} columns={6} showStats />
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
                      totalTransactions={totalTransactions}
                      totalAmount={totalAmount}
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
                    <ReportsSummaryTable data={mockSummaryData} />
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
                        stickyHeader={false}
                        showScrollIndicators={false}
                      />
                    </div>
                    <ReportsPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalTransactions}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      onSearch={setSearchQuery}
                      onDateFilter={handleDateFilter}
                      searchQuery={searchQuery}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
