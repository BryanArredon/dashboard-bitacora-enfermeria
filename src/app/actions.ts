'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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


export async function loginUsuario(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    throw new Error('Por favor, ingresa correo y contraseña')
  }

  // Set the dummy cookie (simulating session token)
  const cookieStore = await cookies()
  cookieStore.set('auth-token', 'dummy-token-' + Date.now(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  })

  // Redirect to dashboard (home)
  redirect('/')
}

export async function logoutUsuario() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  redirect('/login')
}
