import { ColumnDef } from '@tanstack/react-table';
import { HistoricalExecution } from '../../types';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const getHistoricalStatusColor = (estado: string): string => {
  switch (estado) {
    case 'Exitoso':
      return '#00a63e';
    case 'Inactivo':
    case 'Fallido':
      return '#e7000b';
    default:
      return '#6b7280';
  }
};

export const historicalColumns: ColumnDef<HistoricalExecution>[] = [
  {
    accessorKey: 'fechaModificacion',
    header: 'Fecha modificación',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.fechaModificacion}
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: 'aliasRecurrente',
    header: 'Alias recurrente',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#23366a', fontWeight: 500 }}>
        {row.original.aliasRecurrente}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.tipo}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: 'refCargo',
    header: 'Ref. cargo',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#23366a', fontFamily: 'Cousine, monospace' }}>
        {row.original.refCargo}
      </div>
    ),
    size: 130,
  },
  {
    accessorKey: 'refAbono',
    header: 'Ref. abono',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#23366a', fontFamily: 'Cousine, monospace' }}>
        {row.original.refAbono}
      </div>
    ),
    size: 130,
  },
  {
    accessorKey: 'tipoBeneficiario',
    header: 'Tipo beneficiario',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.tipoBeneficiario}
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: 'beneficiario',
    header: 'Beneficiario',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.beneficiario}
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: 'valor',
    header: 'Valor',
    cell: ({ row }) => (
      <div style={{ 
        fontSize: '11px', 
        color: '#23366a', 
        fontWeight: 500,
        textAlign: 'right',
        fontFamily: 'Cousine, monospace'
      }}>
        {formatCurrency(row.original.valor)}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: 'bancoDestino',
    header: 'Banco destino',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.bancoDestino}
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: 'fechaInicio',
    header: 'Fecha inicio',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.fechaInicio}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: 'frecuencia',
    header: 'Frecuencia',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.frecuencia}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => (
      <div style={{ 
        fontSize: '11px', 
        color: getHistoricalStatusColor(row.original.estado),
        fontWeight: 500
      }}>
        {row.original.estado}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: 'finalizado',
    header: 'Finalizado',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.finalizado ? 'Sí' : 'No'}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: 'canal',
    header: 'Canal',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.canal}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: 'oficina',
    header: 'Oficina',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.oficina}
      </div>
    ),
    size: 120,
  },
];
