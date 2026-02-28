'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { associateIdentityWithDevicesAction } from '@/actions/maintenance/token';
import type { TokenClientI, TokenDeviceI, TokenIdentityI } from '@/interfaces/maintenance/token';
import styles from './page.module.css';

type TokenTableRow = {
  identityId: number;
  identityStatus: number;
  device: TokenDeviceI;
};

function getStatusLabel(status: number): string {
  return status === 1 ? 'Activo' : 'Inactivo';
}

function formatDate(value: string | null): string {
  if (!value) return '-';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-SV', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export default function TokenMantenimientoPage() {
  const [associateNumber, setAssociateNumber] = useState('');
  const [client, setClient] = useState<TokenClientI | null>(null);
  const [identities, setIdentities] = useState<TokenIdentityI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo<TokenTableRow[]>(() => {
    return identities.flatMap((identity) =>
      identity.devices.map((device) => ({
        identityId: identity.id,
        identityStatus: identity.status,
        device,
      })),
    );
  }, [identities]);

  const runSearch = async () => {
    const value = associateNumber.trim();

    if (!value) {
      setError('Ingrese un número de asociado para consultar.');
      setClient(null);
      setIdentities([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await associateIdentityWithDevicesAction(value);

      if (response.errors || !response.data) {
        setClient(null);
        setIdentities([]);
        setError(response.errorMessage || 'No se encontró información del asociado.');
        return;
      }

      setClient(response.data.client);
      setIdentities(response.data.identities ?? []);
    } catch (err) {
      setClient(null);
      setIdentities([]);
      setError(err instanceof Error ? err.message : 'Ocurrió un error al consultar el asociado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Token</h1>
        <p>Gestión y seguimiento de dispositivos vinculados</p>
      </header>

      <div className={styles.panel}>
        <div className={styles.searchRow}>
          <label htmlFor="associateNumber" className={styles.srOnly}>Número de asociado</label>
          <input
            id="associateNumber"
            className={styles.searchInput}
            placeholder="Asociado: Ingrese un número de asociado"
            value={associateNumber}
            onChange={(e) => setAssociateNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void runSearch();
              }
            }}
          />
          <button
            type="button"
            className={styles.searchButton}
            onClick={() => {
              void runSearch();
            }}
            disabled={isLoading}
          >
            <Search size={16} />
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {client && (
          <div className={styles.clientSummary}>
            <strong>{client.clientName.trim()}</strong>
            <span>Asociado #{client.associateNumber}</span>
            <span>Cliente ID: {client.clientId}</span>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Alias</th>
                <th>Sistema Operativo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Última Conexión</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.identityId}-${row.device.deviceCode}-${index}`}>
                  <td>{row.device.alias || '-'}</td>
                  <td>{row.device.operatingSystem || '-'}</td>
                  <td>{row.device.deviceBrand || '-'}</td>
                  <td>{row.device.deviceModel || '-'}</td>
                  <td>{formatDate(row.device.lastAccess)}</td>
                  <td>
                    <span className={row.device.status === 1 ? styles.active : styles.inactive}>
                      {getStatusLabel(row.device.status)}
                    </span>
                  </td>
                  <td>
                    <span className={styles.actionHint}>
                      {row.identityStatus === 1 ? 'Identidad activa' : 'Sin acciones'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              <p>Realice una búsqueda</p>
              <span>Utilice el número de asociado para ver dispositivos vinculados.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
