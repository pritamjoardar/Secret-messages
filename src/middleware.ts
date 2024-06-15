import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

// Middleware function
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // If user is authenticated
    if (token) {
        // Redirect authenticated users away from sign-in, sign-up, and root pages to the dashboard
        if (url.pathname.startsWith('/signIn') || url.pathname.startsWith('/signup') || url.pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // Redirect unauthenticated users away from protected routes to the home page
        if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/verify')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Allow the request if no redirection is needed
    return NextResponse.next();
}

// Matching paths configuration
export const config = {
    matcher: [
        '/signIn',
        '/signup',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}
