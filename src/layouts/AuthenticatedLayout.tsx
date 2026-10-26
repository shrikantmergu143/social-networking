import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { AppSidebar } from '../components/layout/AppSidebar';
import { RightSidebar } from '../components/layout/RightSidebar';
import { MobileBottomNavigation } from '../components/layout/MobileBottomNavigation';
import { MatchCelebrationModal } from '../components/common/MatchCelebrationModal';
import { CreatePostModal } from '../components/common/CreatePostModal';
import { useAppDispatch, useAppSelector } from '../hooks';
import { message } from '../app/notification';
import { socialApi } from '../lib/social.api';
import { replaceProfiles, replaceSavedProfiles, replaceDiscoveryFilters } from '../features/discovery/discoverySlice';
import { replaceFollowing, replaceFollowers, replacePendingRequests } from '../features/connections/connectionsSlice';
import { replaceMatches } from '../features/matches/matchesSlice';
import { replaceNotifications } from '../features/notifications/notificationsSlice';
import { replaceStories } from '../features/stories/storiesSlice';
import { updateCurrentUserProfile } from '../features/auth/authSlice';
import { replaceBlockedUsers } from '../features/connections/connectionsSlice';
import styles from './AuthenticatedLayout.module.css';

export const AuthenticatedLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (currentUser?.id) {
      socialApi.getProfile(currentUser.id)
        .then(profile => dispatch(updateCurrentUserProfile(profile)))
        .catch(error => message.error(error instanceof Error ? error.message : 'Unable to refresh your profile.'));
    }
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    let active = true;
    const load = async <T,>(request: Promise<T>, onSuccess: (data: T) => void, label: string) => {
      try {
        const data = await request;
        if (active) onSuccess(data);
      } catch (error) {
        if (active) message.error(error instanceof Error ? error.message : `Unable to load ${label}.`);
      }
    };

    void load(socialApi.getDiscovery(), data => dispatch(replaceProfiles(data)), 'discovery profiles');
    void load(socialApi.getSavedProfiles(), data => dispatch(replaceSavedProfiles(data)), 'saved profiles');
    void load(socialApi.getPreferences(), data => dispatch(replaceDiscoveryFilters(data)), 'dating preferences');
    void load(socialApi.getFollowing(), data => dispatch(replaceFollowing(data)), 'following');
    void load(socialApi.getFollowers(), data => dispatch(replaceFollowers(data)), 'followers');
    void load(socialApi.getFollowRequests(), data => dispatch(replacePendingRequests(data)), 'follow requests');
    void load(socialApi.getBlockedProfiles(), data => dispatch(replaceBlockedUsers(data)), 'blocked profiles');
    void load(socialApi.getMatches(), data => dispatch(replaceMatches(data)), 'matches');
    void load(socialApi.getNotifications(), data => dispatch(replaceNotifications(data)), 'notifications');
    void load(socialApi.getStories(), data => dispatch(replaceStories(data)), 'stories');

    return () => {
      active = false;
    };
  }, [dispatch]);

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
