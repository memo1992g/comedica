
'use client';

import { useState } from 'react';
import ManagementReport from '../../components/management-report';
import type { CorrespondentI } from '@/interfaces/management/correspondents';
import {
  listCorrespondentsAction,
  exportXmlCorrespondentAction,
} from '@/actions/management/correspondents';
import { correspondentsColumns } from './correspondents-columns';

export default function ManagementCorrespondents() {
  const [data, setData] = useState<CorrespondentI[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (_month: number) => {
    setIsSearching(true);
    setError(null);

    const result = await listCorrespondentsAction();

    if (result.errors || !result.data) {
      setError(result.errorMessage || 'Error al obtener corresponsales');
      setIsSearching(false);
      return;
    }

    setData(result.data);
    setIsSearching(false);
  };

  const handleExportXml = async (_month: number) => {
    setIsExporting(true);
    setError(null);

    const result = await exportXmlCorrespondentAction(data);

    if (result.errors || !result.data) {
      setError(result.errorMessage || 'Error al exportar XML');
      setIsExporting(false);
      return;
    }

    const binary = atob(result.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.codePointAt(i) ?? 0;
    const blob = new Blob([bytes], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corresponsales.xml';
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <ManagementReport
      title="Corresponsales"
      subtitle="Consulta y generación de reportes mensuales de corresponsales."
      xmlButtonLabel="XML Corresponsal"
      columns={correspondentsColumns}
      data={data}
      onSearch={handleSearch}
      onExportXml={handleExportXml}
      isSearching={isSearching}
      isExporting={isExporting}
      error={error}
    />
  );
}