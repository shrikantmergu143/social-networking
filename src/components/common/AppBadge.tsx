import React from 'react';

export interface AppBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  onClick
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      borderRadius: 'var(--radius-full)',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all var(--transition-fast)'
    };

    switch (variant) {
      case 'primary':
        return { ...base, background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(255, 79, 129, 0.2)' };
      case 'secondary':
        return { ...base, background: 'var(--secondary-light)', color: 'var(--secondary)', border: '1px solid rgba(124, 77, 255, 0.2)' };
      case 'accent':
        return { ...base, background: 'var(--accent-light)', color: 'var(--accent-hover)', border: '1px solid rgba(255, 181, 71, 0.3)' };
      case 'success':
        return { ...base, background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(34, 160, 107, 0.2)' };
      case 'outline':
        return { ...base, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
      case 'neutral':
      default:
        return { ...base, background: 'var(--surface-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' };
    }
  };

  return (
    <span style={getStyles()} className={className} onClick={onClick}>
      {children}
    </span>
  );
};
