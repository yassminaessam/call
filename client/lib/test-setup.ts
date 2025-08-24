// Use the Vitest-specific entry to extend expect safely
import '@testing-library/jest-dom/vitest';

// Basic localStorage mock for non-browser test environment
if (typeof globalThis.localStorage === 'undefined') {
	const store: Record<string, string> = {};
	globalThis.localStorage = {
		getItem: (k: string) => (k in store ? store[k] : null),
		setItem: (k: string, v: string) => { store[k] = String(v); },
		removeItem: (k: string) => { delete store[k]; },
		clear: () => { Object.keys(store).forEach(k => delete store[k]); },
		key: (i: number) => Object.keys(store)[i] || null,
		get length() { return Object.keys(store).length; }
	} as any;
}
