import { cookies } from 'next/headers'

export interface UserSession {
  sub: string // correo
  authorities: string[] // roles como ROLE_ADMIN
  exp: number
}

/**
 * Decodifica un JWT manualmente para extraer el payload.
 * Útil para obtener roles en el servidor (Server Components / Actions).
 */
export function decodeJWT(token: string): UserSession | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decodificando JWT:', error)
    return null
  }
}

/**
 * Obtiene la sesión actual desde las cookies.
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return decodeJWT(token)
}

/**
 * Verifica si el usuario tiene un rol específico.
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  // Los roles pueden venir con el prefijo ROLE_ o no, normalizamos la comparación
  const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`
  return session.authorities.includes(normalizedRole)
}
