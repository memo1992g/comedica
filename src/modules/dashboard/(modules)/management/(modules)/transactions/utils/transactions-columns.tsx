'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { TransactionPxSsfI } from '@/interfaces/management/transactions';

const cellStyle = { fontFamily: 'var(--font-dm-sans)', fontSize: '11px', color: '#4a4a4c' };
const codeStyle = { ...cellStyle, color: '#23366a' };
const subHeaderStyle = { fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#8e8e93' };

export const transactionsColumns: ColumnDef<TransactionPxSsfI>[] = [
  {
    id: 'codigoCorresponsalGroup',
    header: () => <span className="tableHeaderTitle">Código Corresponsal</span>,
    columns: [
      {
        accessorKey: 'codigoCorresponsal',
        header: () => <span style={subHeaderStyle}>&nbsp;</span>,
        size: 250,
        cell: ({ getValue }) => <span style={codeStyle}>{getValue() as string}</span>,
      },
    ],
  },
  {
    id: 'pagoTarjeta',
    header: () => <span className="tableHeaderTitle">Pago Tarjeta</span>,
    columns: [
      {
        accessorKey: 'transNumTc',
        header: () => <span style={subHeaderStyle}>Trx</span>,
        cell: ({ getValue }) => <span style={cellStyle}>{getValue() as number}</span>,
        size: 100,
      },
      {
        accessorKey: 'transValTc',
        header: () => <span style={subHeaderStyle}>Monto</span>,
        cell: ({ getValue }) => <span style={cellStyle}>${(getValue() as number).toFixed(2)}</span>,
        size: 100,
      },
    ],
  },
  {
    id: 'abonoCuenta',
    header: () => <span className="tableHeaderTitle">Abono a Cuenta</span>,
    columns: [
      {
        accessorKey: 'transNumCta',
        header: () => <span style={subHeaderStyle}>Trx</span>,
        cell: ({ getValue }) => <span style={cellStyle}>{getValue() as number}</span>,
        size: 100,
      },
      {
        accessorKey: 'transValCta',
        header: () => <span style={subHeaderStyle}>Monto</span>,
        cell: ({ getValue }) => <span style={cellStyle}>${(getValue() as number).toFixed(2)}</span>,
        size: 130,
      },
    ],
  },
  {
    id: 'pagoPrestamo',
    header: () => <span className="tableHeaderTitle">Pago Prestamo</span>,
    columns: [
      {
        accessorKey: 'transNumCr',
        header: () => <span style={subHeaderStyle}>Trx</span>,
        cell: ({ getValue }) => <span style={cellStyle}>{getValue() as number}</span>,
        size: 100,
      },
      {
        accessorKey: 'transValCr',
        header: () => <span style={subHeaderStyle}>Monto</span>,
        cell: ({ getValue }) => <span style={cellStyle}>${(getValue() as number).toFixed(2)}</span>,
        size: 130,
      },
    ],
  },
  {
    id: 'totales',
    header: () => <span className="tableHeaderTitle">Totales</span>,
    columns: [
      {
        accessorKey: 'totalTrans',
        header: () => <span style={subHeaderStyle}>Total Trx</span>,
        cell: ({ getValue }) => <span style={cellStyle}>{getValue() as number}</span>,
        size: 100,
      },
      {
        accessorKey: 'totalValTrans',
        header: () => <span style={subHeaderStyle}>Total Monto</span>,
        cell: ({ getValue }) => <span style={cellStyle}>${(getValue() as number).toFixed(2)}</span>,
        size: 130,
      },
    ],
  },
  {
    id: 'fechaGroup',
    header: () => <span className="tableHeaderTitle">Fecha</span>,
    columns: [
      {
        accessorKey: 'datePresents',
        header: () => <span style={subHeaderStyle}>&nbsp;</span>,
        cell: ({ getValue }) => <span style={cellStyle}>{getValue() as string}</span>,
        size: 120,
      },
    ],
  },
];
