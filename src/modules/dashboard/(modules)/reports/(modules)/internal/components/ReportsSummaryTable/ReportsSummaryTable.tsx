'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import styles from './styles/ReportsSummaryTable.module.css';

export interface SummaryRow {
  canal: string;
  abonosAmount: number;
  abonosCount: number;
  cargosAmount: number;
  cargosCount: number;
  creditosTotalAmount: number;
  creditosTotalCount: number;
  tcCanalAmount: number;
  tcCanalCount: number;
  isTotal?: boolean;
}

interface ReportsSummaryTableProps {
  data: SummaryRow[];
}

export default function ReportsSummaryTable({ data }: ReportsSummaryTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRowTop}>
            <th className={styles.headerCellCanal} rowSpan={2}>
              Canal
            </th>
            <th className={styles.headerCellGroup} colSpan={4}>
              TRANSFERENCIAS
            </th>
            <th className={styles.headerCellGroup} colSpan={2}>
              CRÉDITOS
            </th>
            <th className={styles.headerCellGroup} colSpan={2}>
              TC
            </th>
          </tr>
          <tr className={styles.headerRowBottom}>
            <th className={styles.headerCellSubgroup} colSpan={2}>
              ABONOS
            </th>
            <th className={styles.headerCellSubgroup} colSpan={2}>
              CARGOS
            </th>
            <th className={styles.headerCellSubgroup} colSpan={2}>
              TOTAL
            </th>
            <th className={styles.headerCellSubgroup} colSpan={2}>
              CANAL
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const rowClass = row.isTotal
              ? styles.totalRow
              : index % 2 === 0
              ? styles.oddRow
              : styles.evenRow;

            return (
              <tr key={row.canal} className={rowClass}>
                <td className={styles.cellCanal}>{row.canal}</td>
                <td className={styles.cellAmount}>
                  {formatCurrency(row.abonosAmount)}
                </td>
                <td className={styles.cellCountDanger}>{row.abonosCount}</td>
                <td className={styles.cellAmount}>
                  {formatCurrency(row.cargosAmount)}
                </td>
                <td className={styles.cellCountDanger}>{row.cargosCount}</td>
                <td className={styles.cellAmount}>
                  {formatCurrency(row.creditosTotalAmount)}
                </td>
                <td className={styles.cellCountPrimary}>
                  {row.creditosTotalCount}
                </td>
                <td className={styles.cellAmount}>
                  {formatCurrency(row.tcCanalAmount)}
                </td>
                <td className={styles.cellCountPrimary}>{row.tcCanalCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
