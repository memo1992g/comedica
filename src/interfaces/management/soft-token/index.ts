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

export interface SaveSoftTokenConfigRequestI {
  flow: string;
  product: string;
  transactionType: string;
  amount: number;
}
