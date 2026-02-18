import type { UserResult } from '../../../data/mock-data';
import detailStyles from '../../user-detail-info/styles/user-detail.module.css';

interface UserStateHeaderProps {
  user: UserResult;
}

export default function UserStateHeader({ user }: UserStateHeaderProps) {
  return (
    <div className={detailStyles.bannerSection}>
      <div className={detailStyles.banner} />
      <div className={detailStyles.avatarWrapper}>
        <div className={detailStyles.avatar}>{user.initials}</div>
      </div>
      <h3 className={detailStyles.userName}>{user.name}</h3>
      <p className={detailStyles.userMeta}>
        ID: {user.id} <span className={detailStyles.dot}>•</span> DUI: {user.dui}
      </p>
    </div>
  );
}
