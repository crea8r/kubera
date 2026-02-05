import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('hieu@superteam.vn');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      nav('/');
    } catch (e: any) {
      setErr(e?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto' }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        <p style={{ opacity: 0.75, marginTop: 6 }}>React frontend (mock-inspired) → real backend.</p>
        <form onSubmit={onSubmit}>
          <div style={{ marginTop: 12 }}>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err ? (
            <div style={{ marginTop: 12, color: '#b91c1c', fontSize: 13 }}>{err}</div>
          ) : null}
          <div className="hstack" style={{ marginTop: 14 }}>
            <button className="btn" disabled={loading} type="submit">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Seed creds prefilled</span>
          </div>
        </form>
      </div>
    </div>
  );
}
