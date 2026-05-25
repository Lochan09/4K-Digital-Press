import React from 'react';
import { services } from '../../data';

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="section-heading narrow">
        <p>// What We Offer</p>
        <h2>
          Our <span>Services</span>
        </h2>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <div className="service-icon" aria-hidden="true">
              {service.icon}
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
