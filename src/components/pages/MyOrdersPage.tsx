import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogoSVG } from '../icons/GoogleLogoSVG';

interface Order {
  id: string;
  createdAt: string;
  productCategory: string;
  albumSize?: string;
  occasion?: string;
  designCode?: string;
  customText?: string;
  notes?: string;
  photoCount: number;
  driveFolderUrl?: string;
}

interface Props { onBack: () => void; }

export default function MyOrdersPage({ onBack }: Props) {
  const { user, loading, signIn } = useAuth();
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [fetching,     setFetching]     = useState(false);
  const [error,        setError]        = useState('');
  const [lookupEmail,  setLookupEmail]  = useState('');
  const [manualMode,   setManualMode]   = useState(false);

  function fetchOrders(email: string) {
    setFetching(true);
    setError('');
    fetch(`/api/orders/lookup?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(d => {
        if (d.orders) setOrders(d.orders);
        else setError(d.error || 'Failed to load orders.');
      })
      .catch(() => setError('Network error.'))
      .finally(() => setFetching(false));
  }

  useEffect(() => {
    if (!user) return;
    fetchOrders(user.email!);
  }, [user]);

  if (loading) return null;

  if (!user) return (
    <div className="sub-page">
      <div className="sub-page-section">
        <div className="sub-page-inner admin-gate">
          <p className="sub-page-eyebrow"><span className="eyebrow-line" />My Orders</p>
          <h2 className="sub-page-title">Sign In to View Your Orders</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Your order history is tied to your Google account.
          </p>
          <button className="button" onClick={signIn}>
            <GoogleLogoSVG /> Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sub-page">
      <div className="sub-page-section">
        <div className="sub-page-inner">
          <button className="button button-ghost sub-page-back" onClick={onBack}>← Back</button>
          <p className="sub-page-eyebrow"><span className="eyebrow-line" />My Orders</p>
          <h2 className="sub-page-title">Order History</h2>
          <p className="sub-page-subtitle">{user.displayName}</p>

          {fetching && <p style={{ color: 'var(--muted)' }}>Loading your orders…</p>}
          {error    && <p style={{ color: '#fca5a5' }}>{error}</p>}

          {!fetching && orders.length === 0 && !error && !manualMode && (
            <div className="sub-page-card">
              <p>No orders found for <strong style={{ color: 'var(--accent-2)' }}>{user.email}</strong>.</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                If you placed an order with a different email, search below.
              </p>
              <button
                className="button button-ghost"
                style={{ marginTop: '1rem' }}
                onClick={() => setManualMode(true)}
              >
                Search by order email
              </button>
              <button className="button" style={{ marginTop: '0.75rem' }} onClick={onBack}>
                Place Your First Order →
              </button>
            </div>
          )}

          {(manualMode && !fetching) && (
            <div className="sub-page-card myorder-lookup-card">
              <p style={{ marginBottom: '0.75rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                Enter the email address you used when placing the order:
              </p>
              <form
                style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
                onSubmit={e => { e.preventDefault(); if (lookupEmail.trim()) fetchOrders(lookupEmail.trim()); }}
              >
                <input
                  type="email"
                  className="myorder-lookup-input"
                  placeholder="order@email.com"
                  value={lookupEmail}
                  onChange={e => setLookupEmail(e.target.value)}
                  required
                />
                <button type="submit" className="button" style={{ flexShrink: 0 }}>Search</button>
              </form>
              <button
                style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.78rem', cursor: 'pointer', padding: 0 }}
                onClick={() => { setManualMode(false); setLookupEmail(''); fetchOrders(user.email!); }}
              >
                ← Back to my account orders
              </button>
            </div>
          )}

          {orders.map(o => (
            <div key={o.id} className="sub-page-card myorder-card">
              <div className="myorder-header">
                <div>
                  <p className="myorder-id">{o.id}</p>
                  <p className="myorder-date">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <span className="myorder-status">Received</span>
              </div>
              <div className="myorder-grid">
                <div><strong>Product</strong><span>{o.productCategory}</span></div>
                {o.albumSize  && <div><strong>Size</strong><span>{o.albumSize}</span></div>}
                {o.occasion   && <div><strong>Occasion</strong><span>{o.occasion}</span></div>}
                {o.designCode && <div><strong>Design</strong><span>{o.designCode}</span></div>}
                {o.customText && <div><strong>Custom Text</strong><span>{o.customText}</span></div>}
                {o.photoCount > 0 && (
                  <div>
                    <strong>Photos</strong>
                    <span>{o.photoCount} uploaded</span>
                  </div>
                )}
              </div>
              {o.notes && (
                <p className="myorder-notes"><em>Note:</em> {o.notes}</p>
              )}

              {o.driveFolderUrl && (
                <a
                  href={o.driveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="myorder-photos-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View {o.photoCount} Uploaded Photo{o.photoCount !== 1 ? 's' : ''} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
