'use client';

import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { historicalColumns } from '../../utils/historical-columns';
import { mockHistoricalExecutions } from '../../data/mock-data';
import TablePagination from './components/TablePagination';
import styles from './HistoricalModal.module.css';

interface HistoricalModalProps {
  isOpen: boolean;
  onClose: () => void;
  recurringId: string | null;
}

export default function HistoricalModal({ isOpen, onClose, recurringId }: HistoricalModalProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  
  const columns = useMemo(
    () =>
      getCustomTableColumns({
        columns: historicalColumns,
        enableRowSelection: false,
        enableRowExpansion: false,
      }),
    []
  );

  const { table } = useCustomTable({
    data: mockHistoricalExecutions,
    columns,
    manualPagination: false,
    pageIndex,
    pageSize,
  });

  const totalPages = Math.ceil(mockHistoricalExecutions.length / pageSize);
  const currentPage = pageIndex + 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>
            <span>Histórico de ejecuciones</span>
            <p>Detalle de las ejecuciones realizadas para este pago</p>
          </DialogTitle>
        </DialogHeader>
        <div className={styles.tableContainer} data-custom-table>
          <CustomTable
            table={table}
            enableColumnReordering={false}
            enableRowExpansion={false}
            stickyHeader={true}
            showScrollIndicators={true}
            scroll={{ x: 2000, y: 500 }}
            stickyColumns={{
              right:['valor', 'estado']
            }}
          />
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={mockHistoricalExecutions.length}
          onPageChange={(page) => setPageIndex(page - 1)}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
        />
      </DialogContent>
    </Dialog>
  );
}
