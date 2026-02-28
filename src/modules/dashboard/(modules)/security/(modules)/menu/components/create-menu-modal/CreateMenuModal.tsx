"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  MenuModuleI,
  CreateModulePayloadI,
  CreateCategoryPayloadI,
  CreateSubCategoryPayloadI,
} from "@/interfaces/security";
import ConfirmDetailsModal from "../confirm-details-modal/ConfirmDetailsModal";
import type { ConfirmDetailRow } from "../confirm-details-modal/ConfirmDetailsModal";
import CreateModuleTab from "./CreateModuleTab";
import CreateCategoryTab from "./CreateCategoryTab";
import CreateSubCategoryTab from "./CreateSubCategoryTab";
import styles from "./styles/CreateMenuModal.module.css";

interface CreateMenuModalProps {
  modules: MenuModuleI[];
  onClose: () => void;
  onCreateModule: (data: CreateModulePayloadI) => void;
  onCreateCategory: (data: CreateCategoryPayloadI) => void;
  onCreateSubCategory: (data: CreateSubCategoryPayloadI) => void;
}

type PendingAction =
  | { type: "module"; data: CreateModulePayloadI }
  | { type: "category"; data: CreateCategoryPayloadI }
  | { type: "subcategory"; data: CreateSubCategoryPayloadI };

function buildConfirmDetails(action: PendingAction, modules: MenuModuleI[]): ConfirmDetailRow[] {
  switch (action.type) {
    case "module":
      return [
        { label: "Nombre", value: action.data.name },
        { label: "Descripción", value: action.data.description },
        { label: "Orden", value: String(action.data.order) },
        { label: "Estado", value: action.data.status },
      ];
    case "category": {
      const mod = modules.find((m) => m.id === action.data.moduleId);
      return [
        { label: "Módulo", value: mod?.name ?? action.data.moduleId },
        { label: "Nombre", value: action.data.name },
        { label: "Descripción", value: action.data.description },
        { label: "Ruta", value: action.data.route },
        { label: "Orden", value: String(action.data.order) },
        { label: "Estado", value: action.data.status },
      ];
    }
    case "subcategory": {
      const mod = modules.find((m) => m.id === action.data.moduleId);
      return [
        { label: "Módulo", value: mod?.name ?? action.data.moduleId },
        { label: "Nombre", value: action.data.name },
        { label: "Descripción", value: action.data.description },
        { label: "Orden", value: String(action.data.order) },
        { label: "Estado", value: action.data.status },
        { label: "Menús incluidos", value: `${action.data.menuIds.length} seleccionados` },
      ];
    }
  }
}

function getConfirmTitle(type: PendingAction["type"]) {
  switch (type) {
    case "module": return "Confirmar creación de módulo";
    case "category": return "Confirmar creación de menú";
    case "subcategory": return "Confirmar creación de sub-categoría";
  }
}

function getSuccessMsg(type: PendingAction["type"]) {
  switch (type) {
    case "module": return "Se creará un nuevo módulo en el sistema";
    case "category": return "Se creará un nuevo menú en el sistema";
    case "subcategory": return "Se creará una nueva sub-categoría en el sistema";
  }
}

export default function CreateMenuModal({
  modules,
  onClose,
  onCreateModule,
  onCreateCategory,
  onCreateSubCategory,
}: Readonly<CreateMenuModalProps>) {
  const [pending, setPending] = useState<PendingAction | null>(null);

  const handleConfirm = () => {
    if (!pending) return;
    switch (pending.type) {
      case "module": onCreateModule(pending.data); break;
      case "category": onCreateCategory(pending.data); break;
      case "subcategory": onCreateSubCategory(pending.data); break;
    }
    onClose();
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Nuevo Menú</h2>
            <p className={styles.modalSubtitle}>
              Crear una nueva opción de navegación en el sistema
            </p>
          </div>

          <Tabs defaultValue="module">
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="module" className={styles.tabTrigger}>
                Módulo Principal
              </TabsTrigger>
              <TabsTrigger value="category" className={styles.tabTrigger}>
                Categorías
              </TabsTrigger>
              <TabsTrigger value="subcategory" className={styles.tabTrigger}>
                Sub-Categorías
              </TabsTrigger>
            </TabsList>

            <TabsContent value="module" className={styles.tabContent}>
              <CreateModuleTab
                modules={modules}
                onSave={(d) => setPending({ type: "module", data: d })}
                onCancel={onClose}
              />
            </TabsContent>

            <TabsContent value="category" className={styles.tabContent}>
              <CreateCategoryTab
                modules={modules}
                onSave={(d) => setPending({ type: "category", data: d })}
                onCancel={onClose}
              />
            </TabsContent>

            <TabsContent value="subcategory" className={styles.tabContent}>
              <CreateSubCategoryTab
                modules={modules}
                onSave={(d) => setPending({ type: "subcategory", data: d })}
                onCancel={onClose}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {pending && (
        <ConfirmDetailsModal
          title={getConfirmTitle(pending.type)}
          subtitle="Revise los datos antes de confirmar"
          successMessage={getSuccessMsg(pending.type)}
          details={buildConfirmDetails(pending, modules)}
          onCancel={() => setPending(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
