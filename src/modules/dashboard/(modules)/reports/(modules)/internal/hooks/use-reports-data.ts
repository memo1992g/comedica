import { useMemo } from 'react';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { TransactionData, reportColumns } from '../utils/columns';

interface UseReportsDataParams {
  data: TransactionData[];
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

export function useReportsData({
  data,
  searchQuery,
  currentPage,
  itemsPerPage,
}: UseReportsDataParams) {
  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(
      (item) =>
        item.nameOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accountOrigin.includes(searchQuery) ||
        item.accountDestination.includes(searchQuery)
    );
  }, [data, searchQuery]);

  // Calcular totales
  const totalTransactions = filteredData.length;
  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

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
    data: filteredData,
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  return {
    table,
    filteredData,
    totalTransactions,
    totalAmount,
    totalPages,
  };
}
