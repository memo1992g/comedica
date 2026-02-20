import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import {
  ServicioTransaction,
  EventoTransaction,
  SeguroTransaction,
  MinisterioTransaction,
} from '../types/service-types';

function formatDateCell(value: string): string {
  if (!value) return '---';
  try {
    return format(new Date(value), 'dd/MM/yyyy - h:mm a');
  } catch {
    return value;
  }
}

// Servicios columns
export const serviciosColumns: ColumnDef<ServicioTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <span style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {formatDateCell(row.getValue('fecha'))}
      </span>
    ),
    size: 170,
  },
  {
    accessorKey: 'numeroAsociado',
    header: 'N° asociado',
    cell: ({ row }) => (
      <span style={{ color: '#4a4a4c' }}>{row.getValue('numeroAsociado')}</span>
    ),
    size: 120,
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    cell: ({ row }) => (
      <span style={{ color: '#23366a' }}>{row.getValue('nombre')}</span>
    ),
    size: 180,
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => (
      <span style={{ color: '#23366a', textAlign: 'right', display: 'block' }}>
        {formatCurrency(row.getValue('monto'))}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: 'colector',
    header: 'Colector',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('colector')}</span>
    ),
    size: 150,
  },
  {
    accessorKey: 'referencia',
    header: 'Referencia',
    cell: ({ row }) => (
      <span style={{ fontFamily: 'Cousine, monospace', color: '#6b7280' }}>
        {row.getValue('referencia')}
      </span>
    ),
    size: 150,
  },
];

// Eventos columns
export const eventosColumns: ColumnDef<EventoTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <span style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {formatDateCell(row.getValue('fecha'))}
      </span>
    ),
    size: 170,
  },
  {
    accessorKey: 'numeroAsociado',
    header: 'N° asociado',
    cell: ({ row }) => (
      <span style={{ color: '#4a4a4c' }}>{row.getValue('numeroAsociado')}</span>
    ),
    size: 120,
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => (
      <span style={{ color: '#23366a', textAlign: 'right', display: 'block' }}>
        {formatCurrency(row.getValue('monto'))}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: 'codEvento',
    header: 'Cod evento',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('codEvento')}</span>
    ),
    size: 120,
  },
  {
    accessorKey: 'nombreEvento',
    header: 'Nombre evento',
    cell: ({ row }) => (
      <span style={{ color: '#23366a' }}>{row.getValue('nombreEvento')}</span>
    ),
    size: 150,
  },
  {
    accessorKey: 'nombreParticipante',
    header: 'Nombre participante',
    cell: ({ row }) => (
      <span style={{ color: '#23366a' }}>{row.getValue('nombreParticipante')}</span>
    ),
    size: 180,
  },
];

// Seguros Comédica columns
export const segurosColumns: ColumnDef<SeguroTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <span style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {formatDateCell(row.getValue('fecha'))}
      </span>
    ),
    size: 170,
  },
  {
    accessorKey: 'numeroAsociado',
    header: 'N° asociado',
    cell: ({ row }) => (
      <span style={{ color: '#4a4a4c' }}>{row.getValue('numeroAsociado')}</span>
    ),
    size: 100,
  },
  {
    accessorKey: 'nombre',
    header: 'Asegurado',
    cell: ({ row }) => (
      <span style={{ color: '#23366a' }}>{row.getValue('nombre')}</span>
    ),
    size: 180,
  },
  {
    accessorKey: 'valorPagado',
    header: 'Valor Pagado',
    cell: ({ row }) => (
      <span style={{ color: '#23366a', textAlign: 'right', display: 'block' }}>
        {formatCurrency(row.getValue('valorPagado'))}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: 'poliza',
    header: 'Póliza',
    cell: ({ row }) => (
      <span style={{ fontFamily: 'Cousine, monospace', color: '#6b7280' }}>
        {row.getValue('poliza')}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: 'tipoPoliza',
    header: 'Tipo Póliza',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('tipoPoliza')}</span>
    ),
    size: 100,
  },
  {
    accessorKey: 'tipoCuenta',
    header: 'Tipo Cuenta',
    cell: ({ row }) => (
      <span style={{ color: '#6b7280' }}>{row.getValue('tipoCuenta')}</span>
    ),
    size: 140,
  },
];

// Ministerio de Hacienda columns
export const ministerioColumns: ColumnDef<MinisterioTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <span style={{ fontSize: '11px', color: '#4a4a4c' }}>
        {formatDateCell(row.getValue('fecha'))}
      </span>
    ),
    size: 170,
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    cell: ({ row }) => (
      <span style={{ color: '#23366a' }}>{row.getValue('nombre')}</span>
    ),
    size: 200,
  },
  {
    accessorKey: 'numeroAsociado',
    header: 'N° asociado',
    cell: ({ row }) => (
      <span style={{ color: '#4a4a4c' }}>{row.getValue('numeroAsociado')}</span>
    ),
    size: 100,
  },
  {
    accessorKey: 'cuentaOrigen',
    header: 'Cuenta Origen',
    cell: ({ row }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '11px', color: '#23366a' }}>
          {row.getValue('cuentaOrigen')}
        </span>
        <span style={{ fontSize: '9px', color: '#6a7282' }}>
          {row.original.tipoCuenta}
        </span>
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ row }) => (
      <span style={{ color: '#23366a', textAlign: 'right', display: 'block' }}>
        {formatCurrency(row.getValue('monto'))}
      </span>
    ),
    size: 120,
  },
  {
    accessorKey: 'mandamientoNpe',
    header: 'Mandamiento (NPE)',
    cell: ({ row }) => (
      <span style={{ fontFamily: 'Cousine, monospace', color: '#6b7280' }}>
        {row.getValue('mandamientoNpe')}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: 'canal',
    header: 'Canal',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('canal')}</span>
    ),
    size: 80,
  },
];
