import { useMemo } from 'react';
import { RecurringReport } from '../types';

interface UseRecurringDataProps {
  data: RecurringReport[];
  searchQuery: string;
}

interface UseRecurringDataReturn {
  filteredData: RecurringReport[];
  totalTransactions: number;
  totalAmount: number;
}

export function useRecurringData({ data, searchQuery }: UseRecurringDataProps): UseRecurringDataReturn {
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      (item) =>
        item.solicitud.toLowerCase().includes(query) ||
        item.beneficiario.toLowerCase().includes(query) ||
        item.numeroAsociado.toLowerCase().includes(query) ||
        item.tipo.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const totalTransactions = filteredData.length;
  const totalAmount = filteredData.reduce((sum, item) => sum + item.valor, 0);

  return { filteredData, totalTransactions, totalAmount };
}
