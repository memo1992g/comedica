'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function ConsultaUsuariosHistorialPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode="USER_MANAGEMENT"
      title="Historial de Gestiones"
      onBack={() => router.push('/dashboard/usuarios/consulta-usuarios')}
    />
  );
}
