'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import RecurringHeader from './components/RecurringHeader/RecurringHeader';
import RecurringTabs from './components/RecurringTabs/RecurringTabs';
import RecurringStats from './components/RecurringStats/RecurringStats';
import RecurringPagination from './components/RecurringPagination/RecurringPagination';
import HistoricalModal from './components/HistoricalModal/HistoricalModal';
import { createRecurringColumns } from './utils/recurring-columns';
import { executedReportsColumns } from './utils/executed-columns';
import ReportTableSkeleton from '@/components/common/ReportTableSkeleton/ReportTableSkeleton';
import { useRecurringData } from './hooks/use-recurring-data';
import { useExecutedData } from './hooks/use-executed-data';
import { useRecurringActions } from './hooks/use-recurring-actions';
import { RecurringTab } from './types';
import type { RecurringReport } from './types';
import styles from './styles/ReportsRecurring.module.css';
import './styles/CustomTableOverrides.css';

const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);

export default function ReportsRecurring() {
  const [activeTab, setActiveTab] = useState<RecurringTab>('recurrentes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RecurringReport | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({ from: startOfYear, to: today });

  const {
    recurringData: apiRecurring,
    executedData: apiExecuted,
    isLoading,
    fetchReport,
    hasRecurringFetched,
    hasExecutedFetched,
  } = useRecurringActions();

  useEffect(() => {
    const fechaDesde = dateRange.from.toISOString().split('T')[0];
    const fechaHasta = dateRange.to.toISOString().split('T')[0];
    fetchReport(activeTab, { fechaDesde, fechaHasta });
  }, [activeTab, dateRange, fetchReport]);

  const recurringSource = apiRecurring;
  const executedSource = apiExecuted;

  const { filteredData: recurringData, totalTransactions: recurringTotal, totalAmount: recurringAmount } =
    useRecurringData({
      data: recurringSource,
      searchQuery: activeTab === 'recurrentes' ? searchQuery : '',
    });

  const { filteredData: executedData, totalTransactions: executedTotal, totalAmount: executedAmount } =
    useExecutedData({
      data: executedSource,
      searchQuery: activeTab === 'ejecutadas' ? searchQuery : '',
    });

  const handleViewDetail = (item: RecurringReport) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const recurringColumns = useMemo(
    () => getCustomTableColumns({ columns: createRecurringColumns(handleViewDetail), enableRowSelection: false, enableRowExpansion: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const executedColumns = useMemo(
    () => getCustomTableColumns({ columns: executedReportsColumns, enableRowSelection: false, enableRowExpansion: false }),
    [],
  );

  const totalTransactions = activeTab === 'recurrentes' ? recurringTotal : executedTotal;
  const totalAmount = activeTab === 'recurrentes' ? recurringAmount : executedAmount;
  const totalPages = Math.max(1, Math.ceil(totalTransactions / itemsPerPage));

  const { table: recurringTable } = useCustomTable({
    data: recurringData,
    columns: recurringColumns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const { table: executedTable } = useCustomTable({
    data: executedData,
    columns: executedColumns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const handleTabChange = (newTab: RecurringTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    if (range.from && range.to) { setDateRange({ from: range.from, to: range.to }); setCurrentPage(1); }
  };

  const hasFetchedCurrentTab = activeTab === 'recurrentes' ? hasRecurringFetched : hasExecutedFetched;
  const showSkeleton = isLoading || !hasFetchedCurrentTab;

  return (
    <>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <RecurringHeader onExport={() => console.log('Exportar Excel')} />
          <RecurringTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {showSkeleton ? (
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
                  <RecurringStats totalTransactions={totalTransactions} totalAmount={totalAmount} />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className={styles.tableWrapper}
                >
                  <div className={styles.tableSection} data-custom-table>
                    {activeTab === 'recurrentes' ? (
                      <CustomTable
                        table={recurringTable}
                        enableColumnReordering={false}
                        enableRowExpansion={false}
                        stickyHeader={true}
                        scroll={{ x: 2186, y: 500 }}
                        stickyColumns={{ right: ['valor', 'estado', 'tipo'] }}
                      />
                    ) : (
                      <CustomTable
                        table={executedTable}
                        enableColumnReordering={false}
                        enableRowExpansion={false}
                        stickyHeader={true}
                        showScrollIndicators={false}
                        scroll={{ x: 2186, y: 500 }}
                      />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}

          <RecurringPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalTransactions}
            itemsPerPage={itemsPerPage}
            dateRange={dateRange}
            onPageSizeChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
            onPageChange={setCurrentPage}
            onSearch={setSearchQuery}
            onDateRangeChange={handleDateRangeChange}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      <HistoricalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </>
  );
}

