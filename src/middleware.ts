import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_COOKIE_NAME = 'engeman_auth_token'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value

  console.log(`[Middleware] -> Path: ${pathname} | Token exists: ${!!token}`)

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
    console.log(
      `[Middleware] REDIRECIONANDO -> Sem token, destino: ${url.pathname}`,
    )
    return NextResponse.redirect(url)
  }

  if (token && (isPublicPage || isRoot)) {
    console.log(
      `[Middleware] REDIRECIONANDO -> Com token na raiz/public, destino: /list`,
    )
    return NextResponse.redirect(new URL('/list', request.url))
  }

  console.log(`[Middleware] OK -> Deixando passar a requisição: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)',
  ],
}
