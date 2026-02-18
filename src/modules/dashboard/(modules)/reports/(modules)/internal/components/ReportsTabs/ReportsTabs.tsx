'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import styles from './styles/ReportsTabs.module.css';

type ReportTab = 'abonos' | 'cargos' | 'pagos' | 'creditos' | 'consolidado' | 'resumen';

interface ReportsTabsProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
}

const tabs: { id: ReportTab; label: string }[] = [
  { id: 'abonos', label: 'Abonos' },
  { id: 'cargos', label: 'Cargos' },
  { id: 'pagos', label: 'Pagos TC' },
  { id: 'creditos', label: 'Créditos' },
  { id: 'consolidado', label: 'Consolidado' },
  { id: 'resumen', label: 'Resumen' },
];

export default function ReportsTabs({ activeTab, onTabChange }: ReportsTabsProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ReportTab)} className={styles.tabsContainer}>
      <TabsList className={styles.tabsList}>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            className={styles.tabTrigger}
          >
            {tab.label}
          </TabsTrigger>
        ))}
        <div 
          className={styles.indicator}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </TabsList>
    </Tabs>
  );
}
