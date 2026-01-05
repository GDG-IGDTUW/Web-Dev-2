import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/' || path === '/login' || path === '/register' || path.startsWith('/api/auth');
    const token = request.cookies.get('auth_token')?.value || '';

    if (isPublicPath && token && (path === '/login' || path === '/register')) {
        // Redirect to dashboard if already logged in and trying to access auth pages
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    if (!isPublicPath && !token) {
        // Redirect to login if trying to access protected route (except public api or assets)
        // We should filter assets more robustly if needed, but for now specific paths:
        if (path.startsWith('/dashboard') || path.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/onboarding/:path*',
    ],
};
