export default function ReportesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Generación de Reportes</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Exportación de sábanas informativas, historiales clínicos para directivos.
        </p>
      </div>

      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Módulo en Desarrollo</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Exportaciones e integraciones con Excel/PDF vendrán en siguientes Fases.
        </p>
        <button className="mt-8 btn-primary bg-primary-600">Preparar Reporte General</button>
      </div>
    </div>
  )
}
