'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationForm from './components/notification-form/notification-form';
import NotificationMessage from './components/notification-message/notification-message';
import ConfirmationModal from './components/confirmation-modal/confirmation-modal';
import SecurityParamsPanel from './components/security-params-panel/security-params-panel';
import NotificationHistory from './components/notification-history/notification-history';
import { mockNotificationHistory } from './data/mock-data';
import styles from './styles/user-notifications.module.css';

type MainTab = 'masivas' | 'parametros';
type View = 'main' | 'history';
type RecipientType = 'segment' | 'individual';

interface UploadedFile {
  name: string;
  userCount: number;
}

interface FoundUser {
  id: string;
  name: string;
  initials: string;
}

const mainTabs: { id: MainTab; label: string }[] = [
  { id: 'masivas', label: 'Notificaciones masivas' },
  { id: 'parametros', label: 'Parámetros de Notificaciones de Seguridad Predeterminadas' },
];

export default function UserNotifications() {
  const [activeTab, setActiveTab] = useState<MainTab>('masivas');
  const [currentView, setCurrentView] = useState<View>('main');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form state
  const [recipientType, setRecipientType] = useState<RecipientType>('segment');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);

  // Params dirty state
  const [paramsDirty, setParamsDirty] = useState(false);

  // Tab indicator
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab]);

  // Mock user search
  useEffect(() => {
    if (userId.length >= 1) {
      setFoundUser({ id: userId, name: `Usuario ${userId}`, initials: `U${userId}` });
    } else {
      setFoundUser(null);
    }
  }, [userId]);

  const canSend = message.trim().length > 0 && (
    (recipientType === 'segment') ||
    (recipientType === 'individual' && (userId.length > 0 || uploadedFile !== null))
  );

  const handleSend = () => setShowConfirmModal(true);

  const handleConfirmSend = () => {
    setShowConfirmModal(false);
    setMessage('');
    setSelectedSegments([]);
    setSelectedChannels([]);
    setUserId('');
    setUploadedFile(null);
    setFoundUser(null);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as MainTab);
    setCurrentView('main');
  };

  if (currentView === 'history') {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <NotificationHistory
            data={mockNotificationHistory}
            onBack={() => setCurrentView('main')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>Notificaciones</h2>
            <p className={styles.subtitle}>
              Gestione el envío de mensajes masivos o personalizados a sus usuarios.
            </p>
          </div>
          <div className={styles.headerActions}>
            {activeTab === 'masivas' ? (
              <>
                <button
                  type="button"
                  className={styles.sendButton}
                  disabled={!canSend}
                  onClick={handleSend}
                >
                  Enviar Notificación
                </button>
                <button
                  type="button"
                  className={styles.historyButton}
                  onClick={() => setCurrentView('history')}
                >
                  Historial
                </button>
              </>
            ) : (
              <>
                <button type="button" className={styles.saveButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setParamsDirty(false)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className={styles.tabsList}>
              {mainTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  ref={(el) => { tabRefs.current[tab.id] = el; }}
                  className={styles.tabTrigger}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
              <div
                className={styles.indicator}
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            </TabsList>
          </Tabs>
        </div>

        {activeTab === 'masivas' ? (
          <div className={styles.mainLayout}>
            <div className={styles.leftPanel}>
              <NotificationForm
                recipientType={recipientType}
                onRecipientTypeChange={setRecipientType}
                selectedSegments={selectedSegments}
                onSegmentsChange={setSelectedSegments}
                selectedChannels={selectedChannels}
                onChannelsChange={setSelectedChannels}
                userId={userId}
                onUserIdChange={setUserId}
                uploadedFile={uploadedFile}
                onFileUpload={setUploadedFile}
                foundUser={foundUser}
              />
            </div>
            <div className={styles.rightPanel}>
              <NotificationMessage
                message={message}
                onMessageChange={setMessage}
              />
            </div>
          </div>
        ) : (
          <div className={styles.paramsLayout}>
            <SecurityParamsPanel onDirtyChange={setParamsDirty} />
          </div>
        )}
      </div>

      {showConfirmModal && (
        <ConfirmationModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSend}
        />
      )}
    </div>
  );
}
