import { useEffect, useState } from 'react';
import { api, type ApiEnvelope } from '../lib/api';
import type { Workspace } from '../lib/types';

export default function BudgetPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [cycles, setCycles] = useState<any[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [lines, setLines] = useState<any[]>([]);
  const [links, setLinks] = useState<{ budgetLineId: string; operationId: string }[]>([]);
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
        setWs(w);

        const dRes = await api.request<ApiEnvelope<any>>(`/api/workspaces/${w.id}`);
        if (!(dRes as any).success) throw new Error((dRes as any).error.message);
        const cyclesData = (dRes as any).data.cycles ?? [];
        setCycles(cyclesData);
        const active = cyclesData.find((c: any) => c.isActive) ?? cyclesData[0];
        if (active) setSelectedCycleId(active.id);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedCycleId) return;
      try {
        const res = await api.request<ApiEnvelope<any>>(`/api/cycles/${selectedCycleId}`);
        if (!(res as any).success) throw new Error((res as any).error.message);
        setLines((res as any).data.cycle.budgetLines ?? []);
        setLinks((res as any).data.links ?? []);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load cycle');
      }
    })();
  }, [selectedCycleId]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Budget</h1>
      {loading ? <div className="card">Loading…</div> : null}
      {err ? <div className="card" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>{err}</div> : null}

      <div className="card">
        <div className="hstack">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{ws?.name ?? '—'}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Cycle</div>
          </div>
          <div style={{ width: 320 }}>
            <select value={selectedCycleId} onChange={(e) => setSelectedCycleId(e.target.value)}>
              {cycles.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.isActive ? '🟢 ' : ''}{c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Allocated (USD)</th>
              <th>PIC</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l: any) => {
              const linkCount = links.filter((x) => x.budgetLineId === l.id).length;
              return (
                <tr key={l.id}>
                  <td>{l.code}</td>
                  <td>{l.name}</td>
                  <td>{String(l.allocatedUsd)}</td>
                  <td>{l.pic ?? ''}</td>
                  <td>{linkCount ? <span className="badge">{linkCount} ops</span> : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
