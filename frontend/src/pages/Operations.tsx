import { useEffect, useState } from 'react';
import { api, type ApiEnvelope } from '../lib/api';

export default function OperationsPage() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [cycleId, setCycleId] = useState('');
  const [ops, setOps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const wRes = await api.request<ApiEnvelope<any[]>>('/api/workspaces');
        if (!(wRes as any).success) throw new Error((wRes as any).error.message);
        const w = (wRes as any).data[0];

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
      if (!cycleId) return;
      try {
        const res = await api.request<ApiEnvelope<any>>(`/api/cycles/${cycleId}`);
        if (!(res as any).success) throw new Error((res as any).error.message);
        setOps((res as any).data.cycle.operations ?? []);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load ops');
      }
    })();
  }, [cycleId]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Operations</h1>
      {loading ? <div className="card">Loading…</div> : null}
      {err ? <div className="card" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>{err}</div> : null}

      <div className="card">
        <div className="hstack">
          <div style={{ flex: 1, fontWeight: 700 }}>Cycle</div>
          <div style={{ width: 320 }}>
            <select value={cycleId} onChange={(e) => setCycleId(e.target.value)}>
              {cycles.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.isActive ? '🟢 ' : ''}{c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="grid2">
        {ops.map((op: any) => (
          <div className="card" key={op.id}>
            <div className="hstack" style={{ justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 800 }}>{op.code} — {op.name}</div>
              <span className="badge">{op.status}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>{op.hypothesis}</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 700 }}>KPIs</div>
              <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                {(op.kpis ?? []).map((k: any) => (
                  <li key={k.id} style={{ fontSize: 13 }}>
                    {k.name}: {k.current} / {k.target}
                  </li>
                ))}
                {(op.kpis ?? []).length === 0 ? <li style={{ fontSize: 13, opacity: 0.7 }}>No KPIs yet</li> : null}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
