'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If already logged in, redirect to admin directly
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin');
      }
    }
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during auth verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 px-margin-mobile bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-card max-w-md w-full p-8 rounded-2xl border-white/10 z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-display-lg text-3xl font-extrabold text-primary-fixed tracking-tighter">
            DS
          </Link>
          <h1 className="font-headline-md text-xl font-bold mt-4">Security Access Portal</h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">Authorized intelligence personnel only.</p>
        </div>

        {error && (
          <div className="p-4 bg-error-container/10 border border-error text-error rounded-lg text-xs font-semibold mb-6">
            Access Denied: {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="font-label-sm text-xs text-on-surface-variant ml-1">Admin Signature (Email)</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@systems.com"
              className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none text-on-surface transition-all search-glow"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-sm text-xs text-on-surface-variant ml-1">Access Protocol (Password)</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none text-on-surface transition-all search-glow"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 btn-premium text-on-primary-fixed rounded-lg font-label-md text-sm font-bold tracking-widest uppercase transition-all disabled:opacity-50"
          >
            {loading ? 'VERIFYING SIGNATURE...' : 'AUTHENTICATE ACCESS'}
          </button>
        </form>
      </div>
    </main>
  );
}
