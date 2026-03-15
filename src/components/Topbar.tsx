import { ThemeToggle } from "./ThemeToggle"
import { logoutUsuario } from "../app/actions"

export default function Topbar() {
  return (
    <header className="h-20 glass-panel border-b border-transparent rounded-none shadow-none border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 sticky top-0 z-10 flex items-center justify-between px-6 md:px-8">
      
      {/* Search Bar / Left Side */}
      <div className="flex-1 max-w-md hidden md:flex items-center relative">
        <svg className="w-5 h-5 text-slate-400 absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input 
          type="text" 
          placeholder="Buscar pacientes, camas o notas..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <div className="md:hidden flex items-center gap-3">
        {/* Mobile Logo Fallback */}
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Componente del Turno del Modo Oscuro */}
        <ThemeToggle />
        
        {/* Profile Dropdown Simulation */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-tight">Enfermera Titular</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Jornada 7:00 - 15:00</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-[#020617]">
            ET
          </div>
          <form action={logoutUsuario}>
            <button type="submit" className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Cerrar sesión">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
