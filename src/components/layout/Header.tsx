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

  return (
    <header className="topbar">
      <button
        className="brand brand-btn"
        onClick={() => onNavigate('main')}
        aria-label="4K Digital Press home"
      >
        <span className="brand-mark">
          <img
            className="brand-logo"
            src="/logo.png"
            alt="4K Digital Press"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
              t.parentElement!.textContent = '4K';
            }}
          />
        </span>
        <span>
          <strong>4K Digital Press</strong>
          <small>Premium Wedding Albums — Mysuru</small>
        </span>
      </button>

      <nav className="nav">
        {activePage !== 'main' ? (
          <button className="nav-text-btn" onClick={() => onNavigate('main')}>Home</button>
        ) : (
          <>
            <a href="#catalog">Catalog</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </>
        )}
        <button
          className={`nav-text-btn ${activePage === 'about' ? 'nav-active' : ''}`}
          onClick={() => onNavigate('about')}
        >
          About Us
        </button>
        <button
          className={`nav-text-btn ${activePage === 'achievements' ? 'nav-active' : ''}`}
          onClick={() => onNavigate('achievements')}
        >
          Achievements
        </button>
        {user && (
          <button
            className={`nav-text-btn ${activePage === 'myorders' ? 'nav-active' : ''}`}
            onClick={() => onNavigate('myorders')}
          >
            My Orders
          </button>
        )}
        {isOwner && (
          <button
            className={`nav-text-btn ${activePage === 'admin' ? 'nav-active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            Monitor Orders
          </button>
        )}
      </nav>

      {/* Desktop auth — sign in button or avatar */}
      {!loading && !user && (
        <button className="nav-signin-btn" onClick={signIn}>
          <GoogleLogoSVG /> Sign In
        </button>
      )}
      {!loading && user && (
        <div className="nav-user-wrap">
          {user.photoURL && (
            <img
              src={user.photoURL}
              referrerPolicy="no-referrer"
              className="nav-avatar"
              alt={user.displayName || 'User'}
            />
          )}
          <span className="nav-user-name">{user.displayName?.split(' ')[0]}</span>
          <button className="nav-signout-btn" onClick={signOut}>Sign Out</button>
        </div>
      )}

      <a className="button button-ghost" href="#order">
        Order Now
      </a>
    </header>
  );
}
