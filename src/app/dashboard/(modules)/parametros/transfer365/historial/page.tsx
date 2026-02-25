import { redirect } from 'next/navigation';

export default function LegacyTransfer365HistoryRedirectPage() {
  redirect('/dashboard/mantenimiento/transfer365/historial');
}
