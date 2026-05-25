import React from 'react';

export default function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="section-heading narrow">
        <p>// Find Us</p>
        <h2>
          Visit Our <span>Lab</span>
        </h2>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <strong>Address</strong>
          <p>
            No.51, Opp. VTU College, Sathagalli Layout,
            <br />
            Rammanahalli, Mysuru, Karnataka – 570 029
          </p>
        </div>
        <div className="contact-card">
          <strong>Phone</strong>
          <p>6366064066 / 8123704066</p>
          <p>0821-2332916</p>
        </div>
        <div className="contact-card">
          <strong>Email</strong>
          <p>4kdigitalpress@gmail.com</p>
        </div>
        <div className="contact-card">
          <strong>Working Hours</strong>
          <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
          <p>Sunday: By Appointment</p>
        </div>
        <div className="contact-card">
          <strong>Follow Us</strong>
          <div className="social-links">
            <a href="https://www.facebook.com/search/top/?q=4k%20digital%20press" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href="https://www.instagram.com/4k_digital_press/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://wa.me/916366064066" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="location-panel">
        <div className="location-map" aria-hidden="true" />
        <div className="location-copy">
          <p className="location-kicker">Map</p>
          <h3>Rammanahalli, Mysuru</h3>
          <p>
            No.51, Opp. VTU College, Sathagalli Layout, Mysuru, Karnataka – 570 029
          </p>
          <a
            className="button button-ghost"
            href="https://www.google.com/maps/search/?api=1&query=8MGX+P9+Mysuru+Karnataka"
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
