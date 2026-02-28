'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function UsuariosPorRolHistorialPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode="OTHER"
      title="Historial de Usuarios por Rol"
      onBack={() => router.push('/dashboard/seguridad/usuarios-por-rol')}
    />
  );
}
