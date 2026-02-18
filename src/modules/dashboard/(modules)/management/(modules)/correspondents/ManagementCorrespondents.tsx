
'use client';

import { useState } from 'react';
import ManagementReport from '../../components/management-report';
import type { ReportRow } from '../../utils/report-columns';
import { listCorrespondentsAction } from '@/actions/management/correspondents';

export default function ManagementCorrespondents() {
  const [data, setData] = useState<ReportRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);

    const result = await listCorrespondentsAction();

    if (result.errors || !result.data) {
      setError(result.errorMessage || 'Error al obtener corresponsales');
      setIsSearching(false);
      return;
    }

    const mapped: ReportRow[] = result.data.map((c) => ({
      code: c.codeSsf,
      numTransTC: c.districtCodePx,
      valTransTC: c.districtCodeOr,
      numTransCA: 0,
      valTransCA: 0,
    }));

    setData(mapped);
    setIsSearching(false);
  };

  return (
    <ManagementReport
      title="Corresponsales"
      subtitle="Consulta y generación de reportes mensuales de corresponsales."
      xmlButtonLabel="XML Corresponsal"
      data={data}
      onSearch={handleSearch}
      isSearching={isSearching}
      error={error}
    />
  );
}