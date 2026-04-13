import { getSession } from '@/lib/auth'
import { fetchMyProfile } from '@/app/actions'
import { User, Shield, Calendar, Mail, IdCard, Stethoscope } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getSession()
  const profile = await fetchMyProfile()

  if (!session || !profile) return <div>No se pudo cargar la sesión o el perfil.</div>

  const roles = profile.roles || []

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {profile.nombre ? `${profile.nombre} ${profile.apellidos}` : 'Perfil de Usuario'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona tu información profesional y permisos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Profesional */}
        <div className="bg-white dark:bg-[#020617] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-primary-600 dark:text-primary-400">
            <IdCard size={20} />
            <h2 className="font-semibold text-lg">Información Profesional</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Nombre Completo</p>
              <p className="text-lg text-slate-800 dark:text-slate-200">{profile.nombre || 'No registrado'} {profile.apellidos || ''}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">No. Empleado</p>
                <p className="text-slate-800 dark:text-slate-200 font-mono bg-slate-50 dark:bg-white/5 py-1 px-2 rounded mt-1 inline-block">
                  {profile.numeroEmpleado || 'S/N'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Especialidad</p>
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 mt-1">
                   <Stethoscope size={14} className="text-primary-500" />
                   {profile.especialidad || 'General'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Cuenta */}
        <div className="bg-white dark:bg-[#020617] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-primary-600 dark:text-primary-400">
            <Mail size={20} />
            <h2 className="font-semibold text-lg">Cuenta</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Correo Electrónico</p>
              <p className="text-lg text-slate-800 dark:text-slate-200">{profile.correo}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Estado</p>
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Validada
              </span>
            </div>
          </div>
        </div>

        {/* Roles y Permisos */}
        <div className="bg-white dark:bg-[#020617] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-primary-600 dark:text-primary-400">
            <Shield size={20} />
            <h2 className="font-semibold text-lg">Roles y Accesos Dinámicos</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Tus roles definen qué módulos del sistema puedes ver y operar.</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <span 
                  key={role}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-lg text-sm border border-slate-200 dark:border-white/10 font-medium"
                >
                  {role.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#020617] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-primary-600 dark:text-primary-400">
          <Calendar size={20} />
          <h2 className="font-semibold text-lg">Sesión</h2>
        </div>
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Tu token de seguridad fue emitido para esta sesión y expirará automáticamente.
          </p>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-400 text-sm">
            La sesión expira el: <strong>{new Date(session.exp * 1000).toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
