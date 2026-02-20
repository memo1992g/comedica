import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { ServiceTransaction, ServicesTab } from '../types/service-types';
import {
  serviciosColumns,
  eventosColumns,
  segurosColumns,
  ministerioColumns,
} from '../utils/columns';

interface UseServicesDataOptions {
  activeTab: ServicesTab;
  data: ServiceTransaction[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export function useServicesData({
  activeTab,
  data,
  currentPage,
  itemsPerPage,
  totalPages,
}: UseServicesDataOptions) {
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

  const { table } = useCustomTable({
    data: data as any[],
    columns,
    manualPagination: true,
    pageCount: totalPages,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  return { table, columns };
}
