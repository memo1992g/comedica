'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import RecurringHeader from './components/RecurringHeader/RecurringHeader';
import RecurringTabs from './components/RecurringTabs/RecurringTabs';
import RecurringStats from './components/RecurringStats/RecurringStats';
import RecurringPagination from './components/RecurringPagination/RecurringPagination';
import HistoricalModal from './components/HistoricalModal/HistoricalModal';
import { createRecurringColumns } from './components/RecurringDataTable/recurring-columns';
import { executedReportsColumns } from './components/ExecutedReportsTable/executed-columns';
import { mockRecurringReports, mockExecutedReports } from './data/mock-data';
import { useRecurringData } from './hooks/use-recurring-data';
import { useExecutedData } from './hooks/use-executed-data';
import { useRecurringActions } from './hooks/use-recurring-actions';
import { RecurringTab } from './types';
import styles from './styles/ReportsRecurring.module.css';
import './styles/CustomTableOverrides.css';

export default function ReportsRecurring() {
  const [activeTab, setActiveTab] = useState<RecurringTab>('recurrentes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecurringId, setSelectedRecurringId] = useState<string | null>(null);

  const {
    recurringData: apiRecurring,
    executedData: apiExecuted,
    isLoading,
    fetchReport,
  } = useRecurringActions();

  React.useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, fetchReport]);

  const recurringSource = apiRecurring.length > 0 ? apiRecurring : mockRecurringReports;
  const executedSource = apiExecuted.length > 0 ? apiExecuted : mockExecutedReports;

  // Data for recurring reports tab
  const { filteredData: recurringData, totalTransactions: recurringTotal, totalAmount: recurringAmount } =
    useRecurringData({
      data: recurringSource,
      searchQuery: activeTab === 'recurrentes' ? searchQuery : '',
    });

  // Data for executed reports tab
  const { filteredData: executedData, totalTransactions: executedTotal, totalAmount: executedAmount } =
    useExecutedData({
      data: executedSource,
      searchQuery: activeTab === 'ejecutadas' ? searchQuery : '',
    });

  const handleViewDetail = (id: string) => {
    setSelectedRecurringId(id);
    setIsModalOpen(true);
  };

  // Columns for recurring reports
  const recurringColumns = useMemo(
    () =>
      getCustomTableColumns({
        columns: createRecurringColumns(handleViewDetail),
        enableRowSelection: false,
        enableRowExpansion: false,
      }),
    []
  );

  // Columns for executed reports
  const executedColumns = useMemo(
    () =>
      getCustomTableColumns({
        columns: executedReportsColumns,
        enableRowSelection: false,
        enableRowExpansion: false,
      }),
    []
  );

  const totalTransactions = activeTab === 'recurrentes' ? recurringTotal : executedTotal;
  const totalAmount = activeTab === 'recurrentes' ? recurringAmount : executedAmount;

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

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

  const shouldAnimate = true;

  return (
    <>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <RecurringHeader onExport={() => console.log('Exportar Excel')} />
          <RecurringTabs activeTab={activeTab} onTabChange={handleTabChange} />

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
              initial={shouldAnimate ? { opacity: 0, x: 40 } : { opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldAnimate ? { opacity: 0, x: -40 } : { opacity: 0 }}
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
                    stickyColumns={{
                      right: ['valor', 'estado', 'tipo']
                    }}

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
              <RecurringPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalTransactions}
                itemsPerPage={itemsPerPage}
                onPageSizeChange={(size) => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
                onPageChange={setCurrentPage}
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <HistoricalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recurringId={selectedRecurringId}
      />
    </>
  );
}
