'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialUsuariosSeguridadPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='OTHER'
      title='Historial de Usuarios de Seguridad'
      onBack={() => router.push('/dashboard/seguridad/usuarios')}
    />
  );
}
