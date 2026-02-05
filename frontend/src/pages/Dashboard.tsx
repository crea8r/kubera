import { useEffect, useMemo, useState } from 'react';
import { api, type ApiEnvelope } from '../lib/api';
import type { Workspace } from '../lib/types';

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const active = useMemo(() => workspaces[0] ?? null, [workspaces]);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {loading ? <div className="card">Loading…</div> : null}
      {err ? <div className="card" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>{err}</div> : null}

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
