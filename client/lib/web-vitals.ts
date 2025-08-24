// web-vitals.ts
// Lightweight collector forwarding metrics to backend & logging in dev.
import { onCLS, onLCP, onINP, onFCP, onTTFB } from 'web-vitals';

interface MetricPayload { name: string; value: number; id: string; navigationType?: string }

const endpoint = '/api/metrics/web-vitals';

function send(metric: MetricPayload) {
  try {
    const body = JSON.stringify({ ...metric, ts: Date.now() });
    navigator.sendBeacon?.(endpoint, body) || fetch(endpoint, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
  } catch {
    // ignore
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[vitals] ${metric.name}:`, metric.value.toFixed(2));
  }
}

export function initWebVitals() {
  onCLS(m => send(m as any));
  onLCP(m => send(m as any));
  onINP(m => send(m as any));
  onFCP(m => send(m as any));
  onTTFB(m => send(m as any));
}
