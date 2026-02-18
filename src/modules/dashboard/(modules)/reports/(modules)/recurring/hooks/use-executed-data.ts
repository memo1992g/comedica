import { useMemo } from 'react';
import { ExecutedReport } from '../types';

interface UseExecutedDataProps {
  data: ExecutedReport[];
  searchQuery: string;
}

interface UseExecutedDataReturn {
  filteredData: ExecutedReport[];
  totalTransactions: number;
  totalAmount: number;
}

export function useExecutedData({ data, searchQuery }: UseExecutedDataProps): UseExecutedDataReturn {
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      (item) =>
        item.numeroAsociado.toLowerCase().includes(query) ||
        item.tipo.toLowerCase().includes(query) ||
        item.refCargo.toLowerCase().includes(query) ||
        item.estadoEjecucion.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const totalTransactions = filteredData.length;
  const totalAmount = filteredData.reduce((sum, item) => sum + item.valor, 0);

  return { filteredData, totalTransactions, totalAmount };
}
