'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecurringTab } from '../../types';
import styles from './RecurringTabs.module.css';

interface RecurringTabsProps {
  activeTab: RecurringTab;
  onTabChange: (tab: RecurringTab) => void;
}

const tabs: { id: RecurringTab; label: string }[] = [
  { id: 'recurrentes', label: 'Reporte Transfer365 Recurrentes' },
  { id: 'ejecutadas', label: 'Reportes Transfer365 Recurrentes Ejecutadas' },
];

export default function RecurringTabs({ activeTab, onTabChange }: RecurringTabsProps) {
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
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as RecurringTab)} className={styles.tabsContainer}>
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
