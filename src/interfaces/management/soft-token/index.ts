export interface SoftTokenFlowI {
  idFlow: number;
  flowCode: string;
  flowName: string;
  category: "TRANSACTIONAL" | "ADMINISTRATIVE";
  hasAmount: number;
  status: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface SoftTokenConfigI {
  configId: number;
  flowId: number;
  flowCode: string;
  flowName: string;
  productCode: string | null;
  productName: string | null;
  typeCode: string | null;
  typeName: string | null;
  amountLimit: number | null;
  tokenRequired: boolean;
}

export interface SaveSoftTokenConfigRequestI {
  flow: string;
  product: string | null;
  transactionType: string | null;
  amount: number | null;
  tokenRequired: boolean;
}
