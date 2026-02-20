'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import Button from '@/components/ui/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { getAuditLog } from '@/lib/api/parameters.service';
import { AuditLog } from '@/types';
import styles from './styles/SoftTokenHistory.module.css';
import './styles/CustomTableOverrides.css';

const cellStyle = { fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#4a4a4c' };

const auditColumns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'timestamp',
    header: () => <span className="tableHeaderTitle">Fecha</span>,
    cell: ({ getValue }) => {
      const d = new Date(getValue() as string);
      const date = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      return <span style={{ ...cellStyle, color: '#bbb' }}>{date} - {time}</span>;
    },
    size: 180,
  },
  {
    accessorKey: 'userName',
    header: () => <span className="tableHeaderTitle">Gestionado por</span>,
    cell: ({ getValue }) => (
      <span style={{ ...cellStyle, color: '#23366a' }}>{getValue() as string}</span>
    ),
    size: 180,
  },
  {
    accessorKey: 'action',
    header: () => <span className="tableHeaderTitle">Acción</span>,
    cell: ({ getValue }) => <span style={cellStyle}>{getValue() as string}</span>,
    size: 200,
  },
  {
    id: 'detalles',
    header: () => <span className="tableHeaderTitle">Detalles</span>,
    cell: ({ row }) => {
      const log = row.original;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={cellStyle}>{log.details}</span>
          {log.changes && log.changes.length > 0 && log.changes.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#bbb' }}>{c.field}:</span>
              <span style={{ fontSize: '10px', color: '#4a4a4c', opacity: 0.6, textDecoration: 'line-through' }}>
                {c.oldValue}
              </span>
              <span style={{ fontSize: '10px', color: '#4a4a4c' }}>{c.newValue}</span>
            </div>
          ))}
        </div>
      );
    },
    size: 300,
  },
];

export default function SoftTokenHistory() {
  const router = useRouter();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    loadAuditLogs();
  }, [currentPage]);

  const loadAuditLogs = async () => {
    try {
      const response = await getAuditLog({
        search,
        page: currentPage,
        pageSize: itemsPerPage,
        module: 'Solicitud de Soft Token',
      });
      setAuditLogs(response.data);
      setTotalLogs(response.total);
    } catch (error) {
      console.error('Error al cargar auditoría:', error);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return auditLogs;
    const q = search.toLowerCase();
    return auditLogs.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.details.toLowerCase().includes(q),
    );
  }, [auditLogs, search]);

  const totalItems = search ? filtered.length : totalLogs;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const columns = useMemo(() => getCustomTableColumns({ columns: auditColumns }), []);

  const { table } = useCustomTable({
    data: filtered,
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.historyHeader}>
          <div className={styles.headerLeft}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => router.push('/dashboard/parametros/solicitud-soft-token')}
              className={styles.backButton}
            />
          </div>
          <div className={styles.headerCenter}>
            <h2 className={styles.historyTitle}>Historial completo de auditoría</h2>
            <p className={styles.historySubtitle}>{totalItems} resultados</p>
          </div>
        </div>

        <div className={styles.tableSection} data-softtoken-table>
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
                placeholder="Buscar"
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
    </div>
  );
}
