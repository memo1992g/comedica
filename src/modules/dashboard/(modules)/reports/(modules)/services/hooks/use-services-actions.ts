import { useState, useCallback } from 'react';
import type {
  ServicioTransaction,
  EventoTransaction,
  SeguroTransaction,
  MinisterioTransaction,
  ServicesTab,
  ServiceTransaction,
} from '../types/service-types';
import type {
  ServicesReportItem,
  EventsReportItem,
  InsuranceReportItem,
  MhReportItem,
} from '@/interfaces/reports';
import type {
  ActionResult,
  BackofficeApiPaginatedData,
} from '@/interfaces/ApiResponse.interface';
import {
  servicesReportAction,
  eventsReportAction,
  insuranceReportAction,
  mhReportAction,
} from '@/actions/reports';

export interface ServiceFilters {
  fechaDesde?: string;
  fechaHasta?: string;
  nombreCliente?: string;
  nombre?: string;
  poliza?: string;
  cuentaOrigen?: string;
}

export interface ServicesExtras {
  totalTransacciones: number;
  montoTotal: number;
}

function buildExtras(
  extras: Record<string, number | null> | undefined,
  totalElements: number,
  computedAmount: number,
): ServicesExtras {
  return {
    totalTransacciones:
      (extras?.totalTransacciones as number | null) ?? totalElements,
    montoTotal:
      (extras?.montoTotal as number | null) ?? computedAmount,
  };
}

function mapServiciosData(items: ServicesReportItem[]): ServicioTransaction[] {
  return items.map((item) => ({
    fecha: item.fechaTransaccion,
    numeroAsociado: item.idCliente,
    nombre: item.nombreCliente,
    monto: item.montoTransaccion,
    colector: item.colector,
    referencia: item.documentoReferencia,
  }));
}

function mapEventosData(items: EventsReportItem[]): EventoTransaction[] {
  return items.map((item) => ({
    fecha: item.fecha,
    numeroAsociado: item.numeroAsociado,
    monto: item.monto,
    codEvento: item.codigoEvento,
    nombreEvento: item.nombreEvento,
    nombreParticipante: item.nombreParticipante,
  }));
}

function mapSegurosData(items: InsuranceReportItem[]): SeguroTransaction[] {
  return items.map((item) => ({
    fecha: item.fecha,
    numeroAsociado: item.numeroAsociado,
    monto: item.valorPagado,
    nombre: item.nombre,
    cuentaOrigen: item.cuentaOrigen,
    tipoCuenta: item.tipoCuenta,
    valorPagado: item.valorPagado,
    tipoPoliza: item.tipoPoliza,
    poliza: item.poliza,
    referencia: item.referencia,
  }));
}

function mapMinisterioData(items: MhReportItem[]): MinisterioTransaction[] {
  return items.map((item) => ({
    fecha: item.fecha,
    numeroAsociado: item.asociado,
    monto: item.monto,
    nombre: item.nombre,
    cuentaOrigen: item.cuentaOrigen,
    tipoCuenta: item.tipoCuenta,
    mandamientoNpe: item.numeroMandamiento,
    referencia: item.referencia,
    canal: item.canal,
  }));
}

type TabAction = (
  filters: Record<string, unknown>,
  pagination: { page: number; size: number },
) => Promise<ActionResult<BackofficeApiPaginatedData<unknown>>>;

type TabMapper = (items: unknown[]) => ServiceTransaction[];

interface TabConfig {
  action: TabAction;
  mapper: TabMapper;
  buildFilters: (f: ServiceFilters) => Record<string, unknown>;
}

const tabConfigs: Record<ServicesTab, TabConfig> = {
  servicios: {
    action: servicesReportAction as TabAction,
    mapper: (items) => mapServiciosData(items as ServicesReportItem[]),
    buildFilters: (f) => ({
      fechaDesde: f.fechaDesde,
      fechaHasta: f.fechaHasta,
      nombreCliente: f.nombreCliente,
    }),
  },
  eventos: {
    action: eventsReportAction as TabAction,
    mapper: (items) => mapEventosData(items as EventsReportItem[]),
    buildFilters: (f) => ({
      fechaDesde: f.fechaDesde,
      fechaHasta: f.fechaHasta,
      nombre: f.nombre,
    }),
  },
  seguros_comedica: {
    action: insuranceReportAction as TabAction,
    mapper: (items) => mapSegurosData(items as InsuranceReportItem[]),
    buildFilters: (f) => ({
      fechaDesde: f.fechaDesde,
      fechaHasta: f.fechaHasta,
      poliza: f.poliza,
    }),
  },
  ministerio_hacienda: {
    action: mhReportAction as TabAction,
    mapper: (items) => mapMinisterioData(items as MhReportItem[]),
    buildFilters: (f) => ({
      fechaDesde: f.fechaDesde,
      fechaHasta: f.fechaHasta,
      cuentaOrigen: f.cuentaOrigen,
    }),
  },
};

export function useServicesActions() {
  const [data, setData] = useState<ServiceTransaction[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [extras, setExtras] = useState<ServicesExtras | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (tab: ServicesTab, filters: ServiceFilters = {}, page = 0, size = 10) => {
      setIsLoading(true);
      setError(null);
      setData([]);
      setTotalElements(0);
      setTotalPages(0);
      setExtras(null);

      try {
        const config = tabConfigs[tab];
        const res = await config.action(config.buildFilters(filters), { page, size });

        if (res && !res.errors && res.data) {
          const mapped = config.mapper(res.data.data);
          const computedAmount = mapped.reduce((s, i) => s + i.monto, 0);

          setData(mapped);
          setTotalElements(res.data.totalElements);
          setTotalPages(res.data.totalPages);
          setExtras(buildExtras(res.data.extras, res.data.totalElements, computedAmount));
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

  return { data, totalElements, totalPages, extras, isLoading, error, fetchReport };
}
