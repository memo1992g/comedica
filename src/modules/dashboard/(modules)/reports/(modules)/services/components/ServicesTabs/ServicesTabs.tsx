'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ServicesTab } from '../../types/service-types';
import styles from './ServicesTabs.module.css';

interface ServicesTabsProps {
  activeTab: ServicesTab;
  onTabChange: (tab: ServicesTab) => void;
}

const tabs: { id: ServicesTab; label: string }[] = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'seguros_comedica', label: 'Seguros comédica' },
  { id: 'ministerio_hacienda', label: 'Ministerio de hacienda' },
];

export default function ServicesTabs({ activeTab, onTabChange }: ServicesTabsProps) {
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
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            className={styles.tabTrigger}
            data-state={activeTab === tab.id ? 'active' : 'inactive'}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div 
          className={styles.indicator}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
    </div>
  );
}
