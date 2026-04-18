import { useContext } from 'react';
import { AppCtx } from '../context/AppContext';

function Navbar() {
  const { user, logout, setPage, page, cart } = useContext(AppCtx);

  const navItems = [
    { key: 'home',        label: 'Home',           icon: '🏠' },
    { key: 'aquafeed',    label: 'Aqua Feed',       icon: '🐟' },
    { key: 'medicine',    label: 'Medicine',         icon: '💊' },
    { key: 'repair',      label: 'Repair Service',  icon: '🔧' },
    { key: 'marketplace', label: 'Marketplace',     icon: '🛒' },
  ];

  return (
    <nav style={{
      background: 'var(--teal)', color: '#fff', padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 60, boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        onClick={() => setPage(user?.role === 'admin' ? 'admin-dashboard' : 'home')}
      >
        <span style={{ fontSize: 22 }}>🌊</span>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, letterSpacing: '0.5px' }}>
          AquaCrop
        </span>
      </div>

      {/* Nav Links — only for non-admin */}
      {user?.role !== 'admin' && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navItems.map((n) => (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              style={{
                background: page === n.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6,
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontSize: 14 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Cart — user only */}
        {user?.role !== 'admin' && (
          <button
            onClick={() => setPage('cart')}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', padding: '6px 14px', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            🛒 Cart
            {cart.length > 0 && (
              <span style={{
                background: 'var(--accent)', color: '#fff', borderRadius: '50%',
                width: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </button>
        )}

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 13 }}>{user?.name?.split(' ')[0]}</span>
          {user?.role === 'admin' && (
            <span className="badge badge-amber" style={{ fontSize: 11 }}>Admin</span>
          )}
        </div>

        <button
          onClick={logout}
          className="btn btn-sm"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
