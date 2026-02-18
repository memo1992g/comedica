'use client';

import React from 'react';
import styles from './Transfer365SquareTable.module.css';

export interface SquareRow {
  concept: string;
  outgoingAmount: number;
  incomingAmount: number;
  netAmount: number;
  isEditable?: boolean;
  isDifference?: boolean;
}

interface Transfer365SquareTableProps {
  data: SquareRow[];
}

export default function Transfer365SquareTable({ data }: Transfer365SquareTableProps) {
  const formatCurrency = (value: number): string => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
    
    return value < 0 ? `-${formatted}` : `${formatted}`;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>CONCEPTO</th>
            <th className={`${styles.headerCell} ${styles.centerAlign}`}>SALIENTES</th>
            <th className={`${styles.headerCell} ${styles.centerAlign}`}>ENTRANTES</th>
            <th className={`${styles.headerCell} ${styles.centerAlign}`}>NETO</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row.concept} 
              className={`${styles.bodyRow} ${row.concept === 'COMÉDICA' ? styles.alternateRow : ''}`}
            >
              <td 
                className={`${styles.bodyCell} ${row.isDifference ? styles.differenceCell : ''}`}
              >
                {row.concept}
              </td>
              <td 
                className={`${styles.bodyCell} ${styles.rightAlign} ${row.isDifference ? styles.differenceCell : ''}`}
              >
                {row.isEditable ? (
                  <div className={styles.inputContainer}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="text" 
                      className={styles.input} 
                      defaultValue="0.00"
                      placeholder="0.00"
                    />
                  </div>
                ) : (
                  <span className={row.isDifference && row.outgoingAmount < 0 ? styles.negativeValue : ''}>
                    {formatCurrency(row.outgoingAmount)}
                  </span>
                )}
              </td>
              <td 
                className={`${styles.bodyCell} ${styles.rightAlign} ${row.isDifference ? styles.differenceCell : ''}`}
              >
                {row.isEditable ? (
                  <div className={styles.inputContainer}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="text" 
                      className={styles.input} 
                      defaultValue="0.00"
                      placeholder="0.00"
                    />
                  </div>
                ) : (
                  <span className={row.isDifference && row.incomingAmount < 0 ? styles.negativeValue : ''}>
                    {formatCurrency(row.incomingAmount)}
                  </span>
                )}
              </td>
              <td 
                className={`${styles.bodyCell} ${styles.rightAlign} ${row.isDifference ? styles.differenceCell : ''}`}
              >
                {row.isEditable ? (
                  <div className={styles.inputContainer}>
                    <span className={styles.currencySymbol}>$</span>
                    <input 
                      type="text" 
                      className={styles.input} 
                      defaultValue="0.00"
                      placeholder="0.00"
                    />
                  </div>
                ) : (
                  formatCurrency(row.netAmount)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
