import { useState, useCallback } from 'react';
import type { Transfer365Transaction } from '../utils/columns';
import type { SquareRow } from '../components/Transfer365SquareTable/Transfer365SquareTable';
import type {
  Transfer365ReportItem,
  Transfer365CardReportItem,
  Transfer365BalanceData,
} from '@/interfaces/reports';
import {
  transfer365ReportAction,
  transfer365CardReportAction,
  transfer365BalanceAction,
  transfer365CardBalanceAction,
} from '@/actions/reports';
import type { Transfer365Tab } from '../components/Transfer365Tabs/Transfer365Tabs';

export interface DateFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

function mapTransfer365Data(items: Transfer365ReportItem[]): Transfer365Transaction[] {
  return items.map((item, i) => ({
    id: `t365-${i}`,
    date: item.fechaHora?.split(' ')[0] || item.fechaHora || '',
    time: item.fechaHora?.split(' ')[1] || '',
    accountOrigin: item.cuentaOrigen,
    bankOrigin: item.entidadOrigen,
    nameOrigin: item.nombreOrigen,
    amount: item.montoSaliente !== 0 ? -item.montoSaliente : item.montoEntrante,
    type: item.tipoTransferencia,
    accountDestination: item.cuentaDestino,
    bankDestination: item.entidadDestino,
    nameDestination: item.nombreDestino,
    code: item.codigo,
    transactionType: item.montoSaliente !== 0 ? 'Saliente' : 'Entrante',
  }));
}

function mapTransfer365CardData(items: Transfer365CardReportItem[]): Transfer365Transaction[] {
  return items.map((item, i) => ({
    id: `t365c-${i}`,
    date: item.fechaHora?.split(' ')[0] || item.fechaHora || '',
    time: item.fechaHora?.split(' ')[1] || '',
    accountOrigin: item.cuentaOrigen,
    bankOrigin: item.bancoOrigen,
    nameOrigin: item.remitente,
    amount: item.montoSaliente !== 0 ? -item.montoSaliente : item.montoEntrante,
    type: item.tipoTransferencia,
    accountDestination: item.cuentaDestino,
    bankDestination: item.bancoDestino,
    nameDestination: item.destinatario,
    code: item.codigo,
    transactionType: item.montoSaliente !== 0 ? 'Saliente' : 'Entrante',
  }));
}

function mapBalanceToSquareRows(balance: Transfer365BalanceData): SquareRow[] {
  return [
    {
      concept: 'BCR',
      outgoingAmount: 0,
      incomingAmount: 0,
      netAmount: 0,
      isEditable: true,
    },
    {
      concept: 'COMÉDICA',
      outgoingAmount: balance.totalSalientes,
      incomingAmount: balance.totalEntrantes,
      netAmount: balance.montoNeto,
    },
    {
      concept: 'DIFERENCIA',
      outgoingAmount: -balance.totalSalientes,
      incomingAmount: -balance.totalEntrantes,
      netAmount: -balance.montoNeto,
      isDifference: true,
    },
  ];
}

export function useTransfer365Actions() {
  const [data, setData] = useState<Transfer365Transaction[]>([]);
  const [balanceData, setBalanceData] = useState<SquareRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (tab: Transfer365Tab, filters: DateFilters = {}, page = 0, size = 100) => {
      setIsLoading(true);
      setError(null);

      try {
        let result;
        const pagination = { page, size };

        switch (tab) {
          case 'transfer365':
            result = await transfer365ReportAction(filters, pagination);
            if (result && !result.errors && result.data) {
              setData(mapTransfer365Data(result.data.data));
            }
            break;
          case 'transfer365-card':
            result = await transfer365CardReportAction(filters, pagination);
            if (result && !result.errors && result.data) {
              setData(mapTransfer365CardData(result.data.data));
            }
            break;
          case 'cuadre': {
            const balanceResult = await transfer365BalanceAction(filters);
            if (balanceResult && !balanceResult.errors && balanceResult.data) {
              setBalanceData(mapBalanceToSquareRows(balanceResult.data));
            }
            if (balanceResult?.errors) {
              setError(balanceResult.errorMessage || 'Error al obtener cuadre');
            }
            break;
          }
          case 'cuadre-card': {
            const cardFilters = {
              fechaHoraDesde: filters.fechaDesde,
              fechaHoraHasta: filters.fechaHasta,
            };
            const cardBalanceResult = await transfer365CardBalanceAction(cardFilters);
            if (cardBalanceResult && !cardBalanceResult.errors && cardBalanceResult.data) {
              setBalanceData(mapBalanceToSquareRows(cardBalanceResult.data));
            }
            if (cardBalanceResult?.errors) {
              setError(cardBalanceResult.errorMessage || 'Error al obtener cuadre CA-RD');
            }
            break;
          }
        }

        if (result && result.errors) {
          setError(result.errorMessage || 'Error al obtener el reporte');
        }
      } catch {
        setError('Error inesperado al obtener el reporte');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { data, balanceData, isLoading, error, fetchReport };
}
