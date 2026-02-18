import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { ServiceTransaction, ServicesTab } from '../types/service-types';
import {
  mockServiciosData,
  mockEventosData,
  mockSegurosData,
  mockMinisterioData,
  mockStatsData,
} from '../data/mock-data';
import {
  serviciosColumns,
  eventosColumns,
  segurosColumns,
  ministerioColumns,
} from '../utils/columns';

interface UseServicesDataOptions {
  activeTab: ServicesTab;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  externalData?: ServiceTransaction[];
}

interface UseServicesDataResult {
  table: any;
  totalTransactions: number;
  totalAmount: number;
  totalPages: number;
  filteredData: ServiceTransaction[];
  columns: ColumnDef<any>[];
}

export function useServicesData({
  activeTab,
  searchQuery,
  currentPage,
  itemsPerPage,
  externalData,
}: UseServicesDataOptions): UseServicesDataResult {
  // Get data and stats based on active tab
  const { rawData, stats } = useMemo(() => {
    if (externalData && externalData.length > 0) {
      const totalAmount = externalData.reduce((sum, item) => sum + item.monto, 0);
      return {
        rawData: externalData,
        stats: { totalTransactions: externalData.length, totalAmount },
      };
    }

    switch (activeTab) {
      case 'servicios':
        return {
          rawData: mockServiciosData,
          stats: mockStatsData.servicios,
        };
      case 'eventos':
        return {
          rawData: mockEventosData,
          stats: mockStatsData.eventos,
        };
      case 'seguros_comedica':
        return {
          rawData: mockSegurosData,
          stats: mockStatsData.seguros_comedica,
        };
      case 'ministerio_hacienda':
        return {
          rawData: mockMinisterioData,
          stats: mockStatsData.ministerio_hacienda,
        };
    }
    // Default to servicios
    return {
      rawData: mockServiciosData,
      stats: mockStatsData.servicios,
    };
  }, [activeTab, externalData]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rawData;

    const query = searchQuery.toLowerCase();
    return rawData.filter(item => {
      const searchableFields = Object.values(item).join(' ').toLowerCase();
      return searchableFields.includes(query);
    });
  }, [rawData, searchQuery]);

  // Get columns based on active tab
  const columns = useMemo(() => {
    let baseColumns: ColumnDef<ServiceTransaction>[];
    
    switch (activeTab) {
      case 'servicios':
        baseColumns = serviciosColumns as ColumnDef<ServiceTransaction>[];
        break;
      case 'eventos':
        baseColumns = eventosColumns as ColumnDef<ServiceTransaction>[];
        break;
      case 'seguros_comedica':
        baseColumns = segurosColumns as ColumnDef<ServiceTransaction>[];
        break;
      case 'ministerio_hacienda':
        baseColumns = ministerioColumns as ColumnDef<ServiceTransaction>[];
        break;
      default:
        baseColumns = serviciosColumns as ColumnDef<ServiceTransaction>[];
    }

    return getCustomTableColumns({
      columns: baseColumns,
      enableRowSelection: false,
      enableRowExpansion: false,
    });
  }, [activeTab]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Initialize table
  const { table } = useCustomTable({
    data: filteredData as any[],
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  return {
    table,
    totalTransactions: stats.totalTransactions,
    totalAmount: stats.totalAmount,
    totalPages,
    filteredData,
    columns,
  };
}
