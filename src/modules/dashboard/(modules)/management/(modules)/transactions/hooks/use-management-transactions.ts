import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { getCustomTableColumns } from '@/components/common/CustomTable/utils/get-custom-table-columns';
import { useCustomTable } from '@/components/common/CustomTable/hooks/use-custom-table';
import { transactionsColumns } from '../utils/transactions-columns';
import { mockTransactionsData } from '../data/mock-data';
import type { TransactionPxSsfI } from '@/interfaces/management/transactions';
import {
  uploadExcelAction,
  saveTransactionsAction,
  exportXmlFromBodyAction,
} from '@/actions/management/transactions';

export type TransactionState = 'empty' | 'loaded' | 'saved';

export function useManagementTransactions() {
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
    data: txState === 'empty' ? [] : data,
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: 10,
  });

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
    const result = await saveTransactionsAction([...transacciones]);
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
    // Reconstruct Blob from base64 (Blob can't cross Server Action boundary)
    const binary = atob(result.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaccion.xml';
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return {
    fileInputRef,
    fileName,
    isUploading,
    isSaving,
    isExporting,
    txState,
    error,
    currentPage,
    setCurrentPage,
    totalItems,
    startItem,
    endItem,
    table,
    handleUploadClick,
    handleFileChange,
    handleSave,
    handleExportXml,
  };
}
