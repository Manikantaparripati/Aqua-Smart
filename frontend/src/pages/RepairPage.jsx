import { useState, useContext, useEffect } from 'react';
import { AppCtx } from '../context/AppContext';
import api from '../api/axios';

const SERVICE_TYPES = [
  'Motor Repair', 'Aerator Fix', 'Tractor Service',
  'Electrical Work', 'Pump Repair', 'Generator Service',
];

const SERVICE_ICONS = {
  'Motor Repair': '⚙️', 'Aerator Fix': '💨', 'Tractor Service': '🚜',
  'Electrical Work': '⚡', 'Pump Repair': '🔩', 'Generator Service': '🔋',
};

function RepairPage() {
  const { showToast, fetchBookings, bookings } = useContext(AppCtx);
  const [form, setForm]         = useState({ name: '', phone: '', serviceType: '', message: '' });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.serviceType)
      return showToast('Please fill all required fields', 'error');
    setLoading(true);
    try {
      await api.post('/bookings', form);
      showToast('Booking submitted! We will contact you within 2 hours. ✅');
      setSubmitted(true);
      setForm({ name: '', phone: '', serviceType: '', message: '' });
      fetchBookings();
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          🔧 Repair Service
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
          Book expert repair for motors, aerators, and more
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Booking Form */}
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: 'var(--teal)' }}>📋 Book a Service</h3>
          {submitted && (
            <div style={{
              background: 'var(--teal-light)', border: '1.5px solid #9fe1cb',
              borderRadius: 8, padding: '12px 14px', marginBottom: 16,
              color: 'var(--teal)', fontSize: 14, fontWeight: 500,
            }}>
              ✅ Booking confirmed! We'll call you within 2 hours.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                placeholder="Your name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                placeholder="10-digit mobile number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Service Type *</label>
              <select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                <option value="">-- Select service --</option>
                {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Issue Description</label>
              <textarea
                rows={3} placeholder="Describe the problem..."
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full"
              style={{ justifyContent: 'center', padding: 11 }} disabled={loading}>
              {loading ? '⏳ Submitting...' : 'Submit Booking'}
            </button>
          </form>
        </div>

        {/* Right panel */}
        <div>
          {/* Available services */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--muted)', letterSpacing: '0.5px' }}>
              AVAILABLE SERVICES
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SERVICE_TYPES.map((s) => (
                <div key={s} style={{
                  background: 'var(--teal-light)', borderRadius: 8, padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setForm({ ...form, serviceType: s })}
                >
                  <span>{SERVICE_ICONS[s]}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Bookings */}
          <div className="card">
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--muted)', letterSpacing: '0.5px' }}>
              MY BOOKINGS
            </h4>
            {bookings.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>No bookings yet.</p>
            ) : (
              bookings.slice(0, 4).map((b) => (
                <div key={b._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{b.serviceType}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {b.name} · {b.phone}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`badge ${
                    b.status === 'confirmed'  ? 'badge-green'
                    : b.status === 'completed' ? 'badge-blue'
                    : b.status === 'cancelled' ? 'badge-red'
                    : 'badge-amber'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepairPage;
