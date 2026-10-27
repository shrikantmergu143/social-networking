import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout';
import { FullScreenLayout } from '../layouts/FullScreenLayout';
import { ProtectedRoute, PublicRoute } from '../routes/RouteGuards';
import { ROUTES } from '../routes/paths';

// Pages
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { VerifyOtpPage } from '../features/auth/VerifyOtpPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { OnboardingWizard } from '../features/onboarding/OnboardingWizard';
import { FeedPage } from '../features/feed/FeedPage';
import { StoriesViewerPage } from '../features/stories/StoriesViewerPage';
import { DiscoveryPage } from '../features/discovery/DiscoveryPage';
import { ProfilePage } from '../features/profiles/ProfilePage';
import { MyProfilePage } from '../features/profiles/MyProfilePage';
import { MatchesPage } from '../features/matches/MatchesPage';
import { MessagesPage } from '../features/messages/MessagesPage';
import { SearchPage } from '../features/search/SearchPage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { ConnectionsPage } from '../features/connections/ConnectionsPage';
import { BookmarksPage } from '../features/bookmarks/BookmarksPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { BlockedUsersPage } from '../features/moderation/BlockedUsersPage';
import { ReportUserPage } from '../features/moderation/ReportUserPage';
import { PremiumPage } from '../features/premium/PremiumPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // Public Section
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        )
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        )
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />
      },
      {
        path: ROUTES.VERIFY_OTP,
        element: <VerifyOtpPage />
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: <ResetPasswordPage />
      }
    ]
  },

  // Onboarding Wizard Flows
  {
    path: '/onboarding/*',
    element: (
      <ProtectedRoute>
        <OnboardingWizard />
      </ProtectedRoute>
    )
  },

  // Stories Fullscreen Viewer
  {
    path: '/stories/:storyId',
    element: (
      <ProtectedRoute>
        <FullScreenLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StoriesViewerPage />
      }
    ]
  },

  // Authenticated App Section
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AuthenticatedLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.FEED,
        element: <FeedPage />
      },
      {
        path: ROUTES.DISCOVER,
        element: <DiscoveryPage />
      },
      {
        path: '/profile/:userId',
        element: <ProfilePage />
      },
      {
        path: ROUTES.MY_PROFILE,
        element: <MyProfilePage />
      },
      {
        path: ROUTES.MATCHES,
        element: <MatchesPage />
      },
      {
        path: ROUTES.MESSAGES,
        element: <MessagesPage />
      },
      {
        path: '/messages/:conversationId',
        element: <MessagesPage />
      },
      {
        path: ROUTES.SEARCH,
        element: <SearchPage />
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: <NotificationsPage />
      },
      {
        path: ROUTES.CONNECTIONS,
        element: <ConnectionsPage />
      },
      {
        path: ROUTES.SUGGESTED_CONNECTIONS,
        element: <ConnectionsPage />
      },
      {
        path: ROUTES.FOLLOW_REQUESTS,
        element: <ConnectionsPage />
      },
      {
        path: ROUTES.FOLLOWERS,
        element: <ConnectionsPage />
      },
      {
        path: ROUTES.FOLLOWING,
        element: <ConnectionsPage />
      },
      {
        path: ROUTES.SAVED,
        element: <BookmarksPage />
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />
      },
      {
        path: ROUTES.BLOCKED_USERS,
        element: <BlockedUsersPage />
      },
      {
        path: '/report/:userId',
        element: <ReportUserPage />
      },
      {
        path: ROUTES.PREMIUM,
        element: <PremiumPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
