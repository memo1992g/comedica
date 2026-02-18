'use client';

import React, { useState, useEffect } from 'react';
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

export default function ReportsServices() {
  const [activeTab, setActiveTab] = useState<ServicesTab>('servicios');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: apiData, isLoading, error: apiError, fetchReport } = useServicesActions();

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, fetchReport]);

  const { table, totalTransactions, totalAmount, totalPages } = useServicesData({
    activeTab,
    searchQuery,
    currentPage,
    itemsPerPage,
    externalData: apiData.length > 0 ? apiData : undefined,
  });

  const handleTabChange = (newTab: ServicesTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleExport = () => {
    console.log('Exportar Excel');
  };

  const handleDateFilter = (date: Date | null) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      fetchReport(activeTab, { fechaDesde: dateStr, fechaHasta: dateStr });
    } else {
      fetchReport(activeTab);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    console.log('Filtro:', value);
  };

  const shouldAnimate = true; // Always animate between tabs

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <ServicesHeader onExport={handleExport} />

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
                    totalTransactions={totalTransactions}
                    totalAmount={totalAmount}
                  />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={shouldAnimate ? { opacity: 0, x: 40 } : { opacity: 1 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldAnimate ? { opacity: 0, x: -40 } : { opacity: 1 }}
                  transition={{
                    duration: shouldAnimate ? 0.25 : 0,
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
                    />
                  </div>
                  <ServicesPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalTransactions}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    onSearch={setSearchQuery}
                    onDateFilter={handleDateFilter}
                    onFilterChange={handleFilterChange}
                    searchQuery={searchQuery}
                  />
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
