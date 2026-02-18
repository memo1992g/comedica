import { useMemo } from 'react';
import { Transfer365Transaction } from '../utils/columns';

interface UseTransfer365DataProps {
  data: Transfer365Transaction[];
  searchQuery: string;
  filterValue: string;
}

export function useTransfer365Data({ data, searchQuery, filterValue }: UseTransfer365DataProps) {
  const filteredData = useMemo(() => {
    let result = data;

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.nameOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.nameDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.accountOrigin.includes(searchQuery) ||
          item.accountDestination.includes(searchQuery)
      );
    }

    if (filterValue !== 'all') {
      if (filterValue === 'saliente') {
        result = result.filter((item) => item.transactionType === 'Saliente');
      } else if (filterValue === 'entrante') {
        result = result.filter((item) => item.transactionType === 'Entrante');
      }
    }

    return result;
  }, [data, searchQuery, filterValue]);

  const totalTransactions = filteredData.length;
  const totalAmount = filteredData.reduce((sum, item) => sum + Math.abs(item.amount), 0);

  return { filteredData, totalTransactions, totalAmount };
}
