import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';

export const AppCtx = createContext();
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  const [user,     setUser]     = useState(() => {
    const saved = localStorage.getItem('aquacrop_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [page,     setPage]     = useState(() => {
    const saved = localStorage.getItem('aquacrop_user');
    if (!saved) return 'login';
    const u = JSON.parse(saved);
    return u.role === 'admin' ? 'admin-dashboard' : 'home';
  });
  const [cart,     setCart]     = useState([]);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [toast,    setToast]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  // ─── Toast ───────────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Auth ─────────────────────────────────────────────────────
  const login = (userData, token) => {
    localStorage.setItem('aquacrop_token', token);
    localStorage.setItem('aquacrop_user',  JSON.stringify(userData));
    setUser(userData);
    setPage(userData.role === 'admin' ? 'admin-dashboard' : 'home');
  };

  const logout = () => {
    localStorage.removeItem('aquacrop_token');
    localStorage.removeItem('aquacrop_user');
    setUser(null);
    setPage('login');
    setCart([]);
    setProducts([]);
    setBookings([]);
  };

  // ─── Products ─────────────────────────────────────────────────
  const fetchProducts = useCallback(async (category) => {
    try {
      setLoading(true);
      const params = category ? { category } : {};
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ─── Cart ──────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    setCart((c) => {
      const existing = c.find((i) => i._id === product._id);
      if (existing) return c.map((i) => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCart((c) => c.filter((i) => i._id !== id));
  }, []);

  const updateCartQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setCart((c) => c.map((i) => i._id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ─── Bookings ─────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data.bookings);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load bookings', 'error');
    }
  }, [showToast]);

  return (
    <AppCtx.Provider value={{
      user, login, logout,
      page, setPage,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      products, setProducts, fetchProducts,
      bookings, setBookings, fetchBookings,
      loading, setLoading,
      showToast,
    }}>
      {children}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? 'var(--teal)'
                    : toast.type === 'error'   ? 'var(--danger)'
                    : 'var(--accent)',
          color: '#fff', padding: '13px 20px', borderRadius: 10,
          fontSize: 14, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          animation: 'fadeIn 0.3s ease',
          display: 'flex', alignItems: 'center', gap: 8,
          maxWidth: 320,
        }}>
          <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
          {toast.msg}
        </div>
      )}
    </AppCtx.Provider>
  );
}
