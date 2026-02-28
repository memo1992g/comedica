"use client";

import { useRouter } from "next/navigation";
import AuditHistoryTable from "@/components/audit/AuditHistoryTable";

export default function HistorialMenuPage() {
  const router = useRouter();
  return (
    <AuditHistoryTable
      classificationCode="OTHER"
      title="Historial de Gestión de Menús"
      onBack={() => router.push("/dashboard/seguridad/menu")}
    />
  );
}
