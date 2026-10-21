# Feature Implementation Plan: Mobile Post Feed UI Improvements

This implementation plan outlines the redesign and refinement of the mobile post feed (`FeedPage.tsx`, `PostCard.tsx`, and associated CSS modules) to deliver an optimized mobile experience with refined card spacing, edge-to-edge full-width swipeable image carousels, and intuitive bottom action bars.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following preferences were confirmed during the planning phase:
> - **Focus Area**: Card spacing and image display optimization for mobile viewports.
> - **Image Format**: Full-width swipeable image carousel with natural aspect ratio fit and pagination dots.
> - **Action Bar Position**: Clean bottom action bar positioned below the caption with like, comment, share, and bookmark buttons.

---

## 1. Overview & Core Concept

- **Refined Card Spacing**: Reduce horizontal margins on narrow mobile viewports, remove heavy dual borders, and replace with clean hairline dividers or soft whitespace separators (`py-4` / `space-y-3`).
- **Edge-to-Edge Image Carousel**: Post images will span edge-to-edge on mobile screens without awkward side padding, with horizontal swipe/scroll snap and dot indicators for multi-image posts.
- **Action Bar & Typography**: Streamlined layout ordering (Header -> Edge Image -> Action Buttons -> Likes/Caption -> Comments preview) following top-tier mobile social app ergonomics.

---

## 2. User Experience & Visual Design

- **Mobile Viewport Optimization**:
  - Container padding adjusted to `px-0 sm:px-4` on mobile so images extend edge-to-edge like Instagram/TikTok.
  - Smooth touch scroll and swipe snap for image galleries.
- **Action Bar**:
  - Left group: Like (Heart), Comment (MessageCircle), Share (Send).
  - Right: Bookmark (Bookmark).
  - Clean font sizes and touch hitboxes ($\ge 44\text{px}$).

---

## 3. Technical Architecture & Data Strategy

- **Components to Modify**:
  - `src/features/feed/PostCard.tsx`: Restructure card layout for mobile edge-to-edge images and bottom action bar positioning.
  - `src/features/feed/PostCard.module.css`: Update mobile responsive CSS rules, edge-to-edge image handling, carousel snap points, and spacing.
  - `src/features/feed/FeedPage.tsx`: Refine feed container spacing on mobile viewports.
