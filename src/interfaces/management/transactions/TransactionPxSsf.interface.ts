export interface TransactionPxSsfI {
  codigoCorresponsal: string;
  transNumTc: number;
  transValTc: number;
  transNumCta: number;
  transValCta: number;
  transNumCr: number;
  transValCr: number;
  totalTrans: number;
  totalValTrans: number;
  datePresents: string;
}

export interface UploadExcelResponseI {
  fileName: string;
  totalRows: number;
  transacciones: TransactionPxSsfI[];
}

export interface SaveTransactionsResponseI {
  saved: number;
  message: string;
}
