import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        {/* Replace /logo-footer.png with your footer logo file in public/ */}
        <img
          className="footer-logo"
          src="/logo-footer.png"
          alt="4K Digital Press"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <strong>4K Digital Press</strong>
        <span>© 2025 4K Digital Press · Mysuru, Karnataka</span>
      </div>

      <div className="social-links footer-links">
        <a href="https://www.facebook.com/search/top/?q=4k%20digital%20press" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href="https://www.instagram.com/4k_digital_press/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://wa.me/916366064066" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a href="mailto:4kdigitalpress@gmail.com">Email</a>
      </div>

      <span className="crafted">Crafted with ✦ Pride</span>
    </footer>
  );
}
