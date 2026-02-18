import apiClient, { getErrorMessage } from './client';

interface BackofficeResult {
  code: number;
  message: string;
}

interface BackofficeEnvelope<T> {
  result?: BackofficeResult;
  data?: T;
}

interface UserManagementConsultRequest {
  associatedNumber: number;
}

interface UserManagementUser {
  associatedNumber?: number;
  associatedClientId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  identification?: string;
  email?: string;
  phoneNumber?: string;
  ebankingStatus?: string;
  username?: string;
}

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

function buildContext() {
  return {
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: 'W',
    requestId: crypto.randomUUID(),
  };
}

function assertSuccess<T>(response: BackofficeEnvelope<T>, fallbackMessage: string): T {
  if (response?.result && response.result.code !== 0) {
    throw new Error(response.result.message || fallbackMessage);
  }

  if (response?.data === undefined || response?.data === null) {
    throw new Error(fallbackMessage);
  }

  return response.data;
}

function normalizeStatus(status?: string): 'Activo' | 'Inactivo' | 'Bloqueado' {
  const value = (status || '').toUpperCase();
  if (value.includes('BLOCK')) {
    return 'Bloqueado';
  }
  if (value.includes('INACTIVE') || value === 'I') {
    return 'Inactivo';
  }
  return 'Activo';
}

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function normalizeProfile(raw: UserManagementUser): UserManagementProfile {
  const name = raw.fullName || [raw.firstName, raw.lastName].filter(Boolean).join(' ').trim() || 'Sin nombre';

  return {
    id: String(raw.associatedClientId ?? raw.associatedNumber ?? raw.username ?? ''),
    associatedNumber: String(raw.associatedNumber ?? ''),
    name,
    dui: raw.identification ?? '-',
    phone: raw.phoneNumber ?? '-',
    email: raw.email ?? '-',
    username: raw.username ?? '-',
    status: normalizeStatus(raw.ebankingStatus),
  };
}

export const userManagementService = {
  async consultUser(associatedNumber: number): Promise<UserManagementProfile> {
    try {
      const response = await apiClient.post<BackofficeEnvelope<UserManagementUser>>('/user-management/consult', {
        ...buildContext(),
        request: { associatedNumber } satisfies UserManagementConsultRequest,
      });

      const data = assertSuccess(response.data, 'No se encontró información del usuario');
      return normalizeProfile(data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async blockUser(username: string): Promise<void> {
    try {
      await apiClient.post<BackofficeEnvelope<string>>('/user-management/block', {
        ...buildContext(),
        request: { username },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async unblockUser(username: string): Promise<void> {
    try {
      await apiClient.post<BackofficeEnvelope<string>>('/user-management/unblock', {
        ...buildContext(),
        request: { username },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async inactivateUser(username: string): Promise<void> {
    try {
      await apiClient.post<BackofficeEnvelope<string>>('/user-management/inactivate', {
        ...buildContext(),
        request: { username },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  toConsultationUser(profile: UserManagementProfile) {
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
  },

  toSupportUser(profile: UserManagementProfile) {
    const initials = initialsFromName(profile.name);

    return {
      id: profile.associatedNumber || profile.id,
      name: profile.name,
      dui: profile.dui,
      initials,
      status: profile.status,
      username: profile.username,
    };
  },
};
