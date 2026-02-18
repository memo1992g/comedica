import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { supportHistoryColumns } from './utils/history-columns';
import type { SupportHistoryEntry } from '../../data/mock-data';
import styles from './styles/history-table.module.css';
import '../../styles/CustomTableOverrides.css';

interface HistoryTableProps {
  data: SupportHistoryEntry[];
  onBack: () => void;
}

export default function HistoryTable({ data, onBack }: HistoryTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filtered = useMemo(() => data.filter(
    (row) =>
      row.accion.toLowerCase().includes(search.toLowerCase()) ||
      row.gestionadoPor.toLowerCase().includes(search.toLowerCase()) ||
      row.asociado.toLowerCase().includes(search.toLowerCase()) ||
      row.motivo.toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const columns = useMemo(
    () => getCustomTableColumns({ columns: supportHistoryColumns }),
    []
  );

  const { table } = useCustomTable({
    data: filtered,
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={onBack}
            className={styles.backButton}
          />
        </div>
        <div className={styles.headerCenter}>
          <h2 className={styles.historyTitle}>Historial de Gestión de Estados</h2>
          <p className={styles.historySubtitle}>
            {totalItems} registros encontrados
          </p>
        </div>
        <div className={styles.headerRight} />
      </div>

      <div className={styles.tableSection} data-support-table>
        <CustomTable
          table={table}
          enableColumnReordering={false}
          enableRowExpansion={false}
          stickyHeader={false}
          showScrollIndicators={false}
        />
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.leftSection}>
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar en historial"
              className={styles.searchInput}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.pageInfo}>
            <span className={styles.pageLabel}>Página</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}
            >
              <SelectTrigger className={styles.pageSizeTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={styles.itemsInfo}>
            {startItem}-{endItem} de {totalItems}
          </div>

          <div className={styles.navButtons}>
            <button
              className={styles.navButton}
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className={styles.navButton}
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
