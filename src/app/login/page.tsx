import { loginUsuario } from '../actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 glass-panel z-10 m-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
            Bitácora Médica
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Ingresa a tu cuenta para continuar</p>
        </div>

        <form action={loginUsuario} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="enfermera@hospital.com"
              className="w-full px-4 py-3 rounded-xl glass-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
            <input 
              name="password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl glass-input"
            />
          </div>

          <button 
            type="submit"
            className="w-full btn-primary py-3 text-lg mt-4 flex items-center justify-center gap-2"
          >
            Iniciar Sesión
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          Sistema Seguro de Gestión Clínica
        </p>
      </div>
    </div>
  )
}
