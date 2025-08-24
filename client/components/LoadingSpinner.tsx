import React from 'react';

// Lightweight spinner that adapts to RTL via inherent layout and uses Tailwind utility classes
export const LoadingSpinner: React.FC<{ label?: string }>= ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-4" role="status" aria-live="polite">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
    <div className="text-sm text-muted-foreground">{label || 'Loading...'}</div>
  </div>
);

export default LoadingSpinner;
