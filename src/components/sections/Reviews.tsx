import React from 'react';

export default function Reviews() {
  return (
    <section className="section review-section">
      <div className="section-heading narrow">
        <p>Share Your Experience</p>
        <h2>
          Loved Your <span>Album?</span>
        </h2>
        <p>
          Your kind words help other families discover the work. Leave a Google review in less than a minute.
        </p>
      </div>

      <div className="review-card">
        <div className="rating">⭐⭐⭐⭐⭐</div>
        <a className="button" href="https://share.google/mklDkGH6wiNDIpkQG" target="_blank" rel="noreferrer">
          Write a Google Review
        </a>
        <span>Opens Google Maps · Takes less than a minute</span>
      </div>
    </section>
  );
}
