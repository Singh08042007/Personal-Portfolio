'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030305] text-slate-100 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-error-container/20 border border-error/40 flex items-center justify-center text-error mb-4">
        <span className="material-symbols-outlined text-3xl">warning</span>
      </div>
      <h2 className="text-2xl font-bold font-headline-lg mb-2">System Diagnostics Interrupted</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        An anomaly occurred during neural matrix rendering.
      </p>
      <button
        onClick={() => reset()}
        className="btn-premium px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-on-primary-fixed shadow-lg"
      >
        Re-Initialize System
      </button>
    </div>
  );
}
