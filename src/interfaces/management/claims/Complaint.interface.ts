export interface ComplaintFilterI {
  idTipoReclamo?: number;
  estadoReclamo?: string;
  soloConsolidados?: boolean;
  textoBusqueda?: string;
}

export interface ComplaintListRequestI {
  filters: ComplaintFilterI;
  pagination: {
    page: number;
    size: number;
  };
}

export interface ComplaintI {
  id: number;
  idChannelCoreUser: number;
  idTipoReclamo: number;
  dui: string;
  nombreCliente: string;
  monto: number;
  descripcion: string;
  idEstadoReclamo: number;
  idEstadoResolucion: number | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateComplaintRequestI {
  idChannelCoreUser: number;
  idTipoReclamo: number;
  dui: string;
  nombreCliente: string;
  monto: number;
  descripcion: string;
}

export interface UpdateComplaintRequestI {
  idEstadoReclamo: number;
  idEstadoResolucion: number;
}

export interface CatalogItemI {
  id: number;
  name: string;
  description?: string;
}
