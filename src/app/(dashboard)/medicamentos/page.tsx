export default function MedicamentosPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Gestión de Farmacia Interna</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Control de inventario de medicamentos y programación de suministros por cama.
        </p>
      </div>

      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Módulo en Desarrollo</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Esta función conectará directamente con la Base de Inventario Hospitalario.
        </p>
        <button className="mt-8 btn-primary bg-primary-600">Requisición Nueva</button>
      </div>
    </div>
  )
}
