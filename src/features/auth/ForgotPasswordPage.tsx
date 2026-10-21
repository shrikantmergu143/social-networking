import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { message } from '../../app/notification';
import { AppButton } from '../../components/common/AppButton';
import { ROUTES } from '../../routes/paths';
import styles from './AuthPages.module.css';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      message.success('Verification code sent to ' + email);
      navigate(ROUTES.VERIFY_OTP, { state: { email } });
    }, 600);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div style={{ marginBottom: 16 }}>
          <Link to={ROUTES.LOGIN} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>

        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Forgot Password?</h1>
          <p className={styles.subtitle}>Enter your account email and we'll send a 6-digit verification code</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Account Email</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexmorgan@example.com"
                className={styles.input}
              />
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>

          <AppButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            icon={<ArrowRight size={18} />}
          >
            Send Verification Code
          </AppButton>
        </form>
      </div>
    </div>
  );
};
