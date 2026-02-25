import { redirect } from 'next/navigation';

export default function LegacyTransfer365RedirectPage() {
  redirect('/dashboard/mantenimiento/transfer365');
}
