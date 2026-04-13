import { fetchAuditLogs } from '@/app/actions'
import { History, User, Activity, Clock, Database } from 'lucide-react'

export default async function AdminAuditPage() {
  const logs = await fetchAuditLogs()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <History className="text-primary-500" />
          Bitácora de Auditoría
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Seguimiento detallado de todas las acciones administrativas y de seguridad</p>
      </div>

      <div className="bg-white dark:bg-[#020617] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entidad</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha y Hora</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        log.accion.includes('CREATE') ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 
                        log.accion.includes('DELETE') ? 'bg-red-100 text-red-600 dark:bg-red-900/20' : 
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                      }`}>
                        <Activity size={16} />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{log.accion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <User size={14} className="text-slate-400" />
                      {log.usuario?.correo || 'Sistema'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Database size={14} className="text-slate-400" />
                       <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded-md text-xs font-mono text-slate-600 dark:text-slate-400">
                         {log.tablaAfectada}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                      <Clock size={14} />
                      {new Date(log.fechaAccion).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver JSON
                    </button>
                  </td>
                </tr>
              ))}
              
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    No se han registrado auditorías todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
