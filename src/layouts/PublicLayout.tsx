import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { ROUTES } from '../routes/paths';
import styles from './PublicLayout.module.css';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      {/* Strict 3-Zone Top Bar Contract */}
      <header className={styles.topBar}>
        {/* Zone 1: Brand Wordmark single element */}
        <Link to={ROUTES.LANDING} className={styles.brandLink}>
          <span className={styles.brandWordmark}>Aura</span>
        </Link>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          <a href="#stories" className={styles.navLink}>Success Stories</a>
          <a href="#safety" className={styles.navLink}>Safety & Privacy</a>
        </nav>

        {/* Zone 3: Primary action */}
        <div className={styles.topActions}>
          <AppButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Sign In
          </AppButton>
          <AppButton
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.REGISTER)}
          >
            Get Started
          </AppButton>
        </div>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerMeta}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Aura</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} Aura Inc. All rights reserved.</span>
          </div>

          <div className={styles.footerLinks}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#guidelines">Community Guidelines</a>
            <a href="#support">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
