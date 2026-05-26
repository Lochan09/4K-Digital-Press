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
}

interface Props { onBack: () => void; }

export default function MyOrdersPage({ onBack }: Props) {
  const { user, loading, signIn } = useAuth();
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetch(`/api/orders/lookup?email=${encodeURIComponent(user.email!)}`)
      .then(r => r.json())
      .then(d => {
        if (d.orders) setOrders(d.orders);
        else setError(d.error || 'Failed to load orders.');
      })
      .catch(() => setError('Network error.'))
      .finally(() => setFetching(false));
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

          {!fetching && orders.length === 0 && !error && (
            <div className="sub-page-card">
              <p>You haven't placed any orders yet.</p>
              <button className="button" style={{ marginTop: '1rem' }} onClick={onBack}>
                Place Your First Order →
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
                {o.photoCount > 0 && <div><strong>Photos</strong><span>{o.photoCount} uploaded</span></div>}
              </div>
              {o.notes && (
                <p className="myorder-notes"><em>Note:</em> {o.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
