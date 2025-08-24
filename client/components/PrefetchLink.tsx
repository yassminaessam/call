import React, { useRef, useEffect, useCallback } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface PrefetchLinkProps extends LinkProps {
  prefetch?: 'hover' | 'visible' | 'hover-visible' | 'none';
}

// Map of route -> dynamic import function (must align with lazy declarations in App.tsx)
// We conditionally reference them here to trigger preloading without mounting.
const routeImporters: Record<string, () => Promise<any>> = {
  '/calls': () => import('@/pages/CallCenter'),
  '/sales': () => import('@/pages/Sales'),
  '/hr': () => import('@/pages/HR'),
  '/marketing': () => import('@/pages/Marketing'),
  '/manufacturing': () => import('@/pages/Manufacturing'),
  '/support': () => import('@/pages/Support'),
  '/ai-answering': () => import('@/pages/AIAnswering'),
  '/settings': () => import('@/pages/Settings'),
  '/translation-demo': () => import('@/pages/TranslationDemo'),
};

function prefetchRoute(path: string) {
  const loader = routeImporters[path];
  if (loader) {
    loader().catch(() => {});
  }
}

export const PrefetchLink: React.FC<PrefetchLinkProps> = ({ prefetch = 'hover-visible', onMouseEnter, to, ...rest }) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const path = typeof to === 'string' ? to : to.pathname || '';

  const handleMouseEnter = useCallback<React.MouseEventHandler<HTMLAnchorElement>>((e) => {
    if (onMouseEnter) onMouseEnter(e);
    if (prefetch === 'hover' || prefetch === 'hover-visible') prefetchRoute(path);
  }, [onMouseEnter, path, prefetch]);

  useEffect(() => {
    if (!(prefetch === 'visible' || prefetch === 'hover-visible')) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    let triggered = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!triggered && entry.isIntersecting) {
          triggered = true;
            prefetchRoute(path);
            obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [path, prefetch]);

  return (
    <Link ref={ref} to={to} onMouseEnter={handleMouseEnter} {...rest} />
  );
};

export default PrefetchLink;
