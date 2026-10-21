import React, { useState } from 'react';
import { Image as ImageIcon, X, Globe, Users, Lock, Sparkles } from 'lucide-react';
import { Select } from 'antd';
import { AppModal } from '../common/AppModal';
import { AppButton } from '../common/AppButton';
import { AppAvatar } from '../common/AppAvatar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createPost } from '../../features/feed/feedSlice';
import type { FeedPost } from '../../types';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Life');
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'close_friends'>('public');
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [customImageInput, setCustomImageInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const presetImages = [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80'
  ];

  const handleAddImage = (url: string) => {
    if (url && !imageUrls.includes(url)) {
      setImageUrls([...imageUrls, url]);
      setCustomImageInput('');
      setShowImageInput(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && imageUrls.length === 0) return;

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      userId: currentUser?.id || 'usr_me',
      author: {
        id: currentUser?.id || 'usr_me',
        name: currentUser?.fullName || 'Alex Morgan',
        username: currentUser?.username || 'alexmorgan',
        avatar: currentUser?.avatar || '',
        isVerified: currentUser?.isVerified || true,
        location: currentUser?.location || 'San Francisco, CA'
      },
      caption: caption.trim(),
      images: imageUrls,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: 'Just now',
      isLiked: false,
      isSaved: false,
      tags: [selectedTag],
      visibility,
      comments: []
    };

    dispatch(createPost(newPost));
    setCaption('');
    onClose();
  };

  return (
    <AppModal open={open} onCancel={onClose} width={540} title="Create Post">
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

        {/* Add photo bar */}
        <div style={{
          padding: '12px 16px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          background: 'var(--surface-subtle)'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Add media to your post
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'white',
                border: '1px solid var(--border)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--primary)'
              }}
            >
              <ImageIcon size={16} /> Choose Photo
            </button>
          </div>
        </div>

        {showImageInput && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8 }}>Select from showcase photo assets:</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 10 }}>
              {presetImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`preset-${i}`}
                  onClick={() => handleAddImage(img)}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    border: '2px solid transparent'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={customImageInput}
                onChange={(e) => setCustomImageInput(e.target.value)}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  padding: '0 8px',
                  fontSize: '0.8125rem'
                }}
              />
              <AppButton
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => handleAddImage(customImageInput)}
              >
                Add
              </AppButton>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <AppButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            variant="primary"
            disabled={!caption.trim() && imageUrls.length === 0}
          >
            Publish Post
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
