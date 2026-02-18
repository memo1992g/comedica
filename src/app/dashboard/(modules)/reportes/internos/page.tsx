import { Metadata } from 'next';
import ReportsInternal from '@/modules/dashboard/(modules)/reports/(modules)/internal/ReportsInternal';

export const metadata: Metadata = {
  title: 'Reportes Internos | Comedica Backoffice',
  description: 'Gestión de reportes internos: abonos, cargos, pagos, créditos y consolidados',
};

export default function ReportsInternalPage() {
  return <ReportsInternal />;
}
