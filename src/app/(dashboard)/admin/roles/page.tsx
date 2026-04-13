import { fetchRoles, fetchApps } from '@/app/actions'
import { Plus, ShieldCheck, Briefcase, UserPlus } from 'lucide-react'
import CreateRoleForm from '@/components/CreateRoleForm'

export default async function AdminRolesPage() {
  const roles = await fetchRoles()
  const apps = await fetchApps()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-primary-500" />
            Catálogo de Roles
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Gestiona los privilegios y accesos por aplicación</p>
        </div>
        <CreateRoleForm apps={apps} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role: any) => (
          <div key={role.id} className="bg-white dark:bg-[#020617] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm border-l-4 border-l-primary-500">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{role.nombreRol}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <Briefcase size={12} />
                    {role.aplicacion?.nombre || 'General'}
                  </div>
               </div>
               <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-lg text-primary-600 dark:text-primary-400">
                 <ShieldCheck size={20} />
               </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex gap-2">
               <button className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                 <UserPlus size={14} />
                 Asignar
               </button>
            </div>
          </div>
        ))}

        {roles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
            <p className="text-slate-500 dark:text-slate-400">No hay roles definidos todavía.</p>
          </div>
        )}
      </div>
    </div>
  )
}
