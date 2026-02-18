
'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Upload, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import CustomTable from '@/components/common/CustomTable/CustomTable';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { transactionsColumns } from './utils/transactions-columns';
import { mockTransactionsData } from './data/mock-data';
import type { TransactionPxSsfI } from '@/interfaces/management/transactions';
import ManagementTableSkeleton from '@/components/common/ManagementTableSkeleton/ManagementTableSkeleton';
import {
  uploadExcelAction,
  saveTransactionsAction,
  exportXmlFromBodyAction,
} from '@/actions/management/transactions';
import styles from './styles/ManagementTransactions.module.css';
import '../../styles/CustomTableOverrides.css';

type TransactionState = 'empty' | 'loaded' | 'saved';

export default function ManagementTransactions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [txState, setTxState] = useState<TransactionState>('empty');
  const [transacciones, setTransacciones] = useState<TransactionPxSsfI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const data = transacciones.length > 0 ? transacciones : mockTransactionsData;
  const totalItems = data.length;
  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalItems);

  const columns = useMemo(
    () => getCustomTableColumns({ columns: transactionsColumns }),
    []
  );

  const { table } = useCustomTable({
    data: txState !== 'empty' ? data : [],
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: 10,
  });

  const renderTableContent = () => {
    if (isUploading) {
      return <ManagementTableSkeleton rows={8} columns={5} />;
    }
    if (txState === 'empty') {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Upload className={styles.emptyIconSvg} />
          </div>
          <p className={styles.emptyTitle}>No hay datos para mostrar</p>
          <p className={styles.emptyHint}>
            Cargue un archivo Excel para visualizar la información
          </p>
        </div>
      );
    }
    return (
      <div data-custom-table>
        <CustomTable table={table} />
      </div>
    );
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('archivo', file);

    const result = await uploadExcelAction(formData);

    if (result.errors || !result.data) {
      setError(result.errorMessage || 'Error al cargar el archivo');
      setIsUploading(false);
      return;
    }

    setFileName(result.data.fileName);
    setTransacciones(result.data.transacciones);
    setIsUploading(false);
    setTxState('loaded');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const result = await saveTransactionsAction(transacciones);

    if (result.errors) {
      setError(result.errorMessage || 'Error al guardar las transacciones');
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setTxState('saved');
  };

  const handleExportXml = async () => {
    setIsExporting(true);
    setError(null);

    const result = await exportXmlFromBodyAction(transacciones);

    if (result.errors || !result.data) {
      setError(result.errorMessage || 'Error al exportar XML');
      setIsExporting(false);
      return;
    }

    const url = URL.createObjectURL(result.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaccion.xml';
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Transacciones</h2>
          <p className={styles.subtitle}>
            Consulta y generación de reportes mensuales de transacciones.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.uploadBar}>
            <div className={styles.uploadInfoRow}>
              <div>
                <p className={styles.uploadTitle}>Carga de Archivo Excel</p>
                <p className={styles.uploadHint}>
                  Seleccione el archivo mensual proporcionado por Punto Xpress
                </p>
              </div>
              <div className={styles.uploadActions}>
                {txState === 'loaded' && (
                  <Button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={isSaving}
                    isLoading={isSaving}
                  >
                    Guardar en Base de Datos
                  </Button>
                )}
                <Button
                  className={styles.uploadButton}
                  leftIcon={<Upload size={16} />}
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  isLoading={isUploading}
                >
                  Cargar archivo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {renderTableContent()}

          <div className={styles.cardFooter}>
            {txState === 'saved' && (
              <div className={styles.xmlButtons}>
                <Button
                  key="xml-transacciones"
                  variant="outline"
                  size="sm"
                  leftIcon={<FileText size={12} />}
                  className={styles.xmlButton}
                  onClick={handleExportXml}
                  disabled={isExporting}
                  isLoading={isExporting}
                >
                  XML Transacciones
                </Button>
              </div>
            )}
            {fileName && txState === 'empty' && (
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{fileName}</span>
                <span className={styles.fileDate}>
                  — {new Date().toLocaleDateString('es-SV')}
                </span>
              </div>
            )}
            {txState !== 'empty' && (
              <div className={styles.paginationInfo}>
                <span className={styles.paginationText}>
                  {startItem}-{endItem} de {totalItems}
                </span>
                <div className={styles.paginationButtons}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.pageButton}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.pageButton}
                    disabled={endItem >= totalItems}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}