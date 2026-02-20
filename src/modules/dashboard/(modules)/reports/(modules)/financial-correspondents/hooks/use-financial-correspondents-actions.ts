import { useState, useCallback } from 'react';
import type { FinancialCorrespondentsReportItem } from '@/interfaces/reports';
import { financialCorrespondentsReportAction } from '@/actions/reports';
import { FinancialCorrespondentTransaction } from '../types/FinancialCorrespondent.type';

export interface FinancialCorrespondentsDateFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

function mapData(
  items: FinancialCorrespondentsReportItem[],
): FinancialCorrespondentTransaction[] {
  return items.map((item, index) => ({
    id: String(index),
    fecha: item.fecha,
    numeroAsociado: item.numAsociado,
    nombre: item.nombre,
    monto: item.monto,
    cuenta: item.cuenta,
    referencia: item.referencia,
    tipo: item.tipo as FinancialCorrespondentTransaction['tipo'],
  }));
}

export function useFinancialCorrespondentsActions() {
  const [data, setData] = useState<FinancialCorrespondentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (filters: FinancialCorrespondentsDateFilters = {}) => {
      setIsLoading(true);
      setError(null);
      setData([]);

      try {
        const res = await financialCorrespondentsReportAction(filters);

        if (res && !res.errors && res.data) {
          setData(mapData(res.data as FinancialCorrespondentsReportItem[]));
        } else {
          setError(res?.errorMessage || 'Error al obtener el reporte');
        }
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
