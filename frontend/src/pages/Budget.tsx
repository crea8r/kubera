import { useEffect, useMemo, useState } from 'react';
import { api, type ApiEnvelope } from '../lib/api';
import type { Workspace } from '../lib/types';

export default function BudgetPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const ws = useMemo(() => workspaces.find((w) => w.id === workspaceId) ?? null, [workspaces, workspaceId]);

  const [cycles, setCycles] = useState<any[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [lines, setLines] = useState<any[]>([]);
  const [links, setLinks] = useState<{ budgetLineId: string; operationId: string }[]>([]);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [allocatedUsd, setAllocatedUsd] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function loadWorkspaces() {
    setLoading(true);
    setErr(null);
    try {
      const wRes = await api.request<ApiEnvelope<any[]>>('/api/workspaces');
      if (!(wRes as any).success) throw new Error((wRes as any).error.message);
      const wsList = (wRes as any).data as Workspace[];
      setWorkspaces(wsList);
      if (!workspaceId && wsList[0]) setWorkspaceId(wsList[0].id);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }

  async function loadCycles(wId: string) {
    const dRes = await api.request<ApiEnvelope<any>>(`/api/workspaces/${wId}`);
    if (!(dRes as any).success) throw new Error((dRes as any).error.message);
    const cyclesData = (dRes as any).data.cycles ?? [];
    setCycles(cyclesData);
    const active = cyclesData.find((c: any) => c.isActive) ?? cyclesData[0];
    setSelectedCycleId(active?.id ?? '');
  }

  useEffect(() => {
    loadWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!workspaceId) return;
    setErr(null);
    loadCycles(workspaceId).catch((e: any) => setErr(e?.message ?? 'Failed to load cycles'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  async function loadCycle(cId: string) {
    const res = await api.request<ApiEnvelope<any>>(`/api/cycles/${cId}`);
    if (!(res as any).success) throw new Error((res as any).error.message);
    setLines((res as any).data.cycle.budgetLines ?? []);
    setLinks((res as any).data.links ?? []);
  }

  useEffect(() => {
    if (!selectedCycleId) return;
    setErr(null);
    loadCycle(selectedCycleId).catch((e: any) => setErr(e?.message ?? 'Failed to load cycle'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCycleId]);

  async function createBudgetLine() {
    if (!selectedCycleId) return;
    setCreating(true);
    setErr(null);
    try {
      const payload = {
        code: code.trim(),
        name: name.trim(),
        allocatedUsd,
        notes: notes.trim() || undefined
      };
      const res = await api.request<ApiEnvelope<any>>(`/api/cycles/${selectedCycleId}/budget-lines`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!(res as any).success) throw new Error((res as any).error.message);
      setCode('');
      setName('');
      setAllocatedUsd(0);
      setNotes('');
      await loadCycle(selectedCycleId);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to create budget line');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Budget</h1>
      {loading ? <div className="card">Loading…</div> : null}
      {err ? <div className="card" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>{err}</div> : null}

      <div className="card">
        <div className="hstack">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>Budget (workspace)</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Select an annual budget</div>
          </div>
          <div style={{ width: 360 }}>
            <select value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)}>
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hstack" style={{ marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{ws?.name ?? '—'}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Cycle (annual)</div>
          </div>
          <div style={{ width: 360 }}>
            <select value={selectedCycleId} onChange={(e) => setSelectedCycleId(e.target.value)}>
              {cycles.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.isActive ? '🟢 ' : ''}{c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="card">
          <div style={{ fontWeight: 800 }}>Create budget line</div>
          <div className="grid3" style={{ marginTop: 12 }}>
            <div>
              <label>Code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. P2" />
            </div>
            <div>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Op team travel" />
            </div>
            <div>
              <label>Amount (USD)</label>
              <input type="number" value={allocatedUsd} onChange={(e) => setAllocatedUsd(Number(e.target.value))} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional notes" />
          </div>
          <div className="hstack" style={{ marginTop: 12 }}>
            <button className="btn" disabled={creating || !selectedCycleId || !code.trim() || !name.trim()} onClick={createBudgetLine}>
              {creating ? 'Creating…' : 'Add line'}
            </button>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Links to operations can be added later.</span>
          </div>
        </div>

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Allocated (USD)</th>
              <th>PIC</th>
              <th>Notes</th>
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
                  <td style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.notes ?? ''}</td>
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
