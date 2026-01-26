import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if the path is home or starts with /grand-prix or /stream
    if (
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/grand-prix') ||
        request.nextUrl.pathname.startsWith('/stream')
    ) {
        return NextResponse.redirect(new URL('/coming-soon', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/grand-prix/:path*',
        '/stream/:path*',
    ],
}
