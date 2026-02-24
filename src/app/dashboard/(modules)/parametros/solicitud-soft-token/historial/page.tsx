"use client";

import { useRouter } from "next/navigation";
import { AuditHistoryTable } from "@/components/audit";

export default function HistorialSoftTokenPage() {
  const router = useRouter();

  return (
    <AuditHistoryTable
      classificationCode="SOFTTOKEN"
      title="Historial completo de auditoría"
      onBack={() => router.push("/dashboard/parametros/solicitud-soft-token")}
    />
  );
}
