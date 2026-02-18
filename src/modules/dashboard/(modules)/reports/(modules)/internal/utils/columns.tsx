'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';

export interface TransactionData {
    id: string;
    date: string;
    time: string;
    accountOrigin: string;
    nameOrigin: string;
    idOrigin: string;
    accountDestination: string;
    nameDestination: string;
    idDestination: string;
    amount: number;
    channel: string;
}

export const reportColumns: ColumnDef<TransactionData>[] = [
    {
        id: 'datetime',
        accessorFn: (row) => `${row.date} ${row.time}`,
        header: () => <span className='tableHeaderTitle'>Fecha/Hora</span>,
        cell: ({ row }) => (
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', lineHeight: '16.5px', color: '#4a4a4c' }}>
                {row.original.date} {row.original.time}
            </span>
        ),
        size: 120,
    },
    {
        accessorKey: 'accountOrigin',
        header: () => <span className='tableHeaderTitle'>Cuenta Origen</span>,
        cell: ({ getValue }) => (
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', lineHeight: '16.5px', color: '#23366a' }}>
                {getValue() as string}
            </span>
        ),
        size: 110,
    },
    {
        id: 'nameOrigin',
        accessorKey: 'nameOrigin',
        header: () => <span className='tableHeaderTitle'>Nombre Origen</span>,
        cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', lineHeight: '16.5px', color: '#4a4a4c' }}>
                    {row.original.nameOrigin}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '8px', lineHeight: '12px', color: '#6a7282' }}>
                    ID {row.original.idOrigin}
                </span>
            </div>
        ),
        size: 150,
    },
    {
        accessorKey: 'accountDestination',
        header: () => <span className='tableHeaderTitle'>Cuenta Destino</span>,
        cell: ({ getValue }) => (
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', lineHeight: '16.5px', color: '#23366a' }}>
                {getValue() as string}
            </span>
        ),
        size: 110,
    },
    {
        id: 'nameDestination',
        accessorKey: 'nameDestination',
        header: () => <span className='tableHeaderTitle'>Nombre Destino</span>,
        cell: ({ row }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', lineHeight: '16.5px', color: '#4a4a4c' }}>
                    {row.original.nameDestination}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '8px', lineHeight: '12px', color: '#6a7282' }}>
                    ID {row.original.idDestination}
                </span>
            </div>
        ),
        size: 150,
    },
    {
        accessorKey: 'amount',
        header: () => <span className='tableHeaderTitle'>Monto</span>,
        cell: ({ getValue }) => (
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', lineHeight: '16.5px', color: '#23366a' }}>
                {formatCurrency(getValue() as number)}
            </span>
        ),
        size: 100,
    },
    {
        accessorKey: 'channel',
        header: () => <span className='tableHeaderTitle'>Canal</span>,
        cell: ({ getValue }) => (
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', lineHeight: '16.5px', color: '#4a4a4c' }}>
                {getValue() as string}
            </span>
        ),
        size: 120,
    },
];
