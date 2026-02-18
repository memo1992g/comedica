'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { NotificationHistoryEntry } from '../../../data/mock-data';

const cellStyle = { fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#4a4a4c' };

export const notificationHistoryColumns: ColumnDef<NotificationHistoryEntry>[] = [
  {
    accessorKey: 'fecha',
    header: () => <span className="tableHeaderTitle">Fecha</span>,
    cell: ({ getValue }) => <span style={{ ...cellStyle, color: '#BBBBBB' }}>{getValue() as string}</span>,
    size: 180,
  },
  {
    accessorKey: 'usuarioAdmin',
    header: () => <span className="tableHeaderTitle">Usuario Administrador</span>,
    cell: ({ getValue }) => <span style={{ ...cellStyle, color: '#23366A' }}>{getValue() as string}</span>,
    size: 180,
  },
  {
    accessorKey: 'modalidades',
    header: () => <span className="tableHeaderTitle">Modalidades</span>,
    cell: ({ getValue }) => <span style={cellStyle}>{getValue() as string}</span>,
    size: 200,
  },
  {
    accessorKey: 'destinatarios',
    header: () => <span className="tableHeaderTitle">Destinatarios</span>,
    cell: ({ getValue }) => <span style={cellStyle}>{getValue() as string}</span>,
    size: 200,
  },
];
