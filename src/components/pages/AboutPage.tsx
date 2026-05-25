import React from 'react';

interface Props {
  onBack: () => void;
}

export default function AboutPage({ onBack }: Props) {
  return (
    <div className="sub-page" id="page-about">
      <section className="sub-page-section">
        <div className="sub-page-inner">

          <div className="sub-page-eyebrow">
            <span className="eyebrow-line"></span>
            About Us
          </div>

          <h1 className="sub-page-title">4K Digital Press</h1>
          <p className="sub-page-subtitle">Derived from Prince Digilab &nbsp;·&nbsp; Established 2023</p>

          <div className="sub-page-card">
            <p>
              Welcome to <strong>4K Digital Press</strong>, your trusted destination for premium photo printing
              and customized album solutions in Mysuru. Derived from the legacy of <em>Prince Digilab</em>, we
              were proudly established in <strong>2023</strong> — continuing and elevating a tradition of
              excellence in photo craftsmanship with the latest 4K digital printing technology.
            </p>
            <p>
              Over the years, we are proud to have served <strong>5000+ happy customers</strong> across South
              India with a wide range of premium photo products and customized printing solutions. From wedding
              albums to luxury photo books, our commitment to quality and customer satisfaction has helped us
              build strong relationships with professional photographers, studios, event managers, and photo
              lovers.
            </p>
            <p>
              At 4K Digital Press, we combine advanced digital printing technology with creative album designing
              to deliver world-class products with premium finishing and long-lasting quality.
            </p>
          </div>

          <div className="sub-page-two-col">
            <div className="sub-page-card">
              <div className="sub-page-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To preserve every beautiful memory with premium quality, creative craftsmanship, and innovative
                4K printing solutions.
              </p>
            </div>
            <div className="sub-page-card">
              <div className="sub-page-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To become South India's most trusted and leading 4K digital photo lab and album printing
                company.
              </p>
            </div>
          </div>

          <div className="sub-page-quote-banner">
            <div className="sub-page-quote-title">4K Digital Press</div>
            <div className="sub-page-quote-sub">Derived from Prince Digilab · Est. 2023</div>
            <div className="sub-page-quote-text">"Premium Albums for Precious Moments"</div>
          </div>

          <button className="button sub-page-back" onClick={onBack}>
            ← Back to Home
          </button>

        </div>
      </section>
    </div>
  );
}
