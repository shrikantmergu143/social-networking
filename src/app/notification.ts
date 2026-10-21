import React, { useEffect } from 'react';
import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

let messageApi: MessageInstance | null = null;

export const MessageInitializer: React.FC = () => {
  const staticApi = App.useApp();
  useEffect(() => {
    messageApi = staticApi.message;
  }, [staticApi]);
  return null;
};

export const message = {
  success: (content: any, duration?: number, onClose?: () => void) => {
    if (messageApi) {
      return messageApi.success(content, duration, onClose);
    }
    console.warn('Message accessed before initialization', content);
  },
  error: (content: any, duration?: number, onClose?: () => void) => {
    if (messageApi) {
      return messageApi.error(content, duration, onClose);
    }
    console.warn('Message accessed before initialization', content);
  },
  info: (content: any, duration?: number, onClose?: () => void) => {
    if (messageApi) {
      return messageApi.info(content, duration, onClose);
    }
    console.warn('Message accessed before initialization', content);
  },
  warning: (content: any, duration?: number, onClose?: () => void) => {
    if (messageApi) {
      return messageApi.warning(content, duration, onClose);
    }
    console.warn('Message accessed before initialization', content);
  },
  loading: (content: any, duration?: number, onClose?: () => void) => {
    if (messageApi) {
      return messageApi.loading(content, duration, onClose);
    }
    console.warn('Message accessed before initialization', content);
  },
};
