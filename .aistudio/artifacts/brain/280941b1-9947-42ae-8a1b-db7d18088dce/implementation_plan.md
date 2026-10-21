# Aura: Social Networking & Dating Web Application

A modern, responsive social networking and dating web platform that seamlessly bridges Instagram-style social sharing (feed, stories, comments, bookmarks) with Tinder/Bumble/Hinge-style matchmaking (card deck discovery, dating filters, mutual match scenarios, and real-time chat simulation).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been confirmed through Phase 1 clarification:

- **Confirmed Decision 1 (Brand Identity)**: Platform is branded as **Aura** — a modern, elegant social networking and dating connection experience.
- **Confirmed Decision 2 (Initial Demo State)**: The application pre-loads in an authenticated state with a rich demo user profile ("Alex Morgan"), active social feed, real-time mock stories, discovery deck, and incoming conversations. Users can easily explore the public marketing landing page, log out, or test onboarding at any time.
- **Confirmed Decision 3 (Dating Discovery UX)**: Central interactive card deck featuring large photography, profile badges, bio highlights, intention badges, touch/mouse action buttons (Pass, Super Like, Like), and optional drag/swipe physics.
- **Technology Alignment**: Ant Design + Redux Toolkit + Redux Persist + React Router DOM + CSS Modules + Lucide React + Day.js, strictly respecting CSS variables and avoiding generic AI visual cliches.

---

## 1. Overview & Core Concept

- **What It Does**: Aura allows users to share visual life updates and connect socially while simultaneously exploring potential romantic and social matches in a safe, beautifully curated space.
- **Target Audience / Persona**: Young adults, creatives, and professionals seeking authentic relationships, shared passions, and visual self-expression without fragmented app switching.
- **Key Value**: Unifies the social feed (authenticity, everyday passions, stories) with intentional dating discovery (verified profiles, relationship intentions, mutual match celebrations, and contextual direct messaging).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Social Journey**: Browse stories in an Instagram-like story carousel -> view full-screen stories with progress timers -> scroll feed -> like, comment, and bookmark posts -> create new multimedia post with live preview.
2. **Dating & Matchmaking Journey**: Open Discovery -> review high-res photo cards -> inspect verified profile details and intentions -> filter by age, distance, and relationship goals -> Pass, Like, or Super Like -> trigger deterministic mutual match dialog -> jump straight into messaging.
3. **Conversations & Connections**: Real-time simulated chat with typing indicators, read receipts, emoji quick-reactions, media attachment mocks, and online status indicators.
4. **Safety & Customization**: Manage profile, edit bios and interests, configure privacy/discovery visibility, report or block unwanted profiles, and explore Premium membership benefits.

### Visual Identity & Theme

- **Design Philosophy**: Warm elegance with high-contrast editorial typography, generous negative space, subtle surface elevations, and zero-pill discipline (rendering static metadata as quiet unboxed text separated by subtle typographic dots `·`).
- **Color Tokens (CSS Variables)**:
  - Primary: `#FF4F81` (Romantic rose)
  - Secondary: `#7C4DFF` (Deep violet)
  - Accent: `#FFB547` (Warm amber / Super Like)
  - Background: `#F8F8FC` (Soft cloud neutral)
  - Surface: `#FFFFFF` (Crisp elevated cards)
  - Primary Text: `#202033` (High-contrast slate)
  - Secondary Text: `#77778A` (Muted readability)
  - Border: `#E9E9F2` (1px subtle structural dividers)
  - Success: `#22A06B` | Error: `#E5484D`
- **Typography**: Paired modern geometric sans (`Plus Jakarta Sans` / `Manrope`) with strict typographic scaling (`clamp(2rem, 3.5vw, 3rem)` headlines, balanced line measure, and tabular numerals for counters and metrics).
- **Responsive Layout**:
  - **Desktop (1440px+)**: Left navigation rail with brand wordmark and quick actions, centered primary stage (feed/discovery/profile), and right contextual rail (suggested connections, trending topics, online matches).
  - **Tablet (768px - 1023px)**: Compact icon navigation rail with fluid center stage.
  - **Mobile (375px - 767px)**: Sticky compact header (<56px), full-width thumb-friendly scroll, and fixed bottom navigation bar (respecting the 15% mobile sticky cap rule with 44px+ touch targets).

---

## 3. Key Product Decisions & Trade-Offs

- **State Management & Persistence**:
  - *Chosen Approach*: Redux Toolkit with `redux-persist` storing authenticated session, user profile, discovery queue state, saved posts, matches, and mock conversations in `localStorage`.
  - *Why*: Allows instantaneous state hydration across page refreshes while ensuring form submissions, likes, and profile edits immediately reflect across all 18 modules. Sensitive credentials (passwords/OTPs) are explicitly excluded from persistence.
- **Ant Design & Custom Styling Synthesis**:
  - *Chosen Approach*: Ant Design `ConfigProvider` styled with Aura brand theme tokens for interactive components (Drawers, Modals, Forms, Dropdowns, DatePickers, Notifications) combined with custom CSS Modules and CSS variables for layouts and cards.
  - *Why*: Delivers rock-solid form validation, accessible modals, and smooth drawers without hand-rolling complex overlay physics.
- **Deterministic Matchmaking Scenario**:
  - *Chosen Approach*: Realistic dating queue with pre-programmed mutual match triggers (e.g. liking specific profiles such as "Elena Rostova" or "Maya Lin" triggers an instant mutual match celebration modal and adds them to `/matches`).
  - *Why*: Avoids frustrating dead ends while realistically separating one-sided likes from true mutual matches.

---

## 4. Technical Architecture & Data Strategy

### System & Component Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AURA WEB APPLICATION                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────┐                           ┌────────────────────┐
│     Public Routes     │                           │ Authenticated App  │
│ (/ , /login, /register│                           │ (Layout Wrapper)   │
│  /forgot-password,    │                           └──────────┬─────────┘
│  /onboarding/*)       │                                      │
└───────────────────────┘           ┌──────────────────────────┴──────────────────────────┐
                                    ▼                                                     ▼
                        ┌───────────────────────┐                             ┌───────────────────────┐
                        │   Desktop Shell       │                             │   Mobile Shell        │
                        │ • Left Nav Rail       │                             │ • Top App Bar (52px)  │
                        │ • Search & Quick-Post │                             │ • Bottom Tab Bar      │
                        │ • Right Context Rail  │                             │ • Gesture / Drawers   │
                        └──────────┬────────────┘                             └──────────┬────────────┘
                                   └──────────────────────────┬──────────────────────────┘
                                                              │
                                    ┌─────────────────────────┴─────────────────────────┐
                                    ▼                                                   ▼
                        ┌───────────────────────┐                           ┌───────────────────────┐
                        │     Social Domain     │                           │     Dating Domain     │
                        ├───────────────────────┤                           ├───────────────────────┤
                        │ • Feed (/feed)        │                           │ • Discovery (/discover│
                        │ • Stories Carousel    │                           │ • Filter Drawer       │
                        │ • Post Creator Card   │                           │ • Profile View (/user)│
                        │ • Social Search       │                           │ • Matches (/matches)  │
                        │ • Connections/Follow  │                           │ • Match Celebrations  │
                        └───────────────────────┘                           └───────────────────────┘
                                                              │
                                    ┌─────────────────────────┴─────────────────────────┐
                                    ▼                                                   ▼
                        ┌───────────────────────┐                           ┌───────────────────────┐
                        │ Communication & Util  │                           │ Settings & Safety     │
                        ├───────────────────────┤                           ├───────────────────────┤
                        │ • Chat (/messages)    │                           │ • Edit Profile        │
                        │ • Notifications Hub   │                           │ • Privacy / Blocklist │
                        │ • Bookmarks (/saved)  │                           │ • Premium Subscription│
                        └───────────────────────┘                           └───────────────────────┘
                                                              │
                                    ┌─────────────────────────┴─────────────────────────┐
                                    ▼                                                   ▼
                        ┌───────────────────────────────────────────────────────────────────┐
                        │                      Redux Toolkit Store                          │
                        │  authSlice · profileSlice · feedSlice · discoverySlice            │
                        │  matchesSlice · messagesSlice · notificationsSlice · settingsSlice│
                        └─────────────────────────────────┬─────────────────────────────────┘
                                                          ▼
                                            ┌───────────────────────────┐
                                            │   Redux Persist Storage   │
                                            │  (Local Session & Cache)  │
                                            └───────────────────────────┘
```

### Module Breakdown & Coverage Plan

1. **Foundation & Token System**: `variables.css`, `global.css`, `typography.css`, Ant Design `ConfigProvider` theme configuration, typed store and persistence setup.
2. **Reusable UI Architecture**: `AppButton`, `AppInput`, `AppAvatar`, `AppBadge`, `AppModal`, `AppDrawer`, `AppTabs`, `AppEmptyState`, `AppConfirmDialog`, `Toast`.
3. **Public Experience**:
   - Marketing Landing Page (`/`): High-conversion hero, feature pillars, success testimonials, safety guidelines, and CTA anchors.
   - Authentication Suite (`/login`, `/register`, `/forgot-password`, `/verify-otp`, `/reset-password`): Rich form validation, password strength meter, and quick demo-login shortcuts.
   - Guided Onboarding (`/onboarding/*`): Multi-step progress (Basic Info, Interests, Dating Preferences, Photos, and Profile Preview).
4. **Social Networking Experience**:
   - Feed (`/feed`): Rich post cards with multi-photo carousels, likes, threaded comments, shares, saves, and new post composer with image mock previews.
   - Stories (`/stories/:storyId`): Full-screen story player with auto-advancing progress timers, pauses on tap/hold, and user reply inputs.
   - Search & Explore (`/search`): Real-time debounced queries across users, tags, and posts with tabbed filters and recent search history.
   - Connections (`/connections`, `/followers`, `/following`): Follow/unfollow toggles and mutual connection badges.
   - Bookmarks (`/saved`): Segmented view for saved media posts and bookmarked dating profiles.
5. **Dating & Matchmaking Experience**:
   - Discovery Deck (`/discover`): Interactive profile stack with photo paging, verification badges, distance, relationship goals, lifestyle tags, and tactile Pass / Like / Super Like controls.
   - Dating Filter Drawer: Age range slider, distance radius, gender preference, intention filters, and verified-only toggle.
   - Profile Details (`/profile/:userId` & `/my-profile`): Hero gallery, personal bio, lifestyle breakdown, social post feed, mutual connections, and action triggers.
   - Matches Hub (`/matches`): New match bubble row, recent match grid with compatibility percentages, search filter, and instant conversation starter.
6. **Communication & Safety**:
   - Real-Time Messaging (`/messages` & `/messages/:conversationId`): Active conversation list, simulated typing indicators, read receipts, media attachment previews, and responsive split view.
   - Notifications Hub (`/notifications`): Unread counters, categorization (Likes, Comments, Matches, Messages), mark-as-read, and direct route linking.
   - Safety & Moderation (`/blocked-users`, `/report/:userId`): Interactive report modal with categorization and blocklist management.
   - Premium Experience (`/premium`): Benefit highlights (unlimited likes, rewind, see who liked you), monthly/annual pricing switch, and demo checkout flow.
