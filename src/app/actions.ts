'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Helper para determinar la URL base (Interna para SSR/Server Actions, Pública para Navegador)
function getBaseUrls() {
  const isServer = typeof window === 'undefined';
  
  // URLs para el Cliente (Browser Public)
  const publicAuth = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
  const publicBackend = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (isServer) {
    // Si estamos en el servidor (SSR/Actions), intentamos usar la URL interna.
    // Si no existe (desarrollo local), usamos la pública.
    return {
      auth: process.env.INTERNAL_AUTH_URL || publicAuth,
      backend: process.env.INTERNAL_BACKEND_URL || publicBackend
    };
  }

  return {
    auth: publicAuth,
    backend: publicBackend
  };
}

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

export interface UserProfile {
  correo: string
  nombre?: string
  apellidos?: string
  numeroEmpleado?: string
  especialidad?: string
  roles: string[]
}

export interface Modulo {
  nombre: string
  ruta: string
  icono: string
  orden: number
}

export async function loginUsuario(prevState: unknown, formData: FormData) {
  // Se obtienen los datos del usuario desde el formulario
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Correo y contraseña son obligatorios' }
  }

  // Se llama al auth-service para validar las credenciales
  const { auth: backendUrl } = getBaseUrls();

  try {
    const response = await fetch(`${backendUrl}/auth/login`, {
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

  const { auth: backendUrl } = getBaseUrls();

  try {
    const response = await fetch(`${backendUrl}/auth/verify-mfa`, {
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
  const { auth: backendUrl } = getBaseUrls();
  const res = await fetch(`${backendUrl}/auth/mfa/setup-totp/${email}`, {
    method: 'GET',
  })
  if (!res.ok) throw new Error('Error al configurar TOTP')
  return res.json() // { secret, qrCodeUrl, mensaje }
}

// Función para habilitar TOTP
export async function enableTotp(email: string, otp: string) {
  const { auth: backendUrl } = getBaseUrls();
  const res = await fetch(`${backendUrl}/auth/mfa/enable-totp`, {
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

  const { auth: backendUrl } = getBaseUrls();

  // Intentar activar TOTP (por si es la primera vez)
  try {
    const enableRes = await fetch(`${backendUrl}/auth/mfa/enable-totp`, {
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
    const verifyRes = await fetch(`${backendUrl}/auth/verify-mfa`, {
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
export type NivelUrgencia = 'Estable' | 'Observación' | 'Crítico'

export type BitacoraEntry = {
  id: string
  paciente: string
  cama: string
  signosVitales: string
  notas: string
  nivelUrgencia: NivelUrgencia
  fechaStr: string
}

export async function obtenerBitacoras(): Promise<BitacoraEntry[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return []
  }

  const { backend: backendUrl } = getBaseUrls();

  try {
    const res = await fetch(`${backendUrl}/bitacora/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      console.error('Error fetching bitacoras, status:', res.status)
      return []
    }

    const { data } = await res.json()
    if (!data || !Array.isArray(data)) return []

    return data.map((item: any): BitacoraEntry => {
      // Parsear y formatear signos vitales desde JSON a string simple
      let signosVitalesStr = 'No registrados'
      if (item.signos_vitales) {
        if (typeof item.signos_vitales === 'object') {
          signosVitalesStr = Object.entries(item.signos_vitales)
                                   .map(([k, v]) => `${k.toUpperCase()} ${v}`)
                                   .join(', ')
        } else if (typeof item.signos_vitales === 'string') {
          signosVitalesStr = item.signos_vitales
        }
      }

      // Devolver estructura de la interfaz
      return {
        id: item.id,
        paciente: item.paciente_nombre || 'Desconocido',
        cama: item.cama || 'N/A',
        signosVitales: signosVitalesStr,
        notas: item.observaciones || '', // Usamos observaciones como notas
        nivelUrgencia: 'Observación', // Fijo de manera temporal
        fechaStr: new Date(item.cliente_timestamp || item.fecha_servidor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    })
  } catch (error) {
    console.error('Error in obtenerBitacoras network call:', error)
    return []
  }
}

export async function obtenerPacientes() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return []

  const { backend: backendUrl } = getBaseUrls();
  try {
    const res = await fetch(`${backendUrl}/pacientes/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return []
    const ds = await res.json()
    return ds.data || []
  } catch (error) {
    console.error('Error in obtenerPacientes:', error)
    return []
  }
}

export async function obtenerPerfiles() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return []

  const { backend: backendUrl } = getBaseUrls();
  try {
    const res = await fetch(`${backendUrl}/perfiles/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return []
    const dict = await res.json()
    return dict.data || []
  } catch (error) {
    console.error('Error in obtenerPerfiles:', error)
    return []
  }
}

export async function guardarBitacora(prevState: any, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const paciente_id = formData.get('paciente_id') as string
  const enfermero_id = formData.get('enfermero_id') as string
  const presionArterial = formData.get('presionArterial') as string
  const temperatura = formData.get('temperatura') as string
  const frecuenciaCardiaca = formData.get('frecuenciaCardiaca') as string
  const notas = formData.get('notas') as string
  const turno = formData.get('turno') as string

  if (!paciente_id || !enfermero_id) return { error: 'Paciente y Enfermero son obligatorios' }

  // Construir JSON de signos vitales
  const signos_vitales = {
    "TA": presionArterial || "N/A",
    "Temp": temperatura ? `${temperatura}°C` : "N/A",
    "FC": frecuenciaCardiaca || "N/A"
  }

  const payload = {
    paciente_id,
    enfermero_id,
    turno: turno || 'matutino',
    signos_vitales,
    observaciones: notas || 'Sin observaciones',
    medicamentos_administrados: [],
    cliente_timestamp: new Date().toISOString()
  }

  const { backend: backendUrl } = getBaseUrls();

  try {
    const res = await fetch(`${backendUrl}/bitacora/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
        const errData = await res.json()
        console.error("Error en servidor al guardar bitacora:", errData)
        return { error: 'Error al guardar el registro en el servidor' }
    }

    revalidatePath('/')
    return { success: true }
  } catch (e) {
      console.error(e)
      return { error: 'Error de red al guardar el registro' }
  }
}

// Nuevas funciones para arquitectura dinámica
export async function fetchMyProfile(): Promise<UserProfile | null> {
  const { auth: authUrl } = getBaseUrls();
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null

  try {
    const res = await fetch(`${authUrl}/users/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function fetchMyModules(): Promise<Modulo[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return []

  const { auth: authUrl } = getBaseUrls();
  try {
    const res = await fetch(`${authUrl}/users/me/modules`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching modules:', error)
    return []
  }
}

// === ADMINISTRACIÓN: APLICACIONES ===
export async function fetchApps() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { auth: authUrl } = getBaseUrls();
  try {
    const res = await fetch(`${authUrl}/admin/aplicaciones`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function createApp(name: string, description: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { auth: authUrl } = getBaseUrls();
  const res = await fetch(`${authUrl}/admin/aplicaciones`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ nombre: name, descripcion: description })
  })
  if (!res.ok) throw new Error('Error al crear aplicación')
  revalidatePath('/admin/apps')
  return res.json()
}

export async function deleteApp(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { auth: authUrl } = getBaseUrls();
  const res = await fetch(`${authUrl}/admin/aplicaciones/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al eliminar aplicación')
  revalidatePath('/admin/apps')
}

// === ADMINISTRACIÓN: ROLES ===
export async function fetchRoles() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { auth: authUrl } = getBaseUrls();
  try {
    const res = await fetch(`${authUrl}/admin/roles`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function createRole(roleName: string, appId: string) {
  const { auth: authUrl } = getBaseUrls();
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const res = await fetch(`${authUrl}/admin/roles`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ nombreRol: roleName, aplicacionId: appId })
  })
  if (!res.ok) throw new Error('Error al crear rol')
  revalidatePath('/admin/roles')
  return res.json()
}

// === ADMINISTRACIÓN: AUDITORÍA ===
export async function fetchAuditLogs() {
  const { auth: authUrl } = getBaseUrls();
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  try {
    const res = await fetch(`${authUrl}/admin/audit`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

// === CLÍNICA: PACIENTES ===
export async function fetchPacientes() {
  const { backend: backendUrl } = getBaseUrls();
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  try {
    const res = await fetch(`${backendUrl}/pacientes/`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    return []
  }
}

export async function createPaciente(data: any) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { backend: backendUrl } = getBaseUrls();
  const res = await fetch(`${backendUrl}/pacientes/`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al registrar paciente')
  revalidatePath('/pacientes')
  return res.json()
}

export async function deletePaciente(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { backend: backendUrl } = getBaseUrls();
  const res = await fetch(`${backendUrl}/pacientes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al dar de alta al paciente')
  revalidatePath('/pacientes')
}

// === CLÍNICA: BITÁCORA (EXTRAS) ===
export async function deleteBitacora(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { backend: backendUrl } = getBaseUrls();
  const res = await fetch(`${backendUrl}/bitacora/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al eliminar registro')
  revalidatePath('/')
}