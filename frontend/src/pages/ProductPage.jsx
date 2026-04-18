import { useEffect, useContext } from 'react';
import { AppCtx } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

function ProductPage({ category, title, subtitle, icon }) {
  const { products, fetchProducts, addToCart, loading } = useContext(AppCtx);

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

  const filtered = products.filter((p) => p.category === category);

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{icon}</span>{title}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{subtitle}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div className="loader" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--muted)' }}>Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3>No products found</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Check back soon or ask your admin to add products.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
