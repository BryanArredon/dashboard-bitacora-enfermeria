import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LayoutGrid, Users, History, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getSession()
  const isAdmin = session?.authorities.includes('ROLE_ADMIN')

  if (!isAdmin) {
    redirect('/')
  }

  const managementOptions = [
    {
      title: 'Aplicaciones',
      description: 'Registra y gestiona las aplicaciones que consumen el MS-Auth.',
      icon: <LayoutGrid size={24} />,
      href: '/admin/apps',
      color: 'bg-blue-500'
    },
    {
      title: 'Roles de Usuarios',
      description: 'Asigna, remueve y crea nuevos roles para los usuarios del sistema.',
      icon: <Users size={24} />,
      href: '/admin/roles',
      color: 'bg-primary-500'
    },
    {
      title: 'Auditoría',
      description: 'Consulta el historial de acciones y modificaciones realizadas.',
      icon: <History size={24} />,
      href: '/admin/audit',
      color: 'bg-amber-500'
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel de Administración</h1>
        <p className="text-slate-500 dark:text-slate-400">Control central del Microservicio de Seguridad y Autenticación</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementOptions.map((option) => (
          <Link 
            key={option.title} 
            href={option.href}
            className="group block p-6 bg-white dark:bg-[#020617] rounded-2xl border border-slate-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-sm hover:shadow-md"
          >
            <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {option.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center justify-between">
              {option.title}
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary-500" />
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {option.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="p-8 bg-primary-500/5 dark:bg-primary-500/10 rounded-2xl border border-primary-500/20">
        <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2">Nota de Seguridad</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Todas las acciones realizadas en este panel están sujetas al sistema de auditoría. 
          Cualquier cambio en roles o aplicaciones quedará registrado con tu usuario y marca de tiempo.
        </p>
      </div>
    </div>
  )
}
