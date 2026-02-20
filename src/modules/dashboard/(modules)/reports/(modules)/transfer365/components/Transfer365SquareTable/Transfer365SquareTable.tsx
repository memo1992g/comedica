'use client';

import React, { useState, useEffect } from 'react';
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

function parseAmount(value: string): number {
  const cleaned = value.replaceAll(',', '').trim();
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  return value < 0 ? `-${formatted}` : formatted;
}

/** Allows only digits and one decimal point while typing; formats thousands on blur. */
function maskInput(raw: string): string {
  // Strip anything that isn't a digit or dot
  let cleaned = raw.replaceAll(/[^\d.]/g, '');
  // Keep only the first dot
  const dotIndex = cleaned.indexOf('.');
  if (dotIndex !== -1) {
    cleaned = cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replaceAll('.', '');
  }
  return cleaned;
}

function formatMasked(value: string): string {
  const num = Number.parseFloat(value.replaceAll(',', ''));
  if (Number.isNaN(num)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

interface MaskedInputProps {
  value: string;
  onChange: (v: string) => void;
}

function MaskedInput({ value, onChange }: Readonly<MaskedInputProps>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(maskInput(e.target.value));
  };

  const handleBlur = () => {
    onChange(formatMasked(value));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Strip formatting so the user can edit the raw number
    const raw = value.replaceAll(',', '');
    onChange(raw === '0.00' ? '' : raw);
    e.target.select();
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      className={styles.input}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder="0.00"
    />
  );
}

export default function Transfer365SquareTable({ data }: Readonly<Transfer365SquareTableProps>) {
  const comedica = data.find((r) => r.concept === 'COMÉDICA');

  const [bcrOutgoing, setBcrOutgoing] = useState('0.00');
  const [bcrIncoming, setBcrIncoming] = useState('0.00');
  const [bcrNet, setBcrNet] = useState('0.00');

  // Reset BCR inputs when the COMÉDICA data changes (new fetch)
  useEffect(() => {
    setBcrOutgoing('0.00');
    setBcrIncoming('0.00');
    setBcrNet('0.00');
  }, [comedica?.outgoingAmount, comedica?.incomingAmount, comedica?.netAmount]);

  const diffOutgoing = parseAmount(bcrOutgoing) - (comedica?.outgoingAmount ?? 0);
  const diffIncoming = parseAmount(bcrIncoming) - (comedica?.incomingAmount ?? 0);
  const diffNet = parseAmount(bcrNet) - (comedica?.netAmount ?? 0);

  function diffClass(value: number): string {
    if (value >= 0) return styles.positiveValue;
    return styles.negativeValue;
  }

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
          {data.map((row) => {
            if (row.isDifference) {
              return (
                <tr key={row.concept} className={styles.bodyRow}>
                  <td className={`${styles.bodyCell} ${styles.differenceLabel}`}>{row.concept}</td>
                  <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                    <span className={diffClass(diffOutgoing)}>{formatCurrency(diffOutgoing)}</span>
                  </td>
                  <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                    <span className={diffClass(diffIncoming)}>{formatCurrency(diffIncoming)}</span>
                  </td>
                  <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                    <span className={diffClass(diffNet)}>{formatCurrency(diffNet)}</span>
                  </td>
                </tr>
              );
            }

            if (row.isEditable) {
              return (
                <tr key={row.concept} className={styles.bodyRow}>
                  <td className={styles.bodyCell}>{row.concept}</td>
                  <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                    <div className={styles.inputContainer}>
                      <span className={styles.currencySymbol}>$</span>
                      <MaskedInput value={bcrOutgoing} onChange={setBcrOutgoing} />
                    </div>
                  </td>
                  <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                    <div className={styles.inputContainer}>
                      <span className={styles.currencySymbol}>$</span>
                      <MaskedInput value={bcrIncoming} onChange={setBcrIncoming} />
                    </div>
                  </td>
                  <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                    <div className={styles.inputContainer}>
                      <span className={styles.currencySymbol}>$</span>
                      <MaskedInput value={bcrNet} onChange={setBcrNet} />
                    </div>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={row.concept} className={`${styles.bodyRow} ${styles.alternateRow}`}>
                <td className={styles.bodyCell}>{row.concept}</td>
                <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                  {formatCurrency(row.outgoingAmount)}
                </td>
                <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                  {formatCurrency(row.incomingAmount)}
                </td>
                <td className={`${styles.bodyCell} ${styles.rightAlign}`}>
                  {formatCurrency(row.netAmount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
