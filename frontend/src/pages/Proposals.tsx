import { useEffect, useMemo, useState } from 'react';
import { api, type ApiEnvelope } from '../lib/api';

export default function ProposalsPage() {
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [cycles, setCycles] = useState<any[]>([]);
  const [cycleId, setCycleId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => {
    const qs = new URLSearchParams();
    if (cycleId) qs.set('cycleId', cycleId);
    if (status) qs.set('status', status);
    const s = qs.toString();
    return s ? `?${s}` : '';
  }, [cycleId, status]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const wRes = await api.request<ApiEnvelope<any[]>>('/api/workspaces');
        if (!(wRes as any).success) throw new Error((wRes as any).error.message);
        const w = (wRes as any).data[0];
        setWorkspaceId(w.id);

        const dRes = await api.request<ApiEnvelope<any>>(`/api/workspaces/${w.id}`);
        if (!(dRes as any).success) throw new Error((dRes as any).error.message);
        const cs = (dRes as any).data.cycles ?? [];
        setCycles(cs);
        const active = cs.find((c: any) => c.isActive) ?? cs[0];
        if (active) setCycleId(active.id);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!workspaceId) return;
      try {
        const res = await api.request<ApiEnvelope<any>>(`/api/workspaces/${workspaceId}/proposals${query}`);
        if (!(res as any).success) throw new Error((res as any).error.message);
        setItems((res as any).data);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load proposals');
      }
    })();
  }, [workspaceId, query]);

  async function approve(id: string) {
    setErr(null);
    try {
      const res = await api.request<ApiEnvelope<any>>(`/api/proposals/${id}/approve`, { method: 'POST', body: '{}' });
      if (!(res as any).success) throw new Error((res as any).error.message);
      // refresh
      const r2 = await api.request<ApiEnvelope<any>>(`/api/workspaces/${workspaceId}/proposals${query}`);
      if ((r2 as any).success) setItems((r2 as any).data);
    } catch (e: any) {
      setErr(e?.message ?? 'Approve failed');
    }
  }

  async function reject(id: string) {
    const reason = prompt('Rejection reason?') ?? '';
    if (!reason.trim()) return;
    setErr(null);
    try {
      const res = await api.request<ApiEnvelope<any>>(`/api/proposals/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
      if (!(res as any).success) throw new Error((res as any).error.message);
      const r2 = await api.request<ApiEnvelope<any>>(`/api/workspaces/${workspaceId}/proposals${query}`);
      if ((r2 as any).success) setItems((r2 as any).data);
    } catch (e: any) {
      setErr(e?.message ?? 'Reject failed');
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Proposals</h1>
      {loading ? <div className="card">Loading…</div> : null}
      {err ? <div className="card" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>{err}</div> : null}

      <div className="card">
        <div className="grid3">
          <div>
            <label>Cycle</label>
            <select value={cycleId} onChange={(e) => setCycleId(e.target.value)}>
              {cycles.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.isActive ? '🟢 ' : ''}{c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="draft">draft</option>
              <option value="submitted">submitted</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="spent">spent</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div className="badge">{items.length} items</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Created</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: any) => (
              <tr key={p.id}>
                <td>{new Date(p.createdAt).toISOString().slice(0, 10)}</td>
                <td>{p.description}</td>
                <td>${String(p.amountUsd)}</td>
                <td>
                  <span className="badge">{p.status}</span>
                </td>
                <td>
                  {p.status === 'submitted' ? (
                    <div className="hstack">
                      <button className="btn" onClick={() => approve(p.id)}>
                        Approve
                      </button>
                      <button className="btn" style={{ background: '#ef4444' }} onClick={() => reject(p.id)}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
