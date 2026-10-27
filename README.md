# Aura: Social Networking & Dating Web Application

**Aura** is a modern, responsive web application that bridges social networking (inspired by Instagram) with dating and matchmaking (inspired by Tinder, Bumble, and Hinge).

---

## 🌟 Highlights & Key Features

### 1. Social Networking
- **Feed (`/feed`)**: Multimedia post stream with single & multi-image carousels, likes, threaded comments with replies, bookmarks, shares, and a live post composer.
- **Stories (`/stories/:storyId`)**: Full-screen story viewer with auto-progress indicators, pause-on-hold, tap-to-navigate, and direct reply interactions.
- **Search & Explore (`/search`)**: Real-time debounced search across profiles, captions, and hashtags with recent search history.
- **Connections (`/connections`)**: Segmented view for following, followers, and suggested connections with follow/unfollow and remove options.
- **Bookmarks (`/saved`)**: Saved posts and bookmarked dating profiles.

### 2. Dating & Matchmaking
- **Dating Discovery (`/discover`)**: Interactive card deck with large portrait photography, tap-to-browse photos, age, distance, verification badge, bio snippet, and intention tags.
- **Tactile Action Dock**: Pass, Like, Super Like, Rewind, and Bookmark buttons.
- **Deterministic Mutual Match Scenario**: Liking specific profiles (e.g., *Elena Rostova*, *Maya Lin*, or *Camille Laurent*) triggers an interactive celebration modal with compatibility metrics, shared passions, and an instant message starter.
- **Dating Filters Drawer**: Age range slider, distance radius, gender preferences, relationship goals, verified-only filter, and online status toggle.
- **Matches Screen (`/matches`)**: Grid of active matches with compatibility percentages, search filter, and unmatch confirmation dialog.
- **Profile Details (`/profile/:userId`)**: Full-page inspection with lifestyle breakdown (work, education, zodiac, drinking, workout, pets), photo gallery, and dating action triggers.

### 3. Communication & Safety
- **Direct Messaging (`/messages` & `/messages/:conversationId`)**: Responsive chat stage with persisted messages delivered in real time through an authenticated Socket.IO connection, typing indicators, and per-message, per-user delivery/read timestamps stored as message receipts.
- **Notifications Hub (`/notifications`)**: Unread badge count, categorization (All, Unread, Matches, Social), and mark-as-read controls.
- **Safety & Moderation (`/blocked-users` & `/report/:userId`)**: Blocklist manager and report submission flow with categorized violation reasons.
- **Aura Premium (`/premium`)**: Tier comparison (Aura Plus vs. Aura Elite), monthly/annual pricing toggle, and demonstration activation flow.

### 4. Authentication & Onboarding
- **Public Marketing Landing (`/`)**: High-conversion hero, feature pillars, success testimonials, safety guidelines, and CTA anchors.
- **Auth Suite (`/login`, `/register`, `/forgot-password`, `/verify-otp`, `/reset-password`)**: Form validation, password strength meters, and quick demo login shortcuts.
- **Guided Onboarding (`/onboarding/*`)**: 5-step wizard (Basic Info, Passions, Dating Intentions, Photos, and Profile Preview).

---

## 🛠️ Technology Stack

- **React 19** with **TypeScript**
- **Vite**
- **React Router DOM** (v7) with centralized route constants and route guards
- **Redux Toolkit** & **Redux Persist** (persisting auth session, discovery queue, saved posts, matches, and settings)
- **Ant Design** with custom `ConfigProvider` theme tokens matching Aura branding
- **CSS Modules** & **CSS Variables** (`variables.css`, `typography.css`, `responsive.css`)
- **Lucide React** icons
- **Day.js**

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
The app will run locally on `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```

### 4. Code Validation & Type Check
```bash
npm run lint
```

---

## 🔌 Connecting a Real Backend

To transition from the current persistent mock frontend to a full-stack production architecture:

1. **API Client (`src/services/apiClient.ts`)**:
   - Replace local Redux mock dispatches with Axios or Fetch calls to REST/GraphQL endpoints (e.g. `/api/auth/login`, `/api/feed/posts`, `/api/discovery/swipe`).
2. **Real-Time Messaging**:
   - The NestJS Socket.IO gateway authenticates clients with their access token, verifies conversation membership, and broadcasts persisted messages and typing indicators to authorized participants.
3. **Authentication**:
   - Store secure HttpOnly session cookies or Bearer JWT tokens received from your OAuth/Auth server rather than storing demo tokens in `localStorage`.
4. **Media Uploads**:
   - Connect the image picker in `CreatePostModal` and `OnboardingWizard` to an S3 or Google Cloud Storage presigned URL upload flow.
