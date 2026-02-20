'use client';

import { ColumnDef } from '@tanstack/react-table';

export interface ReportRow {
  code: string;
  numTransTC: number;
  valTransTC: number;
  numTransCA: number;
  valTransCA: number;
  numTransPR?: number;
  valTransPR?: number;
  fechaPresenta?: string;
}

export const reportColumns: ColumnDef<ReportRow>[] = [
  {
    accessorKey: 'code',
    header: () => <span className="tableHeaderTitle">WTPX_CODIGO_SSF</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#23366a' }}>
        {getValue() as string}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'numTransTC',
    header: () => <span className="tableHeaderTitle">WTPX_NUM_TRANS_TC</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        {getValue() as number}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'valTransTC',
    header: () => <span className="tableHeaderTitle">WTPX_VAL_TRANS_TC</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        ${(getValue() as number).toFixed(2)}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'numTransCA',
    header: () => <span className="tableHeaderTitle">WTPX_NUM_TRANS_CA</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        {getValue() as number}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'valTransCA',
    header: () => <span className="tableHeaderTitle">WTPX_VAL_TRANS_CA</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        ${(getValue() as number).toFixed(2)}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'numTransPR',
    header: () => <span className="tableHeaderTitle">WTPX_NUM_TRANS_PR</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        {(getValue() as number | undefined) ?? 0}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'valTransPR',
    header: () => <span className="tableHeaderTitle">WTPX_VAL_TRANS_PR</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        ${((getValue() as number | undefined) ?? 0).toFixed(2)}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'fechaPresenta',
    header: () => <span className="tableHeaderTitle">WTPX_FECHA_PRESENTA</span>,
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        {(getValue() as string | undefined) ?? ''}
      </span>
    ),
    size: 160,
  },
];
