import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
  Flag,
  Copy
} from 'lucide-react';
import { Dropdown, type MenuProps } from 'antd';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleLikePost, toggleSavePost, addComment, deletePost } from './feedSlice';
import { ROUTES } from '../../routes/paths';
import type { FeedPost, PostComment } from '../../types';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: FeedPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageHeights, setImageHeights] = useState<Record<number, number>>({});

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !post.images) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeImageIndex < post.images.length - 1) {
      setActiveImageIndex(prev => prev + 1);
    }
    if (isRightSwipe && activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    const img = e.currentTarget;
    const containerWidth = img.parentElement?.clientWidth || 400;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = img.naturalHeight / img.naturalWidth;
      const calculatedHeight = Math.min(Math.max(containerWidth * ratio, 260), 560);
      setImageHeights(prev => ({ ...prev, [index]: calculatedHeight }));
    }
  };

  const isMyPost = post.userId === currentUser?.id;

  const handleLike = () => {
    dispatch(toggleLikePost(post.id));
  };

  const handleSave = () => {
    dispatch(toggleSavePost(post.id));
    message.success(post.isSaved ? 'Removed from saved items' : 'Saved to your bookmarks');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/feed#${post.id}`);
    message.success('Post link copied to clipboard!');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      postId: post.id,
      userId: currentUser?.id || 'usr_me',
      userName: currentUser?.fullName || 'Alex Morgan',
      userAvatar: currentUser?.avatar || '',
      userVerified: currentUser?.isVerified || true,
      text: replyTo ? `@${replyTo} ${commentText.trim()}` : commentText.trim(),
      createdAt: 'Just now',
      likesCount: 0
    };

    dispatch(addComment({ postId: post.id, comment: newComment }));
    setCommentText('');
    setReplyTo(null);
  };

  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'copy',
      label: 'Copy link to post',
      icon: <Copy size={14} />,
      onClick: handleShare
    },
    ...(isMyPost ? [{
      key: 'delete',
      label: 'Delete Post',
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: () => {
        dispatch(deletePost(post.id));
        message.info('Post deleted');
      }
    }] : [{
      key: 'report',
      label: 'Report post',
      icon: <Flag size={14} />,
      onClick: () => navigate(ROUTES.REPORT(post.author.id))
    }])
  ];

  return (
    <article className={styles.card} id={post.id}>
      {/* Header */}
      <div className={styles.header}>
        <Link to={ROUTES.PROFILE(post.author.id)} className={styles.authorMeta}>
          <AppAvatar
            src={post.author.avatar}
            alt={post.author.name}
            size={42}
            isVerified={post.author.isVerified}
          />
          <div className={styles.authorText}>
            <div className={styles.authorName}>
              {post.author.name}
            </div>
            <div className={styles.postSubmeta}>
              <span>@{post.author.username}</span>
              <span>·</span>
              <span>{post.createdAt}</span>
              {post.author.location && (
                <>
                  <span>·</span>
                  <span>{post.author.location}</span>
                </>
              )}
            </div>
          </div>
        </Link>

        <Dropdown menu={{ items: moreMenuItems }} trigger={['click']} placement="bottomRight">
          <button className={styles.moreBtn} aria-label="More options">
            <MoreHorizontal size={20} />
          </button>
        </Dropdown>
      </div>

      {/* Media Carousel */}
      {post.images && post.images.length > 0 && (
        <div
          className={styles.mediaContainer}
          style={{ height: imageHeights[activeImageIndex] ? `${imageHeights[activeImageIndex]}px` : '380px' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={post.images[activeImageIndex]}
            alt={`Post media by ${post.author.name}`}
            className={styles.postImage}
            onLoad={(e) => handleImageLoad(e, activeImageIndex)}
            referrerPolicy="no-referrer"
          />

          {post.images.length > 1 && (
            <>
              {activeImageIndex > 0 && (
                <button
                  className={`${styles.navArrow} ${styles.prevArrow}`}
                  onClick={() => setActiveImageIndex(prev => prev - 1)}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
              )}
              {activeImageIndex < post.images.length - 1 && (
                <button
                  className={`${styles.navArrow} ${styles.nextArrow}`}
                  onClick={() => setActiveImageIndex(prev => prev + 1)}
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} />
                </button>
              )}

              <div className={styles.dotsRow}>
                {post.images.map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot} ${i === activeImageIndex ? styles.dotActive : ''}`}
                    onClick={() => setActiveImageIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.leftActions}>
          <button
            className={`${styles.actionButton} ${post.isLiked ? styles.liked : ''}`}
            onClick={handleLike}
            aria-label="Like post"
          >
            <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
            <span className="tabular-nums">{post.likesCount}</span>
          </button>

          <button
            className={styles.actionButton}
            onClick={() => setShowComments(!showComments)}
            aria-label="View comments"
          >
            <MessageCircle size={20} />
            <span className="tabular-nums">{post.commentsCount}</span>
          </button>

          <button
            className={styles.actionButton}
            onClick={handleShare}
            aria-label="Share post"
          >
            <Share2 size={19} />
          </button>
        </div>

        <button
          className={`${styles.actionButton} ${post.isSaved ? styles.saved : ''}`}
          onClick={handleSave}
          aria-label="Save post"
        >
          <Bookmark size={20} fill={post.isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Caption & tags */}
      {post.caption && (
        <div className={styles.captionArea}>
          <p>{post.caption}</p>
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsRow}>
              {post.tags.map(t => (
                <span
                  key={t}
                  className={styles.tagLink}
                  onClick={() => navigate(`${ROUTES.SEARCH}?tag=${t}`)}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className={styles.commentsArea}>
          {post.comments && post.comments.length > 0 ? (
            <div className={styles.commentsList}>
              {post.comments.map(c => (
                <div key={c.id}>
                  <div className={styles.commentItem}>
                    <AppAvatar
                      src={c.userAvatar}
                      alt={c.userName}
                      size={32}
                      isVerified={c.userVerified}
                    />
                    <div className={styles.commentBubble}>
                      <div className={styles.commentAuthor}>{c.userName}</div>
                      <div>{c.text}</div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span>{c.createdAt}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyTo(c.userName);
                          }}
                          style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {c.replies && c.replies.length > 0 && (
                    <div className={styles.replyList}>
                      {c.replies.map(r => (
                        <div key={r.id} className={styles.commentItem}>
                          <AppAvatar
                            src={r.userAvatar}
                            alt={r.userName}
                            size={26}
                            isVerified={r.userVerified}
                          />
                          <div className={styles.commentBubble}>
                            <div className={styles.commentAuthor}>{r.userName}</div>
                            <div>{r.text}</div>
                            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{r.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              No comments yet. Be the first to spark a conversation!
            </p>
          )}

          {/* Add comment input */}
          <form onSubmit={handleAddComment} className={styles.commentInputRow}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyTo ? `Replying to @${replyTo}...` : "Write a comment..."}
              className={styles.commentInput}
            />
            <button type="submit" className={styles.commentSendBtn} aria-label="Send comment">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
