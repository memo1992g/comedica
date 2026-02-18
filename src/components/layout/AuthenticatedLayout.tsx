'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardSidebar from '@/components/layout/DashboardSidebar/DashboardSidebar';
import styles from '@/app/dashboard/styles/dashboardLayout.module.css';
import DashboardHeader from '@/components/layout/DashboardHeader/DashboardHeader';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: Readonly<AuthenticatedLayoutProps>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => setIsHydrated(true), []);

  useEffect(() => {
    if (isHydrated && (!token || !user)) router.push('/auth/login');
  }, [isHydrated, token, user, router]);

  if (!isHydrated) {
    return (
      <div className={styles.loaderWrap}>
        <div className={styles.loader} />
        <div className={styles.loaderText}>Cargando...</div>
      </div>
    );
  }

  if (!token || !user) return null;

  return (
    <div className={styles.shell}>
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((v) => !v)}
      />

      <div className={isSidebarCollapsed ? styles.contentCollapsed : styles.contentExpanded}>
        <DashboardHeader
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)}
        />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
