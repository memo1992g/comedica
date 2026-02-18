'use client';

import React, { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { ReportRow, reportColumns } from '../utils/report-columns';
import ManagementTableSkeleton from '@/components/common/ManagementTableSkeleton/ManagementTableSkeleton';
import styles from '../styles/management-report.module.css';
import '../styles/CustomTableOverrides.css';

interface ManagementReportProps {
  title: string;
  subtitle: string;
  xmlButtonLabel: string;
  data: ReportRow[];
  onSearch?: (month: number) => Promise<void>;
  onExportXml?: (month: number) => Promise<void>;
  isSearching?: boolean;
  isExporting?: boolean;
  error?: string | null;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function ManagementReport({
  title, subtitle, xmlButtonLabel, data,
  onSearch, onExportXml, isSearching, isExporting, error,
}: ManagementReportProps) {
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth()));
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const columns = useMemo(
    () => getCustomTableColumns({ columns: reportColumns }),
    []
  );

  const { table } = useCustomTable({
    data: hasSearched ? data : [],
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const renderContent = () => {
    if (isSearching) {
      return <ManagementTableSkeleton rows={8} columns={5} />;
    }
    if (hasSearched) {
      return (
        <div className={styles.tableContainer} data-custom-table>
          {error && (
            <div style={{ padding: '12px 16px', color: '#dc2626', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
              {error}
            </div>
          )}
          <CustomTable table={table} />
        </div>
      );
    }
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Search className={styles.emptyIconSvg} />
        </div>
        <p className={styles.emptyTitle}>No hay datos para mostrar</p>
        <p className={styles.emptyHint}>
          Seleccione un mes y presione buscar
        </p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.searchBar}>
            <div className={styles.searchBarInner}>
              <div className={styles.searchInfo}>
                <p className={styles.searchTitle}>Búsqueda de Reportes</p>
                <p className={styles.searchHint}>
                  Seleccione el mes para consultar la información existente
                </p>
              </div>
              <div className={styles.searchControls}>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className={styles.monthSelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={m} value={String(i)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Search size={16} />}
                  className={styles.searchButton}
                  disabled={isSearching}
                  isLoading={isSearching}
                  onClick={async () => {
                    if (onSearch) {
                      await onSearch(Number(selectedMonth));
                    }
                    setHasSearched(true);
                  }}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>

          {renderContent()}

          <div className={styles.cardFooter}>
            <div className={styles.xmlButtons}>
              {hasSearched && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FileText size={12} />}
                  className={styles.xmlButton}
                  disabled={isExporting}
                  isLoading={isExporting}
                  onClick={async () => {
                    if (onExportXml) {
                      await onExportXml(Number(selectedMonth));
                    }
                  }}
                >
                  {xmlButtonLabel}
                </Button>
              )}
            </div>
            {hasSearched && (
              <div className={styles.paginationInfo}>
                <span className={styles.paginationText}>
                  {startItem}-{endItem} de {totalItems}
                </span>
                <div className={styles.paginationButtons}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.pageButton}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.pageButton}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
