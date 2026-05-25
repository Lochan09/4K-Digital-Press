import React from 'react';

type Page = 'main' | 'about' | 'achievements';

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ activePage, onNavigate }: Props) {
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
              const target = e.currentTarget;
              target.style.display = 'none';
              target.parentElement!.textContent = '4K';
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
      </nav>

      <a className="button button-ghost" href="#order">
        Order Now
      </a>
    </header>
  );
}
