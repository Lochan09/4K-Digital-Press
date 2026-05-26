import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogoSVG } from '../icons/GoogleLogoSVG';
import type { Page } from '../../types';

const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL as string || '').toLowerCase();

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ activePage, onNavigate }: Props) {
  const { user, loading, signIn, signOut } = useAuth();
  const isOwner = !!user && user.email?.toLowerCase() === OWNER_EMAIL;
  const [menuOpen, setMenuOpen] = useState(false);

  function go(page: Page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="topbar">
      {/* ── Logo ── */}
      <button className="brand brand-btn" onClick={() => go('main')} aria-label="4K Digital Press home">
        <span className="brand-mark">
          <img
            className="brand-logo"
            src="/logo-footer.png"
            alt="4K Digital Press"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
              t.parentElement!.textContent = '4K';
            }}
          />
        </span>
        <small className="brand-tag">Premium Wedding Albums · Mysuru</small>
      </button>

      {/* ── Desktop nav ── */}
      <nav className="nav nav--desktop">
        {activePage !== 'main' ? (
          <button className="nav-text-btn" onClick={() => go('main')}>Home</button>
        ) : (
          <>
            <a href="#catalog">Catalog</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </>
        )}
        <button className={`nav-text-btn ${activePage === 'about' ? 'nav-active' : ''}`} onClick={() => go('about')}>About Us</button>
        <button className={`nav-text-btn ${activePage === 'achievements' ? 'nav-active' : ''}`} onClick={() => go('achievements')}>Achievements</button>
        {user && <button className={`nav-text-btn ${activePage === 'myorders' ? 'nav-active' : ''}`} onClick={() => go('myorders')}>My Orders</button>}
        {isOwner && <button className={`nav-text-btn ${activePage === 'admin' ? 'nav-active' : ''}`} onClick={() => go('admin')}>Monitor Orders</button>}
      </nav>

      {/* ── Desktop right side (auth + order) ── */}
      <div className="nav-end">
        {!loading && !user && (
          <button className="nav-signin-btn" onClick={signIn}><GoogleLogoSVG /> Sign In</button>
        )}
        {!loading && user && (
          <div className="nav-user-wrap">
            {user.photoURL && (
              <img src={user.photoURL} referrerPolicy="no-referrer" className="nav-avatar" alt={user.displayName || 'User'} />
            )}
            <span className="nav-user-name">{user.displayName?.split(' ')[0]}</span>
            <button className="nav-signout-btn" onClick={signOut}>Sign Out</button>
          </div>
        )}
        <a className="button button-ghost" href="#order">Order Now</a>
      </div>

      {/* ── Hamburger (mobile only) ── */}
      <button
        className={`hamburger${menuOpen ? ' hamburger--open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="mob-drawer">
          <nav className="mob-nav">
            {activePage !== 'main' ? (
              <button className="mob-nav-item" onClick={() => go('main')}>Home</button>
            ) : (
              <>
                <a className="mob-nav-item" href="#catalog"     onClick={closeMenu}>Catalog</a>
                <a className="mob-nav-item" href="#services"    onClick={closeMenu}>Services</a>
                <a className="mob-nav-item" href="#contact"     onClick={closeMenu}>Contact</a>
              </>
            )}
            <button className={`mob-nav-item${activePage === 'about'        ? ' mob-nav-item--active' : ''}`} onClick={() => go('about')}>About Us</button>
            <button className={`mob-nav-item${activePage === 'achievements' ? ' mob-nav-item--active' : ''}`} onClick={() => go('achievements')}>Achievements</button>
            {user && <button className={`mob-nav-item${activePage === 'myorders' ? ' mob-nav-item--active' : ''}`} onClick={() => go('myorders')}>My Orders</button>}
            {isOwner && <button className={`mob-nav-item${activePage === 'admin' ? ' mob-nav-item--active' : ''}`} onClick={() => go('admin')}>Monitor Orders</button>}
          </nav>

          <div className="mob-drawer-footer">
            {!loading && !user && (
              <button className="nav-signin-btn mob-signin" onClick={() => { signIn(); closeMenu(); }}>
                <GoogleLogoSVG /> Sign In with Google
              </button>
            )}
            {!loading && user && (
              <div className="mob-user-row">
                {user.photoURL && (
                  <img src={user.photoURL} referrerPolicy="no-referrer" className="nav-avatar" alt={user.displayName || 'User'} />
                )}
                <span className="nav-user-name">{user.displayName}</span>
                <button className="nav-signout-btn" onClick={() => { signOut(); closeMenu(); }}>Sign Out</button>
              </div>
            )}
            <a className="button mob-order-btn" href="#order" onClick={closeMenu}>Order Now</a>
          </div>
        </div>
      )}
    </header>
  );
}
