import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { StoriesCarousel } from '../stories/StoriesCarousel';
import { PostCard } from './PostCard';
import { CreatePostModal } from '../../components/common/CreatePostModal';
import { CreateStoryModal } from '../../components/common/CreateStoryModal';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector, useDebounce, useInfiniteScroll } from '../../hooks';
import {
  appendFeedPage,
  resetFeed,
  replaceFeedPage,
  setFeedFilter,
  setFeedLoading,
} from './feedSlice';
import { feedApi } from './feed.api';
import { message } from '../../app/notification';
import styles from './FeedPage.module.css';

export const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const feedState = useAppSelector(state => state.feed);
  const { posts, activeFilter, isLoading } = feedState;
  const pagination = feedState.pagination ?? {
    page: 0,
    limit: 2,
    total: 0,
    totalPages: 0,
    search: '',
  };
  const currentUser = useAppSelector(state => state?.auth?.currentUser);
  const following = useAppSelector(state => state?.connections?.following);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const latestSearchRef = useRef(debouncedSearch);
  const isCurrentSearch = pagination.search === debouncedSearch;
  const currentPage = isCurrentSearch ? pagination.page : 0;
  const totalPages = isCurrentSearch ? pagination.totalPages : 0;

  useEffect(() => {
    latestSearchRef.current = debouncedSearch;
  }, [debouncedSearch]);

  useEffect(() => {
    let active = true;
    dispatch(resetFeed(debouncedSearch));
    dispatch(setFeedLoading(true));
    feedApi.getPosts(1, pagination.limit, debouncedSearch)
      .then(result => {
        if (active) {
          dispatch(replaceFeedPage({ ...result, search: debouncedSearch }));
        }
      })
      .catch(error => {
        if (active) {
          message.error(error instanceof Error ? error?.message : 'Unable to load posts.');
        }
      })
      .finally(() => {
        if (active && latestSearchRef.current === debouncedSearch) {
          dispatch(setFeedLoading(false));
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch, debouncedSearch]);

  const loadNextPage = useCallback((nextPage: number) => {
    if (isLoading || !isCurrentSearch || nextPage <= currentPage) return;
    dispatch(setFeedLoading(true));
    feedApi.getPosts(nextPage, pagination.limit, debouncedSearch)
      .then(result => {
        dispatch(appendFeedPage({ ...result, search: debouncedSearch }));
      })
      .catch(error => message.error(error instanceof Error ? error.message : 'Unable to load more posts.'))
      .finally(() => {
        if (latestSearchRef.current === debouncedSearch) {
          dispatch(setFeedLoading(false));
        }
      });
  }, [currentPage, debouncedSearch, dispatch, isCurrentSearch, isLoading, pagination.limit]);

  useInfiniteScroll({
    currentPage,
    hasMore: currentPage > 0 && currentPage < totalPages,
    isLoading,
    onLoadMore: loadNextPage,
    threshold: 200,
  });

  // Filter posts based on active tab
  const filteredPosts = posts?.filter?.(post => {
    if (activeFilter === 'following') {
      return following?.some?.(f => f.id === post?.userId) || post?.userId === currentUser?.id;
    }
    if (activeFilter === 'trending') {
      return post?.likesCount > 300;
    }
    return true;
  });

  return (
    <div className={styles.feedContainer}>
      {/* Stories carousel */}
      <StoriesCarousel onOpenCreateStory={() => setIsStoryOpen(true)} />

      {/* Quick create post trigger */}
      <div className={styles.createPostBar} onClick={() => setIsCreateOpen(true)}>
        <AppAvatar
          src={currentUser?.avatar || ''}
          alt={currentUser?.fullName || 'You'}
          size={38}
          isVerified={currentUser?.isVerified}
        />
        <span className={styles.fakeInput}>
          Share an update, design thought, or moment...
        </span>
        <div style={{ color: 'var(--primary)' }}>
          <ImageIcon size={20} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.tabBtn} ${activeFilter === 'all' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setFeedFilter('all'))}
        >
          All Activity
        </button>
        <button
          className={`${styles.tabBtn} ${activeFilter === 'following' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setFeedFilter('following'))}
        >
          Following ({following?.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeFilter === 'trending' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setFeedFilter('trending'))}
        >
          Trending Sparks
        </button>
      </div>

      <div className={styles.feedSearch}>
        <Search size={18} />
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search posts, creators, or tags..."
          aria-label="Search feed"
        />
        {search && <button onClick={() => setSearch('')} aria-label="Clear feed search"><X size={16} /></button>}
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <PostCard key={post?.id} post={post} />
        ))
      ) : (
        <AppEmptyState
          icon={<Sparkles size={32} />}
          title="No posts found"
          description={
            activeFilter === 'following'
              ? "You haven't followed accounts with recent updates. Explore suggested people in the sidebar!"
              : "No trending posts match this criteria right now."
          }
        />
      )}

      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <CreateStoryModal open={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
    </div>
  );
};
