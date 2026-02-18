
'use client';

import { useState } from 'react';
import ManagementReport from '../../components/management-report';
import type { ReportRow } from '../../utils/report-columns';
import { listComplaintsAction } from '@/actions/management/claims';

export default function ManagementClaims() {
  const [data, setData] = useState<ReportRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);

    const result = await listComplaintsAction();

    if (result.errors || !result.data) {
      setError(result.errorMessage || 'Error al obtener reclamos');
      setIsSearching(false);
      return;
    }

    const mapped: ReportRow[] = result.data.map((c) => ({
      code: String(c.id),
      numTransTC: c.idTipoReclamo,
      valTransTC: c.monto,
      numTransCA: c.idEstadoReclamo,
      valTransCA: c.idEstadoResolucion ?? 0,
    }));

    setData(mapped);
    setIsSearching(false);
  };

  return (
    <ManagementReport
      title="Reclamos"
      subtitle="Consulta y gestión de reclamos mensuales."
      xmlButtonLabel="XML Reclamos"
      data={data}
      onSearch={handleSearch}
      isSearching={isSearching}
      error={error}
    />
  );
}