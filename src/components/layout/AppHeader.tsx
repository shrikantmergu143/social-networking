import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sparkles,
  LogOut,
  User,
  Settings,
  Shield,
  PlusCircle,
  Flame,
  X
} from 'lucide-react';
import { Dropdown, type MenuProps } from 'antd';
import { AppAvatar } from '../common/AppAvatar';
import { AppButton } from '../common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../features/auth/authSlice';
import { ROUTES } from '../../routes/paths';
import styles from './AppHeader.module.css';
import { authApi } from '../../features/auth/services/auth.api';
import { message } from '../../app/notification';

interface AppHeaderProps {
  onOpenCreatePost?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenCreatePost }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const unreadNotifs = useAppSelector(state =>
    state.notifications.notifications.filter?.(n => !n.isRead).length
  );
  const [searchVal, setSearchVal] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchVal.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      message.warning(error instanceof Error ? `Signed out locally; server session could not be closed: ${error.message}` : 'Signed out locally; server session could not be closed.');
    }
    dispatch(logout());
    navigate(ROUTES.LANDING);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <User size={16} />,
      onClick: () => navigate(ROUTES.MY_PROFILE)
    },
    {
      key: 'settings',
      label: 'Settings & Privacy',
      icon: <Settings size={16} />,
      onClick: () => navigate(ROUTES.SETTINGS)
    },
    {
      key: 'safety',
      label: 'Safety Center',
      icon: <Shield size={16} />,
      onClick: () => navigate(ROUTES.BLOCKED_USERS)
    },
    {
      key: 'premium',
      label: 'Aura Elite',
      icon: <Sparkles size={16} style={{ color: 'var(--accent)' }} />,
      onClick: () => navigate(ROUTES.PREMIUM)
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Log Out',
      icon: <LogOut size={16} />,
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <header className={styles.header}>
      {/* Zone 1: Mobile brand logo (hidden on desktop because sidebar has brand) */}
      <div className={styles.mobileBrandArea}>
        <Link to={ROUTES.FEED} className={styles.brandLink}>
          <div className={styles.mobileLogoWrap}>
            <Flame size={18} />
          </div>
          <span className={styles.brandWordmark}>Aura</span>
        </Link>
      </div>

      {/* Desktop Search Bar with tags */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search creators, hashtags, or dating interests..."
            className={styles.searchInput}
          />
          {searchVal && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchVal('')}
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div className={styles.quickTagsDesktop}>
          <span
            className={styles.quickTag}
            onClick={() => navigate(`${ROUTES.SEARCH}?tag=Photography`)}
          >
            #Photography
          </span>
          <span
            className={styles.quickTag}
            onClick={() => navigate(`${ROUTES.SEARCH}?tag=Design`)}
          >
            #Design
          </span>
          <span
            className={styles.quickTag}
            onClick={() => navigate(`${ROUTES.SEARCH}?tag=Music`)}
          >
            #Music
          </span>
        </div>
      </div>

      {/* Mobile Search Toggle Overlay */}
      {isMobileSearchOpen && (
        <div className={styles.mobileSearchOverlay}>
          <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
            <Search size={18} className={styles.mobileSearchInputIcon} />
            <input
              type="text"
              autoFocus
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search people or tags..."
              className={styles.mobileSearchInput}
            />
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className={styles.closeSearchBtn}
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Zone 3: Actions & Profile */}
      <div className={styles.actions}>
        {/* Mobile Search Icon Button */}
        <button
          className={styles.mobileSearchBtn}
          onClick={() => setIsMobileSearchOpen(true)}
          title="Search"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {onOpenCreatePost && (
          <AppButton
            variant="primary"
            size="sm"
            onClick={onOpenCreatePost}
            icon={<PlusCircle size={16} />}
            className={styles.headerCreateBtn}
          >
            Create
          </AppButton>
        )}

        <Link
          to={ROUTES.NOTIFICATIONS}
          className={styles.iconButton}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadNotifs > 0 && (
            <span className={styles.badgeDot}>
              <span className={styles.badgePulse} />
            </span>
          )}
        </Link>

        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <div className={styles.profileMenuTrigger}>
            <AppAvatar
              src={currentUser?.avatar || ''}
              alt={currentUser?.fullName || 'User'}
              size={36}
              isVerified={currentUser?.isVerified}
            />
            <span className={styles.userNameLabel}>
              {currentUser?.fullName?.split(' ')[0]}
            </span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
