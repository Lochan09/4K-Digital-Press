import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogoSVG } from '../icons/GoogleLogoSVG';

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL as string || '';

interface Order {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
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

export default function AdminPage({ onBack }: Props) {
  const { user, loading, signIn } = useAuth();
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error,    setError]    = useState('');

  const isOwner = !!user && user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();

  useEffect(() => {
    if (!user || !isOwner) return;
    setFetching(true);
    user.getIdToken()
      .then(token => fetch('/api/orders/admin', {
        headers: { Authorization: `Bearer ${token}` },
      }))
      .then(r => r.json())
      .then(d => {
        if (d.orders) setOrders(d.orders);
        else setError(d.error || 'Failed to load orders.');
      })
      .catch(() => setError('Network error.'))
      .finally(() => setFetching(false));
  }, [user, isOwner]);

  if (loading) return null;

  if (!user) return (
    <div className="sub-page">
      <div className="sub-page-section">
        <div className="sub-page-inner admin-gate">
          <p className="sub-page-eyebrow"><span className="eyebrow-line" />Monitor Orders</p>
          <h2 className="sub-page-title">Admin Access</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Sign in with the owner account to view all orders.
          </p>
          <button className="button" onClick={signIn}>
            <GoogleLogoSVG /> Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOwner) return (
    <div className="sub-page">
      <div className="sub-page-section">
        <div className="sub-page-inner admin-gate">
          <p className="sub-page-eyebrow"><span className="eyebrow-line" />Monitor Orders</p>
          <h2 className="sub-page-title">Access Denied</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            This page is only accessible to the studio owner.
          </p>
          <button className="button button-ghost" onClick={onBack}>← Go Back</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sub-page">
      <div className="sub-page-section admin-section">
        <button className="button button-ghost sub-page-back" onClick={onBack}>← Back</button>
        <p className="sub-page-eyebrow"><span className="eyebrow-line" />Monitor Orders</p>
        <h2 className="sub-page-title">All Orders</h2>
        <p className="sub-page-subtitle">
          {fetching ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
        </p>

        {error && <p className="admin-error">{error}</p>}

        {!fetching && orders.length === 0 && !error && (
          <p style={{ color: 'var(--muted)' }}>No orders yet.</p>
        )}

        {orders.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Occasion</th>
                  <th>Design</th>
                  <th>Photos</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><code className="admin-id">{o.id}</code></td>
                    <td className="admin-date">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td><strong>{o.name}</strong></td>
                    <td>{o.phone}</td>
                    <td>{o.email}</td>
                    <td>{o.productCategory}</td>
                    <td>{o.albumSize || '—'}</td>
                    <td>{o.occasion || '—'}</td>
                    <td>{o.designCode || '—'}</td>
                    <td>
                      {o.photoCount > 0 && o.driveFolderUrl
                        ? <a href={o.driveFolderUrl} target="_blank" rel="noreferrer" className="admin-drive-link">{o.photoCount} →</a>
                        : o.photoCount > 0 ? o.photoCount : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
