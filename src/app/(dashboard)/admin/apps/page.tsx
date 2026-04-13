import { fetchApps } from '@/app/actions'
import { Plus, Trash2, Globe, Shield } from 'lucide-react'
import CreateAppForm from '@/components/CreateAppForm'

export default async function AdminAppsPage() {
  const apps = await fetchApps()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Aplicaciones</h1>
          <p className="text-slate-500 dark:text-slate-400">Controla las plataformas que integran el ecosistema</p>
        </div>
        <CreateAppForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app: any) => (
          <div key={app.id} className="group relative bg-white dark:bg-[#020617] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-primary-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Globe size={24} />
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{app.nombre}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
              {app.descripcion || 'Sin descripción disponible para esta aplicación.'}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Shield size={14} />
                ID: {app.id.substring(0, 8)}...
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Activa
              </span>
            </div>
          </div>
        ))}

        {apps.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
            <p className="text-slate-500 dark:text-slate-400">No hay aplicaciones registradas todavía.</p>
          </div>
        )}
      </div>
    </div>
  )
}
