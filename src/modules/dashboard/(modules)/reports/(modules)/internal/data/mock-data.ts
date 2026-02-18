import { TransactionData } from '../utils/columns';
import { SummaryRow } from '../components/ReportsSummaryTable/ReportsSummaryTable';

export const mockTransactions: TransactionData[] = [
  {
    id: '1',
    date: '27/12/2025',
    time: '21:05',
    accountOrigin: '1087702565',
    nameOrigin: 'María García',
    idOrigin: '41316',
    accountDestination: '2067534862',
    nameDestination: 'Roberto Sánchez',
    idDestination: '13690',
    amount: 116.35,
    channel: 'Banca en línea',
  },
  {
    id: '2',
    date: '12/01/2026',
    time: '21:04',
    accountOrigin: '1071874976',
    nameOrigin: 'Carlos López',
    idOrigin: '28457',
    accountDestination: '207572065',
    nameDestination: 'Laura Torres',
    idDestination: '19234',
    amount: 686.9,
    channel: 'Banca en línea',
  },
];

export const mockSummaryData: SummaryRow[] = [
  {
    canal: 'Banca en línea',
    abonosAmount: 1526.3,
    abonosCount: 5,
    cargosAmount: 3514.2,
    cargosCount: 8,
    creditosTotalAmount: 21633.14,
    creditosTotalCount: 18,
    tcCanalAmount: 6822.94,
    tcCanalCount: 2,
  },
  {
    canal: 'Banca Móvil',
    abonosAmount: 628.93,
    abonosCount: 1,
    cargosAmount: 5610.2,
    cargosCount: 9,
    creditosTotalAmount: 8109.96,
    creditosTotalCount: 9,
    tcCanalAmount: 8729.38,
    tcCanalCount: 4,
  },
  {
    canal: 'TOTAL GENERAL',
    abonosAmount: 2155.23,
    abonosCount: 6,
    cargosAmount: 9124.4,
    cargosCount: 17,
    creditosTotalAmount: 29743.1,
    creditosTotalCount: 27,
    tcCanalAmount: 15552.32,
    tcCanalCount: 6,
    isTotal: true,
  },
];
