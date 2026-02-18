'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { SupportHistoryEntry } from '../../../data/mock-data';

const cellStyle = { fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#4a4a4c' };

export const supportHistoryColumns: ColumnDef<SupportHistoryEntry>[] = [
  {
    accessorKey: 'fecha',
    header: () => <span className="tableHeaderTitle">Fecha</span>,
    cell: ({ getValue }) => <span style={{ ...cellStyle, color: '#BBBBBB' }}>{getValue() as string}</span>,
    size: 150,
  },
  {
    accessorKey: 'gestionadoPor',
    header: () => <span className="tableHeaderTitle">Gestionado por</span>,
    cell: ({ getValue }) => <span style={{ ...cellStyle, color: '#23366A' }}>{getValue() as string}</span>,
    size: 150,
  },
  {
    accessorKey: 'asociado',
    header: () => <span className="tableHeaderTitle">Asociado</span>,
    cell: ({ getValue }) => <span style={cellStyle}>{getValue() as string}</span>,
    size: 170,
  },
  {
    accessorKey: 'accion',
    header: () => <span className="tableHeaderTitle">Acción</span>,
    cell: ({ getValue }) => <span style={cellStyle}>{getValue() as string}</span>,
    size: 170,
  },
  {
    id: 'detalles',
    header: () => <span className="tableHeaderTitle">Detalles</span>,
    cell: ({ row }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#4A4A4C', fontWeight: 700 }}>Estado: </span>
          <span style={{ ...cellStyle, color: '#23366A', fontWeight: 700 }}>{row.original.estado}</span>
          <span style={{ fontSize: '10px', color: '#8e8e93', fontWeight: 400 }}> (Ant: {row.original.estadoPrevio})</span>
        </div>
        <div>
          <span style={{ fontSize: '10px', color: '#4A4A4C', fontWeight: 700 }}>Motivo: </span>
          <span style={{ ...cellStyle, color: '#23366A', fontWeight: 700 }}>{row.original.motivo}</span>
        </div>
      </div>
    ),
    size: 300,
  },
];
