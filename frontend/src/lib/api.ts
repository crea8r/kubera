export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: { code: string; message: string; details?: unknown } };
export type ApiEnvelope<T> = ApiSuccess<T> | ApiError;

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:29001';

export class ApiClient {
  baseUrl: string;
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      credentials: 'include',
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        'content-type': 'application/json'
      }
    });

    const json = (await res.json().catch(() => null)) as any;

    if (!res.ok) {
      const msg = json?.error?.message ?? `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return json as T;
  }
}

export const api = new ApiClient();
