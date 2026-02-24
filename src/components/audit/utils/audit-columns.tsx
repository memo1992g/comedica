'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { AuditHistoryRowI } from '@/interfaces/audit';
import { formatAuditDateTime, parseAuditDetails } from '@/lib/utils/audit-history';

const cellStyle = { fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#4a4a4c' };

export const auditColumns: ColumnDef<AuditHistoryRowI>[] = [
  {
    accessorKey: 'createdAt',
    header: () => <span className="tableHeaderTitle">Fecha</span>,
    cell: ({ getValue }) => (
      <span style={{ ...cellStyle, color: '#BBBBBB' }}>
        {formatAuditDateTime(getValue() as string)}
      </span>
    ),
    size: 150,
  },
  {
    accessorKey: 'gestionadoPor',
    header: () => <span className="tableHeaderTitle">Gestionado por</span>,
    cell: ({ getValue }) => (
      <span style={{ ...cellStyle, color: '#23366A' }}>{getValue() as string}</span>
    ),
    size: 150,
  },
  {
    accessorKey: 'usuario',
    header: () => <span className="tableHeaderTitle">Usuario</span>,
    cell: ({ getValue }) => <span style={cellStyle}>{getValue() as string}</span>,
    size: 140,
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
    cell: ({ row }) => {
      const lines = parseAuditDetails(row.original.detalles);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {lines.map((line) => (
            <div
              key={`${line.label}-${line.oldValue ?? ''}-${line.newValue ?? ''}-${line.value ?? ''}`}
            >
              <span style={{ fontSize: '10px', color: '#4A4A4C', fontWeight: 700 }}>
                {line.label}:{' '}
              </span>
              {line.oldValue !== undefined || line.newValue !== undefined ? (
                <>
                  <span style={{ ...cellStyle, opacity: 0.6, textDecoration: 'line-through' }}>
                    {line.oldValue}
                  </span>
                  <span style={{ margin: '0 4px', fontSize: '10px', color: '#8ba7ff' }}>→</span>
                  <span style={{ ...cellStyle, color: '#23366A', fontWeight: 700 }}>
                    {line.newValue}
                  </span>
                </>
              ) : (
                <span style={{ ...cellStyle, color: '#23366A', fontWeight: 700 }}>
                  {line.value}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    },
    size: 300,
  },
];
