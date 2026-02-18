'use client';

import React from 'react';
import { LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import styles from './styles/ModuleHeader.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ModuleHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ breadcrumbs = [], isSidebarCollapsed, onToggleSidebar }) => {
  const logout = useAuthStore((state) => state.logout);
  const hasBreadcrumbs = breadcrumbs.length > 0;
  const lastUpdated = new Date().toLocaleString('es-SV', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {isSidebarCollapsed && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={styles.toggleButton}
            aria-label="Expandir sidebar"
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        )}
      {hasBreadcrumbs ? (
        <nav className={styles.breadcrumb} aria-label="Navegacion de ruta">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className={styles.separator}>&gt;</span>}
              {item.href && index < breadcrumbs.length - 1 ? (
                <a href={item.href} className={styles.breadcrumbItem}>
                  {item.label}
                </a>
              ) : (
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? styles.breadcrumbItemActive
                      : styles.breadcrumbItem
                  }
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      ) : (
        <div className={styles.statusText}>
          Ultima actualizacion de datos: {lastUpdated}
        </div>
      )}
      </div>
      <button
        onClick={handleLogout}
        className={styles.logoutButton}
        aria-label="Cerrar sesion"
        type="button"
      >
        <LogOut size={20} />
      </button>
    </header>
  );
};
