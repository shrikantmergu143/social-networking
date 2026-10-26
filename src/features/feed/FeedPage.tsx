import React, { useEffect, useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { StoriesCarousel } from '../stories/StoriesCarousel';
import { PostCard } from './PostCard';
import { CreatePostModal } from '../../components/common/CreatePostModal';
import { CreateStoryModal } from '../../components/common/CreateStoryModal';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { replacePosts, setFeedFilter } from './feedSlice';
import { feedApi } from './feed.api';
import { message } from '../../app/notification';
import styles from './FeedPage.module.css';

export const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, activeFilter } = useAppSelector(state => state.feed);
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const following = useAppSelector(state => state.connections.following);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  useEffect(() => {
    let active = true;
    feedApi.getPosts()
      .then(serverPosts => {
        if (active) dispatch(replacePosts(serverPosts));
      })
      .catch(error => {
        if (active) {
          message.error(error instanceof Error ? error.message : 'Unable to load posts.');
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  // Filter posts based on active tab
  const filteredPosts = posts.filter?.(post => {
    if (activeFilter === 'following') {
      return following.some(f => f.id === post.userId) || post.userId === currentUser?.id;
    }
    if (activeFilter === 'trending') {
      return post.likesCount > 300;
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
          Following ({following.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeFilter === 'trending' ? styles.tabBtnActive : ''}`}
          onClick={() => dispatch(setFeedFilter('trending'))}
        >
          Trending Sparks
        </button>
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
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
