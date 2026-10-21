import React, { useState } from 'react';
import { Select, Tag, Input, Button, App } from 'antd';
import { X } from 'lucide-react';
import { AppDrawer } from '../../components/common/AppDrawer';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateCurrentUserProfile } from '../auth/authSlice';
import type { UserProfile, RelationshipGoal } from '../../types';
import { AppUpload } from '../../components/common/AppUpload';
import { profileApi } from './services/profile.api';

interface EditProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const INTEREST_OPTIONS = [
  'Hiking', 'Photography', 'Coffee', 'Music', 'Travel', 'Art', 'Fitness',
  'Cooking', 'Reading', 'Gaming', 'Yoga', 'Design', 'Technology', 'Surfing'
];

export const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [pronouns, setPronouns] = useState(currentUser?.pronouns || '');
  const [occupation, setOccupation] = useState(currentUser?.lifestyle?.occupation || '');
  const [education, setEducation] = useState(currentUser?.lifestyle?.education || '');
  const [photos, setPhotos] = useState<string[]>(currentUser?.photos || [currentUser?.avatar || '']);
  const [interests, setInterests] = useState<string[]>(currentUser?.interests || ['Coffee', 'Design', 'Travel']);
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal>(
    currentUser?.relationshipGoal || 'Long-term partner'
  );


  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) {
      message.error('You must keep at least one profile photo');
      return;
    }
    setPhotos(photos.filter((_, i) => i !== index));
    message.success('Photo removed');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const savedPhotos = photos?.filter?.(photo => photo);

    const payload = {
      fullName,
      bio,
      location,
      pronouns,
      relationshipGoal,
      photos: savedPhotos,
      avatar: savedPhotos[0] || '',
      interests,
      lifestyle: {
        ...currentUser?.lifestyle,
        occupation,
        education
      }
    };

    const response = await profileApi.updateProfile(payload);
    if (!response.status) {
      message.error(response.error?.message || 'Unable to update your profile.');
      return;
    }

    dispatch(updateCurrentUserProfile(payload));
    message.success('Profile updated successfully!');
    onClose();
  };

  return (
    <AppDrawer title="Edit Your Profile & Photos" open={open} onClose={onClose} width={460}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 32 }}>
        {/* Photo Management */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>
            Profile Photos ({new Set([...photos].filter(Boolean)).size})
          </label>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 12, }}>
            {photos.map((p, idx) => (
              <div key={idx} style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                <img
                  src={p}
                  alt={`Photo ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, border: idx === 0 ? '2px solid var(--primary)' : '1px solid #ddd' }}
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
                {idx === 0 && (
                  <span style={{ position: 'absolute', bottom: 2, left: 2, right: 2, fontSize: 9, background: 'var(--primary)', color: 'white', textAlign: 'center', borderRadius: 4, fontWeight: 700 }}>
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, alignItems: 'start', marginBottom: 16 }}>
              <AppUpload value={photos} onChange={value => setPhotos(value as string[])} type="profile" multiple maxCount={6} showUploadList={false} />
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>
                JPG, PNG, or WebP · max 5 MB each · up to 6 photos
              </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
            Full Name
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
              Pronouns
            </label>
            <Input
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
            Bio / Introduction
          </label>
          <Input.TextArea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
              Occupation
            </label>
            <Input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
              Education
            </label>
            <Input
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>
            Interests & Passions
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {interests.map(item => (
              <Tag
                key={item}
                closable
                onClose={() => setInterests(interests.filter(i => i !== item))}
                color="magenta"
                style={{ padding: '4px 10px', borderRadius: 999, fontSize: '0.8125rem' }}
              >
                {item}
              </Tag>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 4 }}>Click to add from popular interests:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {INTEREST_OPTIONS.filter(i => !interests.includes(i)).map(item => (
              <Tag
                key={item}
                onClick={() => setInterests([...interests, item])}
                style={{ cursor: 'pointer', borderRadius: 999, padding: '2px 8px', fontSize: '0.75rem' }}
              >
                + {item}
              </Tag>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
            Relationship Intention
          </label>
          <Select
            value={relationshipGoal}
            onChange={setRelationshipGoal}
            style={{ width: '100%', borderRadius: 8 }}
            options={[
              { value: 'Long-term partner', label: 'Long-term partner' },
              { value: 'Long-term, open to short', label: 'Long-term, open to short' },
              { value: 'Short-term, open to long', label: 'Short-term, open to long' },
              { value: 'Short-term fun', label: 'Short-term fun' },
              { value: 'New friends', label: 'New friends' },
              { value: 'Still figuring it out', label: 'Still figuring it out' }
            ]}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <AppButton type="submit" variant="primary" fullWidth>
            Save Profile Changes
          </AppButton>
        </div>
      </form>
    </AppDrawer>
  );
};
