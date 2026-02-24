'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
import { recurringDetailAction } from '@/actions/reports/recurring-detail.action';
import type { RecurringDetailItem } from '@/interfaces/reports';
import type { RecurringReport, HistoricalExecution } from '../../types';
import TablePagination from './components/TablePagination';
import styles from './HistoricalModal.module.css';

interface HistoricalModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: RecurringReport | null;
}

function mapDetailToHistorical(items: RecurringDetailItem[]): HistoricalExecution[] {
  return items.map((d, i) => ({
    id: `detail-${i}-${d.numeroSolicitud}`,
    fechaModificacion: d.fechaModificacion ?? d.fechaCreacion,
    aliasRecurrente: d.alias,
    tipo: d.tipo,
    refCargo: d.refCargo,
    refAbono: d.refAbono,
    tipoBeneficiario: d.tipoBeneficiario,
    beneficiario: d.beneficiario,
    valor: d.valor,
    bancoDestino: d.bancoDestino,
    fechaInicio: d.fechaInicio,
    frecuencia: d.frecuencia,
    estado: mapEstado(d.estado),
    finalizado: d.finalizado?.toUpperCase() === 'SI',
    canal: d.canal ?? '',
    oficina: d.oficina ?? '',
  }));
}

function mapEstado(estado: string): 'Exitoso' | 'Inactivo' | 'Fallido' {
  const normalized = estado?.toUpperCase();
  if (normalized === 'ACTIVO' || normalized === 'EXITOSO') return 'Exitoso';
  if (normalized === 'INACTIVO') return 'Inactivo';
  return 'Fallido';
}

export default function HistoricalModal({ isOpen, onClose, item }: HistoricalModalProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState<HistoricalExecution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const fetchDetail = useCallback(async (row: RecurringReport) => {
    setIsLoading(true);
    try {
      const res = await recurringDetailAction({
        numeroAsociado: row.numeroAsociado,
        tipo: row.tipo,
        frecuencia: row.frecuencia,
        refAbono: row.refAbono,
        refCargo: row.refCargo,
      });
      if (res.data && !res.errors) {
        setData(mapDetailToHistorical(res.data));
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && item) {
      setPageIndex(0);
      fetchDetail(item);
    }
    if (!isOpen) {
      setData([]);
    }
  }, [isOpen, item, fetchDetail]);
  
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
    data,
    columns,
    manualPagination: false,
    pageIndex,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
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
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              Cargando detalle...
            </div>
          ) : (
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
          )}
        </div>
        {!isLoading && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={data.length}
            onPageChange={(page) => setPageIndex(page - 1)}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
