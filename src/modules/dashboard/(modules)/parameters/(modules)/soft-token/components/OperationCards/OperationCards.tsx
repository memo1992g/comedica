'use client';

import React from 'react';
import type { SoftTokenOperationConfig } from '../../hooks/use-soft-token';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import styles from '../../styles/SoftToken.module.css';

interface OperationCardsProps {
  label: string;
  items: SoftTokenOperationConfig[];
  showAmount?: boolean;
  onChangeAmount?: (key: string, val: number) => void;
  onChangeRequired: (key: string, val: boolean) => void;
}

export default function OperationCards({
  label,
  items,
  showAmount,
  onChangeAmount,
  onChangeRequired,
}: OperationCardsProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>{label}</p>
      <div className={styles.cardsGrid}>
        {items.map((item) => (
          <div key={item.key} className={styles.card}>
            <h3 className={styles.cardTitle}>{item.label}</h3>
            <div className={styles.cardFields}>
              {showAmount && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Monto</label>
                  <input
                    type="number"
                    className={styles.fieldInput}
                    value={item.amount ?? 0}
                    onChange={(e) => onChangeAmount?.(item.key, Number(e.target.value))}
                    min={0}
                  />
                </div>
              )}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Requiere Soft Token</label>
                <Select
                  value={item.requiresSoftToken ? 'si' : 'no'}
                  onValueChange={(v) => onChangeRequired(item.key, v === 'si')}
                >
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
