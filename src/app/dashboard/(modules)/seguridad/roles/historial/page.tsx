'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialRolesPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='OTHER'
      title='Historial de Roles'
      onBack={() => router.push('/dashboard/seguridad/roles')}
    />
  );
}
