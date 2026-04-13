import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerBitacoras, obtenerPacientes, obtenerPerfiles } from '../actions'
import BitacoraForm from '@/components/BitacoraForm'
import CheckList from '@/components/CheckList'
import DeleteBitacoraButton from '@/components/DeleteBitacoraButton'

export default async function DashboardHome() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  const registros = await obtenerBitacoras()
  const pacientes = await obtenerPacientes()
  const perfiles = await obtenerPerfiles()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPIs Level 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pacientes Activos</p>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{pacientes.length}</p>
          <div className="mt-2 flex items-center text-xs text-green-500 font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Actualizado hoy
          </div>
        </div>
        
        <div className="glass-panel p-5 relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">En Observación</p>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">8</p>
        </div>
        
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estado Crítico</p>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">3</p>
        </div>
        
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Personal en Turno</p>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{perfiles.length}</p>
        </div>
      </div>

      {/* Main Grid: Data Table (2/3) + Utility Panel (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Utility Panels (Checklist) */}
        <div className="lg:col-span-1 space-y-6 flex flex-col h-[500px]">
          <CheckList />
        </div>

        {/* Right Column: Complex Data Table & Form */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* Action Form Panel */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Nueva Captura Rápida
            </h3>
            <BitacoraForm pacientes={pacientes} perfiles={perfiles} />
          </div>

          {/* Data Table */}
          <div className="glass-panel overflow-hidden flex-1 flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white/30 dark:bg-slate-900/40">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Registros Recientes</h3>
              <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">Ver Historial Completo</button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                    <th className="px-5 py-4 border-b border-slate-200 dark:border-white/5">Paciente</th>
                    <th className="px-5 py-4 border-b border-slate-200 dark:border-white/5">Cama</th>
                    <th className="px-5 py-4 border-b border-slate-200 dark:border-white/5">Estado</th>
                    <th className="px-5 py-4 border-b border-slate-200 dark:border-white/5">Vitales Principales</th>
                    <th className="px-5 py-4 border-b border-slate-200 dark:border-white/5 text-center">Tiempo</th>
                    <th className="px-5 py-4 border-b border-slate-200 dark:border-white/5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                  {registros.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-slate-500 bg-white/20 dark:bg-slate-900/10">
                        No hay registros guardados.
                      </td>
                    </tr>
                  ) : (
                    registros.map((registro) => (
                      <tr key={registro.id} className="hover:bg-white/50 dark:hover:bg-slate-800/40 transition-colors group">
                        <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                          {registro.paciente}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-mono">{registro.cama}</span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {registro.nivelUrgencia === 'Crítico' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Crítico
                            </span>
                          )}
                          {registro.nivelUrgencia === 'Observación' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Observación
                            </span>
                          )}
                          {registro.nivelUrgencia === 'Estable' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Estable
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400 truncate max-w-[200px]" title={registro.signosVitales}>
                          {registro.signosVitales.split(',')[0]} {/* Mostrar solo el primer signo para evitar desbordar */}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center text-xs text-slate-400 dark:text-slate-500">
                          {registro.fechaStr}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <DeleteBitacoraButton id={registro.id} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
