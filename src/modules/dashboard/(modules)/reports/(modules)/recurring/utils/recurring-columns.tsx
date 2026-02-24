import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { RecurringReport } from '../types';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const getStatusColor = (estado: string): string => {
  switch (estado) {
    case 'Activo':
      return '#00a63e';
    case 'Inactivo':
      return '#e7000b';
    case 'Pendiente':
      return '#4a5565';
    default:
      return '#6b7280';
  }
};

export const createRecurringColumns = (
  onViewDetail: (item: RecurringReport) => void
): ColumnDef<RecurringReport>[] => [
  {
    id: 'detalle',
    accessorKey: 'detalle',
    header: 'Detalle',
    cell: ({ row }) => (
      <button
        onClick={() => onViewDetail(row.original)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Eye size={16} color="#23366a" />
      </button>
    ),
    size: 80,
  },
  {
    id: 'tipo',
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
    id: 'solicitud',
    accessorKey: 'solicitud',
    header: 'No. solicitud',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#23366a', fontFamily: 'Cousine, monospace' }}>
        {row.original.solicitud}
      </div>
    ),
    size: 120,
  },
  {
    id: 'fechaCreacion',
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
    id: 'ultimaMod',
    accessorKey: 'ultimaMod',
    header: 'Última mod.',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.ultimaMod ? format(new Date(row.original.ultimaMod), 'dd/MM/yyyy h:mm a') : '---'}
      </div>
    ),
    size: 120,
  },
  {
    id: 'numeroAsociado',
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
    id: 'refCargo',
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
    id: 'refAbono',
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
    id: 'tipoBeneficiario',
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
    id: 'beneficiario',
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
    id: 'valor',
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
    id: 'bancoDestino',
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
    id: 'fechaInicio',
    accessorKey: 'fechaInicio',
    header: 'Fecha inicio',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.fechaInicio ? format(new Date(row.original.fechaInicio), 'dd/MM/yyyy h:mm a') : '---'}
      </div>
    ),
    size: 120,
  },
  {
    id: 'frecuencia',
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
    id: 'estado',
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => (
      <div style={{ 
        fontSize: '11px', 
        color: getStatusColor(row.original.estado),
        fontWeight: 500
      }}>
        {row.original.estado}
      </div>
    ),
    size: 100,
  },
  {
    id: 'finalizado',
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
    id: 'canal',
    accessorKey: 'canal',
    header: 'Canal',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.canal || '---'}
      </div>
    ),
    size: 100,
  },
  {
    id: 'oficina',
    accessorKey: 'oficina',
    header: 'Oficina',
    cell: ({ row }) => (
      <div style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {row.original.oficina || '---'}
      </div>
    ),
    size: 120,
  },
];
