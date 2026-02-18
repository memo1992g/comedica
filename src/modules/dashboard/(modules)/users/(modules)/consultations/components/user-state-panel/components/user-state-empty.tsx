import { User } from 'lucide-react';
import detailStyles from '../../user-detail-info/styles/user-detail.module.css';

export default function UserStateEmpty() {
  return (
    <div className={detailStyles.emptyState}>
      <div className={detailStyles.emptyIcon}>
        <User className={detailStyles.emptyIconSvg} />
      </div>
      <p className={detailStyles.emptyText}>
        Seleccione un usuario para gestionar su estado
      </p>
    </div>
  );
}
