'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ModuleHeader, BreadcrumbItem } from './components/ModuleHeader/ModuleHeader';
import { sidebarItems } from '@/components/layout/DashboardSidebar/consts/dashboard-sidebar.config';

type RouteEntry = { label: string; parent?: string; parentLabel?: string };

// Mapeo de rutas a breadcrumbs derivado del sidebar
const routeMap: Record<string, RouteEntry> = (() => {
  const map: Record<string, RouteEntry> = {};

  sidebarItems.forEach((item) => {
    map[item.href] = { label: item.label };

    if (item.basePath && item.basePath !== item.href) {
      map[item.basePath] = { label: item.label };
    }

    if (item.children && item.children.length > 0) {
      const parentPath = item.basePath ?? item.href;
      item.children.forEach((child) => {
        map[child.href] = {
          label: child.label,
          parent: parentPath,
          parentLabel: item.label,
        };
      });
    }
  });

  return map;
})();

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Si es la ruta principal del dashboard, no mostrar breadcrumb
  if (pathname === '/dashboard') {
    return [];
  }

  const route = routeMap[pathname];
  
  if (!route) {
    // Ruta no encontrada, intenta generar breadcrumbs desde la URL
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [];
    
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return {
        label,
        href: index < segments.length - 1 ? path : undefined,
      };
    });
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Agregar breadcrumb padre si existe
  if (route.parent && route.parentLabel) {
    breadcrumbs.push({
      label: route.parentLabel,
      href: route.parent,
    });
  }
  
  // Agregar breadcrumb actual (sin href porque es la página activa)
  breadcrumbs.push({
    label: route.label,
  });
  
  return breadcrumbs;
}

interface DashboardHeaderProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function DashboardHeader({ isSidebarCollapsed, onToggleSidebar }: Readonly<DashboardHeaderProps>) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname || '/dashboard');

  return (
    <ModuleHeader
      breadcrumbs={breadcrumbs}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={onToggleSidebar}
    />
  );
}
