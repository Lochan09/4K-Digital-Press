import React from 'react';
import { orderFields } from '../../data';

export default function OrderSection() {
  async function submitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch('/api/orders', { method: 'POST', body: fd });
      if (res.ok) {
        const json = await res.json();
        alert('Order submitted — id: ' + json.orderId);
        form.reset();
      } else {
        alert('Failed to submit order');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  }

  return (
    <section className="section order-section" id="order">
      <div className="order-intro">
        <div className="order-intro-accent" aria-hidden="true" />

        <p className="eyebrow">// Book Your Order</p>
        <h2>
          Preserve Your <span>Memories</span>
        </h2>
        <p className="order-intro-lead">
          Visit us in Mysuru or fill the form — we'll help you pick the perfect design and finish for your occasion.
        </p>

        <ul className="highlight-list">
          {[
            { icon: '📐', text: 'All sizes from 12×12 to 12×18 available' },
            { icon: '✍️', text: 'Custom name, date, and photo on every piece' },
            { icon: '🪵', text: 'Premium rexin, leather, and wood finishes' },
            { icon: '📦', text: 'Quick turnaround with careful packaging' },
            { icon: '🎁', text: 'Albums, LED boxes, suitcase sets, and more' },
          ].map(({ icon, text }) => (
            <li key={text}>
              <span className="hl-icon">{icon}</span>
              <span className="hl-text">{text}</span>
            </li>
          ))}
        </ul>

        <div className="order-trust-row">
          <div className="order-trust-item">
            <span className="order-trust-icon">📍</span>
            <div>
              <strong>Visit Our Studio</strong>
              <span>Mysuru, Karnataka</span>
            </div>
          </div>
          <div className="order-trust-item">
            <span className="order-trust-icon">📞</span>
            <div>
              <strong>Call / WhatsApp</strong>
              <span>+91 98765 43210</span>
            </div>
          </div>
          <div className="order-trust-item">
            <span className="order-trust-icon">🚚</span>
            <div>
              <strong>Ships Pan-India</strong>
              <span>Careful packaging</span>
            </div>
          </div>
        </div>
      </div>

      <form className="order-form" onSubmit={submitOrder} encType="multipart/form-data">
        <div className="form-header">
          <h3>Place an Order</h3>
          <p>We'll contact you shortly to confirm.</p>
        </div>

        <div className="form-grid">
          {/* Name + Phone — side by side */}
          {orderFields.slice(0, 2).map((field) => (
            <label key={field.label}>
              <span>{field.label} *</span>
              <input name={field.label} placeholder={field.placeholder} />
            </label>
          ))}

          {/* Email — full width */}
          {orderFields.slice(2, 3).map((field) => (
            <label key={field.label} className="full-width">
              <span>{field.label} *</span>
              <input name={field.label} placeholder={field.placeholder} />
            </label>
          ))}

          {/* Product dropdowns */}
          <label>
            <span>Product Category *</span>
            <select name="productCategory" defaultValue="">
              <option value="" disabled>— Select Category —</option>
              <option>4K Pad Album</option>
              <option>Luxury Combo Package</option>
              <option>LED Video Box</option>
              <option>Special Combo Package</option>
              <option>Suitcase Package</option>
              <option>Three Fold Pad</option>
              <option>Pendrive Box</option>
              <option>Box with Pad</option>
              <option>Other / Custom</option>
            </select>
          </label>

          <label>
            <span>Album Size</span>
            <select name="albumSize" defaultValue="">
              <option value="" disabled>Select Size</option>
              <option>6×9</option>
              <option>8×24</option>
              <option>9×24</option>
              <option>12×18</option>
              <option>10×26</option>
              <option>12×24</option>
              <option>12×30</option>
              <option>12×32</option>
              <option>12×36</option>
              <option>15×24</option>
              <option>16×24</option>
              <option>18×24</option>
            </select>
          </label>

          <label>
            <span>Occasion</span>
            <select name="occasion" defaultValue="">
              <option value="" disabled>Select Occasion</option>
              <option>Wedding</option>
              <option>Reception</option>
              <option>Engagement</option>
              <option>Birthday</option>
              <option>Baby Shower / Naming</option>
              <option>Other</option>
            </select>
          </label>

          {/* Design Code, Names/Custom Text, Additional Notes — full width */}
          {orderFields.slice(3).map((field) => (
            <label key={field.label} className="full-width">
              <span>{field.label}</span>
              {field.label === 'Additional Notes' ? (
                <textarea name={field.label} placeholder={field.placeholder} rows={4} />
              ) : (
                <input name={field.label} placeholder={field.placeholder} />
              )}
            </label>
          ))}

          <label className="full-width upload-box">
            <span>📷 Upload Your Photos <small>(optional — helps us understand your vision)</small></span>
            <div className="upload-placeholder">
              <strong>Click to select photos / folder</strong>
              <p>JPG, PNG, and TIFF accepted · Multiple files supported</p>
            </div>
            <input name="photos" type="file" multiple />
          </label>
        </div>

        <button className="button submit-button" type="submit">
          Submit Order Request
        </button>
      </form>
    </section>
  );
}
