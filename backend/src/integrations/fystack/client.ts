import crypto from 'node:crypto';
import { env } from '../../lib/env.js';

export type FystackClientOpts = {
  baseUrl?: string;
  apiKey?: string;
  secretKey?: string;
};

function hmacSha256Hex(secret: string, message: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function buildQueryString(params: Record<string, string>) {
  const entries = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([k, v]) => `${k}=${v}`).join('&');
}

export class FystackClient {
  baseUrl: string;
  apiKey: string;
  secretKey: string;

  constructor(opts: FystackClientOpts = {}) {
    this.baseUrl = opts.baseUrl ?? env.FYSTACK_BASE_URL;
    this.apiKey = opts.apiKey ?? (env.FYSTACK_API_KEY || '');
    this.secretKey = opts.secretKey ?? (env.FYSTACK_SECRET_KEY || '');
  }

  private sign(method: string, pathWithQuery: string, timestampSeconds: number, body: unknown) {
    const params: Record<string, string> = {
      method: method.toUpperCase(),
      path: pathWithQuery,
      timestamp: String(timestampSeconds)
    };
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      params.body = JSON.stringify(body);
    }
    const qs = buildQueryString(params);
    return hmacSha256Hex(this.secretKey, qs);
  }

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string>, extraHeaders?: Record<string, string>) {
    if (!this.apiKey || !this.secretKey) throw new Error('Fystack credentials not configured');

    const url = new URL(this.baseUrl + path);
    if (query) for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
    const pathWithQuery = url.pathname + (url.search ? url.search : '');

    const ts = Math.floor(Date.now() / 1000);
    const sign = this.sign(method, pathWithQuery, ts, body);

    const res = await fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
        'ACCESS-API-KEY': this.apiKey,
        'ACCESS-TIMESTAMP': String(ts),
        'ACCESS-SIGN': sign,
        ...(extraHeaders ?? {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await res.text();
    let json: any;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      const err = new Error(`Fystack HTTP ${res.status}`);
      (err as any).status = res.status;
      (err as any).body = json;
      throw err;
    }

    return json as T;
  }

  // Wallets
  createWallet(input: { name: string; wallet_type: 'standard' | 'mpc'; wallet_purpose?: 'general' | 'user' }) {
    return this.request<any>('POST', '/wallets', input);
  }

  walletCreationStatus(walletId: string) {
    return this.request<any>('GET', `/wallets/creation-status/${walletId}`);
  }

  listWallets(query?: { limit?: string; offset?: string; wallet_type?: string; workspace_id?: string }) {
    return this.request<any>('GET', '/wallets', undefined, query);
  }

  // Withdrawals
  requestWithdrawal(walletId: string, input: { asset_id: string; amount: string; recipient_address: string }, idempotencyKey: string) {
    return this.request<any>(
      'POST',
      `/wallets/${walletId}/request-withdrawal`,
      input,
      undefined,
      { 'X-Idempotency-Key': idempotencyKey }
    );
  }

  getWithdrawal(withdrawalId: string) {
    return this.request<any>('GET', `/withdrawals/${withdrawalId}`);
  }

  // Assets/Networks
  listAssets() {
    return this.request<any>('GET', '/assets');
  }

  listNetworks() {
    return this.request<any>('GET', '/networks');
  }

  workspaceStats() {
    return this.request<any>('GET', '/workspaces');
  }
}
