export interface ReportRow {
  code: string;
  numTransTC: number;
  valTransTC: number;
  numTransCA: number;
  valTransCA: number;
}

export const mockCorrespondentsData: ReportRow[] = [
  { code: 'CORR-001', numTransTC: 150, valTransTC: 5000, numTransCA: 45, valTransCA: 1200.5 },
  { code: 'CORR-002', numTransTC: 200, valTransTC: 7500.25, numTransCA: 60, valTransCA: 2100 },
  { code: 'CORR-003', numTransTC: 89, valTransTC: 3200.1, numTransCA: 22, valTransCA: 800.9 },
  { code: 'CORR-004', numTransTC: 310, valTransTC: 12000, numTransCA: 95, valTransCA: 3400.5 },
];
