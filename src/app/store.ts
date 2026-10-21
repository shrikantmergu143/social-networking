import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { persistConfig } from './persistConfig';

import authReducer from '../features/auth/authSlice';
import feedReducer from '../features/feed/feedSlice';
import discoveryReducer from '../features/discovery/discoverySlice';
import matchesReducer from '../features/matches/matchesSlice';
import messagesReducer from '../features/messages/messagesSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import storiesReducer from '../features/stories/storiesSlice';
import connectionsReducer from '../features/connections/connectionsSlice';
import settingsReducer from '../features/settings/settingsSlice';
import onboardingReducer from '../features/onboarding/onboardingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
  discovery: discoveryReducer,
  matches: matchesReducer,
  messages: messagesReducer,
  notifications: notificationsReducer,
  stories: storiesReducer,
  connections: connectionsReducer,
  settings: settingsReducer,
  onboarding: onboardingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
