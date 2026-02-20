import { useState, useEffect, useMemo, useCallback } from 'react';
import { getFlowsAction, saveConfigAction } from '@/actions/parameters/soft-token';
import type { SoftTokenFlowI } from '@/interfaces/management/soft-token';

export interface SoftTokenOperationConfig {
  key: string;
  label: string;
  amount?: number;
  requiresSoftToken: boolean;
}

export interface SoftTokenConfig {
  transactions: SoftTokenOperationConfig[];
  administrative: SoftTokenOperationConfig[];
}

function mapFlowsToConfig(flows: SoftTokenFlowI[]): SoftTokenConfig {
  return {
    transactions: flows
      .filter((f) => f.category === 'TRANSACTIONAL')
      .map((f) => ({
        key: f.flowCode,
        label: f.flowName,
        amount: f.hasAmount === 1 ? 0 : undefined,
        requiresSoftToken: f.status === 1,
      })),
    administrative: flows
      .filter((f) => f.category === 'ADMINISTRATIVE')
      .map((f) => ({
        key: f.flowCode,
        label: f.flowName,
        requiresSoftToken: f.status === 1,
      })),
  };
}

export interface PendingChange {
  label: string;
  field: string;
  oldValue: string | number;
  newValue: string | number;
  changed: boolean;
}

export function useSoftToken() {
  const [config, setConfig] = useState<SoftTokenConfig | null>(null);
  const [editedConfig, setEditedConfig] = useState<SoftTokenConfig | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      const result = await getFlowsAction();
      if (result.data) {
        const mapped = mapFlowsToConfig(result.data);
        setConfig(mapped);
        setEditedConfig(mapped);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const updateTransaction = (key: string, field: 'amount' | 'requiresSoftToken', value: number | boolean) => {
    if (!editedConfig) return;
    setEditedConfig({
      ...editedConfig,
      transactions: editedConfig.transactions.map((t) =>
        t.key === key ? { ...t, [field]: value } : t,
      ),
    });
  };

  const updateAdmin = (key: string, value: boolean) => {
    if (!editedConfig) return;
    setEditedConfig({
      ...editedConfig,
      administrative: editedConfig.administrative.map((a) =>
        a.key === key ? { ...a, requiresSoftToken: value } : a,
      ),
    });
  };

  const pendingChanges = useMemo<PendingChange[]>(() => {
    if (!config || !editedConfig) return [];

    const changes: PendingChange[] = [];

    config.transactions.forEach((orig) => {
      const edited = editedConfig.transactions.find((t) => t.key === orig.key);
      if (!edited) return;
      const amountChanged = orig.amount !== edited.amount;
      const tokenChanged = orig.requiresSoftToken !== edited.requiresSoftToken;
      if (amountChanged || tokenChanged) {
        if (orig.amount !== undefined) {
          changes.push({
            label: orig.label,
            field: 'Monto',
            oldValue: orig.amount ?? 0,
            newValue: edited.amount ?? 0,
            changed: amountChanged,
          });
        }
        changes.push({
          label: orig.label,
          field: 'Soft Token',
          oldValue: orig.requiresSoftToken ? 'SI' : 'NO',
          newValue: edited.requiresSoftToken ? 'SI' : 'NO',
          changed: tokenChanged,
        });
      }
    });

    config.administrative.forEach((orig) => {
      const edited = editedConfig.administrative.find((a) => a.key === orig.key);
      if (!edited) return;
      if (orig.requiresSoftToken !== edited.requiresSoftToken) {
        changes.push({
          label: orig.label,
          field: 'Soft Token',
          oldValue: orig.requiresSoftToken ? 'SI' : 'NO',
          newValue: edited.requiresSoftToken ? 'SI' : 'NO',
          changed: true,
        });
      }
    });

    return changes;
  }, [config, editedConfig]);

  /** Group pending changes by operation label */
  const groupedChanges = useMemo(() => {
    const map = new Map<string, PendingChange[]>();
    pendingChanges.forEach((c) => {
      const arr = map.get(c.label) || [];
      arr.push(c);
      map.set(c.label, arr);
    });
    return map;
  }, [pendingChanges]);

  const hasChanges = pendingChanges.length > 0;

  const handleSave = () => setShowConfirmation(true);

  const handleConfirm = async () => {
    if (!editedConfig) return;
    setIsLoading(true);
    try {
      const savePromises = editedConfig.transactions
        .filter((t) => t.amount !== undefined)
        .map((t) =>
          saveConfigAction({
            flow: t.key,
            product: 'AH',
            transactionType: 'THIRD',
            amount: t.amount ?? 0,
          }),
        );
      await Promise.all(savePromises);
      await loadConfig();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    editedConfig,
    pendingChanges,
    groupedChanges,
    hasChanges,
    isLoading,
    showConfirmation,
    setShowConfirmation,
    updateTransaction,
    updateAdmin,
    handleSave,
    handleConfirm,
  };
}
