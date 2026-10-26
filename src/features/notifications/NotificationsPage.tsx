import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Sparkles,
  CheckCheck,
  Check
} from 'lucide-react';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { markAsRead, markAllAsRead, setNotificationsFilter } from './notificationsSlice';
import { acceptFollowRequest, replacePendingRequests } from '../connections/connectionsSlice';
import { ROUTES } from '../../routes/paths';
import type { AppNotification } from '../../types';
import styles from './NotificationsPage.module.css';
import { socialApi } from '../../lib/social.api';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notifications, filter } = useAppSelector(state => state.notifications);

  const filtered = notifications.filter?.(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'matches') return n.type === 'match';
    if (filter === 'social') return ['like', 'comment', 'follow', 'follow_request', 'follow_accepted', 'superlike'].includes(n.type);
    return true;
  });

  const handleNotificationClick = async (n: AppNotification) => {
    if (!n.isRead) {
      try {
        await socialApi.markNotificationRead(n.id);
        dispatch(markAsRead(n.id));
      } catch (error) {
        message.error(error instanceof Error ? error.message : 'Unable to update notification.');
        return;
      }
    }
    if (n.type === 'match' && n.targetId) {
      navigate(ROUTES.PROFILE(n.targetId));
    } else if (n.type === 'message' && n.targetId) {
      navigate(ROUTES.CONVERSATION(n.targetId));
    } else if (n.type === 'superlike' || (n.type === 'like' && n.targetType === 'profile')) {
      if (n.targetId) navigate(ROUTES.PROFILE(n.targetId));
    } else if (n.type === 'like' || n.type === 'comment') {
      navigate(ROUTES.FEED);
    } else if (['follow', 'follow_request', 'follow_accepted'].includes(n.type) && n.targetId) {
      navigate(ROUTES.PROFILE(n.targetId));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await socialApi.markAllNotificationsRead();
      dispatch(markAllAsRead());
      message.success('All notifications marked as read');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to update notifications.');
    }
  };

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'match':
        return <div className={styles.iconBadge} style={{ background: 'var(--gradient-primary)' }}><Heart size={13} fill="white" /></div>;
      case 'like':
        return <div className={styles.iconBadge} style={{ background: 'var(--primary)' }}><Heart size={13} /></div>;
      case 'comment':
        return <div className={styles.iconBadge} style={{ background: 'var(--secondary)' }}><MessageCircle size={13} /></div>;
      case 'follow':
      case 'follow_request':
      case 'follow_accepted':
        return <div className={styles.iconBadge} style={{ background: 'var(--accent)' }}><UserPlus size={13} /></div>;
      case 'superlike':
        return <div className={styles.iconBadge} style={{ background: 'var(--secondary)' }}><Heart size={13} fill="white" /></div>;
      case 'message':
        return <div className={styles.iconBadge} style={{ background: 'var(--success)' }}><MessageCircle size={13} /></div>;
      default:
        return <div className={styles.iconBadge} style={{ background: 'var(--primary)' }}><Sparkles size={13} /></div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>
          <Bell size={22} color="var(--primary)" /> Notifications
        </h1>

        <button
          onClick={handleMarkAllRead}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            color: 'var(--primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <CheckCheck size={16} /> Mark all read
        </button>
      </div>

      <div className={styles.tabsRow}>
        <button
          className={`${styles.tabBtn} ${filter === 'all' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setNotificationsFilter('all'))}
        >
          All Activity
        </button>
        <button
          className={`${styles.tabBtn} ${filter === 'unread' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setNotificationsFilter('unread'))}
        >
          Unread ({notifications.filter?.(n => !n.isRead).length})
        </button>
        <button
          className={`${styles.tabBtn} ${filter === 'matches' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setNotificationsFilter('matches'))}
        >
          Matches
        </button>
        <button
          className={`${styles.tabBtn} ${filter === 'social' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setNotificationsFilter('social'))}
        >
          Likes & Comments
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className={styles.notifList}>
          {filtered.map(n => (
            <div
              key={n.id}
              className={`${styles.notifItem} ${!n.isRead ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(n)}
            >
              <div style={{ position: 'relative' }}>
                <AppAvatar
                  src={n.actor.avatar}
                  alt={n.actor.name}
                  size={42}
                />
                <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
                  {getTypeIcon(n.type)}
                </div>
              </div>

              <div className={styles.content}>
                <div className={styles.text}>{n.text}</div>
                <div className={styles.time}>{n.createdAt}</div>
                {n.type === 'follow_request' && (
                  <div style={{ marginTop: 6 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      style={{
                        padding: '4px 12px',
                        background: 'var(--primary)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={async () => {
                        if (!n.targetId) return;
                        try {
                          await socialApi.acceptFollowRequest(n.targetId);
                          dispatch(acceptFollowRequest(n.targetId));
                          dispatch(replacePendingRequests(await socialApi.getFollowRequests()));
                          await socialApi.markNotificationRead(n.id);
                          dispatch(markAsRead(n.id));
                          message.success(`Accepted follow request from ${n.actor.name}`);
                        } catch (error) {
                          message.error(error instanceof Error ? error.message : 'Unable to accept follow request.');
                        }
                      }}
                    >
                      Accept Request
                    </button>
                  </div>
                )}
              </div>

              {!n.isRead && <span className={styles.dot} />}
            </div>
          ))}
        </div>
      ) : (
        <AppEmptyState
          icon={<Bell size={32} />}
          title="No notifications here"
          description="You're completely caught up! Likes, new matches, and comments will show up here."
        />
      )}
    </div>
  );
};
