import type { ConsolidatedReportItem } from '@/interfaces/reports';
import type { SummaryRow } from '../components/ReportsSummaryTable/ReportsSummaryTable';

const ONLINE_CHANNEL = 'Banca en línea';
const MOBILE_CHANNEL = 'Banca Móvil';

const SUMMARY_CHANNELS = [ONLINE_CHANNEL, MOBILE_CHANNEL] as const;

const createEmptyRow = (canal: string): SummaryRow => ({
  canal,
  abonosAmount: 0,
  abonosCount: 0,
  cargosAmount: 0,
  cargosCount: 0,
  creditosTotalAmount: 0,
  creditosTotalCount: 0,
  tcCanalAmount: 0,
  tcCanalCount: 0,
});

const normalizeTipo = (tipo: string): string =>
  tipo
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();

const sumRows = (left: SummaryRow, right: SummaryRow): SummaryRow => ({
  canal: 'TOTAL GENERAL',
  abonosAmount: left.abonosAmount + right.abonosAmount,
  abonosCount: left.abonosCount + right.abonosCount,
  cargosAmount: left.cargosAmount + right.cargosAmount,
  cargosCount: left.cargosCount + right.cargosCount,
  creditosTotalAmount: left.creditosTotalAmount + right.creditosTotalAmount,
  creditosTotalCount: left.creditosTotalCount + right.creditosTotalCount,
  tcCanalAmount: left.tcCanalAmount + right.tcCanalAmount,
  tcCanalCount: left.tcCanalCount + right.tcCanalCount,
  isTotal: true,
});

export const getEmptySummaryRows = (): SummaryRow[] => {
  const onlineRow = createEmptyRow(ONLINE_CHANNEL);
  const mobileRow = createEmptyRow(MOBILE_CHANNEL);

  return [onlineRow, mobileRow, sumRows(onlineRow, mobileRow)];
};

export const buildSummaryRows = (items: ConsolidatedReportItem[]): SummaryRow[] => {
  const rowsByChannel: Record<(typeof SUMMARY_CHANNELS)[number], SummaryRow> = {
    [ONLINE_CHANNEL]: createEmptyRow(ONLINE_CHANNEL),
    [MOBILE_CHANNEL]: createEmptyRow(MOBILE_CHANNEL),
  };

  for (const item of items) {
    if (!SUMMARY_CHANNELS.includes(item.canal as (typeof SUMMARY_CHANNELS)[number])) {
      continue;
    }

    const row = rowsByChannel[item.canal as (typeof SUMMARY_CHANNELS)[number]];
    const tipo = normalizeTipo(item.tipo);
    const amount = Number(item.monto) || 0;

    if (tipo === 'ABONO') {
      row.abonosAmount += amount;
      row.abonosCount += 1;
      continue;
    }

    if (tipo === 'CARGO') {
      row.cargosAmount += amount;
      row.cargosCount += 1;
      continue;
    }

    if (tipo === 'CREDITO') {
      row.creditosTotalAmount += amount;
      row.creditosTotalCount += 1;
      continue;
    }

    if (tipo === 'TC') {
      row.tcCanalAmount += amount;
      row.tcCanalCount += 1;
    }
  }

  const onlineRow = rowsByChannel[ONLINE_CHANNEL];
  const mobileRow = rowsByChannel[MOBILE_CHANNEL];

  return [onlineRow, mobileRow, sumRows(onlineRow, mobileRow)];
};