import React, { useEffect, useRef, useState } from 'react';
import { orderFields } from '../../data';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogoSVG } from '../icons/GoogleLogoSVG';

type Status = 'idle' | 'uploading' | 'success' | 'error';

interface FileProgress {
  name: string;
  size: number;
  pct: number;
  done: boolean;
}

function buildFileMeta(files: File[]): FileProgress[] {
  return files.map(f => ({ name: f.name, size: f.size, pct: 0, done: false }));
}

function calcFileProgress(files: FileProgress[], loaded: number): FileProgress[] {
  let remaining = loaded;
  return files.map(f => {
    if (remaining <= 0)  return { ...f, pct: 0,   done: false };
    if (remaining >= f.size) { remaining -= f.size; return { ...f, pct: 100, done: true }; }
    const pct = Math.round((remaining / f.size) * 100);
    remaining = 0;
    return { ...f, pct, done: false };
  });
}

function fmt(bytes: number) {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function OrderSection() {
  const formRef  = useRef<HTMLFormElement>(null);
  const { user, signIn } = useAuth();

  const [status,   setStatus]   = useState<Status>('idle');
  const [message,  setMessage]  = useState('');
  const [fileMeta, setFileMeta] = useState<FileProgress[]>([]);
  const [totalPct, setTotalPct] = useState(0);
  const [nameVal,  setNameVal]  = useState('');
  const [emailVal, setEmailVal] = useState('');

  // Auto-fill name & email when user signs in (don't overwrite if already typed)
  useEffect(() => {
    if (user) {
      setNameVal(v  => v  || user.displayName || '');
      setEmailVal(v => v  || user.email       || '');
    }
  }, [user]);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setFileMeta(buildFileMeta(files));
  }

  function submitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form  = e.currentTarget;
    const fd    = new FormData(form);
    const files = Array.from((form.querySelector('input[type=file]') as HTMLInputElement).files || []);

    if (files.length === 0) setFileMeta([]);

    setStatus('uploading');
    setTotalPct(0);
    setMessage('');

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (ev) => {
      if (!ev.lengthComputable) return;
      const pct = Math.round((ev.loaded / ev.total) * 100);
      setTotalPct(pct);
      if (files.length > 0) {
        setFileMeta(prev => calcFileProgress(prev, ev.loaded));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status === 201) {
          setStatus('success');
          setTotalPct(100);
          setFileMeta(prev => prev.map(f => ({ ...f, pct: 100, done: true })));
          setMessage(`Order received! Your ID is ${data.orderId}. We'll contact you shortly.`);
          form.reset();
          setFileMeta([]);
          // Re-populate from user after reset
          setNameVal(user?.displayName || '');
          setEmailVal(user?.email       || '');
        } else {
          setStatus('error');
          setMessage(data.error || 'Something went wrong. Please try again.');
        }
      } catch {
        setStatus('error');
        setMessage('Unexpected response from server.');
      }
    };

    xhr.onerror = () => {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    };

    xhr.open('POST', '/api/orders');
    xhr.send(fd);
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

      <form ref={formRef} className="order-form" onSubmit={submitOrder} encType="multipart/form-data">
        <div className="form-header">
          <h3>Place an Order</h3>
          <p>We'll contact you shortly to confirm.</p>
        </div>

        <div className="form-grid">
          {/* Your Name (controlled for auto-fill) + Phone Number */}
          {orderFields.slice(0, 2).map((field) => (
            <label key={field.label}>
              <span>{field.label} *</span>
              {field.label === 'Your Name' ? (
                <input
                  name={field.label}
                  placeholder={field.placeholder}
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  required
                />
              ) : (
                <input name={field.label} placeholder={field.placeholder} required />
              )}
            </label>
          ))}

          {/* Email — locked to Google account when signed in */}
          {orderFields.slice(2, 3).map((field) => (
            <label key={field.label} className="full-width">
              <span>
                {field.label} *
                {user && <span className="email-lock-badge">✓ from your account</span>}
              </span>
              <input
                name={field.label}
                type="email"
                placeholder={field.placeholder}
                value={emailVal}
                onChange={e => !user && setEmailVal(e.target.value)}
                readOnly={!!user}
                required
                style={user ? { opacity: 0.72, cursor: 'not-allowed' } : undefined}
              />
            </label>
          ))}

          <label>
            <span>Product Category *</span>
            <select name="productCategory" defaultValue="" required>
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
              <option>6×9</option><option>8×24</option><option>9×24</option>
              <option>12×18</option><option>10×26</option><option>12×24</option>
              <option>12×30</option><option>12×32</option><option>12×36</option>
              <option>15×24</option><option>16×24</option><option>18×24</option>
            </select>
          </label>

          <label>
            <span>Occasion</span>
            <select name="occasion" defaultValue="">
              <option value="" disabled>Select Occasion</option>
              <option>Wedding</option><option>Reception</option>
              <option>Engagement</option><option>Birthday</option>
              <option>Baby Shower / Naming</option><option>Other</option>
            </select>
          </label>

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

          {/* Folder upload */}
          <label className="full-width upload-box">
            <span>📁 Upload Your Photos Folder <small>(optional — helps us understand your vision)</small></span>
            {fileMeta.length > 0 ? (
              <div className="upload-placeholder upload-placeholder--selected">
                <strong>✓ {fileMeta.length} photo{fileMeta.length > 1 ? 's' : ''} selected</strong>
                <p>Ready to upload · click to change folder</p>
              </div>
            ) : (
              <div className="upload-placeholder">
                <strong>Click to select a folder</strong>
                <p>Select the entire folder — all photos inside will be uploaded</p>
              </div>
            )}
            <input
              name="photos"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={onFilesChange}
              // @ts-ignore
              webkitdirectory=""
              mozdirectory=""
            />
          </label>
        </div>

        {/* Per-file progress list */}
        {status === 'uploading' && fileMeta.length > 0 && (
          <div className="file-progress-list">
            <div className="file-progress-header">
              <span>Uploading {fileMeta.length} file{fileMeta.length > 1 ? 's' : ''}</span>
              <span className="file-progress-total">{totalPct}%</span>
            </div>
            <div className="file-progress-items">
              {fileMeta.map((f, i) => (
                <div key={i} className="file-progress-item">
                  <div className="file-progress-meta">
                    <span className="file-progress-name">{f.name}</span>
                    <span className="file-progress-info">
                      {f.done ? '✓ Done' : `${f.pct}% · ${fmt(f.size)}`}
                    </span>
                  </div>
                  <div className="file-progress-track">
                    <div
                      className={`file-progress-fill ${f.done ? 'file-progress-fill--done' : ''}`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall progress bar (when no files selected) */}
        {status === 'uploading' && fileMeta.length === 0 && (
          <div className="upload-progress">
            <div className="upload-progress-bar" style={{ width: `${totalPct}%` }} />
            <span>{totalPct < 100 ? `Uploading… ${totalPct}%` : 'Processing…'}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="order-msg order-msg-success">{message}</div>
        )}
        {status === 'error' && (
          <div className="order-msg order-msg-error">{message}</div>
        )}

        {/* Auth-gated submit button */}
        {user ? (
          <button
            className="button submit-button"
            type="submit"
            disabled={status === 'uploading'}
          >
            {status === 'uploading' ? (
              <>
                <span className="btn-spinner" />
                Uploading… {totalPct}%
              </>
            ) : 'Submit Order Request'}
          </button>
        ) : (
          <button
            type="button"
            className="button submit-button submit-button--signin"
            onClick={signIn}
          >
            <GoogleLogoSVG /> Sign In to Place Order
          </button>
        )}
      </form>
    </section>
  );
}
