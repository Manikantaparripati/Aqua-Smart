import { useState, useContext } from 'react';
import { AppCtx } from '../context/AppContext';
import api from '../api/axios';

function LoginPage() {
  const { login, showToast } = useContext(AppCtx);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [form,    setForm]          = useState({ email: '', password: '' });
  const [regForm, setRegForm]       = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      showToast(`Welcome back, ${data.user.name.split(' ')[0]}!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password)
      return showToast('All fields are required', 'error');
    if (regForm.password.length < 6)
      return showToast('Password must be at least 6 characters', 'error');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', regForm);
      login(data.user, data.token);
      showToast(`Account created! Welcome, ${data.user.name.split(' ')[0]}!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a6e4e 0%, #0d3d2b 50%, #1a2e23 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 430 }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: 36, color: '#fff' }}>
          <div style={{ fontSize: 52, marginBottom: 12, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>🌊</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 30, fontWeight: 800, letterSpacing: '1px' }}>AquaCrop Platform</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 8 }}>
            Smart solutions for aquaculture &amp; agriculture
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '28px 32px' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', marginBottom: 28, background: 'var(--bg)',
            borderRadius: 10, padding: 4,
          }}>
            {['Login', 'Register'].map((t, i) => (
              <button
                key={t}
                onClick={() => setIsRegister(i === 1)}
                style={{
                  flex: 1, padding: '9px', borderRadius: 7, border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  background: isRegister === (i === 1) ? 'var(--teal)' : 'transparent',
                  color: isRegister === (i === 1) ? '#fff' : 'var(--muted)',
                  transition: 'all 0.2s',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {!isRegister ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email" placeholder="your@email.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password" placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
                💡 Demo: <strong>admin@aquacrop.com</strong> / <strong>admin123</strong>&nbsp;
                (run seed API first)
              </p>
              <button
                type="submit" className="btn btn-primary w-full"
                style={{ justifyContent: 'center', padding: 13 }} disabled={loading}
              >
                {loading ? '⏳ Signing in...' : 'Login →'}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  placeholder="Your full name"
                  value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email" placeholder="your@email.com"
                  value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password" placeholder="Min 6 characters"
                  value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit" className="btn btn-primary w-full"
                style={{ justifyContent: 'center', padding: 13 }} disabled={loading}
              >
                {loading ? '⏳ Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
