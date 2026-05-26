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
        <div className="location-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.83603727325!2d76.69583497574932!3d12.326820528685136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf719b280017fb%3A0x7a0ccea70d4b5e39!2s4k%20Digital%20Press!5e0!3m2!1sen!2sin!4v1779798706690!5m2!1sen!2sin"
            title="4K Digital Press location"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="location-copy">
          <p className="location-kicker">Map</p>
          <h3>Rammanahalli, Mysuru</h3>
          <p>
            No.51, Opp. VTU College, Sathagalli Layout, Mysuru, Karnataka – 570 029
          </p>
          <a
            className="button button-ghost"
            href="https://maps.app.goo.gl/CcNboXosHVJSYhy2A"
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
