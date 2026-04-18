import { useState, useEffect, useContext } from 'react';
import { AppCtx } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

function MarketplacePage() {
  const { addToCart, showToast, user } = useContext(AppCtx);
  const [tab,       setTab]      = useState('buy');
  const [listings,  setListings] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchListings = async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get('/products', { params: { category: 'marketplace' } });
      setListings(data.products);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load listings', 'error');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSell = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return showToast('Product name and price are required', 'error');
    setSubmitting(true);
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        category: 'marketplace',
        seller: user?.name || 'You',
        image: '📦',
      });
      showToast('Product listed successfully! 🎉');
      setForm({ name: '', description: '', price: '' });
      setTab('buy');
      fetchListings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to list product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          🛒 Crop Marketplace
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
          Buy and sell crops, seeds, and farm products
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, background: 'var(--teal-light)',
        borderRadius: 10, padding: 4, marginBottom: 28, width: 'fit-content',
      }}>
        {[
          { key: 'buy',  label: '🛒 Buy'  },
          { key: 'sell', label: '➕ Sell' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '9px 28px', borderRadius: 7, border: 'none',
            cursor: 'pointer', fontWeight: 600, fontSize: 14,
            background: tab === t.key ? 'var(--teal)' : 'transparent',
            color: tab === t.key ? '#fff' : 'var(--teal)',
            transition: 'all 0.2s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Buy Tab */}
      {tab === 'buy' && (
        loadingList ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="loader" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--muted)' }}>Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <h3>No listings yet</h3>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Be the first to list a product!</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setTab('sell')}>
              + List a Product
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {listings.map((p) => <ProductCard key={p._id} product={p} onAdd={addToCart} />)}
          </div>
        )
      )}

      {/* Sell Tab */}
      {tab === 'sell' && (
        <div style={{ maxWidth: 520 }}>
          <div className="card">
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: 'var(--teal)' }}>
              List Your Product
            </h3>
            <form onSubmit={handleSell}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  placeholder="e.g. Fresh Prawns 1kg" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3} placeholder="Describe your product..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number" placeholder="0" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full"
                style={{ justifyContent: 'center', padding: 11 }} disabled={submitting}>
                {submitting ? '⏳ Listing...' : 'List Product 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketplacePage;
