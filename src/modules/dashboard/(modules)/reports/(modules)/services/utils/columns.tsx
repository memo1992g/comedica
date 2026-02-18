import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import {
  ServicioTransaction,
  EventoTransaction,
  SeguroTransaction,
  MinisterioTransaction,
} from '../types/service-types';

// Servicios columns
export const serviciosColumns: ColumnDef<ServicioTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('fecha')}</span>
    ),
    size: 120,
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
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('fecha')}</span>
    ),
    size: 120,
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
  {
    accessorKey: 'numeroAsociadoParticipante',
    header: 'N° asociado',
    cell: ({ row }) => (
      <span style={{ color: '#4a4a4c' }}>
        {row.getValue('numeroAsociadoParticipante')}
      </span>
    ),
    size: 120,
  },
];

// Seguros Comédica columns
export const segurosColumns: ColumnDef<SeguroTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('fecha')}</span>
    ),
    size: 120,
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
    accessorKey: 'asegurado',
    header: 'Asegurado',
    cell: ({ row }) => (
      <span style={{ color: '#23366a' }}>{row.getValue('asegurado')}</span>
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
    accessorKey: 'numeroPoliza',
    header: 'N° Póliza',
    cell: ({ row }) => (
      <span style={{ fontFamily: 'Cousine, monospace', color: '#6b7280' }}>
        {row.getValue('numeroPoliza')}
      </span>
    ),
    size: 150,
  },
  {
    accessorKey: 'tipoSeguro',
    header: 'Tipo Seguro',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('tipoSeguro')}</span>
    ),
    size: 150,
  },
];

// Ministerio de Hacienda columns
export const ministerioColumns: ColumnDef<MinisterioTransaction>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('fecha')}</span>
    ),
    size: 120,
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
    accessorKey: 'nitDui',
    header: 'NIT/DUI',
    cell: ({ row }) => (
      <span style={{ fontFamily: 'Cousine, monospace', color: '#6b7280' }}>
        {row.getValue('nitDui')}
      </span>
    ),
    size: 150,
  },
  {
    accessorKey: 'mandamientoNpe',
    header: 'Mandamiento (NPE)',
    cell: ({ row }) => (
      <span style={{ fontFamily: 'Cousine, monospace', color: '#6b7280' }}>
        {row.getValue('mandamientoNpe')}
      </span>
    ),
    size: 161,
  },
  {
    accessorKey: 'tipoImpuesto',
    header: 'Tipo Impuesto',
    cell: ({ row }) => (
      <span style={{ fontWeight: 500, color: '#6b7280' }}>{row.getValue('tipoImpuesto')}</span>
    ),
    size: 150,
  },
];
