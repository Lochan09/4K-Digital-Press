import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogoSVG } from '../icons/GoogleLogoSVG';

function exportCSV(orders: Order[]) {
  const header = ['Order ID', 'Date', 'Name', 'Phone', 'Email', 'Product', 'Size', 'Occasion', 'Design Code', 'Custom Text', 'Notes', 'Photos'];
  const rows = orders.map(o => [
    o.id,
    new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    o.name, o.phone, o.email,
    o.productCategory, o.albumSize || '', o.occasion || '',
    o.designCode || '', o.customText || '', o.notes || '',
    o.photoCount,
  ]);
  const csv = [header, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(orders: Order[]) {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(212, 160, 23);
  doc.text('4K Digital Press — All Orders', 40, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Exported on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}  ·  ${orders.length} order(s)`, 40, 58);

  autoTable(doc, {
    startY: 72,
    head: [['Order ID', 'Date', 'Name', 'Phone', 'Email', 'Product', 'Size', 'Occasion', 'Design', 'Photos']],
    body: orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      o.name, o.phone, o.email,
      o.productCategory, o.albumSize || '—', o.occasion || '—',
      o.designCode || '—', o.photoCount > 0 ? o.photoCount : '—',
    ]),
    styles: { fontSize: 8, cellPadding: 5, textColor: [240, 240, 240], fillColor: [22, 22, 22] },
    headStyles: { fillColor: [30, 20, 0], textColor: [212, 160, 23], fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [16, 16, 16] },
    tableLineColor: [60, 50, 0],
    tableLineWidth: 0.3,
    margin: { left: 40, right: 40 },
  });

  doc.save(`orders_${new Date().toISOString().slice(0, 10)}.pdf`);
}

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
        <div className="admin-header-row">
          <p className="sub-page-subtitle">
            {fetching ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
          </p>
          {orders.length > 0 && (
            <div className="admin-export-btns">
              <button className="admin-export-btn" onClick={() => exportCSV(orders)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                Export Excel
              </button>
              <button className="admin-export-btn admin-export-btn--pdf" onClick={() => exportPDF(orders)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/><polyline points="13 17 15 17 15 13"/></svg>
                Export PDF
              </button>
            </div>
          )}
        </div>

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
