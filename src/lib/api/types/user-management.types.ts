export interface UserManagementProfile {
  id: string;
  associatedNumber: string;
  name: string;
  dui: string;
  phone: string;
  email: string;
  username: string;
  status: 'Activo' | 'Inactivo' | 'Bloqueado';
}

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function toConsultationUser(profile: UserManagementProfile) {
  const initials = initialsFromName(profile.name);

  return {
    id: profile.associatedNumber || profile.id,
    name: profile.name,
    dui: profile.dui,
    phone: profile.phone,
    email: profile.email,
    username: profile.username,
    status: profile.status,
    notificationMode: 'Email',
    initials,
    avatarColor: '#23366a',
  };
}

export function toSupportUser(profile: UserManagementProfile) {
  const initials = initialsFromName(profile.name);

  return {
    id: profile.associatedNumber || profile.id,
    name: profile.name,
    dui: profile.dui,
    initials,
    status: profile.status,
    username: profile.username,
  };
}
