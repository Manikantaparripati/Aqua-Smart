function ProductCard({ product, onAdd }) {
  return (
    <div
      className="card fade-in"
      style={{ display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      <div style={{
        background: 'var(--teal-light)', borderRadius: 8, height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
      }}>
        {product.image || '📦'}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{product.name}</h4>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{product.description}</p>
        {product.seller && product.seller !== 'AquaCrop' && (
          <p style={{ fontSize: 12, color: 'var(--teal)', marginTop: 6, fontWeight: 500 }}>
            🏪 by {product.seller}
          </p>
        )}
        {product.stock !== undefined && (
          <p style={{ fontSize: 11, color: product.stock < 20 ? 'var(--danger)' : 'var(--muted)', marginTop: 4 }}>
            {product.stock < 20 ? `⚠️ Only ${product.stock} left` : `In stock: ${product.stock}`}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontFamily: 'Syne', fontSize: 19, fontWeight: 700, color: 'var(--teal)' }}>
          ₹{product.price}
        </span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onAdd(product)}
          disabled={product.stock === 0}
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
