import React, { useState } from 'react';
import { Check } from 'lucide-react';
import styles from './AppAvatar.module.css';

export interface AppAvatarProps {
  src: string;
  alt: string;
  size?: number;
  isVerified?: boolean;
  isOnline?: boolean;
  hasStoryRing?: boolean;
  hasSeenStory?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AppAvatar: React.FC<AppAvatarProps> = ({
  src,
  alt,
  size = 40,
  isVerified = false,
  isOnline = false,
  hasStoryRing = false,
  hasSeenStory = false,
  onClick,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  // Styled fallback container (Zero-Broken-Image Policy)
  const initial = alt ? alt.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`${styles.wrapper} ${hasStoryRing ? (hasSeenStory ? styles.hasSeenRing : styles.hasStoryRing) : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={styles.avatar}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      ) : (
        <div
          className={styles.avatar}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gradient-subtle)',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: `${Math.round(size * 0.42)}px`
          }}
        >
          {initial}
        </div>
      )}

      {isVerified && (
        <span className={styles.verifiedBadge} title="Verified Profile">
          <Check size={10} strokeWidth={3} />
        </span>
      )}

      {isOnline && !isVerified && (
        <span className={styles.onlineDot} title="Online now" />
      )}
    </div>
  );
};
