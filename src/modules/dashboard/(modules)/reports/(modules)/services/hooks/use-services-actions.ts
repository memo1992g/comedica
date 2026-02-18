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
import {
  servicesReportAction,
  eventsReportAction,
  insuranceReportAction,
  mhReportAction,
} from '@/actions/reports';

export interface DateFilters {
  fechaDesde?: string;
  fechaHasta?: string;
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
    numeroAsociadoParticipante: '',
  }));
}

function mapSegurosData(items: InsuranceReportItem[]): SeguroTransaction[] {
  return items.map((item) => ({
    fecha: item.fecha,
    numeroAsociado: item.numeroAsociado,
    asegurado: '',
    monto: item.monto,
    numeroPoliza: item.poliza,
    tipoSeguro: '',
  }));
}

function mapMinisterioData(items: MhReportItem[]): MinisterioTransaction[] {
  return items.map((item) => ({
    fecha: item.fecha,
    numeroAsociado: item.asociado,
    monto: item.monto,
    nitDui: '',
    mandamientoNpe: item.numeroMandamiento,
    tipoImpuesto: '',
  }));
}

export function useServicesActions() {
  const [data, setData] = useState<ServiceTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (tab: ServicesTab, filters: DateFilters = {}, page = 0, size = 100) => {
      setIsLoading(true);
      setError(null);

      try {
        let result;
        const pagination = { page, size };

        switch (tab) {
          case 'servicios':
            result = await servicesReportAction(filters, pagination);
            if (result && !result.errors && result.data) {
              setData(mapServiciosData(result.data.data));
            }
            break;
          case 'eventos':
            result = await eventsReportAction(filters, pagination);
            if (result && !result.errors && result.data) {
              setData(mapEventosData(result.data.data));
            }
            break;
          case 'seguros_comedica':
            result = await insuranceReportAction(filters, pagination);
            if (result && !result.errors && result.data) {
              setData(mapSegurosData(result.data.data));
            }
            break;
          case 'ministerio_hacienda':
            result = await mhReportAction(filters, pagination);
            if (result && !result.errors && result.data) {
              setData(mapMinisterioData(result.data.data));
            }
            break;
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

  return { data, isLoading, error, fetchReport };
}
