'use client'

import { useActionState, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { verificarCodigoAuthenticator, setupTotp } from '../actions'
import Image from 'next/image'

const initialState = { error: '' }

export default function VerificacionAuthenticatorPage({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(verificarCodigoAuthenticator, initialState)
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [qrDataUri, setQrDataUri] = useState<string | null>(null)
  const [loadingQr, setLoadingQr] = useState(true)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  // Obtener QR al montar
  useEffect(() => {
    if (!email) return
    setupTotp(email)
      .then((data) => setQrDataUri(data.qrDataUri))
      .catch((err) => console.error('Error al obtener QR:', err))
      .finally(() => setLoadingQr(false))
  }, [email])

  // Manejadores de dígitos (igual que antes)
  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const codigoCompleto = digits.join('')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl glass-panel z-10 m-4 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Columna izquierda: QR */}
          <div className="flex flex-col items-center justify-center gap-6 p-8 md:w-[45%] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-700/60">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
                Google Authenticator
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Escanea el código QR con la app
              </p>
            </div>

            <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 w-full">
              {[
                'Abre Google Authenticator en tu móvil',
                'Presiona el botón + para agregar cuenta',
                'Selecciona "Escanear código QR"',
                'Ingresa el código de 6 dígitos',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            {/* Contenedor del QR */}
            <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-2 bg-white/60 dark:bg-slate-800/40 p-2">
              {loadingQr ? (
                <div className="text-slate-400">Cargando QR...</div>
              ) : qrDataUri ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUri} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <>
                  <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="text-xs text-slate-400 dark:text-slate-500 text-center leading-tight">
                    No se pudo cargar el QR
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Columna derecha: Formulario */}
          <div className="flex flex-col justify-center p-8 md:w-[55%]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
                Verificación
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Ingresa el código de 6 dígitos que muestra la app
              </p>
            </div>

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="codigo" value={codigoCompleto} />

              {state?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Código de verificación
                </label>
                <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isPending}
                      className={`
                        w-11 h-13 text-center text-xl font-bold rounded-xl glass-input
                        focus:ring-2 focus:ring-primary-500 focus:outline-none
                        transition-all duration-150
                        ${digit ? 'text-primary-600 dark:text-primary-400' : ''}
                        disabled:opacity-70
                      `}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  El código se renueva cada 30 segundos
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending || codigoCompleto.length < 6}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending ? 'Verificando...' : (
                  <>
                    Validar Código
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Opciones secundarias */}
            <div className="mt-6 space-y-3">
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">o también</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              <button
                type="button"
                onClick={() => router.push('/verify-code')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Validar código por correo
              </button>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a iniciar sesión
              </button>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
              Sistema Seguro de Gestión Clínica
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}