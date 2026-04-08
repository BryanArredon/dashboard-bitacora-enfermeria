import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  
  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/verify-code', '/reset-password', '/auth-user']
  const isPublicPath = publicPaths.includes(pathname)

  // Si no está autenticado y la ruta no es pública
  if (!authToken && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si está autenticado y trata de ir al login o verify-code
  if (authToken && (pathname === '/login' || pathname === '/verify-code')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}