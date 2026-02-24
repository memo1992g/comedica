'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function NotificacionesHistorialPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode="NOTIFICATIONS"
      title="Historial de Gestión de Notificaciones"
      onBack={() => router.push('/dashboard/usuarios/notificaciones')}
    />
  );
}
