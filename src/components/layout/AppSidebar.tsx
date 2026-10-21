import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Flame,
  Heart,
  MessageCircle,
  Search,
  Bookmark,
  Users,
  Settings,
  Sparkles,
  PlusCircle,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { AppAvatar } from '../common/AppAvatar';
import { AppButton } from '../common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../features/auth/authSlice';
import { ROUTES } from '../../routes/paths';
import styles from './AppSidebar.module.css';

interface AppSidebarProps {
  onOpenCreatePost?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onOpenCreatePost }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const matchesCount = useAppSelector(state => state.matches.matches.length);
  const unreadMessagesCount = useAppSelector(state =>
    state.messages.conversations.reduce((acc, c) => acc + c.unreadCount, 0)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LANDING);
  };

  const navLinks = [
    { label: 'Home Feed', path: ROUTES.FEED, icon: Home },
    { label: 'Discover', path: ROUTES.DISCOVER, icon: Flame, isHot: true },
    { label: 'Matches', path: ROUTES.MATCHES, icon: Heart, badge: matchesCount > 0 ? matchesCount : undefined },
    { label: 'Messages', path: ROUTES.MESSAGES, icon: MessageCircle, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { label: 'Explore & Search', path: ROUTES.SEARCH, icon: Search },
    { label: 'Saved Items', path: ROUTES.SAVED, icon: Bookmark },
    { label: 'Connections', path: ROUTES.CONNECTIONS, icon: Users },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings }
  ];

  return (
    <aside className={styles.sidebar} aria-label="Desktop Sidebar Navigation">
      {/* Top Brand Section */}
      <div className={styles.topSection}>
        <div className={styles.brandContainer}>
          <NavLink to={ROUTES.FEED} className={styles.brandLink}>
            <div className={styles.brandLogoWrap}>
              <Flame size={22} className={styles.brandFlame} />
              <span className={styles.brandGlow} />
            </div>
            <div className={styles.brandTextGroup}>
              <span className={styles.brandWordmark}>Aura</span>
              <span className={styles.brandPill}>Social & Dating</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className={styles.navGroup}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <div className={styles.itemLeft}>
                  <div className={styles.iconWrap}>
                    <Icon size={20} />
                  </div>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.isHot && <span className={styles.hotDot} title="Active Dating Deck" />}
                </div>
                {item.badge !== undefined && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* New Post Button */}
        {onOpenCreatePost && (
          <div className={styles.createPostBtnWrap}>
            <AppButton
              variant="primary"
              fullWidth
              size="md"
              icon={<PlusCircle size={18} />}
              onClick={onOpenCreatePost}
              className={styles.newPostButton}
            >
              New Post
            </AppButton>
          </div>
        )}
      </div>

      {/* Bottom VIP banner + User profile mini card */}
      <div className={styles.bottomSection}>
        <div
          className={styles.premiumBanner}
          onClick={() => navigate(ROUTES.PREMIUM)}
          role="button"
          tabIndex={0}
          title="Upgrade to Aura Elite"
        >
          <div className={styles.premiumHeader}>
            <div className={styles.premiumTitle}>
              <Sparkles size={16} color="var(--accent)" /> Aura Elite
            </div>
            <span className={styles.vipTag}>PRO</span>
          </div>
          <p className={styles.premiumDesc}>Unlimited likes & priority discover</p>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className={styles.userProfileCard}>
            <div
              className={styles.userInfoArea}
              onClick={() => navigate(ROUTES.MY_PROFILE)}
              title="View your profile"
            >
              <AppAvatar
                src={currentUser?.avatar}
                alt={currentUser?.fullName}
                size={38}
                isVerified={currentUser?.isVerified}
                isOnline={true}
              />
              <div className={styles.userMeta}>
                <div className={styles.userName}>
                  {currentUser?.fullName}
                  {currentUser?.isVerified && (
                    <ShieldCheck size={14} className={styles.verifiedIcon} />
                  )}
                </div>
                <div className={styles.userHandle}>@{currentUser?.username}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
