export default function TurnosPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Calendario de Turnos</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Programación del personal de la planta, guardias, incidencias y rotaciones.
        </p>
      </div>

      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Módulo en Desarrollo</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          AQUÍ SE DEPLEGARÁ UN CALENDARIO MENSUAL COMPLETO EN EL FUTURO.
        </p>
      </div>
    </div>
  )
}
