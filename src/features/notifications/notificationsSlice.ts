import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppNotification } from '../../types';

export interface NotificationsState {
  notifications: AppNotification[];
  filter: 'all' | 'unread' | 'matches' | 'social';
}

const initialState: NotificationsState = {
  notifications: [],
  filter: 'all'
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    replaceNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.notifications = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.isRead = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => { n.isRead = true; });
    },
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.notifications.unshift(action.payload);
    },
    setNotificationsFilter: (state, action: PayloadAction<'all' | 'unread' | 'matches' | 'social'>) => {
      state.filter = action.payload;
    }
  }
});

export const {
  markAsRead,
  replaceNotifications,
  markAllAsRead,
  addNotification,
  setNotificationsFilter
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
