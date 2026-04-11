'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Apartado para el login de la aplicación
// Definimos el tipo de respuesta que esperamos del backend Java
interface AuthResponse {
  userId?: string
  correo?: string
  accessToken?: string
  mensaje?: string
  requiresMfa?: boolean
  tempUserId?: string
  mfaMethods?: ('email' | 'totp')[]
}

export async function loginUsuario(prevState: unknown, formData: FormData) {
  // Se obtienen los datos del usuario desde el formulario
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Correo y contraseña son obligatorios' }
  }

  // Se llama al auth-service para validar las credenciales
  const backendUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8085'

  try {
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password }),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      return { error: data.mensaje || 'Correo o contraseña incorrectos' }
    }

    if (data.requiresMfa === true && data.tempUserId) {
      const cookieStore = await cookies()
      // Guardar tempUserId en cookie (expira en 10 minutos)
      cookieStore.set('tempUserId', data.tempUserId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 10, // 10 minutos
        path: '/',
      })
      cookieStore.set('mfaEmail', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 10,
        path: '/',
      })
      // Redirigir a la página de verificación de código
      redirect('/verify-code')
    }

    // Login exitoso sin MFA (token directo)
    const token = data.accessToken
    if (!token) {
      return { error: 'El servidor no devolvió un token válido' }
    }

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 día
      path: '/',
    })

    redirect('/')
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Error en loginUsuario:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    return { error: errorMessage }
  }
}

// Función para cerrar sesión
export async function logoutUsuario() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  redirect('/login')
}

// Función para verificar el código MFA
export async function verifyMfa(prevState: unknown, formData: FormData) {
  const otp = formData.get('otp') as string

  if (!otp || otp.length !== 6) {
    return { error: 'Debes ingresar un código de 6 dígitos' }
  }

  const cookieStore = await cookies()
  const tempUserId = cookieStore.get('tempUserId')?.value

  if (!tempUserId) {
    return { error: 'Sesión expirada o inválida. Por favor, inicia sesión nuevamente.' }
  }

  const backendUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8085'

  try {
    const response = await fetch(`${backendUrl}/api/auth/verify-mfa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempUserId, otp }),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      return { error: data.mensaje || 'Código incorrecto o expirado' }
    }

    const token = data.accessToken
    if (!token) {
      return { error: 'El servidor no devolvió un token válido' }
    }

    // Guardar token definitivo
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    // Limpiar cookie temporal
    cookieStore.delete('tempUserId')

    redirect('/')
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Error en verifyMfa:', error)
    return { error: 'Error interno del servidor' }
  }
}

// Función para obtener secret y QR
export async function setupTotp(email: string) {
  const backendUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8085'
  const res = await fetch(`${backendUrl}/api/auth/mfa/setup-totp/${email}`, {
    method: 'GET',
  })
  if (!res.ok) throw new Error('Error al configurar TOTP')
  return res.json() // { secret, qrCodeUrl, mensaje }
}

// Función para habilitar TOTP
export async function enableTotp(email: string, otp: string) {
  const backendUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8085'
  const res = await fetch(`${backendUrl}/api/auth/mfa/enable-totp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: email, otp }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.mensaje || 'Error al habilitar TOTP')
  }
  return { success: true }
}

// Función para verificar el código TOTP durante el login
export async function verificarCodigoAuthenticator(prevState: unknown, formData: FormData) {
  const codigo = formData.get('codigo') as string

  if (!codigo || codigo.length !== 6) {
    return { error: 'Debes ingresar un código de 6 dígitos' }
  }

  const cookieStore = await cookies()
  const tempUserId = cookieStore.get('tempUserId')?.value
  const email = cookieStore.get('mfaEmail')?.value

  if (!tempUserId || !email) {
    return { error: 'Sesión expirada. Por favor, inicia sesión nuevamente.' }
  }

  const backendUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8085'

  // Intentar activar TOTP (por si es la primera vez)
  try {
    const enableRes = await fetch(`${backendUrl}/api/auth/mfa/enable-totp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, code: codigo }),
    })

    if (enableRes.ok) {
      const data: AuthResponse = await enableRes.json()
      const token = data.accessToken
      if (token) {
        cookieStore.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24,
          path: '/',
        })
        cookieStore.delete('tempUserId')
        cookieStore.delete('mfaEmail')
        redirect('/')
      }
    }
    // Si falla, continuamos con el siguiente intento (puede ser que ya esté activo)
  } catch {
    console.log('enable-totp falló, intentando verify-mfa...')
  }

  try {
    const verifyRes = await fetch(`${backendUrl}/api/auth/verify-mfa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempUserId, otp: codigo }),
    })

    const data: AuthResponse = await verifyRes.json()

    if (!verifyRes.ok) {
      return { error: data.mensaje || 'Código incorrecto o expirado' }
    }

    const token = data.accessToken
    if (!token) {
      return { error: 'El servidor no devolvió un token válido' }
    }

    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    cookieStore.delete('tempUserId')
    cookieStore.delete('mfaEmail')
    redirect('/')
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    console.error('Error en verify-mfa:', error)
    return { error: 'Error interno del servidor' }
  }
}

// Apartado para la gestión de bitácoras médicas
type NivelUrgencia = 'Estable' | 'Observación' | 'Crítico'

type BitacoraEntry = {
  id: string
  paciente: string
  cama: string
  signosVitales: string
  notas: string
  nivelUrgencia: NivelUrgencia
  fechaStr: string
}

// Simulando base de datos en memoria para la demo
let globalBitacoras: BitacoraEntry[] = [
  {
    id: '1',
    paciente: 'Gómez, R.',
    cama: '104',
    signosVitales: 'TA 120/80',
    notas: 'Paracetamol 500mg IV administrado. Paciente estable.',
    nivelUrgencia: 'Estable',
    fechaStr: 'Hace 10 min'
  },
  {
    id: '2',
    paciente: 'Pérez, M.',
    cama: '105',
    signosVitales: 'TA 110/70, Temp 36.5°C',
    notas: 'Control de signos vitales. Sin fiebre.',
    nivelUrgencia: 'Observación',
    fechaStr: 'Hace 45 min'
  }
]

export async function obtenerBitacoras() {
  return globalBitacoras
}

export async function guardarBitacora(prevState: any, formData: FormData) {
  const paciente = formData.get('paciente') as string
  const cama = formData.get('cama') as string
  const signosVitales = formData.get('signosVitales') as string
  const notas = formData.get('notas') as string
  const urgencia = formData.get('urgencia') as string

  if (!paciente || !cama) return { error: 'Paciente y Cama son obligatorios' }

  const nuevaBitacora: BitacoraEntry = {
    id: Date.now().toString(),
    paciente,
    cama,
    signosVitales: signosVitales || 'No registrados',
    notas: notas || 'Sin notas adicionales',
    nivelUrgencia: (urgencia as NivelUrgencia) || 'Estable',
    fechaStr: 'Justo ahora'
  }

  // Agrega al inicio de la lista
  globalBitacoras.unshift(nuevaBitacora)

  // Refresca la vista
  revalidatePath('/')
  return { success: true }
}