'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function SoporteUsuariosHistorialPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode="USER_MANAGEMENT"
      title="Historial de Gestión de Estados"
      onBack={() => router.push('/dashboard/usuarios/soporte-usuarios')}
    />
  );
}
