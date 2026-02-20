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
  cuentaOrigen?: string;
}

function mapTransfer365Data(items: Transfer365ReportItem[]): Transfer365Transaction[] {
  return items.map((item, i) => ({
    id: `t365-${i}`,
    date: item.fechaHora?.split(' ')[0] || item.fechaHora || '',
    time: item.fechaHora?.split(' ')[1] || '',
    accountOrigin: item.cuentaOrigen,
    bankOrigin: item.entidadOrigen,
    nameOrigin: item.nombreOrigen,
    amount: item.montoSaliente === 0 ? item.montoEntrante : -item.montoSaliente,
    type: item.tipoTransferencia,
    accountDestination: item.cuentaDestino,
    bankDestination: item.entidadDestino,
    nameDestination: item.nombreDestino,
    code: item.codigo,
    transactionType: item.montoSaliente === 0 ? 'Entrante' : 'Saliente',
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
    amount: item.montoSaliente === 0 ? item.montoEntrante : -item.montoSaliente,
    type: item.tipoTransferencia,
    accountDestination: item.cuentaDestino,
    bankDestination: item.bancoDestino,
    nameDestination: item.destinatario,
    code: item.codigo,
    transactionType: item.montoSaliente === 0 ? 'Entrante' : 'Saliente',
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

export interface Transfer365Extras {
  totalTransacciones: number;
  totalEntrante: number;
  totalSaliente: number;
}

interface TransactionResult {
  transactions: Transfer365Transaction[];
  totalElements: number;
  totalPages: number;
  extras: Transfer365Extras;
  error?: string;
}

function buildExtras(extras: Record<string, number | null> | undefined, totalElements: number): Transfer365Extras {
  return {
    totalTransacciones: (extras?.totalTransacciones as number | null) ?? totalElements,
    totalEntrante: (extras?.totalEntrante as number | null) ?? 0,
    totalSaliente: (extras?.totalSaliente as number | null) ?? 0,
  };
}

async function fetchT365Tab(
  filters: DateFilters,
  pagination: { page: number; size: number },
): Promise<TransactionResult> {
  const { cuentaOrigen, ...dateFilters } = filters;
  const res = await transfer365ReportAction({ ...dateFilters, cuentaOrigen }, pagination);
  if (!res?.errors && res?.data) {
    return {
      transactions: mapTransfer365Data(res.data.data),
      totalElements: res.data.totalElements,
      totalPages: res.data.totalPages,
      extras: buildExtras(res.data.extras, res.data.totalElements),
    };
  }
  return { transactions: [], totalElements: 0, totalPages: 0, extras: buildExtras(undefined, 0), error: res?.errorMessage || 'Error al obtener Transfer365' };
}

async function fetchT365CardTab(
  filters: DateFilters,
  pagination: { page: number; size: number },
): Promise<TransactionResult> {
  const { cuentaOrigen, ...dateFilters } = filters;
  const res = await transfer365CardReportAction({ ...dateFilters, cuentaOrigen }, pagination);
  if (!res?.errors && res?.data) {
    return {
      transactions: mapTransfer365CardData(res.data.data),
      totalElements: res.data.totalElements,
      totalPages: res.data.totalPages,
      extras: buildExtras(res.data.extras, res.data.totalElements),
    };
  }
  return { transactions: [], totalElements: 0, totalPages: 0, extras: buildExtras(undefined, 0), error: res?.errorMessage || 'Error al obtener Transfer365 CA-RD' };
}

async function fetchCuadreTab(filters: DateFilters): Promise<{ rows: SquareRow[]; error?: string }> {
  const { cuentaOrigen: _, ...dateFilters } = filters;
  const res = await transfer365BalanceAction(dateFilters);
  if (!res?.errors && res?.data) {
    return { rows: mapBalanceToSquareRows(res.data) };
  }
  return { rows: [], error: res?.errorMessage || 'Error al obtener cuadre' };
}

async function fetchCuadreCardTab(filters: DateFilters): Promise<{ rows: SquareRow[]; error?: string }> {
  const cardFilters = { fechaHoraDesde: filters.fechaDesde, fechaHoraHasta: filters.fechaHasta };
  const res = await transfer365CardBalanceAction(cardFilters);
  if (!res?.errors && res?.data) {
    return { rows: mapBalanceToSquareRows(res.data) };
  }
  return { rows: [], error: res?.errorMessage || 'Error al obtener cuadre CA-RD' };
}

export function useTransfer365Actions() {
  const [data, setData] = useState<Transfer365Transaction[]>([]);
  const [balanceData, setBalanceData] = useState<SquareRow[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [extras, setExtras] = useState<Transfer365Extras | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (tab: Transfer365Tab, filters: DateFilters = {}, page = 0, size = 10) => {
      setIsLoading(true);
      setError(null);
      setData([]);
      setBalanceData([]);
      setTotalElements(0);
      setExtras(null);

      try {
        const pagination = { page, size };
        if (tab === 'transfer365') {
          const r = await fetchT365Tab(filters, pagination);
          setData(r.transactions); setTotalElements(r.totalElements); setTotalPages(r.totalPages); setExtras(r.extras);
          if (r.error) setError(r.error);
        } else if (tab === 'transfer365-card') {
          const r = await fetchT365CardTab(filters, pagination);
          setData(r.transactions); setTotalElements(r.totalElements); setTotalPages(r.totalPages); setExtras(r.extras);
          if (r.error) setError(r.error);
        } else if (tab === 'cuadre') {
          const r = await fetchCuadreTab(filters);
          setBalanceData(r.rows);
          if (r.error) setError(r.error);
        } else {
          const r = await fetchCuadreCardTab(filters);
          setBalanceData(r.rows);
          if (r.error) setError(r.error);
        }
      } catch {
        setError('Error inesperado al obtener el reporte');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { data, balanceData, totalElements, totalPages, extras, isLoading, error, fetchReport };
}
