'use client';

import React, { useRef } from 'react';
import { Search, FileText, Trash2, X } from 'lucide-react';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { segmentOptions, channelOptions } from '../../data/mock-data';
import styles from './styles/notification-form.module.css';

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

interface NotificationFormProps {
  recipientType: RecipientType;
  onRecipientTypeChange: (type: RecipientType) => void;
  selectedSegments: string[];
  onSegmentsChange: (segments: string[]) => void;
  selectedChannels: string[];
  onChannelsChange: (channels: string[]) => void;
  userId: string;
  onUserIdChange: (id: string) => void;
  uploadedFile: UploadedFile | null;
  onFileUpload: (file: UploadedFile | null) => void;
  foundUser: FoundUser | null;
}

export default function NotificationForm({
  recipientType,
  onRecipientTypeChange,
  selectedSegments,
  onSegmentsChange,
  selectedChannels,
  onChannelsChange,
  userId,
  onUserIdChange,
  uploadedFile,
  onFileUpload,
  foundUser,
}: NotificationFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSegmentSelect = (value: string) => {
    if (!selectedSegments.includes(value)) {
      onSegmentsChange([...selectedSegments, value]);
    }
  };

  const handleSegmentRemove = (value: string) => {
    onSegmentsChange(selectedSegments.filter((s) => s !== value));
  };

  const handleChannelSelect = (value: string) => {
    if (!selectedChannels.includes(value)) {
      onChannelsChange([...selectedChannels, value]);
    }
  };

  const handleChannelRemove = (value: string) => {
    onChannelsChange(selectedChannels.filter((c) => c !== value));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload({ name: file.name.replace(/\.[^.]+$/, ''), userCount: 50 });
    }
    e.target.value = '';
  };

  const segmentLabel = selectedSegments.length > 0
    ? `${selectedSegments.length} seleccionado(s)`
    : 'Todos los usuarios';

  const channelLabel = selectedChannels.length > 0
    ? `${selectedChannels.length} seleccionado(s)`
    : 'Todos los canales';

  return (
    <>
      <p className={styles.recipientLabel}>Tipo de Destinatario</p>
      <div className={styles.recipientToggle}>
        <button
          type="button"
          className={`${styles.recipientPill} ${recipientType === 'segment' ? styles.recipientPillActive : ''}`}
          onClick={() => onRecipientTypeChange('segment')}
        >
          Por Segmento
        </button>
        <button
          type="button"
          className={`${styles.recipientPill} ${recipientType === 'individual' ? styles.recipientPillActive : ''}`}
          onClick={() => onRecipientTypeChange('individual')}
        >
          Usuario Individual
        </button>
      </div>

      {recipientType === 'segment' ? (
        <>
          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Seleccionar Segmentos</p>
            <Select onValueChange={handleSegmentSelect} value="">
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder={segmentLabel}>{segmentLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {segmentOptions.filter((o) => !selectedSegments.includes(o.value)).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSegments.length > 0 && (
              <div className={styles.tagsContainer}>
                {selectedSegments.map((val) => {
                  const opt = segmentOptions.find((o) => o.value === val);
                  return (
                    <span key={val} className={styles.tag}>
                      {opt?.label}
                      <button type="button" className={styles.tagRemove} onClick={() => handleSegmentRemove(val)}>
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Modalidad de Envío</p>
            <Select onValueChange={handleChannelSelect} value="">
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder={channelLabel}>{channelLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {channelOptions.filter((o) => !selectedChannels.includes(o.value)).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedChannels.length > 0 && (
              <div className={styles.tagsContainer}>
                {selectedChannels.map((val) => {
                  const opt = channelOptions.find((o) => o.value === val);
                  return (
                    <span key={val} className={styles.tag}>
                      {opt?.label}
                      <button type="button" className={styles.tagRemove} onClick={() => handleChannelRemove(val)}>
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>ID de Usuario</p>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.userIdInput}
                placeholder="Ingrese ID (máx. 5 dígitos)"
                value={userId}
                onChange={(e) => onUserIdChange(e.target.value)}
                maxLength={5}
              />
              <Search size={16} className={styles.inputIcon} />
            </div>
          </div>

          <div className={styles.dividerRow}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>O si prefieres</span>
            <div className={styles.dividerLine} />
          </div>

          {uploadedFile ? (
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{uploadedFile.name}</span>
                <span className={styles.fileCount}>{uploadedFile.userCount} usuarios</span>
              </div>
              <button type="button" className={styles.fileRemove} onClick={() => onFileUpload(null)}>
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className={styles.uploadArea} onClick={handleFileClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleFileClick(); }}>
              <FileText size={24} className={styles.uploadIcon} />
              <span className={styles.uploadText}>Adjuntar Excel/CSV</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {foundUser && (
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>{foundUser.initials}</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{foundUser.name}</span>
                <span className={styles.userId}>ID: {foundUser.id}</span>
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Modalidad de Envío</p>
            <Select onValueChange={handleChannelSelect} value="">
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder={channelLabel}>{channelLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {channelOptions.filter((o) => !selectedChannels.includes(o.value)).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedChannels.length > 0 && (
              <div className={styles.tagsContainer}>
                {selectedChannels.map((val) => {
                  const opt = channelOptions.find((o) => o.value === val);
                  return (
                    <span key={val} className={styles.tag}>
                      {opt?.label}
                      <button type="button" className={styles.tagRemove} onClick={() => handleChannelRemove(val)}>
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
