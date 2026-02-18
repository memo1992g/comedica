import { useState, useCallback } from 'react';
import { TransactionData } from '../utils/columns';
import {
  mapDebitItems,
  mapCreditItems,
  mapPaymentAccountItems,
  mapConsolidatedItems,
  mapTcItems,
} from '../utils/internal-report-mappers';
import {
  debitReportAction,
  creditReportAction,
  paymentAccountReportAction,
  consolidatedReportAction,
  tcReportAction,
} from '@/actions/reports';

type ReportTab = 'abonos' | 'cargos' | 'pagos' | 'creditos' | 'consolidado' | 'resumen';

export interface DateFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

export function useInternalReportActions() {
  const [data, setData] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (tab: ReportTab, filters: DateFilters = {}, page = 0, size = 100) => {
      if (tab === 'resumen') return;
      setIsLoading(true);
      setError(null);

      try {
        const pagination = { page, size };
        let mapped: TransactionData[] = [];

        switch (tab) {
          case 'abonos': {
            const res = await paymentAccountReportAction(filters, pagination);
            if (res && !res.errors && res.data) {
              mapped = mapPaymentAccountItems(res.data.data);
            } else {
              setError(res?.errorMessage || 'Error al obtener el reporte');
              return;
            }
            break;
          }
          case 'cargos': {
            const res = await debitReportAction(filters, pagination);
            if (res && !res.errors && res.data) {
              mapped = mapDebitItems(res.data.data);
            } else {
              setError(res?.errorMessage || 'Error al obtener el reporte');
              return;
            }
            break;
          }
          case 'pagos': {
            const res = await tcReportAction(filters, pagination);
            if (res && !res.errors && res.data) {
              mapped = mapTcItems(res.data.data);
            } else {
              setError(res?.errorMessage || 'Error al obtener el reporte');
              return;
            }
            break;
          }
          case 'creditos': {
            const res = await creditReportAction(filters, pagination);
            if (res && !res.errors && res.data) {
              mapped = mapCreditItems(res.data.data);
            } else {
              setError(res?.errorMessage || 'Error al obtener el reporte');
              return;
            }
            break;
          }
          case 'consolidado': {
            const res = await consolidatedReportAction(filters, pagination);
            if (res && !res.errors && res.data) {
              mapped = mapConsolidatedItems(res.data.data);
            } else {
              setError(res?.errorMessage || 'Error al obtener el reporte');
              return;
            }
            break;
          }
        }

        setData(mapped);
      } catch {
        setError('Error inesperado al obtener el reporte');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { data, isLoading, error, fetchReport };
}
