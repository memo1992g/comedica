"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CustomDatePicker } from "@/components/common/CustomDatePicker/CustomDatePicker";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import { useCustomTable } from "@/components/common/CustomTable/hooks/use-custom-table";
import { getCustomTableColumns } from "@/components/common/CustomTable/utils/get-custom-table-columns";
import { getAuditChangesAction } from "@/actions/audit";
import type {
  AuditHistoryRowI,
  AuditClassificationCode,
} from "@/interfaces/audit";
import { auditColumns } from "./utils/audit-columns";
import styles from "./AuditHistoryTable.module.css";
import "./CustomTableOverrides.css";

interface DateRangeFilter {
  from: Date | null;
  to: Date | null;
}

interface AuditHistoryTableProps {
  classificationCode: AuditClassificationCode;
  title?: string;
  onBack: () => void;
}

function formatDateParam(date: Date, end?: boolean): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T${end ? "23:59:59" : "00:00:00"}`;
}

export default function AuditHistoryTable({
  classificationCode,
  title = "Historial completo de auditoría",
  onBack,
}: Readonly<AuditHistoryTableProps>) {
  const [rows, setRows] = useState<AuditHistoryRowI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalRows, setTotalRows] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    from: null,
    to: null,
  });

  const dateFromTs = dateRange.from?.getTime() ?? null;
  const dateToTs = dateRange.to?.getTime() ?? null;

  const loadData = useCallback(async () => {
    try {
      const response = await getAuditChangesAction({
        classificationCode,
        page: currentPage,
        size: itemsPerPage,
        sortBy: "createdAt",
        sortDirection: "DESC",
        createdAtFrom: dateFromTs
          ? formatDateParam(new Date(dateFromTs))
          : undefined,
        createdAtTo: dateToTs
          ? formatDateParam(new Date(dateToTs), true)
          : undefined,
      });

      if (response.data) {
        setRows(response.data.data);
        setTotalRows(response.data.total);
      }
    } catch (error) {
      console.error("Error al cargar auditoría:", error);
    }
  }, [classificationCode, currentPage, itemsPerPage, dateFromTs, dateToTs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalItems = totalRows;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const columns = useMemo(
    () => getCustomTableColumns({ columns: auditColumns }),
    [],
  );

  const { table } = useCustomTable({
    data: rows,
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: itemsPerPage,
  });

  const handleDateRangeChange = (range: DateRangeFilter) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <div className={styles.headerLeft}>
          <Button
            variant='ghost'
            size='sm'
            leftIcon={<ArrowLeft size={16} />}
            onClick={onBack}
            className={styles.backButton}
          />
        </div>
        <div className={styles.headerCenter}>
          <h2 className={styles.historyTitle}>{title}</h2>
          <p className={styles.historySubtitle}>{totalItems} resultados</p>
        </div>
        <div className={styles.headerRight} />
      </div>

      <div
        className={styles.tableSection}
        data-audit-table
        {...(rows.length ? {} : { "data-audit-table-empty": true })}
      >
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
          <div className={styles.dateRangeContainer}>
            <CustomDatePicker
              className={styles.dateRangeButton}
              selectionMode='range'
              disableFutureDates
              rangeValue={{
                from: dateRange.from ?? undefined,
                to: dateRange.to ?? undefined,
              }}
              onRangeChange={(range) =>
                handleDateRangeChange({
                  from: range?.from ?? null,
                  to: range?.to ?? null,
                })
              }
            />
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.pageInfo}>
            <span className={styles.pageLabel}>Items por página</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => {
                setItemsPerPage(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className={styles.pageSizeTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={styles.itemsInfo}>
            {totalItems === 0 ? 0 : startItem}-{endItem} de {totalItems}
          </div>

          <div className={styles.navButtons}>
            <button
              className={styles.navButton}
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage <= 1}
              type='button'
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className={styles.navButton}
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
              type='button'
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
