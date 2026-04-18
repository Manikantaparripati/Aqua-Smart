import { useState, useEffect, useContext } from 'react';
import { AppCtx } from '../context/AppContext';
import api from '../api/axios';

function AdminPanel() {
  const { showToast } = useContext(AppCtx);
  const [tab,        setTab]        = useState('dashboard');
  const [stats,      setStats]      = useState(null);
  const [products,   setProducts]   = useState([]);
  const [bookings,   setBookings]   = useState([]);
  const [orders,     setOrders]     = useState([]);
  const [users,      setUsers]      = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: 'aquafeed', image: '📦' });
  const [loadingStats, setLoadingStats] = useState(false);

  const sidebarItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'orders',    icon: '🛒', label: 'Orders'    },
    { key: 'products',  icon: '📦', label: 'Products'  },
    { key: 'bookings',  icon: '📋', label: 'Bookings'  },
    { key: 'users',     icon: '👥', label: 'Users'     },
  ];

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch { showToast('Failed to load stats', 'error'); }
    finally { setLoadingStats(false); }
  };

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
    } catch { showToast('Failed to load products', 'error'); }
  };

  const loadBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data.bookings);
    } catch { showToast('Failed to load bookings', 'error'); }
  };

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch { showToast('Failed to load users', 'error'); }
  };

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch { showToast('Failed to load orders', 'error'); }
  };

  useEffect(() => {
    if (tab === 'dashboard') { loadStats(); loadBookings(); }
    if (tab === 'orders')    loadOrders();
    if (tab === 'products')  loadProducts();
    if (tab === 'bookings')  loadBookings();
    if (tab === 'users')     loadUsers();
  }, [tab]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return showToast('Name and price are required', 'error');
    try {
      await api.post('/products', { ...newProduct, price: Number(newProduct.price), stock: 100 });
      showToast('Product added successfully!');
      setNewProduct({ name: '', description: '', price: '', category: 'aquafeed', image: '📦' });
      loadProducts();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to add product', 'error'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted.');
      loadProducts();
    } catch { showToast('Failed to delete product', 'error'); }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b));
      showToast('Booking status updated!');
    } catch { showToast('Failed to update booking', 'error'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
      showToast('Order status updated!');
      loadStats();
    } catch { showToast('Failed to update order', 'error'); }
  };

  const handleSeed = async () => {
    try {
      const { data } = await api.post('/admin/seed');
      showToast(`${data.message} (${data.productsAdded} products)`);
      loadStats();
    } catch { showToast('Seed failed', 'error'); }
  };

  const statCards = stats ? [
    { label: 'Total Users',   value: stats.users,    icon: '👥', color: '#e6f1fb' },
    { label: 'Orders',        value: stats.orders || 0, icon: '🛒', color: '#fbe6e6' },
    { label: 'Revenue',       value: `₹${stats.revenue || 0}`, icon: '💰', color: '#eaf3de' },
    { label: 'Products',      value: stats.products,  icon: '📦', color: 'var(--teal-light)' },
    { label: 'Bookings',      value: stats.bookings,  icon: '📋', color: '#faeeda' },
  ] : [];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: 'var(--sidebar)', color: '#fff', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '1.5px', fontWeight: 700 }}>ADMIN PANEL</p>
        </div>
        <div style={{ padding: '12px 0' }}>
          {sidebarItems.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: 14,
              fontWeight: 500, textAlign: 'left', fontFamily: 'inherit',
              background: tab === item.key ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: tab === item.key ? '#fff' : 'rgba(255,255,255,0.6)',
              borderLeft: tab === item.key ? '3px solid var(--accent)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
          <button onClick={handleSeed} className="btn btn-sm w-full"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', justifyContent: 'center' }}>
            🌱 Seed DB
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 28, overflow: 'auto', background: 'var(--bg)' }} className="fade-in">

        {/* ── Dashboard ── */}
        {tab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Admin Dashboard</h2>
            {loadingStats ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="loader" style={{ margin: '0 auto' }} />
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 28 }}>
                  {statCards.map((s) => (
                    <div key={s.label} className="card" style={{ background: s.color, border: 'none', textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 700, color: 'var(--teal)' }}>{s.value}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="card">
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Recent Bookings</h4>
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b._id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 0', borderBottom: '1px solid var(--border)',
                      }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500 }}>{b.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{b.serviceType}</p>
                        </div>
                        <span className={`badge ${
                          b.status === 'confirmed'  ? 'badge-green'
                          : b.status === 'completed' ? 'badge-blue'
                          : b.status === 'cancelled' ? 'badge-red'
                          : 'badge-amber'
                        }`}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Booking Status</h4>
                    {stats?.bookingsByStatus?.map((s) => (
                      <div key={s._id} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{s._id}</span>
                          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{s.count}</span>
                        </div>
                        <div style={{ background: 'var(--border)', borderRadius: 4, height: 6 }}>
                          <div style={{
                            background: s._id === 'confirmed' ? '#1d9e75' : s._id === 'completed' ? '#185fa5' : s._id === 'cancelled' ? '#e24b4a' : '#f0a500',
                            height: 6, borderRadius: 4,
                            width: `${stats.bookings > 0 ? (s.count / stats.bookings) * 100 : 0}%`,
                            transition: 'width 0.5s',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Manage Orders</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {['#', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Action'].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o._id}>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>
                        {o.user?.name || 'Unknown'}
                        {o.user?.email && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{o.user.email}</div>}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {o.orderItems.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: 4 }}>
                            {item.qty}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--teal)' }}>₹{o.totalPrice}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge ${
                          o.status === 'Delivered'  ? 'badge-green'
                          : o.status === 'Shipped' ? 'badge-blue'
                          : o.status === 'Cancelled' ? 'badge-red'
                          : 'badge-amber'
                        }`}>{o.status}</span>
                      </td>
                      <td>
                        <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                          style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}>
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {tab === 'products' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Manage Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {['Product', 'Category', 'Price', 'Stock', 'Action'].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 500 }}>{p.image} {p.name}</td>
                        <td>
                          <span className={`badge ${
                            p.category === 'aquafeed'    ? 'badge-green'
                            : p.category === 'medicine' ? 'badge-blue'
                            : 'badge-amber'
                          }`}>{p.category}</span>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--teal)' }}>₹{p.price}</td>
                        <td style={{ color: p.stock < 20 ? 'var(--danger)' : 'inherit' }}>{p.stock}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card">
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--teal)' }}>+ Add Product</h4>
                <form onSubmit={handleAddProduct}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product name" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows={2} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label>Image Emoji</label>
                    <input value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} placeholder="e.g. 🐟" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                      <option value="aquafeed">Aqua Feed</option>
                      <option value="medicine">Medicine</option>
                      <option value="marketplace">Marketplace</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Add Product</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings ── */}
        {tab === 'bookings' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Manage Bookings</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {['#', 'Customer', 'Phone', 'Service', 'Date', 'Status', 'Action'].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b._id}>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>
                        {b.name}
                        {b.user?.email && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.user.email}</div>}
                      </td>
                      <td>{b.phone}</td>
                      <td>{b.serviceType}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge ${
                          b.status === 'confirmed'  ? 'badge-green'
                          : b.status === 'completed' ? 'badge-blue'
                          : b.status === 'cancelled' ? 'badge-red'
                          : 'badge-amber'
                        }`}>{b.status}</span>
                      </td>
                      <td>
                        <select value={b.status} onChange={(e) => updateBookingStatus(b._id, e.target.value)}
                          style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Manage Users</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {['Avatar', 'Name', 'Email', 'Role', 'Joined'].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', background: 'var(--teal-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 13, color: 'var(--teal)',
                        }}>{u.name[0].toUpperCase()}</div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-amber' : 'badge-green'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
