import { useContext, useState } from 'react';
import { AppCtx } from '../context/AppContext';
import api from '../api/axios';

function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart, showToast, setPage } = useContext(AppCtx);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price
      }));
      
      await api.post('/orders', { orderItems, totalPrice: total });
      
      showToast('Order placed successfully! 🎉');
      clearCart();
      setPage('home');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '32px 24px', maxWidth: 700, margin: '0 auto' }} className="fade-in">
        <div className="card" style={{ textAlign: 'center', padding: 56 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Your cart is empty</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Add some products from our store</p>
          <button className="btn btn-primary" onClick={() => setPage('aquafeed')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 700, margin: '0 auto' }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>🛒 Your Cart</h2>
        <button onClick={clearCart} className="btn btn-sm"
          style={{ background: 'var(--bg)', color: 'var(--danger)', border: '1px solid var(--border)' }}>
          Clear All
        </button>
      </div>

      {cart.map((item) => (
        <div key={item._id} className="card"
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 10, background: 'var(--teal-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>
            {item.image}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.name}</p>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>₹{item.price} each</p>
          </div>
          {/* Qty controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => updateCartQty(item._id, item.qty - 1)}
              style={{
                width: 28, height: 28, borderRadius: 6, border: '1.5px solid var(--border)',
                background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >−</button>
            <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
            <button
              onClick={() => updateCartQty(item._id, item.qty + 1)}
              style={{
                width: 28, height: 28, borderRadius: 6, border: '1.5px solid var(--border)',
                background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >+</button>
          </div>
          <p style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--teal)', minWidth: 70, textAlign: 'right' }}>
            ₹{item.price * item.qty}
          </p>
          <button onClick={() => removeFromCart(item._id)} className="btn btn-danger btn-sm">✕</button>
        </div>
      ))}

      {/* Order Summary */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--muted)' }}>
          <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
          <span>₹{total}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--muted)' }}>
          <span>Delivery</span>
          <span style={{ color: 'var(--success)' }}>FREE</span>
        </div>
        <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 22, color: 'var(--teal)' }}>₹{total}</span>
        </div>
        <button
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center', padding: 13, fontSize: 15 }}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? '⏳ Placing Order...' : 'Proceed to Checkout (Razorpay) →'}
        </button>
      </div>
    </div>
  );
}

export default CartPage;
