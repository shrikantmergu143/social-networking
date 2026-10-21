import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Flame, Heart, MessageCircle, User } from 'lucide-react';
import { useAppSelector } from '../../hooks';
import { ROUTES } from '../../routes/paths';
import styles from './MobileBottomNavigation.module.css';

export const MobileBottomNavigation: React.FC = () => {
  const matchesCount = useAppSelector(state => state.matches.matches.length);
  const unreadMessagesCount = useAppSelector(state =>
    state.messages.conversations.reduce((acc, c) => acc + c.unreadCount, 0)
  );

  const tabs = [
    { label: 'Feed', path: ROUTES.FEED, icon: Home },
    { label: 'Discover', path: ROUTES.DISCOVER, icon: Flame },
    { label: 'Matches', path: ROUTES.MATCHES, icon: Heart, badge: matchesCount > 0 ? matchesCount : undefined },
    { label: 'Messages', path: ROUTES.MESSAGES, icon: MessageCircle, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { label: 'Profile', path: ROUTES.MY_PROFILE, icon: User }
  ];

  return (
    <nav className={styles.navBar} aria-label="Mobile Navigation">
      <div className={styles.navInner}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `${styles.tabItem} ${isActive ? styles.tabItemActive : ''}`
              }
            >
              <div className={styles.iconContainer}>
                <Icon size={22} className={styles.tabIcon} />
                {tab.badge !== undefined && (
                  <span className={styles.badge}>{tab.badge}</span>
                )}
              </div>
              <span className={styles.tabLabel}>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
