export type SubItem = {
  label: string;
  href: string;
};

export type Item = {
  label: string;
  href: string;
  icon: string;
  basePath?: string;
  children?: SubItem[];
};

const iconOverview = "/images/dashboard/overview.svg";
const iconParametros = "/images/dashboard/parametros.svg";
const iconMantenimiento = "/images/dashboard/mantenimiento.svg";
const iconReportes = "/images/dashboard/reportes.svg";
const iconGestiones = "/images/dashboard/gestiones.svg";
const iconUsuarios = "/images/dashboard/usuarios.svg";

export const iconChevronRight = "/images/dashboard/chevron-right.svg";
export const iconChevronDown = "/images/dashboard/chevron-down.svg";

export const sidebarItems: Item[] = [
  { label: "Overview", href: "/dashboard", icon: iconOverview },
  {
    label: "Parámetros",
    href: "/dashboard/parametros",
    basePath: "/dashboard/parametros",
    icon: iconParametros,
    children: [
      {
        label: "Límites y Montos",
        href: "/dashboard/parametros/limites-y-montos",
      },
      {
        label: "Configuraciones de Seguridad",
        href: "/dashboard/parametros/seguridad",
      },
      { label: "Red Transfer365", href: "/dashboard/parametros/transfer365" },
    ],
  },
  {
    label: "Mantenimiento de",
    href: "/dashboard/mantenimiento/atencion-soporte",
    basePath: "/dashboard/mantenimiento",
    icon: iconMantenimiento,
    children: [
      {
        label: "Atención y Soporte",
        href: "/dashboard/mantenimiento/atencion-soporte",
      },
      {
        label: "Cuestionario de Seguridad para Soporte Telefónico",
        href: "/dashboard/mantenimiento/cuestionario-seguridad",
      },
      { label: "Imágenes", href: "/dashboard/mantenimiento/imagenes" },
      {
        label: "Catálogo de productos",
        href: "/dashboard/mantenimiento/catalogo-productos",
      },
    ],
  },
  {
    label: "Reportes",
    href: "/dashboard/reportes/recurrentes",
    basePath: "/dashboard/reportes",
    icon: iconReportes,
    children: [
      { label: "Reportes Internos", href: "/dashboard/reportes/internos" },
      {
        label: "Reportes Transfer365",
        href: "/dashboard/reportes/transfer365",
      },
      {
        label: "Reportes Recurrentes",
        href: "/dashboard/reportes/recurrentes",
      },
      {
        label: "Reportes de Servicios/Eventos",
        href: "/dashboard/reportes/servicios-eventos",
      },
      {
        label: "Corresponsales Financieros",
        href: "/dashboard/reportes/corresponsales-financieros",
      },
    ],
  },
  {
    label: "Gestiones",
    href: "/dashboard/gestiones/punto-express",
    basePath: "/dashboard/gestiones",
    icon: iconGestiones,
    children: [      
      { label: "Corresponsales", href: "/dashboard/gestiones/corresponsales" },
      { label: "Reclamos", href: "/dashboard/gestiones/reclamos" },
      { label: "Transacciones", href: "/dashboard/gestiones/transacciones" },
    ],
  },
  {
    label: "Usuarios",
    href: "/dashboard/usuarios",
    icon: iconUsuarios,
    children: [
      { label: "Soporte a usuarios", href: "/dashboard/usuarios/soporte-usuarios" },
      { label: "Consulta de usuarios", href: "/dashboard/usuarios/consulta-usuarios" },
      { label: "Envío de notificaciones", href: "/dashboard/usuarios/notificaciones" },      
    ],
  },
];
