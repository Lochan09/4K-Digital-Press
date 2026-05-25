import React from 'react';

interface Props {
  onBack: () => void;
}

const timeline = [
  { year: '2015', text: '<strong>Prince Digilab established</strong> — began serving Mysuru with premium photo products and customized printing solutions.' },
  { year: '6 Yrs', text: '<strong>Continuous participation</strong> in India\'s premier photography expos — <em>Photo Today International Expo</em> and <em>KPA Expo (Karnataka Photographers Association)</em>.' },
  { year: '2023', text: '<strong>4K Digital Press launched</strong> — evolved from Prince Digilab, bringing next-generation 4K printing technology while carrying the same legacy of excellence.' },
  { year: 'Now', text: '<strong>5000+ happy customers</strong> served across South India — specializing in premium customized photo products, wedding albums, LED boxes & luxury combos.' },
];

export default function AchievementsPage({ onBack }: Props) {
  return (
    <div className="sub-page" id="page-achievements">
      <section className="sub-page-section">
        <div className="sub-page-inner">

          <div className="sub-page-eyebrow">
            <span className="eyebrow-line"></span>
            Our Story of Excellence
          </div>

          <h1 className="sub-page-title">Experience &amp; Achievements</h1>
          <p className="sub-page-subtitle">
            A combined legacy of Prince Digilab (Est. 2015) &amp; 4K Digital Press (Est. 2023)
          </p>

          <div className="sub-page-intro-note">
            <p>
              These achievements represent the <strong>combined efforts and legacy</strong> of{' '}
              <strong>Prince Digilab</strong> (established 2015) and its evolution into{' '}
              <strong>4K Digital Press</strong> (established 2023) — carrying forward the same passion, quality,
              and trust that has defined us for over a decade.
            </p>
          </div>

          <div className="achieve-stats">
            <div className="achieve-stat">
              <div className="achieve-num">10+</div>
              <div className="achieve-label">Years Combined Experience</div>
            </div>
            <div className="achieve-stat">
              <div className="achieve-num">5000+</div>
              <div className="achieve-label">Happy Customers</div>
            </div>
            <div className="achieve-stat">
              <div className="achieve-num">6+</div>
              <div className="achieve-label">Years at National Expos</div>
            </div>
          </div>

          <div className="sub-page-card">
            <h3 className="timeline-heading">Our Journey</h3>
            <div className="timeline">
              {timeline.map((item) => (
                <div className="timeline-item" key={item.year}>
                  <div className="timeline-badge">{item.year}</div>
                  <div
                    className="timeline-text"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="award-banner">
            <div className="award-glow"></div>
            <div className="award-inner">
              <div className="award-trophy">🏆</div>
              <div className="award-eyebrow">Proud Winner</div>
              <div className="award-title">Best Album Making Company in Karnataka</div>
              <div className="award-sub">A tribute to the combined excellence of Prince Digilab &amp; 4K Digital Press</div>
            </div>
          </div>

          <button className="button sub-page-back" onClick={onBack}>
            ← Back to Home
          </button>

        </div>
      </section>
    </div>
  );
}
