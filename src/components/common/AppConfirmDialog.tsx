import React from 'react';
import { AppModal } from './AppModal';
import { AppButton } from './AppButton';
import { AlertCircle } from 'lucide-react';

export interface AppConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AppConfirmDialog: React.FC<AppConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = true,
  onConfirm,
  onCancel
}) => {
  return (
    <AppModal open={open} onCancel={onCancel} width={420}>
      <div style={{ textAlign: 'center', padding: '16px 8px 8px' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: danger ? 'var(--error-light)' : 'var(--primary-light)',
            color: danger ? 'var(--error)' : 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}
        >
          <AlertCircle size={26} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
          {description}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <AppButton variant="secondary" onClick={onCancel}>
            {cancelText}
          </AppButton>
          <AppButton variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmText}
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};
