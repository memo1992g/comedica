'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialQuejasReclamosPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='OTHER'
      title='Historial completo de auditoría'
      onBack={() => router.push('/dashboard/mantenimiento/quejas-reclamos')}
    />
  );
}
