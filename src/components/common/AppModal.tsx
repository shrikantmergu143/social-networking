import React from 'react';
import { Modal, type ModalProps } from 'antd';

export interface AppModalProps extends ModalProps {
  children: React.ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({
  children,
  className = '',
  centered = true,
  footer = null,
  ...props
}) => {
  return (
    <Modal
      centered={centered}
      footer={footer}
      className={className}
      destroyOnHidden
      {...props}
    >
      {children}
    </Modal>
  );
};
