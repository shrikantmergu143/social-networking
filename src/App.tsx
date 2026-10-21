import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, App as AntdApp, Spin } from 'antd';
import { store, persistor } from './app/store';
import { router } from './app/router';
import { MessageInitializer } from './app/notification';

// Custom Ant Design Theme Tokens tailored for Aura
const auraTheme = {
  token: {
    colorPrimary: '#FF3366',
    colorPrimaryHover: '#E62456',
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    colorWarning: '#FF9F1C',
    colorInfo: '#7928CA',
    colorTextBase: '#111222',
    colorBgBase: '#FFFFFF',
    borderRadius: 14,
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 9999,
      controlHeight: 42,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 42,
    },
    Select: {
      borderRadius: 10,
      controlHeight: 42,
    },
    Modal: {
      borderRadiusLG: 20,
    },
    Drawer: {
      borderRadiusLG: 20,
    },
  },
};

const LoadingFallback: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-main)',
    gap: 16
  }}>
    <div style={{
      fontSize: '1.75rem',
      fontWeight: 800,
      background: 'var(--gradient-primary)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}>
      Aura
    </div>
    <Spin size="large" />
  </div>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <ConfigProvider theme={auraTheme}>
          <AntdApp>
            <MessageInitializer />
            <RouterProvider router={router} />
          </AntdApp>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}
