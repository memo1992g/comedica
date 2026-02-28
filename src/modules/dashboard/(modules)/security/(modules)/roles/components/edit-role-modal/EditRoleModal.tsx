"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import type { RoleI, UpdateRolePayloadI } from "@/interfaces/security/roles";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import PermissionsTab from "./tabs/PermissionsTab";
import AuditTab from "./tabs/AuditTab";
import styles from "./styles/EditRoleModal.module.css";

interface EditRoleModalProps {
  role: RoleI;
  onClose: () => void;
  onUpdate: (
    id: number,
    data: UpdateRolePayloadI,
  ) => Promise<ActionResult<RoleI>>;
  onUpdatePermissions: (
    roleId: number,
    permissions: string[],
  ) => Promise<ActionResult<null>>;
}

export default function EditRoleModal({
  role,
  onClose,
  onUpdate,
  onUpdatePermissions,
}: Readonly<EditRoleModalProps>) {
  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>
            Configurar Rol: {role.code}
          </h2>
          <p className={styles.modalSubtitle}>
            Editar información básica y configurar permisos de acceso
          </p>

          <Tabs defaultValue="general" className={styles.tabsRoot}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="general" className={styles.tabsTrigger}>
                Información general
              </TabsTrigger>
              <TabsTrigger value="permissions" className={styles.tabsTrigger}>
                Configuración de permisos
              </TabsTrigger>
              <TabsTrigger value="audit" className={styles.tabsTrigger}>
                Vista de auditoría
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralInfoTab
                role={role}
                onUpdate={onUpdate}
                onClose={onClose}
              />
            </TabsContent>

            <TabsContent value="permissions">
              <PermissionsTab
                roleId={role.id}
                onSave={onUpdatePermissions}
              />
            </TabsContent>

            <TabsContent value="audit">
              <AuditTab roleId={role.id} onClose={onClose} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
