import defaultStorage from 'redux-persist/es/storage';

const getStorage = () => {
  if (defaultStorage && typeof defaultStorage.getItem === 'function') {
    return defaultStorage;
  }
  if ((defaultStorage as any)?.default && typeof (defaultStorage as any).default.getItem === 'function') {
    return (defaultStorage as any).default;
  }
  return {
    getItem: (key: string): Promise<string | null> => {
      try {
        return Promise.resolve(typeof window !== 'undefined' ? window.localStorage.getItem(key) : null);
      } catch {
        return Promise.resolve(null);
      }
    },
    setItem: (key: string, value: string): Promise<void> => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    },
    removeItem: (key: string): Promise<void> => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    },
  };
};

export const persistConfig = {
  key: 'aura_root_v2',
  version: 2,
  storage: getStorage(),
  whitelist: [
    'auth',
    'discovery',
    'feed',
    'matches',
    'messages',
    'connections',
    'settings',
    'onboarding'
  ],
  // Never persist transient UI states or secrets
  blacklist: []
};
