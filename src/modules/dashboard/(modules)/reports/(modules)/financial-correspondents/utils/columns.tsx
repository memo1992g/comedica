import { ColumnDef } from '@tanstack/react-table';
import { FinancialCorrespondentTransaction } from '../types/FinancialCorrespondent.type';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const financialCorrespondentsColumns: ColumnDef<FinancialCorrespondentTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>
          {row.original.fecha}
        </div>
      );
    },
  },
  {
    accessorKey: 'numeroAsociado',
    header: 'N° asociado',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
          {row.original.numeroAsociado}
        </div>
      );
    },
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#23366a' }}>
          {row.original.nombre}
        </div>
      );
    },
  },
  {
    accessorKey: 'monto',
    header: () => (
      <div style={{ textAlign: 'right', width: '100%', paddingRight: '0' }}>Monto</div>
    ),
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#23366a', textAlign: 'right', width: '100%', paddingRight: '0' }}>
          {formatCurrency(row.original.monto)}
        </div>
      );
    },
  },
  {
    accessorKey: 'cuenta',
    header: 'Cuenta',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'Cousine, monospace' }}>
          {row.original.cuenta}
        </div>
      );
    },
  },
  {
    accessorKey: 'referencia',
    header: 'Referencia',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'Cousine, monospace' }}>
          {row.original.referencia}
        </div>
      );
    },
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>
          {row.original.tipo}
        </div>
      );
    },
  },
];
