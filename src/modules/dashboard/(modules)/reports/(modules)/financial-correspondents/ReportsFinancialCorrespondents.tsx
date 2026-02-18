'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import FinancialCorrespondentsHeader from './components/FinancialCorrespondentsHeader/FinancialCorrespondentsHeader';
import FinancialCorrespondentsStats from './components/FinancialCorrespondentsStats/FinancialCorrespondentsStats';
import FinancialCorrespondentsPagination from './components/FinancialCorrespondentsPagination/FinancialCorrespondentsPagination';
import { mockTransactions } from './data/mock-data';
import { useFinancialCorrespondentsData } from './hooks/use-financial-correspondents-data';
import styles from './styles/ReportsFinancialCorrespondents.module.css';
import './styles/CustomTableOverrides.css';

export default function ReportsFinancialCorrespondents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { table, totalTransactions, totalAmount, totalPages } = useFinancialCorrespondentsData({
    data: mockTransactions,
    searchQuery,
    filterValue,
    currentPage,
    itemsPerPage,
  });

  const handleExport = () => {
    console.log('Exportar Excel');
  };

  const handleDateFilter = (date: Date | null) => {
    console.log('Filtrar por fecha', date);
  };

  const handlePageChange = (page: number) => {
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
          <FinancialCorrespondentsHeader onExport={handleExport} />

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className={styles.statsSection}
          >
            <FinancialCorrespondentsStats
              totalTransactions={totalTransactions}
              totalAmount={totalAmount}
            />
          </motion.div>

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
                stickyHeader={true}
                showScrollIndicators={false}
                scroll={{
                  y: 400
                }}
              />
            </div>
            <FinancialCorrespondentsPagination
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
        </div>
      </div>
    </div>
  );
}
