import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getFlowsAction,
  listConfigsAction,
  saveConfigAction,
} from '@/actions/parameters/soft-token';
import type {
  SoftTokenFlowI,
  SoftTokenConfigI,
} from '@/interfaces/management/soft-token';

export interface SoftTokenOperationConfig {
  key: string;
  flow: string;
  label: string;
  product: string | null;
  transactionType: string | null;
  amount?: number;
  hasAmount: boolean;
  showAmount: boolean;
  requiresSoftToken: boolean;
}

export interface SoftTokenConfig {
  transactions: SoftTokenOperationConfig[];
  administrative: SoftTokenOperationConfig[];
}

function mapFlowsToConfig(
  flows: SoftTokenFlowI[],
  configs: SoftTokenConfigI[],
): SoftTokenConfig {
  const flowMap = new Map(flows.map((flow) => [flow.idFlow, flow]));

  const operations = configs.map<SoftTokenOperationConfig>((config) => {
    const flow = flowMap.get(config.flowId);
    const hasAmount = (flow?.hasAmount ?? 0) === 1;
    const isGenericConfig = config.productCode == null && config.typeCode == null;
    const hasSpecificContext = config.productName || config.typeName;
    const contextLabel = hasSpecificContext
      ? ` · ${config.productName ?? 'General'} / ${config.typeName ?? 'General'}`
      : '';

    return {
      key: String(config.configId),
      flow: config.flowCode,
      label: `${config.flowName}${contextLabel}`,
      product: config.productCode,
      transactionType: config.typeCode,
      amount: hasAmount ? (config.amountLimit ?? 0) : undefined,
      hasAmount,
      showAmount: hasAmount && !isGenericConfig,
      requiresSoftToken: config.tokenRequired,
    };
  });

  return {
    transactions: operations.filter((operation) => {
      const flow = flows.find((item) => item.flowCode === operation.flow);
      return flow?.category === 'TRANSACTIONAL';
    }),
    administrative: operations.filter((operation) => {
      const flow = flows.find((item) => item.flowCode === operation.flow);
      return flow?.category === 'ADMINISTRATIVE';
    }),
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
      const [flowsResult, configsResult] = await Promise.all([
        getFlowsAction(),
        listConfigsAction(),
      ]);

      if (flowsResult.data && configsResult.data) {
        const mapped = mapFlowsToConfig(flowsResult.data, configsResult.data);
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
    if (!config || !editedConfig) return;
    setIsLoading(true);
    try {
      const editedOperations = [
        ...editedConfig.transactions,
        ...editedConfig.administrative,
      ];

      const originalOperations = [
        ...config.transactions,
        ...config.administrative,
      ];

      const changedOperations = editedOperations.filter((editedOperation) => {
        const originalOperation = originalOperations.find(
          (operation) => operation.key === editedOperation.key,
        );

        if (!originalOperation) return false;

        return (
          originalOperation.amount !== editedOperation.amount ||
          originalOperation.requiresSoftToken !== editedOperation.requiresSoftToken
        );
      });

      const savePromises = changedOperations.map((operation) => {
        const amount = operation.hasAmount ? (operation.amount ?? 0) : 0;

        return saveConfigAction({
          flow: operation.flow,
          product: operation.product,
          transactionType: operation.transactionType,
          amount,
          tokenRequired: operation.requiresSoftToken,
        });
      });

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
