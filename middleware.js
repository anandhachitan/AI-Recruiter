import { NextResponse } from 'next/server'

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const isPublicPath = path === '/auth' || path.startsWith('/interview/');

    // Get the session from cookies (Supabase uses 'sb-access-token' or similar)
    // However, Supabase recommends using their auth helper for middleware if possible.
    // Since I don't see @supabase/auth-helpers-nextjs or @supabase/ssr in package.json,
    // I'll check for the existence of the supabase session cookie.
    const hasSession = request.cookies.get('supabase-auth-token')?.value;

    // 1. If user is logged in and trying to access /auth, redirect to dashboard
    if (isPublicPath && hasSession && path === '/auth') {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    }

    // 2. If user is NOT logged in and trying to access protected path, redirect to auth
    // Exceptions: public interview links like /interview/[id]
    if (!isPublicPath && !hasSession) {
        return NextResponse.redirect(new URL('/auth', request.nextUrl))
    }

    return NextResponse.next()
}

// Config to match all request paths except static files, api routes, etc.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
