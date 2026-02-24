'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialAtencionSoportePage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='NOTIFICATIONS'
      title='Historial de Auditoría'
      onBack={() => router.push('/dashboard/mantenimiento/atencion-soporte')}
    />
  );
}
