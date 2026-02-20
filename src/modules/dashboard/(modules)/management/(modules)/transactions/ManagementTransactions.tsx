"use client";

import { Upload, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import ManagementTableSkeleton from "@/components/common/ManagementTableSkeleton/ManagementTableSkeleton";
import { useManagementTransactions } from "./hooks/use-management-transactions";
import styles from "./styles/ManagementTransactions.module.css";
import "../../styles/CustomTableOverrides.css";

export default function ManagementTransactions() {
  const {
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
  } = useManagementTransactions();

  const renderTableContent = () => {
    if (isUploading) return <ManagementTableSkeleton rows={8} columns={5} />;
    if (txState === "empty")
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
    return (
      <div data-custom-table>
        <CustomTable table={table} />
      </div>
    );
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
                {txState === "loaded" && (
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
                type='file'
                accept='.xlsx,.xls,.csv'
                onChange={handleFileChange}
                style={{ display: "none" }}
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
            {txState === "saved" && (
              <div className={styles.xmlButtons}>
                <Button
                  variant='outline'
                  size='sm'
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
            {fileName && txState === "empty" && (
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{fileName}</span>
                <span className={styles.fileDate}>
                  — {new Date().toLocaleDateString("es-SV")}
                </span>
              </div>
            )}
            {txState !== "empty" && (
              <div className={styles.paginationInfo}>
                <span className={styles.paginationText}>
                  {startItem}-{endItem} de {totalItems}
                </span>
                <div className={styles.paginationButtons}>
                  <Button
                    variant='ghost'
                    size='icon'
                    className={styles.pageButton}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
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
