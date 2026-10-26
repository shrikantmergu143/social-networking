import React, { useState } from 'react';
import { AppModal } from './AppModal';
import { AppButton } from './AppButton';
import { AppUpload } from './AppUpload';
import { socialApi } from '../../lib/social.api';
import { message } from '../../app/notification';
import { useAppDispatch } from '../../hooks';
import { replaceStories } from '../../features/stories/storiesSlice';

interface CreateStoryModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!mediaUrl || isSaving) return;
    setIsSaving(true);
    try {
      await socialApi.createStory({ mediaUrl, mediaType: 'image', caption: caption.trim() });
      dispatch(replaceStories(await socialApi.getStories()));
      setMediaUrl('');
      setCaption('');
      onClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to publish story.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppModal open={open} onCancel={onClose} width={480} title="Add to your story">
      <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
        <AppUpload
          value={mediaUrl}
          onChange={value => setMediaUrl(Array.isArray(value) ? value[0] ?? '' : value)}
          type="story"
          maxCount={1}
          listType="picture-card"
        />
        <textarea
          value={caption}
          onChange={event => setCaption(event.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Add a caption..."
          style={{ width: '100%', padding: 12, resize: 'vertical' }}
        />
        <AppButton type="submit" loading={isSaving} disabled={!mediaUrl}>Share Story</AppButton>
      </form>
    </AppModal>
  );
};
