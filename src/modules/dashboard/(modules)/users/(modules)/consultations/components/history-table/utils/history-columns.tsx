'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { UserHistoryEntry } from '../../../data/mock-data';

const cellStyle = { fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#4a4a4c' };

export const historyColumns: ColumnDef<UserHistoryEntry>[] = [
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
    accessorKey: 'accion',
    header: () => <span className="tableHeaderTitle">Acción</span>,
    cell: ({ getValue }) => <span style={{ ...cellStyle, }}>{getValue() as string}</span>,
    size: 150,
  },
  {
    id: 'detalles',
    header: () => <span className="tableHeaderTitle">Detalles</span>,
    cell: ({ row }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div>
          <span style={{ fontSize: '10px', color: '#4A4A4C', fontWeight: 700 }}>Estado: {" "}</span>
          <span style={{ ...cellStyle, color: '#23366A', fontWeight: 700 }}>{row.original.estado}</span>
        </div>
        <div>
          <span style={{ fontSize: '10px', color: '#4A4A4C', fontWeight: 700 }}>Motivo: {" "}</span>
          <span style={{ ...cellStyle, color: '#23366A', fontWeight: 700 }}>{row.original.motivo}</span>
        </div>
      </div>
    ),
    size: 250,
  },
];
