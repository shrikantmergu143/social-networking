import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { AppSidebar } from '../components/layout/AppSidebar';
import { RightSidebar } from '../components/layout/RightSidebar';
import { MobileBottomNavigation } from '../components/layout/MobileBottomNavigation';
import { MatchCelebrationModal } from '../components/common/MatchCelebrationModal';
import { CreatePostModal } from '../components/common/CreatePostModal';
import styles from './AuthenticatedLayout.module.css';

export const AuthenticatedLayout: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const location = useLocation();

  // Certain screens have dedicated full-width or custom multi-column views
  const isChatRoute = location.pathname.startsWith('/messages');
  const isDiscoverRoute = location.pathname.startsWith('/discover');
  const isSettingsRoute = location.pathname.startsWith('/settings');
  const isProfileRoute = location.pathname.startsWith('/profile');
  const isMyProfileRoute = location.pathname.startsWith('/me');
  const showRightSidebar = !isChatRoute && !isDiscoverRoute && !isSettingsRoute && !isProfileRoute && !isMyProfileRoute;

  return (
    <div className={styles.root}>
      {/* Desktop Fixed Left Sidebar */}
      <AppSidebar onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      {/* Main Column Wrapper */}
      <div className={styles.mainWrapper}>
        <AppHeader onOpenCreatePost={() => setIsCreatePostOpen(true)} />

        <div className={styles.bodyContainer}>
          <main className={styles.centerStage}>
            <Outlet />
          </main>

          {showRightSidebar && <RightSidebar />}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileBottomNavigation />

      {/* Global Modals */}
      <MatchCelebrationModal />
      <CreatePostModal
        open={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
};
