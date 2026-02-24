export interface ComplaintFilterI {
  idTipoReclamo?: number;
  estadoReclamo?: string;
  soloConsolidados?: boolean;
  textoBusqueda?: string;
  fechaPresentaDesde?: string;
  fechaPresentaHasta?: string;
}

export interface ComplaintListRequestI {
  filters: ComplaintFilterI;
  pagination: {
    page: number;
    size: number;
  };
}

export interface ComplaintI {
  idReclamo: number;
  canal: string;
  tipo: string;
  dui: string;
  nombreCliente: string;
  fechaPresenta: string;
  descripcion: string;
  monto: number;
  estadoReclamo: string;
  estadoResolucion: string;
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

export interface ReclaimXmlItemI {
  codigoCorresponsal: string;
  administrador: string;
  tipoTransaccion: string;
  numeroControl: string;
  fecha: string;
  tipoDocumento: string;
  numeroDocumento: string;
  motivo: string;
  descripcion: string;
  estado: string;
  resultadoResolucion: string;
  fechaResolucion: string;
  montoReclamado: number;
}
