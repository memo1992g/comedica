export interface CorrespondentI {
  id: number;
  internalCode: string;
  codeSsf: string;
  type: string;
  name: string;
  comercialName: string;
  assignmentDate: string;
  status: string;
  terminationDate: string | null;
  terminationFlow: string | null;
  nit: string;
  address: string;
  municipality: string;
  department: string;
  coordinates: string;
  schedule: string;
  districtCodePx: number;
  districtCodeOr: number;
  creationUser: string;
  creationDate: string;
  modifyUser: string | null;
  modifyDate: string | null;
}

export interface CorrespondentFilterI {
  etcxCreationDateFrom?: string;
  etcxCreationDateTo?: string;
}

export interface CorrespondentListRequestI {
  filters: CorrespondentFilterI;
  pagination: {
    page: number;
    pageSize: number;
  };
}

export interface CreateCorrespondentRequestI {
  internalCode: string;
  codeSsf: string;
  type: string;
  name: string;
  comercialName: string;
  assignmentDate: string;
  status: string;
  terminationDate?: string;
  terminationFlow?: string;
  nit: string;
  address: string;
  municipality: string;
  department: string;
  coordinates: string;
  schedule: string;
  districtCodePx: number;
  districtCodeOr: number;
  creationUser: string;
  creationDate: string;
  modifyUser?: string;
  modifyDate?: string;
}

export interface UpdateCorrespondentRequestI extends CreateCorrespondentRequestI {
  id: number;
}

export interface CorrespondentXmlItemI {
  codigoCorresponsal: string;
  codigoInterno: string;
  administrador: string;
  fechaContratacion: string;
  fechaInicio: string;
  estado: string;
  fechaFinContrato: string;
  causaTerminacion: string;
}

export interface DeleteCorrespondentRequestI {
  id: number;
  internalCode: string;
  codeSsf: string;
  type: string;
  name: string;
  comercialName: string;
  assignmentDate: string;
  status: string;
  terminationDate: string | null;
  terminationFlow: string | null;
  nit: string;
  address: string;
  municipality: string;
  department: string;
  coordinates: string;
  schedule: string;
  districtCodePx: number;
  districtCodeOr: number;
  creationUser: string;
  creationDate: string;
  modifyUser: string;
  modifyDate: string;
}
