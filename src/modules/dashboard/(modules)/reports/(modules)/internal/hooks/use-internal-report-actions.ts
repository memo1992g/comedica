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
import type {
  ActionResult,
  BackofficeApiPaginatedData,
} from '@/interfaces/ApiResponse.interface';
import { buildSummaryRows, getEmptySummaryRows } from '../utils/build-summary-rows';
import type { SummaryRow } from '../components/ReportsSummaryTable/ReportsSummaryTable';

type ReportTab = 'abonos' | 'cargos' | 'pagos' | 'creditos' | 'consolidado' | 'resumen';

export interface DateFilters {
  fechaDesde?: string;
  fechaHasta?: string;
  associateNumber?: string;
  debitCustomerId?: string;
  customerToCharge?: string;
}

interface ReportSummary {
  totalTransactions: number;
  totalAmount: number;
}

interface ReportPagination {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

type FetchableReportTab = Exclude<ReportTab, 'resumen'>;
type GenericReportPayload = BackofficeApiPaginatedData<unknown>;
type ReportAction = (
  filters: DateFilters,
  pagination: { page: number; size: number },
) => Promise<ActionResult<GenericReportPayload>>;
type ReportMapper = (items: unknown[]) => TransactionData[];

const initialSummary: ReportSummary = {
  totalTransactions: 0,
  totalAmount: 0,
};

const initialPagination: ReportPagination = {
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 100,
};

const reportActions: Record<FetchableReportTab, ReportAction> = {
  abonos: paymentAccountReportAction as ReportAction,
  cargos: debitReportAction as ReportAction,
  pagos: tcReportAction as ReportAction,
  creditos: creditReportAction as ReportAction,
  consolidado: consolidatedReportAction as ReportAction,
};

const reportMappers: Record<FetchableReportTab, ReportMapper> = {
  abonos: (items) => mapPaymentAccountItems(items as never[]),
  cargos: (items) => mapDebitItems(items as never[]),
  pagos: (items) => mapTcItems(items as never[]),
  creditos: (items) => mapCreditItems(items as never[]),
  consolidado: (items) => mapConsolidatedItems(items as never[]),
};

export function useInternalReportActions() {
  const [data, setData] = useState<TransactionData[]>([]);
  const [summary, setSummary] = useState<ReportSummary>(initialSummary);
  const [summaryRows, setSummaryRows] = useState<SummaryRow[]>(getEmptySummaryRows());
  const [pagination, setPagination] = useState<ReportPagination>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setData([]);
    setSummary(initialSummary);
    setSummaryRows(getEmptySummaryRows());
    setPagination(initialPagination);
  }, []);

  const setActionError = useCallback(
    (message = 'Error al obtener el reporte') => {
      resetState();
      setError(message);
    },
    [resetState],
  );

  const applyServerMetadata = useCallback(
    (payload: BackofficeApiPaginatedData<unknown>, mapped: TransactionData[]) => {
      const totalElements = Number(payload.totalElements ?? mapped.length);
      const totalPages = Number(payload.totalPages ?? 0);
      const currentPage = Number(payload.currentPage ?? 1);
      const pageSize = Number(payload.pageSize ?? initialPagination.pageSize);
      const totalFromExtras = Number(payload.extras?.totalTransacciones);
      const totalTransactions =
        Number.isFinite(totalFromExtras) && !Number.isNaN(totalFromExtras)
          ? totalFromExtras
          : totalElements;
      const amountFromExtras = payload.extras?.montoTotal;
      const computedAmount = mapped.reduce((sum, item) => sum + item.amount, 0);
      const totalAmount =
        typeof amountFromExtras === 'number' && !Number.isNaN(amountFromExtras)
          ? amountFromExtras
          : computedAmount;

      setPagination({
        totalElements,
        totalPages,
        currentPage,
        pageSize,
      });

      setSummary({
        totalTransactions,
        totalAmount,
      });
    },
    [],
  );

  const fetchResumenReport = useCallback(
    async (filters: DateFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await consolidatedReportAction(filters, {
          page: 0,
          size: 10000000,
        });

        if (!res || res.errors || !res.data) {
          setActionError(res?.errorMessage || 'Error al obtener el reporte');

          return;
        }

        const payload = res.data;
        const items = Array.isArray(payload.data) ? payload.data : [];

        setData([]);
        setSummary(initialSummary);
        setPagination(initialPagination);
        setSummaryRows(buildSummaryRows(items));
      } catch {
        setActionError('Error inesperado al obtener el reporte');
      } finally {
        setIsLoading(false);
      }
    },
    [setActionError],
  );

  const fetchReport = useCallback(
    async (tab: ReportTab, filters: DateFilters = {}, page = 1, size = 100) => {
      if (tab === 'resumen') {
        await fetchResumenReport(filters);

        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const isClientPaginated = tab === 'pagos';
        const requestPagination = isClientPaginated
          ? { page: 0, size: 10000 }
          : { page: Math.max(page - 1, 0), size };
        const action = reportActions[tab];
        const mapper = reportMappers[tab];

        if (!action || !mapper) {
          setActionError();
          return;
        }

        const res = await action(filters, requestPagination);

        if (!res || res.errors || !res.data) {
          setActionError(res?.errorMessage || 'Error al obtener el reporte');
          return;
        }

        const raw = res.data;
        const items = Array.isArray(raw.data) ? raw.data : [];
        const rawIsArray = Array.isArray(raw);
        const dataToMap = rawIsArray ? raw : items;
        const mapped = mapper(dataToMap as unknown[]);
        setData(mapped);

        const normalizedPayload: GenericReportPayload = rawIsArray
          ? {
              data: raw as unknown[],
              totalElements: raw.length,
              totalPages: 1,
              currentPage: 1,
              pageSize: size,
              extras: {},
            }
          : raw;
        applyServerMetadata(normalizedPayload, mapped);
      } catch {
        setActionError('Error inesperado al obtener el reporte');
      } finally {
        setIsLoading(false);
      }
    },
    [applyServerMetadata, fetchResumenReport, setActionError],
  );

  return { data, summary, summaryRows, pagination, isLoading, error, fetchReport };
}
