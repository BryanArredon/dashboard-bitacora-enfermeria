'use client'

import { useActionState, useRef, useState, useEffect } from 'react'
import { verifyMfa } from '../actions'

const initialState = {
  error: '',
}

export default function VerifyCodePage() {
  const [state, formAction, isPending] = useActionState(verifyMfa, initialState)
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutos

  // Temporizador visual (solo cuenta regresiva, sin acción al llegar a 0)
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 glass-panel z-10 m-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
            Verificación
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Ingresa el código de 6 dígitos enviado a tu correo
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Campo oculto con el OTP */}
          <input type="hidden" name="otp" value={codigoCompleto} />

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
                    w-12 h-14 text-center text-xl font-bold rounded-xl glass-input
                    focus:ring-2 focus:ring-primary-500 focus:outline-none
                    transition-all duration-150
                    ${digit ? 'text-primary-600 dark:text-primary-400' : ''}
                    disabled:opacity-70
                  `}
                />
              ))}
            </div>
          </div>

          {/* Temporizador visual (solo informativo) */}
          <div className="flex justify-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              {timeLeft > 0 ? (
                <>Código válido por: <span className={`font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-primary-600 dark:text-primary-400'}`}>{formatTime(timeLeft)}</span></>
              ) : (
                <span className="text-red-500">El código ha expirado. Debes iniciar sesión nuevamente.</span>
              )}
            </span>
          </div>

          <div className="text-center">
            <a href="/auth-user" className="text-sm text-primary-600 dark:text-primary-400 hover:underline transition-colors">
              Probar otro método
            </a>
          </div>
          
          <button
            type="submit"
            disabled={isPending || codigoCompleto.length < 6 || timeLeft === 0}
            className="w-full btn-primary py-3 text-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isPending ? 'Verificando...' : (
              <>
                Verificar Código
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          <a href="/login" className="text-primary-600 hover:underline">
            ← Volver al inicio de sesión
          </a>
        </p>
      </div>
    </div>
  )
}