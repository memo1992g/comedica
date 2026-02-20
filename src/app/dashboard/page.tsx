'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  status: 'Activo' | 'Inactivo';
};

type DistributionItem = { label: string; value: number; color: string };
type VolumeItem = { label: string; value: number };

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [tx, setTx] = useState<{ data: TxRow[]; total: number }>({ data: [], total: 0 });
  const [dist, setDist] = useState<DistributionItem[]>([]);
  const [vol, setVol] = useState<VolumeItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoadError(null);
        const [overviewRes, distRes, volRes] = await Promise.all([
          apiClient.get('/dashboard/overview'),
          apiClient.get('/dashboard/distribution'),
          apiClient.get('/dashboard/volume'),
        ]);

        setOverview(overviewRes.data.data);
        setDist(distRes.data.data);
        setVol(volRes.data.data);
      } catch (error) {
        setOverview(null);
        setDist([]);
        setVol([]);
        setLoadError(getErrorMessage(error));
      }
    };

    void loadDashboard();
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoadError(null);
        const res = await apiClient.get('/dashboard/transactions', { params: { search, page, pageSize } });
        setTx(res.data.data);
      } catch (error) {
        setTx({ data: [], total: 0 });
        setLoadError(getErrorMessage(error));
      }
    };

    void loadTransactions();
  }, [search, page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(tx.total / pageSize)), [tx.total]);
  const rangeText = useMemo(() => {
    if (!tx.total) return `0-0 de 0`;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, tx.total);
    return `${start}-${end} de ${tx.total}`;
  }, [tx.total, page]);

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
            <button className={styles.filterBtn} aria-label="Filtrar">⎘</button>
          </div>

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
  const w = 980;
  const h = 260;
  const padL = 60;
  const padB = 50;
  const barW = 44;
  const gap = 130;

  return (
    <div className={styles.barWrap}>
      <svg viewBox={`0 0 ${w} ${h}`} className={styles.barSvg}>
        {/* grid */}
        {[0.25, 0.5, 0.75, 1].map((k) => {
          const y = (h - padB) - (h - padB - 20) * k;
          return <line key={k} x1={padL} x2={w - 20} y1={y} y2={y} stroke="#e8edf6" />;
        })}

        {data.map((d, i) => {
          const x = padL + i * gap + 40;
          const barH = ((h - padB - 20) * d.value) / max;
          const y = (h - padB) - barH;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barW} height={barH} rx={6} fill="#233269" />
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#233269" fontWeight="700">
                {d.value.toLocaleString()}
              </text>
              <text x={x + barW / 2} y={h - 18} textAnchor="middle" fontSize="11" fill="#6b7280">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
