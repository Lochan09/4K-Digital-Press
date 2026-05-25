import React, { useState } from 'react';
import { catalogCategories } from '../../data';

const TABS = Object.keys(catalogCategories);

export default function Catalog() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const items = catalogCategories[activeTab].items;

  return (
    <section className="section" id="catalog">
      <div className="section-heading narrow">
        <p>// Product Catalog</p>
        <h2>
          Our <span>Collections</span>
        </h2>
        <p>
          Browse the full range, all handcrafted in premium rexin, leather, and wood. Click any
          sheet to enlarge.
        </p>
      </div>

      <div className="category-row" aria-label="Catalog filters">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`chip ${tab === activeTab ? 'chip-active' : ''} ${tab === 'Mini Books' ? 'chip-hot' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Mini Books' ? <span>New</span> : null}
          </button>
        ))}
      </div>

      <div className="catalog-grid">
        {items.map((item) => (
          <article className="catalog-card" key={item.image}>
            <div className="catalog-preview">
              <img
                className="catalog-img"
                src={item.image}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h3>{item.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
