'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#030305] text-slate-100 min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Global System Reset Required</h2>
          <p className="text-xs text-slate-400 mb-6">
            A critical operational exception occurred.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold text-xs uppercase tracking-widest shadow-md"
          >
            Reset Matrix
          </button>
        </div>
      </body>
    </html>
  );
}
