import { useState, useCallback } from 'react';
import type { RecurringReport, ExecutedReport, RecurringTab } from '../types';
import type { RecurringReportItem, RecurringReportResponseI } from '@/interfaces/reports';
import {
  recurringReportAction,
  recurringExReportAction,
} from '@/actions/reports';

export interface DateFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

function mapToRecurringReport(items: RecurringReportItem[]): RecurringReport[] {
  return items.map((item, i) => ({
    id: `rec-${i}-${item.numeroSolicitud}`,
    tipo: item.tipo,
    solicitud: item.numeroSolicitud,
    fechaCreacion: item.fechaCreacion,
    ultimaMod: item.fechaModificacion ?? '',
    numeroAsociado: item.numeroAsociado,
    refCargo: item.refCargo,
    refAbono: item.refAbono,
    tipoBeneficiario: item.tipoBeneficiario,
    beneficiario: item.beneficiario,
    valor: item.valor,
    bancoDestino: item.bancoDestino,
    fechaInicio: item.fechaInicio,
    frecuencia: item.frecuencia,
    estado: mapEstado(item.estado),
    finalizado: item.finalizado?.toUpperCase() === 'SI',
    canal: item.canal ?? '',
    oficina: item.oficina ?? '',
  }));
}

function mapToExecutedReport(items: RecurringReportItem[]): ExecutedReport[] {
  return items.map((item, i) => ({
    id: `exec-${i}-${item.numeroSolicitud}`,
    fechaCreacion: item.fechaCreacion,
    tipo: item.tipo,
    numeroAsociado: item.numeroAsociado,
    refCargo: item.refCargo,
    refAbono: item.refAbono,
    valor: item.valor,
    bancoDestino: item.bancoDestino,
    fechaHoraOp: item.fechaCreacion,
    horaOp: item.fechaCreacion?.split(' ')[1] ?? '',
    fechaEjecucion: item.fechaInicio,
    estadoEjecucion: mapEstadoEjecucion(item.estado),
    mensajeError: null,
    fechaProcesado: item.fechaModificacion,
    fechaRechazo: null,
    mensajeRechazo: null,
  }));
}

function mapEstado(estado: string): 'Activo' | 'Inactivo' | 'Pendiente' {
  const normalized = estado?.toUpperCase();
  if (normalized === 'ACTIVO') return 'Activo';
  if (normalized === 'INACTIVO') return 'Inactivo';
  return 'Pendiente';
}

function mapEstadoEjecucion(
  estado: string,
): 'Procesado' | 'Rechazado' | 'Fallido' | 'Cancelado' {
  const normalized = estado?.toUpperCase();
  if (normalized === 'ACTIVO' || normalized === 'PROCESADO') return 'Procesado';
  if (normalized === 'RECHAZADO') return 'Rechazado';
  if (normalized === 'CANCELADO' || normalized === 'INACTIVO') return 'Cancelado';
  return 'Fallido';
}

function extractItems<T>(data: T[] | { data?: T[]; listado?: T[] } | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const obj = data as { data?: T[]; listado?: T[] };
  return obj.listado ?? obj.data ?? [];
}

async function fetchRecurringTab(
  filters: DateFilters,
  pagination: { page: number; size: number },
): Promise<{ items: RecurringReportItem[]; error?: string }> {
  const res = await recurringReportAction(filters, pagination);
  if (res && !res.errors && res.data) {
    return { items: extractItems(res.data as RecurringReportResponseI | RecurringReportItem[]) };
  }
  return { items: [], error: res?.errorMessage || 'Error al obtener reporte de recurrentes' };
}

async function fetchExecutedTab(
  filters: DateFilters,
  pagination: { page: number; size: number },
): Promise<{ items: RecurringReportItem[]; error?: string }> {
  const res = await recurringExReportAction(filters, pagination);
  if (res && !res.errors && res.data) {
    return { items: extractItems(res.data as RecurringReportResponseI | RecurringReportItem[]) };
  }
  return { items: [], error: res?.errorMessage || 'Error al obtener reporte de ejecutadas' };
}

export function useRecurringActions() {
  const [recurringData, setRecurringData] = useState<RecurringReport[]>([]);
  const [executedData, setExecutedData] = useState<ExecutedReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRecurringFetched, setHasRecurringFetched] = useState(false);
  const [hasExecutedFetched, setHasExecutedFetched] = useState(false);

  const fetchReport = useCallback(
    async (tab: RecurringTab, filters: DateFilters = {}, page = 0, size = 1000) => {
      setIsLoading(true);
      setError(null);

      try {
        const pagination = { page, size };

        if (tab === 'recurrentes') {
          const { items, error: err } = await fetchRecurringTab(filters, pagination);
          setRecurringData(mapToRecurringReport(items));
          if (err) setError(err);
          setHasRecurringFetched(true);
        } else {
          const { items, error: err } = await fetchExecutedTab(filters, pagination);
          setExecutedData(mapToExecutedReport(items));
          if (err) setError(err);
          setHasExecutedFetched(true);
        }
      } catch {
        setError('Error inesperado al obtener el reporte');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { recurringData, executedData, isLoading, error, fetchReport, hasRecurringFetched, hasExecutedFetched };
}
