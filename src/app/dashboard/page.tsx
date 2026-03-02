'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  dateMs: number | null;
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

function parseDateToMs(value?: string): number | null {
  if (!value) return null;

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct.getTime();

  const ddmmyyyy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy, hh = '00', min = '00', ss = '00'] = ddmmyyyy;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), Number(ss));
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  }

  return null;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
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
  const raw = metrics.data?.distributionPaymentTypeDay ?? [];

  const mapped = raw.map((item, idx) => {
    const count = Number(item.cnt ?? 0);
    const pctCount = Number(item.pctCnt ?? 0);
    const amount = Number(item.monto ?? 0);

    const value = count > 0
      ? count
      : pctCount > 0
        ? pctCount
        : amount > 0
          ? amount
          : 0;

    return {
      label: item.paymentType ?? 'Sin tipo',
      value,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    };
  });

  // Si el backend devuelve tipos pero sin contadores (0),
  // repartimos 1 por tipo para que el pastel sea visible.
  if (mapped.length > 0 && mapped.every((item) => item.value <= 0)) {
    return mapped.map((item) => ({ ...item, value: 1 }));
  }

  return mapped;
}

function mapVolume(metrics: OverviewMetricsResponse): VolumeItem[] {
  return [{ label: formatDate(metrics.data?.fechaHoy), value: Number(metrics.data?.volumenDia ?? 0) }];
}

function mapVolumeFromRows(rows: TxRow[]): VolumeItem[] {
  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    const key = row.type || 'Sin tipo';
    grouped.set(key, (grouped.get(key) ?? 0) + row.amountValue);
  });

  return Array.from(grouped.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function mapDistributionFromRows(rows: TxRow[]): DistributionItem[] {
  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    const key = row.type || 'Sin tipo';
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  });

  return Array.from(grouped.entries()).map(([label, value], idx) => ({
    label,
    value,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));
}

function mapTransactionRow(item: Record<string, unknown>, index: number): TxRow {
  const txId = String(item.transactionId ?? item.idTransaccion ?? item.id ?? `TX-${index + 1}`);
  const date = String(item.transactionDate ?? item.fechaHora ?? item.fecha ?? '');
  const dateMs = parseDateToMs(date);
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
    dateMs,
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
  const [isExporting, setIsExporting] = useState<'excel' | 'pdf' | null>(null);

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
        const fromDate = filters.fechaDesde ? new Date(`${filters.fechaDesde}T00:00:00`) : null;
        const toDate = filters.fechaHasta ? new Date(`${filters.fechaHasta}T23:59:59`) : null;
        const fromMs = fromDate && !Number.isNaN(fromDate.getTime()) ? fromDate.getTime() : null;
        const toMs = toDate && !Number.isNaN(toDate.getTime()) ? toDate.getTime() : null;

        const normalizedSearch = normalizeText(search);

        const filteredRows = rows.filter((item) => {
          if (filters.estado !== 'Todos' && item.status !== filters.estado) return false;
          if (fromMs !== null && (item.dateMs === null || item.dateMs < fromMs)) return false;
          if (toMs !== null && (item.dateMs === null || item.dateMs > toMs)) return false;
          if (hasMin && item.amountValue < min) return false;
          if (hasMax && item.amountValue > max) return false;
          if (filters.tipoTransaccion && !item.type.toLowerCase().includes(filters.tipoTransaccion.toLowerCase())) return false;
          if (normalizedSearch) {
            const haystack = [
              item.id,
              item.date,
              item.associate,
              item.client,
              item.category,
              item.type,
              item.amount,
              item.status,
            ].map(normalizeText).join(' ');

            if (!haystack.includes(normalizedSearch)) return false;
          }
          return true;
        });

        const start = (page - 1) * pageSize;
        const paged = filteredRows.slice(start, start + pageSize);

        // Los gráficos siempre se recalculan con el mismo subconjunto
        // mostrado en la tabla para mantener consistencia con los filtros.
        setDist(mapDistributionFromRows(filteredRows));
        setVol(mapVolumeFromRows(filteredRows));

        setTx({ data: paged, total: filteredRows.length });
      } catch {
        setTx({ data: [], total: 0 });
        setDist([]);
        setVol([]);
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

  const downloadOverviewReport = useCallback(async (format: 'excel' | 'pdf') => {
    const fecha = filters.fechaHasta || toInputDate(new Date());
    setIsExporting(format);

    try {
      const response = await apiClient.get<Blob>(`/overview/export/${format}`, {
        params: { fecha },
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];
      const matchedFilename = typeof contentDisposition === 'string'
        ? contentDisposition.match(/filename\*?=(?:UTF-8''|"|)?([^";]+)/i)?.[1]?.replace(/"/g, '').trim()
        : null;
      const defaultName = `overview-${fecha}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      const filename = matchedFilename || defaultName;

      const blob = new Blob([response.data], {
        type: format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setLoadError(`No se pudo exportar ${format.toUpperCase()}: ${getErrorMessage(error)}`);
    } finally {
      setIsExporting(null);
    }
  }, [filters.fechaHasta]);

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
              <button
                className={styles.btnExcel}
                onClick={() => { void downloadOverviewReport('excel'); }}
                disabled={isExporting !== null}
              >
                {isExporting === 'excel' ? 'Exportando...' : 'Excel'}
              </button>
              <button
                className={styles.btnPdf}
                onClick={() => { void downloadOverviewReport('pdf'); }}
                disabled={isExporting !== null}
              >
                {isExporting === 'pdf' ? 'Exportando...' : 'PDF'}
              </button>
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
  const hasData = data.length > 0;
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
        {!hasData && <circle cx={cx} cy={cy} r={r} fill="#EEF1F6" />}
        {slices.length === 1 && <circle cx={cx} cy={cy} r={r} fill={slices[0].color} />}
        {slices.length > 1 && slices.map((s) => {
          const percent = Math.round((s.value / total) * 100);
          const mid = (s.start + s.end) / 2;
          const labelRadius = r * 0.58;
          const textX = cx + labelRadius * Math.cos(2 * Math.PI * mid - Math.PI / 2);
          const textY = cy + labelRadius * Math.sin(2 * Math.PI * mid - Math.PI / 2);

          return (
            <g key={s.label}>
              <path d={arc(s.start, s.end)} fill={s.color} />
              {percent >= 8 && (
                <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#FFFFFF" fontWeight="700">
                  {percent}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Barras simples con SVG (sin librerías) */
function BarChart({ data }: { data: VolumeItem[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartData = data.length > 0 ? data : [{ label: '-', value: 0 }];
  const max = Math.max(...chartData.map((d) => d.value), 1);
  const leftAxisX = 80;
  const rightAxisX = 880;
  const topY = 30;
  const bottomY = 210;
  const innerHeight = bottomY - topY;
  const ticks = 4;

  const formatCompactMoney = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatMoneyTooltip = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className={styles.barWrap}>
      <svg width="100%" height="300" viewBox="0 0 900 300" preserveAspectRatio="none">
        {[...Array(ticks + 1)].map((_, i) => {
          const ratio = i / ticks;
          const y = topY + ratio * innerHeight;
          const tickValue = max * (1 - ratio);
          return (
            <g key={i}>
              <line x1={leftAxisX} x2={rightAxisX} y1={y} y2={y} stroke="#EEF1F6" />
              <text x={leftAxisX - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#97A0B3">
                {formatCompactMoney(tickValue)}
              </text>
            </g>
          );
        })}

        <line x1={leftAxisX} x2={leftAxisX} y1={topY} y2={bottomY} stroke="#DCE3EF" />
        <line x1={leftAxisX} x2={rightAxisX} y1={bottomY} y2={bottomY} stroke="#DCE3EF" />

        {chartData.map((d, i) => {
          const totalWidth = rightAxisX - leftAxisX;
          const slot = totalWidth / chartData.length;
          const barWidth = Math.min(48, slot * 0.42);
          const x = leftAxisX + i * slot + (slot - barWidth) / 2;
          const h = (d.value / max) * innerHeight;
          const y = bottomY - h;
          const label = d.label.length > 18 ? `${d.label.slice(0, 18)}…` : d.label;

          return (
            <g key={d.label} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {hoveredIndex === i && (
                <rect
                  x={leftAxisX + i * slot}
                  y={topY}
                  width={slot}
                  height={innerHeight + 62}
                  fill="#D9DEE8"
                  opacity="0.45"
                />
              )}
              <rect x={x} y={y} width={barWidth} height={h} rx={6} fill="#233269" />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="#243A6B" fontWeight="700">
                {d.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </text>
              <text x={x + barWidth / 2} y={238} textAnchor="middle" fontSize="10" fill="#5B667A">
                {label}
              </text>
            </g>
          );
        })}

        <text x={42} y={18} fontSize="11" fill="#7D889E" fontWeight="700">Monto</text>
        <text x={450} y={270} textAnchor="middle" fontSize="11" fill="#7D889E" fontWeight="700">
          Tipo de transferencia
        </text>
      </svg>

      {hoveredIndex !== null && chartData[hoveredIndex] && (
        <div className={styles.chartTooltip}>
          <div className={styles.chartTooltipTitle}>{chartData[hoveredIndex].label}</div>
          <div className={styles.chartTooltipValue}>Monto: {formatMoneyTooltip(chartData[hoveredIndex].value)}</div>
        </div>
      )}
    </div>
  );
}
