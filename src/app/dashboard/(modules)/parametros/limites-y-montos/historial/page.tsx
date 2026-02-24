'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialAuditoriaPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='LIMITS'
      title='Historial completo de auditoría'
      onBack={() => router.push('/dashboard/parametros/limites-y-montos')}
    />
  );
}
