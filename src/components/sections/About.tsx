import React from 'react';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-heading">
        <p>// Why Choose Us</p>
        <h2>
          Craftsmanship You Can <span>Feel</span>
        </h2>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <strong>72+</strong>
          <span>Unique 4K Pad Designs</span>
        </div>
        <div className="feature-card">
          <strong>9+</strong>
          <span>Luxury Combo Options</span>
        </div>
        <div className="feature-card">
          <strong>5</strong>
          <span>LED Box Collections</span>
        </div>
        <div className="feature-card">
          <strong>15+</strong>
          <span>Suitcase Package Styles</span>
        </div>
        <div className="feature-card">
          <strong>100%</strong>
          <span>Custom Personalization</span>
        </div>
      </div>
    </section>
  );
}
