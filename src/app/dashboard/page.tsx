'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import { getErrorMessage } from '@/lib/api/client';
import apiClient from '@/lib/api/client';
import styles from './styles/dashboardPage.module.css';

type Overview = {
  lastUpdated: string;
  cards: {
    totalTransactions: { value: number; deltaText: string };
    totalAmount: { value: string; deltaText: string; deltaType: 'up' | 'down' };
    avgPerTx: { value: string; deltaText: string; deltaType: 'up' | 'down' };
    mostUsed: { value: string; subtitle: string };
  };
};

type TxRow = {
  id: string;
  date: string;
  associate: string;
  client: string;
  category: string;
  type: string;
  amount: string;
  amountValue: number;
  status: 'Activo' | 'Inactivo';
};

type DistributionItem = { label: string; value: number; color: string };
type VolumeItem = { label: string; value: number };

type OverviewMetricsResponse = {
  data?: {
    fechaHoy?: string;
    cntDia?: number;
    volumenDia?: number;
    pctTransaccionesTxt?: string;
    pctMontoTxt?: string;
    tipoPagoMasUsadoDia?: {
      paymentType?: string;
      cnt?: number;
      monto?: number;
    };
    distributionPaymentTypeDay?: Array<{
      paymentType?: string;
      cnt?: number;
      pctCnt?: number;
      monto?: number;
      pctMonto?: number;
    }>;
  };
};

type OverviewTransactionsResponse = {
  metadata?: {
    totalCount?: number;
  };
  data?: Array<Record<string, unknown>>;
};

const CHART_COLORS = ['#3E7BFA', '#6DA7FF', '#99C4FF', '#3D5CB8', '#A4B0D3', '#233269'];

function buildOverviewContext() {
  return {
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: 'W',
    requestId: crypto.randomUUID(),
  };
}

function toCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value?: string): string {
  if (!value) return '-';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function mapOverview(metrics: OverviewMetricsResponse): Overview {
  const data = metrics.data ?? {};
  const txCount = Number(data.cntDia ?? 0);
  const volume = Number(data.volumenDia ?? 0);
  const avg = txCount > 0 ? volume / txCount : 0;
  const pctTx = data.pctTransaccionesTxt ?? '0%';
  const pctMonto = data.pctMontoTxt ?? '0%';
  const mostUsed = data.tipoPagoMasUsadoDia;

  return {
    lastUpdated: formatDate(data.fechaHoy),
    cards: {
      totalTransactions: { value: txCount, deltaText: pctTx },
      totalAmount: { value: toCurrency(volume), deltaText: pctMonto, deltaType: pctMonto.startsWith('-') ? 'down' : 'up' },
      avgPerTx: { value: toCurrency(avg), deltaText: pctTx, deltaType: pctTx.startsWith('-') ? 'down' : 'up' },
      mostUsed: {
        value: mostUsed?.paymentType ?? '-',
        subtitle: `${mostUsed?.cnt ?? 0} transacciones · ${toCurrency(Number(mostUsed?.monto ?? 0))}`,
      },
    },
  };
}

function mapDistribution(metrics: OverviewMetricsResponse): DistributionItem[] {
  return (metrics.data?.distributionPaymentTypeDay ?? []).map((item, idx) => ({
    label: item.paymentType ?? 'Sin tipo',
    value: Number(item.cnt ?? 0),
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));
}

function mapVolume(metrics: OverviewMetricsResponse): VolumeItem[] {
  return [{ label: formatDate(metrics.data?.fechaHoy), value: Number(metrics.data?.volumenDia ?? 0) }];
}

function mapTransactionRow(item: Record<string, unknown>, index: number): TxRow {
  const txId = String(item.transactionId ?? item.idTransaccion ?? item.id ?? `TX-${index + 1}`);
  const date = String(item.transactionDate ?? item.fechaHora ?? item.fecha ?? '');
  const associate = String(item.associatedNumber ?? item.numeroAsociado ?? item.asociado ?? '-');
  const client = String(item.customerName ?? item.nombreCliente ?? item.nombreDestino ?? '-');
  const category = String(item.category ?? item.categoria ?? item.productType ?? '-');
  const type = String(item.paymentType ?? item.tipoTransferencia ?? item.tipo ?? '-');
  const amountRaw = Number(item.amount ?? item.monto ?? item.montoEntrante ?? 0);
  const statusRaw = String(item.status ?? item.estado ?? 'A');

  return {
    id: txId,
    date: formatDate(date),
    associate,
    client,
    category,
    type,
    amountValue: Number.isFinite(amountRaw) ? amountRaw : 0,
    amount: toCurrency(Number.isFinite(amountRaw) ? amountRaw : 0),
    status: statusRaw.toUpperCase().startsWith('I') ? 'Inactivo' : 'Activo',
  };
}

type OverviewFilters = {
  fechaDesde: string;
  fechaHasta: string;
  tipoTransaccion: string;
  montoMinimo: string;
  montoMaximo: string;
  estado: 'Todos' | 'Activo' | 'Inactivo';
};

function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(today.getDate() - 30);

  const [overview, setOverview] = useState<Overview | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OverviewFilters>({
    fechaDesde: toInputDate(defaultFrom),
    fechaHasta: toInputDate(today),
    tipoTransaccion: '',
    montoMinimo: '',
    montoMaximo: '',
    estado: 'Todos',
  });

  const [tx, setTx] = useState<{ data: TxRow[]; total: number }>({ data: [], total: 0 });
  const [dist, setDist] = useState<DistributionItem[]>([]);
  const [vol, setVol] = useState<VolumeItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await apiClient.post<OverviewMetricsResponse>('/overview/metrics', {
          ...buildOverviewContext(),
          data: { fecha: filters.fechaHasta || toInputDate(new Date()) },
        });

        setOverview(mapOverview(response.data));
        setDist(mapDistribution(response.data));
        setVol(mapVolume(response.data));
      } catch (error) {
        setOverview(null);
        setDist([]);
        setVol([]);
        setLoadError(getErrorMessage(error));
      }
    };

    void loadMetrics();
  }, [filters.fechaHasta]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await apiClient.post<OverviewTransactionsResponse>('/overview/transactions', {
          ...buildOverviewContext(),
          data: {
            filters: {
              fechaInicio: filters.fechaDesde,
              fechaFin: filters.fechaHasta,
              paymentType: filters.tipoTransaccion || null,
              productType: null,
              textoBusqueda: search,
            },
            pagination: {
              page: 0,
              size: 200,
              sortBy: 'transactionDate',
              sortDirection: 'DESC',
            },
          },
        });

        const rows = (response.data.data ?? []).map((item, idx) => mapTransactionRow(item, idx));

        const min = Number(filters.montoMinimo);
        const hasMin = Number.isFinite(min) && filters.montoMinimo !== '';
        const max = Number(filters.montoMaximo);
        const hasMax = Number.isFinite(max) && filters.montoMaximo !== '';

        const filteredRows = rows.filter((item) => {
          if (filters.estado !== 'Todos' && item.status !== filters.estado) return false;
          if (hasMin && item.amountValue < min) return false;
          if (hasMax && item.amountValue > max) return false;
          if (filters.tipoTransaccion && !item.type.toLowerCase().includes(filters.tipoTransaccion.toLowerCase())) return false;
          return true;
        });

        const start = (page - 1) * pageSize;
        const paged = filteredRows.slice(start, start + pageSize);

        setTx({ data: paged, total: filteredRows.length });
      } catch {
        setTx({ data: [], total: 0 });
      }
    };

    void loadTransactions();
  }, [search, page, filters]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(tx.total / pageSize)), [tx.total]);
  const rangeText = useMemo(() => {
    if (!tx.total) return `0-0 de 0`;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, tx.total);
    return `${start}-${end} de ${tx.total}`;
  }, [tx.total, page]);

  const clearFilters = () => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 30);

    setFilters({
      fechaDesde: toInputDate(from),
      fechaHasta: toInputDate(now),
      tipoTransaccion: '',
      montoMinimo: '',
      montoMaximo: '',
      estado: 'Todos',
    });
    setSearch('');
    setPage(1);
  };

  return (
    <div className={styles.wrap}>
      {loadError && <p className={styles.cardSub}>No se pudo cargar dashboard: {loadError}</p>}

      {/* Top cards */}
      <div className={styles.cardsRow}>
        <div className={styles.cardGradient}>
          <div className={styles.cardLabel}>Total de Transacciones</div>
          <div className={styles.cardValue}>{overview?.cards.totalTransactions.value ?? '—'}</div>
          <div className={styles.cardDeltaLight}>{overview?.cards.totalTransactions.deltaText ?? ''}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Monto Total</div>
          <div className={styles.cardValueDark}>{overview?.cards.totalAmount.value ?? '—'}</div>
          <div className={styles.deltaUp}>{overview?.cards.totalAmount.deltaText ?? ''}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Promedio por Transacción</div>
          <div className={styles.cardValueDark}>{overview?.cards.avgPerTx.value ?? '—'}</div>
          <div className={styles.deltaDown}>{overview?.cards.avgPerTx.deltaText ?? ''}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Tipo más Utilizado</div>
          <div className={styles.cardValueDark}>{overview?.cards.mostUsed.value ?? '—'}</div>
          <div className={styles.cardSub}>{overview?.cards.mostUsed.subtitle ?? ''}</div>
        </div>
      </div>

      {/* Middle grid */}
      <div className={styles.midGrid}>
        {/* Tabla */}
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelTitle}>Resumen de Transacciones</div>
            <div className={styles.panelActions}>
              <button className={styles.btnExcel}>Excel</button>
              <button className={styles.btnPdf}>PDF</button>
            </div>
          </div>

          <div className={styles.searchRow}>
            <input
              className={styles.search}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar"
            />
            <button
              className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
              aria-label="Filtrar"
              onClick={() => setShowFilters((prev) => !prev)}
              title="Mostrar/Ocultar filtros"
            >
              <Filter size={16} />
            </button>
          </div>

          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filterField}>
                <label>Fecha Desde</label>
                <input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, fechaDesde: e.target.value }));
                    setPage(1);
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <label>Fecha Hasta</label>
                <input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, fechaHasta: e.target.value }));
                    setPage(1);
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <label>Tipo de Transacción</label>
                <input
                  type="text"
                  value={filters.tipoTransaccion}
                  placeholder="Todos los tipos"
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, tipoTransaccion: e.target.value }));
                    setPage(1);
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <label>Monto Mínimo</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={filters.montoMinimo}
                  placeholder="0.00"
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, montoMinimo: e.target.value }));
                    setPage(1);
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <label>Monto Máximo</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={filters.montoMaximo}
                  placeholder="0.00"
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, montoMaximo: e.target.value }));
                    setPage(1);
                  }}
                />
              </div>
              <div className={styles.filterField}>
                <label>Estado</label>
                <select
                  value={filters.estado}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, estado: e.target.value as OverviewFilters['estado'] }));
                    setPage(1);
                  }}
                >
                  <option value="Todos">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className={styles.filterActions}>
                <button className={styles.clearBtn} onClick={clearFilters}>Limpiar Filtros</button>
              </div>
            </div>
          )}

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID Transacción</th>
                  <th>Fecha</th>
                  <th>N° Asoc.</th>
                  <th>Cliente</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tx.data.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.linkLike}>{r.id}</td>
                    <td>{r.date}</td>
                    <td>{r.associate}</td>
                    <td>{r.client}</td>
                    <td>{r.category}</td>
                    <td>{r.type}</td>
                    <td className={styles.amount}>{r.amount}</td>
                    <td className={r.status === 'Inactivo' ? styles.inactive : styles.active}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pager}>
            <div className={styles.pagerLeft}>Página</div>
            <div className={styles.pagerNum}>{page}</div>
            <div className={styles.pagerRange}>{rangeText}</div>

            <div className={styles.pagerBtns}>
              <button
                className={styles.pagerBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹
              </button>
              <button
                className={styles.pagerBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* Pie */}
        <section className={styles.panel}>
          <div className={styles.panelHeadSimple}>
            <div className={styles.panelTitle}>Distribución de Tipos de Transacción</div>
          </div>

          <PieChart data={dist} />

          <div className={styles.legend}>
            {dist.map((d) => (
              <div key={d.label} className={styles.legendItem}>
                <span className={styles.dot} style={{ background: d.color }} />
                <span className={styles.legendText}>{d.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom bar chart */}
      <section className={styles.panel}>
        <div className={styles.panelHeadSimple}>
          <div className={styles.panelTitle}>Volumen de Transacciones (Monto)</div>
        </div>
        <BarChart data={vol} />
      </section>
    </div>
  );
}

/** Pie simple con SVG (sin librerías) */
function PieChart({ data }: { data: DistributionItem[] }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;

  const slices = data.map((d) => {
    const start = acc / total;
    acc += d.value;
    const end = acc / total;
    return { ...d, start, end };
  });

  const r = 80;
  const cx = 120;
  const cy = 110;

  const arc = (start: number, end: number) => {
    const a0 = 2 * Math.PI * start - Math.PI / 2;
    const a1 = 2 * Math.PI * end - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = end - start > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
  };

  return (
    <div className={styles.pieWrap}>
      <svg width="240" height="220">
        {slices.map((s) => (
          <path key={s.label} d={arc(s.start, s.end)} fill={s.color} />
        ))}
      </svg>
    </div>
  );
}

/** Barras simples con SVG (sin librerías) */
function BarChart({ data }: { data: VolumeItem[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={styles.barWrap}>
      <svg width="100%" height="260" viewBox="0 0 900 260" preserveAspectRatio="none">
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={60}
            x2={880}
            y1={30 + i * 55}
            y2={30 + i * 55}
            stroke="#EEF1F6"
          />
        ))}

        {data.map((d, i) => {
          const width = 70;
          const gap = 35;
          const x = 80 + i * (width + gap);
          const h = (d.value / max) * 180;
          const y = 210 - h;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={width} height={h} rx={10} fill="#3E7BFA" />
              <text x={x + width / 2} y={240} textAnchor="middle" fontSize="12" fill="#5B667A">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
