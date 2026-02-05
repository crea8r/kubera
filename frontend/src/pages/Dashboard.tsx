import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type ApiEnvelope } from '../lib/api';
import type { Workspace } from '../lib/types';

export default function DashboardPage() {
  const nav = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const active = useMemo(() => workspaces[0] ?? null, [workspaces]);

  const [newName, setNewName] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newCurrency, setNewCurrency] = useState('USD');
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.request<ApiEnvelope<Workspace[]>>('/api/workspaces');
      if ((res as any).success) setWorkspaces((res as any).data);
      else setErr((res as any).error.message);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createAnnualBudget() {
    setCreating(true);
    setErr(null);
    try {
      const payload = { name: newName.trim(), year: newYear, currency: newCurrency };
      const res = await api.request<ApiEnvelope<any>>('/api/workspaces', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!(res as any).success) throw new Error((res as any).error.message);
      await refresh();
      nav('/budget');
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to create budget');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {loading ? <div className="card">Loading…</div> : null}
      {err ? <div className="card" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>{err}</div> : null}

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 800 }}>Create annual budget</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>
          Kubera is annual-only. One workspace = one annual budget.
        </div>
        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Budget name</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Superteam VN" />
          </div>
          <div>
            <label>Year</label>
            <input type="number" value={newYear} onChange={(e) => setNewYear(Number(e.target.value))} />
          </div>
          <div>
            <label>Currency</label>
            <input value={newCurrency} onChange={(e) => setNewCurrency(e.target.value)} />
          </div>
        </div>
        <div className="hstack" style={{ marginTop: 12 }}>
          <button className="btn" disabled={creating || !newName.trim()} onClick={createAnnualBudget}>
            {creating ? 'Creating…' : 'Create budget'}
          </button>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Creates Jan 1 → Dec 31 automatically.</span>
        </div>
      </div>

      {active ? (
        <div className="grid3">
          <div className="card">
            <div style={{ fontSize: 12, opacity: 0.7 }}>Workspace</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{active.name}</div>
            <div style={{ marginTop: 10 }}>
              <span className="badge">currency: {active.currency}</span>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: 12, opacity: 0.7 }}>Budget</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Not computed yet</div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
              Next: add dashboard aggregate endpoints (spent/committed/available).
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: 12, opacity: 0.7 }}>Approvals</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Wire proposals view</div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
              Next: show submitted proposals & approve/reject.
            </div>
          </div>
        </div>
      ) : !loading ? (
        <div className="card">No workspaces yet.</div>
      ) : null}

      <div style={{ marginTop: 14 }} className="card">
        <div style={{ fontWeight: 700 }}>Workspaces</div>
        <table className="table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Currency</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.currency}</td>
                <td>{new Date(w.startDate).toISOString().slice(0, 10)}</td>
                <td>{new Date(w.endDate).toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
