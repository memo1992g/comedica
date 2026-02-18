import type {
  DebitReportItem,
  CreditReportItem,
  PaymentAccountReportItem,
  ConsolidatedReportItem,
  TcReportItem,
} from '@/interfaces/reports';
import { TransactionData } from './columns';

export function mapDebitItems(items: DebitReportItem[]): TransactionData[] {
  return items.map((item, i) => ({
    id: `cargos-${i}`,
    date: item.dateTransaction,
    time: '',
    accountOrigin: item.debitedAccount,
    nameOrigin: item.debitAccountHolder ?? '',
    idOrigin: item.associateNumber,
    accountDestination: item.creditedAccount,
    nameDestination: item.creditAccountHolder ?? '',
    idDestination: '',
    amount: item.amount,
    channel: item.channel ?? '',
  }));
}

export function mapCreditItems(items: CreditReportItem[]): TransactionData[] {
  return items.map((item, i) => ({
    id: `creditos-${i}`,
    date: item.transactionDate,
    time: '',
    accountOrigin: item.accountToCharge,
    nameOrigin: item.accountHolderToCharge,
    idOrigin: item.customerToCharge,
    accountDestination: item.accountToPay,
    nameDestination: item.accountHolderToPay,
    idDestination: item.customerToPay,
    amount: item.amount,
    channel: item.channels,
  }));
}

export function mapPaymentAccountItems(items: PaymentAccountReportItem[]): TransactionData[] {
  return items.map((item, i) => ({
    id: `abonos-${i}`,
    date: item.transactionDate,
    time: '',
    accountOrigin: item.debitAccount,
    nameOrigin: '',
    idOrigin: item.debitCustomerId,
    accountDestination: item.creditAccount,
    nameDestination: '',
    idDestination: item.creditCustomerId,
    amount: item.amount,
    channel: '',
  }));
}

export function mapConsolidatedItems(items: ConsolidatedReportItem[]): TransactionData[] {
  return items.map((item, i) => ({
    id: `consolidado-${i}`,
    date: item.fecha,
    time: '',
    accountOrigin: item.cuentaOrigen,
    nameOrigin: '',
    idOrigin: item.associateNumber,
    accountDestination: item.cuentaDestino,
    nameDestination: '',
    idDestination: '',
    amount: item.monto,
    channel: item.canal,
  }));
}

export function mapTcItems(items: TcReportItem[]): TransactionData[] {
  return items.map((item, i) => ({
    id: `pagos-tc-${i}`,
    date: item.fecha,
    time: '',
    accountOrigin: item.cuentaOrigen,
    nameOrigin: item.nombreOrigen,
    idOrigin: item.idOrigen,
    accountDestination: item.tarjetaDestino,
    nameDestination: item.nombreDestino,
    idDestination: item.idDestino,
    amount: item.monto,
    channel: item.canal,
  }));
}
