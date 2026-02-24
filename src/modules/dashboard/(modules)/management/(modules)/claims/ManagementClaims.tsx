
'use client';

import { useState } from 'react';
import ManagementReport from '../../components/management-report';
import type { ComplaintI } from '@/interfaces/management/claims';
import type { PersonI } from '@/interfaces/management/persons';
import {
  listComplaintsAction,
  exportXmlReclaimAction,
} from '@/actions/management/claims';
import { exportXmlPersonsAction, listPersonsAction } from '@/actions/management/persons';
import { claimsColumns } from './claims-columns';

export default function ManagementClaims() {
  const [data, setData] = useState<ComplaintI[]>([]);
  const [personsData, setPersonsData] = useState<PersonI[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPersons, setIsExportingPersons] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (month: number, year: number) => {
    setIsSearching(true);
    setError(null);

    const [claimsResult, personsResult] = await Promise.all([
      listComplaintsAction(month, year),
      listPersonsAction(month, year),
    ]);

    if (claimsResult.errors || !claimsResult.data) {
      setError(claimsResult.errorMessage || 'Error al obtener reclamos');
      setIsSearching(false);
      return;
    }

    setData(claimsResult.data);
    setPersonsData(personsResult.data ?? []);
    setIsSearching(false);
  };

  const handleExportXml = async (_month: number, _year: number) => {
    setIsExporting(true);
    setError(null);

    const result = await exportXmlReclaimAction(data);

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
    a.download = 'reclamos.xml';
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleExportXmlPersons = async (month: number, year: number) => {
    setIsExportingPersons(true);
    setError(null);

    const result = await exportXmlPersonsAction(month, year);

    if (result.errors || !result.data) {
      setError(result.errorMessage || 'Error al exportar XML personas');
      setIsExportingPersons(false);
      return;
    }

    const binary = atob(result.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.codePointAt(i) ?? 0;
    const blob = new Blob([bytes], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personas.xml';
    a.click();
    URL.revokeObjectURL(url);
    setIsExportingPersons(false);
  };

  return (
    <ManagementReport
      title="Reclamos"
      subtitle="Consulta y gestión de reclamos mensuales."
      xmlButtonLabel="XML Reclamos"
      columns={claimsColumns}
      data={data}
      onSearch={handleSearch}
      onExportXml={handleExportXml}
      isSearching={isSearching}
      isExporting={isExporting}
      error={error}
      extraXmlButtons={[
        {
          label: 'XML Personas',
          onExport: handleExportXmlPersons,
          isExporting: isExportingPersons,
          disabled: personsData.length === 0,
        },
      ]}
    />
  );
}