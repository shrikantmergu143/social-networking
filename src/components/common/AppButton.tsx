import React from 'react';
import styles from './AppButton.module.css';

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className
  ].filter?.(Boolean).join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
      ) : (
        icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
      {children}
    </button>
  );
};
