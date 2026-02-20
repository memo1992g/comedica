import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { ComplaintI } from '@/interfaces/management/claims';

const textCell = (value: unknown) => (
  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
    {String(value ?? '')}
  </span>
);

const blueCell = (value: unknown) => (
  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#23366a' }}>
    {String(value ?? '')}
  </span>
);

const h = (label: string) => () => <span className="tableHeaderTitle">{label}</span>;

export const claimsColumns: ColumnDef<ComplaintI>[] = [
  {
    accessorKey: 'canal',
    header: h('Canal'),
    cell: ({ getValue }) => blueCell(getValue()),
    size: 100,
  },
  {
    accessorKey: 'tipo',
    header: h('Tipo'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 150,
  },
  {
    accessorKey: 'dui',
    header: h('DUI'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 120,
  },
  {
    accessorKey: 'nombreCliente',
    header: h('Nombre Cliente'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 200,
  },
  {
    accessorKey: 'fechaPresenta',
    header: h('Fecha Presentación'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 150,
  },
  {
    accessorKey: 'descripcion',
    header: h('Descripción'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 220,
  },
  {
    accessorKey: 'monto',
    header: h('Monto'),
    cell: ({ getValue }) => (
      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' }}>
        ${(getValue() as number).toFixed(2)}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: 'estadoReclamo',
    header: h('Estado Reclamo'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 140,
  },
  {
    accessorKey: 'estadoResolucion',
    header: h('Estado Resolución'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 150,
  },
];
