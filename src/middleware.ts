import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_COOKIE_NAME = 'engeman_auth_token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value

  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedRoute =
    pathname.startsWith('/me') ||
    pathname.startsWith('/properties') ||
    pathname.startsWith('/favorites')

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
