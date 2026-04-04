// ── Timing constants ──────────────────────────────────────────────────────────
export const DEBOUNCE_MS = 300;
export const POLL_INTERVAL_MS = 500;

// ── URL constants ─────────────────────────────────────────────────────────────
export const API = {
  model:           '/api/model',
  modelScan:       '/api/model/scan',
  modelSave:       '/api/model/save',
  modelHyperparam: '/api/model/hyperparam',
  modelLoad:       '/api/model/load',
  modelUnload:     '/api/model/unload',
  runtime:         '/api/runtime',
  runtimeSave:     '/api/runtime/save',
  skills:          '/api/skills',
  tools:           '/api/tools',
  config:          '/api/config',
  configSave:      '/api/config/save',
  configApiKey:    '/api/config/api-key',
  instruct:        '/api/instruct/',
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** POST a JSON body; returns true on success, false on any failure. */
export async function postJson(url: string, body: unknown): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error(`POST ${url} failed: ${response.status} ${response.statusText}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`POST ${url} error:`, err);
    return false;
  }
}

/** GET JSON from a URL; throws on network error or non-OK status. */
export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}
