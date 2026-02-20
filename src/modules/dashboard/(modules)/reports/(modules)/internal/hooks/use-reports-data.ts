import { useMemo } from 'react';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { TransactionData, reportColumns } from '../utils/columns';

interface UseReportsDataParams {
  data: TransactionData[];
  searchQuery: string;
  pageIndex?: number;
  pageSize?: number;
}

export function useReportsData({
  data,
  searchQuery,
  pageIndex,
  pageSize,
}: UseReportsDataParams) {
  const isClientPaginated = pageSize != null;

  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const normalizedQuery = searchQuery.toLowerCase();
    
    return data.filter(
      (item) =>
        item.nameOrigin.toLowerCase().includes(normalizedQuery) ||
        item.nameDestination.toLowerCase().includes(normalizedQuery) ||
        item.accountOrigin.toLowerCase().includes(normalizedQuery) ||
        item.accountDestination.toLowerCase().includes(normalizedQuery) ||
        item.idOrigin.toLowerCase().includes(normalizedQuery)
    );
  }, [data, searchQuery]);

  const filteredTransactions = filteredData.length;
  const filteredAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);

  // For client-paginated tabs, slice locally
  const paginatedData = useMemo(() => {
    if (!isClientPaginated) return filteredData;
    const start = (pageIndex ?? 0) * pageSize;

    return filteredData.slice(start, start + pageSize);
  }, [filteredData, isClientPaginated, pageIndex, pageSize]);

  // Preparar columnas
  const columns = useMemo(
    () =>
      getCustomTableColumns({
        columns: reportColumns,
        enableRowSelection: false,
        enableRowExpansion: false,
      }),
    []
  );

  // Configurar tabla con paginación
  const { table } = useCustomTable({
    data: paginatedData,
    columns,
    manualPagination: true,
    pageIndex: 0,
    pageSize: Math.max(paginatedData.length, 1),
  });

  return {
    table,
    filteredData,
    filteredTransactions,
    filteredAmount,
  };
}
