'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialSeguridadPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='PARAMS'
      title='Historial completo de auditoría'
      onBack={() => router.push('/dashboard/parametros/seguridad')}
    />
  );
}
