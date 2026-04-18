import { useContext } from 'react';
import { AppCtx } from '../context/AppContext';

function HomePage() {
  const { user, setPage } = useContext(AppCtx);

  const services = [
    { key: 'aquafeed',    icon: '🐟', title: 'Aqua Feed',       desc: 'Premium fish & shrimp feeds',      color: '#e1f5ee', border: '#9fe1cb' },
    { key: 'medicine',    icon: '💊', title: 'Medicine',         desc: 'Treatments & water care',          color: '#e6f1fb', border: '#b5d4f4' },
    { key: 'repair',      icon: '🔧', title: 'Repair Service',   desc: 'Motor, aerator & electrical',      color: '#faeeda', border: '#fac775' },
    { key: 'marketplace', icon: '🛒', title: 'Marketplace',      desc: 'Buy & sell crops, fish & seeds',   color: '#eaf3de', border: '#c0dd97' },
  ];

  const stats = [
    { label: 'Products',  value: '200+',   icon: '📦' },
    { label: 'Farmers',   value: '5,000+', icon: '👨‍🌾' },
    { label: 'States',    value: '12',     icon: '🗺️' },
    { label: 'Experts',   value: '50+',    icon: '👨‍⚕️' },
  ];

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }} className="fade-in">
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--teal) 0%, #0d3d2b 100%)',
        borderRadius: 16, padding: '40px 36px', color: '#fff',
        marginBottom: 32, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 140, opacity: 0.07 }}>🌊</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 24, maxWidth: 520 }}>
          Your one-stop platform for aquaculture and agriculture solutions.
          Manage feeds, medicines, repairs, and trade all in one place.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" onClick={() => setPage('aquafeed')}
            style={{ background: '#fff', color: 'var(--teal)', fontWeight: 700 }}>
            Browse Products
          </button>
          <button className="btn" onClick={() => setPage('marketplace')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            Open Marketplace
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 700, color: 'var(--teal)' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 700 }}>Our Services</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {services.map((s) => (
          <div
            key={s.key}
            onClick={() => setPage(s.key)}
            className="card"
            style={{
              cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
              background: `linear-gradient(135deg, ${s.color} 0%, #fff 100%)`,
              border: `1.5px solid ${s.border}`, transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, boxShadow: 'var(--shadow)', flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>{s.desc}</p>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 20, color: 'var(--teal)' }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
