'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialCatalogoProductosPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='PARAMS'
      title='Historial de Auditoría'
      onBack={() => router.push('/dashboard/mantenimiento/catalogo-productos')}
    />
  );
}
