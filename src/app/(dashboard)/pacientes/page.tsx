export default function PacientesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Directorio de Pacientes</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Listado y gestión completa del expediente clínico de los pacientes ingresados.
        </p>
      </div>

      <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Módulo en Desarrollo</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Esta sección albergará el CRM interno hospitalario.
        </p>
        <button className="mt-8 btn-primary">Nuevo Ingreso</button>
      </div>
    </div>
  )
}
