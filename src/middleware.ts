import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_COOKIE_NAME = 'engeman_auth_token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value

  const publicPages = ['/login', '/register']
  const isPublicPage = publicPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  )

  const isRoot = pathname === '/'

  if (!token && !isPublicPage) {
    const url = new URL('/login', request.url)
    if (!isRoot) {
      url.searchParams.set('from', pathname)
    }
    return NextResponse.redirect(url)
  }

  if (token && (isPublicPage || isRoot)) {
    return NextResponse.redirect(new URL('/list', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next|_vercel|.*\\..*).*)'],
}
