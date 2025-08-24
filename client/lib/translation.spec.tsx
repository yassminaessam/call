/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { useEffect } from 'react';
// NOTE: Using relative path to avoid IDE/tsc path alias resolution hiccup in tests.
import { TranslationProvider, useTranslation } from '../contexts/TranslationContext';
import { render, waitFor, cleanup } from '@testing-library/react';

// Failsafe localStorage mock (should already exist from setup but keep lightweight guard)
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

describe('i18n dynamic loading', () => {
  beforeEach(() => {
    localStorage.clear();
    cleanup();
  });

  it('loads default (ar-EG) and falls back correctly', async () => {
    const collected: string[] = [];
    const Consumer: React.FC = () => {
      const { t, ready } = useTranslation();
      useEffect(() => {
        if (ready) {
          collected.push(t('dashboard.title'));
        }
      }, [ready, t]);
      return null;
    };
    render(<TranslationProvider><Consumer /></TranslationProvider>);
    await waitFor(() => expect(collected.length).toBe(1));
    expect(collected[0]).toBeTruthy();
    expect(collected[0]).not.toBe('dashboard.title'); // ensure translation resolved, not key echo
  });

  it('logs missing keys once', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const Consumer: React.FC = () => {
      const { t, ready } = useTranslation();
      useEffect(() => {
        if (ready) {
          t('dashboard.nonexistent');
          t('dashboard.nonexistent');
        }
      }, [ready, t]);
      return null;
    };
    render(<TranslationProvider><Consumer /></TranslationProvider>);
    await waitFor(() => {
      const warnings = warnSpy.mock.calls.filter(c => /Missing translation/.test(String(c[0])));
      expect(warnings.length).toBe(1);
    });
    warnSpy.mockRestore();
  });
});
