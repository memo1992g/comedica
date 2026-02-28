'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialGruposPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='GROUPS'
      title='Historial de Grupos'
      onBack={() => router.push('/dashboard/seguridad/grupos')}
    />
  );
}
