import React, { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';

interface ProfileCoverProps {
  src?: string | null;
  alt: string;
}

export const ProfileCover: React.FC<ProfileCoverProps> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return <div className={`${styles.coverImage} ${styles.defaultCover}`} role="img" aria-label={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={styles.coverImage}
      onError={() => setHasError(true)}
    />
  );
};
