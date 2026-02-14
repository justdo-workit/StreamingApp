import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Only redirect if the user is on the root path
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/coming-soon', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/',
}
