import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { App } from 'antd';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch } from '../../hooks';
import { loginSuccess } from './authSlice';
import { ROUTES } from '../../routes/paths';
import styles from './AuthPages.module.css';
import { authApi } from './services/auth.api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const from = (location.state as any)?.from?.pathname || ROUTES.FEED;

  const validate = () => {
    const errs: typeof errors = {};
    if (!identifier.trim()) errs.identifier = 'Email or phone number is required';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const response = await authApi.login({
      email: identifier,
      password: password,
    }, message);
    if(response?.status){
      const userData: any = response?.data
      dispatch(loginSuccess({
        user: userData?.user,
        token: userData?.accessToken,
      }));
      navigate(from, { replace: true });
    }
    setLoading(false);
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   dispatch(loginSuccess({
    //     user: CURRENT_USER,
    //     token: 'auth_token_' + Date.now()
    //   }));
    //   message.success('Welcome back to Aura, Alex!');
    //   navigate(from, { replace: true });
    // }, 600);
  };

  const handleQuickDemoLogin = () => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   dispatch(loginSuccess({
    //     user: CURRENT_USER,
    //     token: 'auth_token_demo'
    //   }));
    //   message.success('Signed in as demo user Alex Morgan');
    //   navigate(ROUTES.FEED, { replace: true });
    // }, 300);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Enter your details to access your feed & matches</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email or Phone Number</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              className={styles.input}
            />
            {errors.identifier && <div className={styles.errorMessage}>{errors.identifier}</div>}
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.label}>Password</label>
              <Link to={ROUTES.FORGOT_PASSWORD} style={{ fontSize: '0.8125rem', color: 'var(--primary)' }}>
                Forgot?
              </Link>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.input}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Remember this device</span>
            </label>
          </div>

          <AppButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            icon={<ArrowRight size={18} />}
          >
            Sign In to Aura
          </AppButton>
        </form>

        <div className={`hidden ${styles.socialDivider}`}>or continue with</div>

        {/* Mock social sign in clearly labeled */}
        <button 
          type="button"
          className={`hidden ${styles.socialButton}`}
          onClick={handleQuickDemoLogin}
          title="Sign in with Google (Demo)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          className={`hidden ${styles.socialButton}`}
          onClick={handleQuickDemoLogin}
          title="Sign in with Apple (Demo)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.94 2.73 1.01.08 2.03-.48 2.65-1.23"/>
          </svg>
          Continue with Apple
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: 24, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};
