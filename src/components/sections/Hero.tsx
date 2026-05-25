import React from 'react';
import { serviceCategories, stats } from '../../data';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
          <p className="eyebrow">Premium Wedding Albums · Mysuru</p>
          <h1>
            Memories Crafted in <span>Gold</span> & Glory
          </h1>
          <p className="lede">
            From timeless 4K Pad Albums to grand Luxury Combos and LED Video Boxes, every piece is crafted to last a lifetime.
          </p>

          <div className="cta-row">
            <a className="button" href="#catalog">
              Explore Catalog
            </a>
            <a className="button button-ghost" href="#order">
              Place an Order
            </a>
          </div>

          <div className="ticker" aria-label="Featured offerings">
            {serviceCategories.map((item) => (
              <span key={item}>{item} ✦</span>
            ))}
          </div>

          <div className="stats" id="achievements">
            {stats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
