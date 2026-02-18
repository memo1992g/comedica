import { ColumnDef } from '@tanstack/react-table';

export interface Transfer365Transaction {
  id: string;
  date: string;
  time: string;
  accountOrigin: string;
  bankOrigin: string;
  nameOrigin: string;
  idOrigin?: string;
  amount: number;
  type: string;
  accountDestination: string;
  bankDestination: string;
  nameDestination: string;
  idDestination?: string;
  code: string;
  transactionType: 'Saliente' | 'Entrante';
}

const formatCurrency = (value: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  
  return value < 0 ? `-${formatted}` : `+${formatted}`;
};

export const transfer365Columns: ColumnDef<Transfer365Transaction>[] = [
  {
    accessorKey: 'date',
    header: 'Fecha/Hora',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
          {row.original.date} {row.original.time}
        </div>
      );
    },
  },
  {
    accessorKey: 'accountOrigin',
    header: 'Cuenta Origen',
    cell: ({ row }) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '11px', color: '#23366a', fontWeight: 400 }}>
            {row.original.accountOrigin}
          </div>
          <div style={{ fontSize: '9px', color: '#6a7282' }}>
            {row.original.bankOrigin}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'nameOrigin',
    header: 'Nombre Origen',
    cell: ({ row }) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
            {row.original.nameOrigin}
          </div>
          {row.original.idOrigin && (
            <div style={{ fontSize: '8px', color: '#6a7282' }}>
              ID {row.original.idOrigin}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Monto',
    cell: ({ row }) => {
      const amount = row.original.amount;
      const isPositive = amount >= 0;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div 
            style={{ 
              fontSize: '11px', 
              color: isPositive ? '#00a63e' : '#23366a',
              fontWeight: 400 
            }}
          >
            {formatCurrency(amount)}
          </div>
          <div style={{ fontSize: '9px', color: '#6a7282' }}>
            {row.original.type}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'accountDestination',
    header: 'Cuenta Destino',
    cell: ({ row }) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '11px', color: '#23366a', fontWeight: 400 }}>
            {row.original.accountDestination}
          </div>
          <div style={{ fontSize: '9px', color: '#6a7282' }}>
            {row.original.bankDestination}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'nameDestination',
    header: 'Nombre Destino',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
          {row.original.nameDestination}
        </div>
      );
    },
  },
  {
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => {
      const code = row.original.code;
      const isSuccess = code === '00';
      return (
        <div 
          style={{ 
            fontSize: '11px', 
            color: isSuccess ? '#00a63e' : '#e7000b',
            fontWeight: 400 
          }}
        >
          {code}
        </div>
      );
    },
  },
  {
    accessorKey: 'transactionType',
    header: 'Tipo',
    cell: ({ row }) => {
      return (
        <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
          {row.original.transactionType}
        </div>
      );
    },
  },
];
