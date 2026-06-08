import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Please verify your env variables.');
}

// Client for public and authenticated user operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    if (session) {
      // Set auth cookies for middleware
      const maxAge = 60 * 60 * 24 * 7; // 7 days
      document.cookie = `sb-tetumljensphppsstist-auth-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
      document.cookie = `supabase-auth-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
    } else {
      // Clear cookies on sign out
      document.cookie = `sb-tetumljensphppsstist-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
      document.cookie = `supabase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
    }
  });
}

