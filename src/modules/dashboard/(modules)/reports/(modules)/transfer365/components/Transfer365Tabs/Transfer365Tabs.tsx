'use client';

import React from 'react';
import styles from './Transfer365Tabs.module.css';

export type Transfer365Tab = 'transfer365' | 'transfer365-card' | 'cuadre' | 'cuadre-card';

interface Transfer365TabsProps {
  activeTab: Transfer365Tab;
  onTabChange: (tab: Transfer365Tab) => void;
}

export default function Transfer365Tabs({ activeTab, onTabChange }: Transfer365TabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <button
        className={`${styles.tab} ${activeTab === 'transfer365' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('transfer365')}
      >
        Transfer365
        {activeTab === 'transfer365' && <div className={styles.tabIndicator} />}
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'transfer365-card' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('transfer365-card')}
      >
        Transfer365 CA-RD
        {activeTab === 'transfer365-card' && <div className={styles.tabIndicator} />}
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'cuadre' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('cuadre')}
      >
        Cuadre Transfer365
        {activeTab === 'cuadre' && <div className={styles.tabIndicator} />}
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'cuadre-card' ? styles.tabActive : ''}`}
        onClick={() => onTabChange('cuadre-card')}
      >
        Cuadre CA-RD
        {activeTab === 'cuadre-card' && <div className={styles.tabIndicator} />}
      </button>
    </div>
  );
}
