'use client';

import { useRouter } from 'next/navigation';
import { AuditHistoryTable } from '@/components/audit';

export default function HistorialImagenesPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode='OTHER'
      title='Historial de Auditoría de imágenes'
      onBack={() => router.push('/dashboard/mantenimiento/imagenes')}
    />
  );
}
