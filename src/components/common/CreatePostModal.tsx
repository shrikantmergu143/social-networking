import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Select } from 'antd';
import { AppModal } from '../common/AppModal';
import { AppButton } from '../common/AppButton';
import { AppAvatar } from '../common/AppAvatar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createPost, updatePost } from '../../features/feed/feedSlice';
import type { FeedPost } from '../../types';
import { AppUpload } from './AppUpload';
import { feedApi, type PostPayload } from '../../features/feed/feed.api';
import { message } from '../../app/notification';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  post?: FeedPost;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose, post }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Life');
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'close_friends'>('public');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCaption(post?.caption ?? '');
    setSelectedTag(post ? post.tags[0] ?? '' : 'Life');
    setVisibility(post?.visibility ?? 'public');
    setImageUrls(post?.images ?? []);
  }, [open, post]);

  const handleRemoveImage = (index: number) => {
    setImageUrls(urls => urls.filter?.((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!caption.trim() && imageUrls.length === 0) || isSubmitting) return;

    const payload: PostPayload = {
      caption: caption.trim(),
      images: imageUrls,
      tags: selectedTag ? [selectedTag] : [],
      visibility
    };

    setIsSubmitting(true);
    try {
      const savedPost = post
        ? await feedApi.updatePost(post.id, payload)
        : await feedApi.createPost(payload);
      dispatch(post ? updatePost(savedPost) : createPost(savedPost));
      onClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to save this post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal open={open} onCancel={onClose} width={540} title={post ? 'Edit Post' : 'Create Post'}>
      <form onSubmit={handleSubmit} style={{ paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <AppAvatar
            src={currentUser?.avatar || ''}
            alt={currentUser?.fullName || 'You'}
            size={44}
            isVerified={currentUser?.isVerified}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {currentUser?.fullName}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Select
                size="small"
                value={visibility}
                onChange={setVisibility}
                style={{ width: 130 }}
                options={[
                  { value: 'public', label: '🌐 Public' },
                  { value: 'connections', label: '👥 Connections' },
                  { value: 'close_friends', label: '⭐ Close Friends' }
                ]}
              />
              <Select
                size="small"
                value={selectedTag}
                onChange={setSelectedTag}
                style={{ width: 110 }}
                options={[
                  { value: '', label: 'No tag' },
                  { value: 'Life', label: '#Life' },
                  { value: 'Design', label: '#Design' },
                  { value: 'Coffee', label: '#Coffee' },
                  { value: 'Music', label: '#Music' },
                  { value: 'Art', label: '#Art' },
                  { value: 'Travel', label: '#Travel' }
                ]}
              />
            </div>
          </div>
        </div>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's happening in your world?"
          rows={4}
          style={{
            width: '100%',
            padding: 12,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'none',
            outline: 'none',
            marginBottom: 12,
            background: 'var(--surface)'
          }}
        />

        {/* Image Previews */}
        {imageUrls.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
            {imageUrls.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.65)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, alignItems: 'start', marginBottom: 16 }}>
          <AppUpload
            value={imageUrls}
            onChange={value => setImageUrls(Array.isArray(value) ? value : value ? [value] : [])}
            multiple
            type="post"
            maxCount={6}
            showUploadList={false}
          />
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>
            JPG, PNG, or WebP · max 5 MB each · up to 6 photos
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <AppButton type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            variant="primary"
            disabled={!caption.trim() && imageUrls.length === 0}
            loading={isSubmitting}
          >
            {post ? 'Save Changes' : 'Publish Post'}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
