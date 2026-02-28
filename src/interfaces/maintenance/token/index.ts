export interface TokenDeviceI {
  id: number | null;
  deviceCode: string;
  alias: string;
  lastAccess: string | null;
  operatingSystem: string | null;
  deviceBrand: string | null;
  deviceModel: string | null;
  deviceImei: string | null;
  status: number;
  createdUser: string | null;
  createdDate: string | null;
  updateUser: string | null;
  updateDate: string | null;
}

export interface TokenIdentityI {
  id: number;
  clientId: number;
  credential: string;
  identityCode: string;
  status: number;
  createdUser: string;
  createdDate: string;
  updateUser: string | null;
  updateDate: string | null;
  changeReason: string | null;
  devices: TokenDeviceI[];
}

export interface TokenClientI {
  clientName: string;
  associateNumber: number;
  clientId: number;
}

export interface AssociateIdentityWithDevicesDataI {
  client: TokenClientI;
  identities: TokenIdentityI[];
}
