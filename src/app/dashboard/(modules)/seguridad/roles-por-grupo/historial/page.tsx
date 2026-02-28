'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function RolesPorGrupoHistorialPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode="OTHER"
      title="Historial de Roles por Grupo"
      onBack={() => router.push('/dashboard/seguridad/roles-por-grupo')}
    />
  );
}
