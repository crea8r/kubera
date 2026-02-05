import { useEffect, useState } from 'react';
import { api, type ApiEnvelope } from '../lib/api';

export default function SettingsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [networks, setNetworks] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const aRes = await api.request<ApiEnvelope<any>>('/api/fystack/assets');
        if ((aRes as any).success) setAssets((aRes as any).data?.data ?? []);
        const nRes = await api.request<ApiEnvelope<any>>('/api/fystack/networks');
        if ((nRes as any).success) setNetworks((nRes as any).data?.data ?? []);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load fystack data');
      }
    })();
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      {err ? <div className="card" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>{err}</div> : null}

      <div className="grid2">
        <div className="card">
          <div style={{ fontWeight: 700 }}>Fystack Assets</div>
          <div style={{ marginTop: 10, maxHeight: 320, overflow: 'auto' }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {assets.slice(0, 30).map((a) => (
                <li key={a.id} style={{ fontSize: 13 }}>
                  {a.symbol} — {a.name}
                </li>
              ))}
              {assets.length === 0 ? <li style={{ fontSize: 13, opacity: 0.7 }}>No data (or not configured)</li> : null}
            </ul>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700 }}>Networks</div>
          <div style={{ marginTop: 10, maxHeight: 320, overflow: 'auto' }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {networks.slice(0, 30).map((n) => (
                <li key={n.id} style={{ fontSize: 13 }}>
                  {n.name} {n.is_testnet ? '(testnet)' : ''}
                </li>
              ))}
              {networks.length === 0 ? <li style={{ fontSize: 13, opacity: 0.7 }}>No data (or not configured)</li> : null}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
