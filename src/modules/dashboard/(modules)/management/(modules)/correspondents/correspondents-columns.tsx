import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { CorrespondentI } from '@/interfaces/management/correspondents';

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

const h = (label: string) => {
  const Header = () => <span className="tableHeaderTitle">{label}</span>;
  Header.displayName = `Header_${label}`;
  return Header;
};

export const correspondentsColumns: ColumnDef<CorrespondentI>[] = [
  {
    accessorKey: 'codeSsf',
    header: h('Código SSF'),
    cell: ({ getValue }) => blueCell(getValue()),
    size: 110,
  },
  {
    accessorKey: 'internalCode',
    header: h('Código Interno'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 120,
  },
  {
    accessorKey: 'name',
    header: h('Nombre'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 240,
  },
  {
    accessorKey: 'comercialName',
    header: h('Nombre Comercial'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 180,
  },
  {
    accessorKey: 'status',
    header: h('Estado'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 80,
  },
  {
    accessorKey: 'nit',
    header: h('NIT'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 150,
  },
  {
    accessorKey: 'assignmentDate',
    header: h('Fecha Contratación'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 160,
  },
  {
    accessorKey: 'terminationDate',
    header: h('Fecha Terminación'),
    cell: ({ getValue }) => textCell(getValue() ?? '—'),
    size: 150,
  },
  {
    accessorKey: 'terminationFlow',
    header: h('Causa Terminación'),
    cell: ({ getValue }) => textCell(getValue() ?? '—'),
    size: 160,
  },
  {
    accessorKey: 'municipality',
    header: h('Municipio'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 130,
  },
  {
    accessorKey: 'department',
    header: h('Departamento'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 130,
  },
  {
    accessorKey: 'address',
    header: h('Dirección'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 250,
  },
  {
    accessorKey: 'schedule',
    header: h('Horario'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 220,
  },
  {
    accessorKey: 'districtCodePx',
    header: h('Código Distrito PX'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 150,
  },
  {
    accessorKey: 'districtCodeOr',
    header: h('Código Distrito OR'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 150,
  },
  {
    accessorKey: 'creationUser',
    header: h('Usuario Creación'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 140,
  },
  {
    accessorKey: 'creationDate',
    header: h('Fecha Creación'),
    cell: ({ getValue }) => textCell(getValue()),
    size: 150,
  },
  {
    accessorKey: 'modifyUser',
    header: h('Usuario Modif.'),
    cell: ({ getValue }) => textCell(getValue() ?? '—'),
    size: 130,
  },
  {
    accessorKey: 'modifyDate',
    header: h('Fecha Modif.'),
    cell: ({ getValue }) => textCell(getValue() ?? '—'),
    size: 130,
  },
];
