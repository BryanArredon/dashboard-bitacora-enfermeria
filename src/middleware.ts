import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Decodifica un JWT de forma simple para el Middleware (Edge Runtime)
 */
function getRolesFromToken(token: string): string[] {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded.authorities || []
  } catch {
    return []
  }
}

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  
  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/verify-code', '/reset-password', '/google-authenticator']
  const isPublicPath = publicPaths.includes(pathname)

  // Si no está autenticado y la ruta no es pública
  if (!authToken && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si está autenticado
  if (authToken) {
    const roles = getRolesFromToken(authToken)
    const isAdmin = roles.includes('ROLE_ADMIN')

    // Si trata de ir al login o verify-code estando ya logatueado
    if (pathname === '/login' || pathname === '/verify-code') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // PROTECCIÓN DE RUTAS DE ADMINISTRADOR
    if (pathname.startsWith('/admin') && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/' // Redirigir al dashboard normal si no es admin
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}