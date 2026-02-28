import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  listConfigsAction,
  saveConfigAction,
} from '@/actions/parameters/soft-token';
import type { SoftTokenConfigI } from '@/interfaces/management/soft-token';

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

const TRANSACTIONAL_FLOW_CODES = new Set(['TRANSFER', 'PAYMENT', 'TRANSFER365']);

const TRANSACTIONAL_ORDER: string[] = [
  'TRANSFER_OWN',
  'TRANSFER_THIRD',
  'PAYMENT',
  'TRANSFER365',
];

const ADMINISTRATIVE_ORDER: string[] = [
  'PASSWORD_RECOVERY',
  'LOGIN',
  'LIMIT_CONFIGURATION',
  'PASSWORD_CHANGE',
  'TRUSTED_DEVICE_REMOVE',
];

function resolveOperationLabel(config: SoftTokenConfigI): string {
  if (config.flowCode === 'TRANSFER' && config.typeCode === 'OWN') {
    return 'Pagos propios';
  }

  if (config.flowCode === 'TRANSFER' && config.typeCode === 'THIRD') {
    return 'Pagos a terceros';
  }

  if (config.flowCode === 'PAYMENT') {
    return 'Pagos de servicios';
  }

  if (config.flowCode === 'TRANSFER365') {
    return 'Transfer365';
  }

  return config.flowName;
}

function getSortWeight(operation: SoftTokenOperationConfig, transactional: boolean): number {
  if (transactional) {
    const code = operation.transactionType
      ? `${operation.flow}_${operation.transactionType}`
      : operation.flow;

    const position = TRANSACTIONAL_ORDER.indexOf(code);
    return position === -1 ? TRANSACTIONAL_ORDER.length : position;
  }

  const position = ADMINISTRATIVE_ORDER.indexOf(operation.flow);
  return position === -1 ? ADMINISTRATIVE_ORDER.length : position;
}

function mapConfigsToView(configs: SoftTokenConfigI[]): SoftTokenConfig {
  const operations = configs.map<SoftTokenOperationConfig>((config) => {
    const hasAmount = config.amountLimit !== null;

    return {
      key: String(config.configId),
      flow: config.flowCode,
      label: resolveOperationLabel(config),
      product: config.productCode,
      transactionType: config.typeCode,
      amount: hasAmount ? (config.amountLimit ?? 0) : undefined,
      hasAmount,
      showAmount: hasAmount,
      requiresSoftToken: config.tokenRequired,
    };
  });

  const transactions = operations
    .filter((operation) => TRANSACTIONAL_FLOW_CODES.has(operation.flow))
    .sort((a, b) => getSortWeight(a, true) - getSortWeight(b, true));

  const administrative = operations
    .filter((operation) => !TRANSACTIONAL_FLOW_CODES.has(operation.flow))
    .sort((a, b) => getSortWeight(a, false) - getSortWeight(b, false));

  return {
    transactions,
    administrative,
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    setIsInitialLoading(true);
    setLoadError(null);

    try {
      const configsResult = await listConfigsAction();

      if (configsResult.errors) {
        setLoadError(
          configsResult.errorMessage
          || 'No se pudo cargar la configuración de Soft Token.',
        );

        setConfig({ transactions: [], administrative: [] });
        setEditedConfig({ transactions: [], administrative: [] });
        return;
      }

      if (configsResult.data) {
        const mapped = mapConfigsToView(configsResult.data);
        setConfig(mapped);
        setEditedConfig(mapped);
        return;
      }

      setLoadError('No se recibieron datos para la configuración de Soft Token.');
      setConfig({ transactions: [], administrative: [] });
      setEditedConfig({ transactions: [], administrative: [] });
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      setLoadError('Ocurrió un error inesperado al cargar la configuración.');
      setConfig({ transactions: [], administrative: [] });
      setEditedConfig({ transactions: [], administrative: [] });
    } finally {
      setIsInitialLoading(false);
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
    isInitialLoading,
    loadError,
    showConfirmation,
    setShowConfirmation,
    updateTransaction,
    updateAdmin,
    handleSave,
    handleConfirm,
    retryLoad: loadConfig,
  };
}
