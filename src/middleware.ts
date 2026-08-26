import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Let client-side Supabase getSession handle auth checks securely inside /admin component
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
