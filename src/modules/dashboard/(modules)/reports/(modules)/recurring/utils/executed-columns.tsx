import { ColumnDef } from '@tanstack/react-table';
import { ExecutedReport } from '../types';
import { format } from 'date-fns';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const getExecutionStatusColor = (estado: string): string => {
  switch (estado) {
    case 'Procesado':
      return '#00a63e';
    case 'Rechazado':
    case 'Fallido':
      return '#e7000b';
    case 'Cancelado':
      return '#4a5565';
    default:
      return '#6b7280';
  }
};

export const executedReportsColumns: ColumnDef<ExecutedReport>[] = [
  {
    accessorKey: 'fechaCreacion',
    header: 'Fecha creación',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.fechaCreacion ? format(new Date(row.original.fechaCreacion), 'dd/MM/yyyy h:mm a') : '---'}
      </div>
    ),
    size: 120,
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
    accessorKey: 'numeroAsociado',
    header: 'N° asociado',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#23366a', fontFamily: 'Cousine, monospace' }}>
        {row.original.numeroAsociado}
      </div>
    ),
    size: 130,
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
    accessorKey: 'fechaHoraOp',
    header: 'Fecha/hora op.',
    cell: ({ row }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
          {row.original.fechaHoraOp ? format(new Date(row.original.fechaHoraOp), 'dd/MM/yyyy h:mm a') : '---'}
        </div>
        <div style={{ fontSize: '9px', color: '#6b7280' }}>
          {row.original.horaOp}
        </div>
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: 'fechaEjecucion',
    header: 'Fecha ejecución',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.fechaEjecucion ? format(new Date(row.original.fechaEjecucion), 'dd/MM/yyyy h:mm a') : '---'}
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: 'estadoEjecucion',
    header: 'Estado ejecución',
    cell: ({ row }) => (
      <div style={{ 
        fontSize: '11px', 
        color: getExecutionStatusColor(row.original.estadoEjecucion),
        fontWeight: 500
      }}>
        {row.original.estadoEjecucion}
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: 'mensajeError',
    header: 'Mensaje error',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#6b7280' }}>
        {row.original.mensajeError || '-'}
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: 'fechaProcesado',
    header: 'Fecha procesado',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.fechaProcesado ? format(new Date(row.original.fechaProcesado), 'dd/MM/yyyy h:mm a') : '-'}
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: 'fechaRechazo',
    header: 'Fecha rechazo',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.fechaRechazo ? format(new Date(row.original.fechaRechazo), 'dd/MM/yyyy h:mm a') : '-'}
      </div>
    ),
    size: 130,
  },
  {
    accessorKey: 'mensajeRechazo',
    header: 'Mensaje rechazo',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#6b7280' }}>
        {row.original.mensajeRechazo || '-'}
      </div>
    ),
    size: 180,
  },
];
