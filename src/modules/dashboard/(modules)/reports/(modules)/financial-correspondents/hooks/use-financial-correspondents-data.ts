import { useMemo } from 'react';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { FinancialCorrespondentTransaction } from '../types/FinancialCorrespondent.type';
import { financialCorrespondentsColumns } from '../utils/columns';

interface UseFinancialCorrespondentsDataParams {
  data: FinancialCorrespondentTransaction[];
  searchQuery: string;
  filterValue: string;
  currentPage: number;
  itemsPerPage: number;
}

export function useFinancialCorrespondentsData({
  data,
  searchQuery,
  filterValue,
  currentPage,
  itemsPerPage,
}: UseFinancialCorrespondentsDataParams) {
  const filteredData = useMemo(() => {
    let result = data;

    // Filtro por búsqueda (solo nombre)
    if (searchQuery.trim()) {
      result = result.filter((item) =>
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filtro por tipo
    if (filterValue !== 'all') {
      result = result.filter((item) => item.tipo.toLowerCase() === filterValue);
    }

    return result;
  }, [data, searchQuery, filterValue]);

  const totalTransactions = filteredData.length;
  const totalAmount = filteredData.reduce((sum, item) => sum + item.monto, 0);
  const totalPages = Math.max(1, Math.ceil(totalTransactions / itemsPerPage));

  const columns = useMemo(
    () =>
      getCustomTableColumns({
        columns: financialCorrespondentsColumns,
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

  return {
    table,
    filteredData,
    totalTransactions,
    totalAmount,
    totalPages,
  };
}
