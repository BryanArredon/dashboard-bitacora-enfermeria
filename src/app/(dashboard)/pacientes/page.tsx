import { fetchPacientes } from '@/app/actions'
import { UserPlus, User, Search, MapPin, Calendar, MoreVertical, Trash2 } from 'lucide-react'
import CreatePacienteForm from '@/components/CreatePacienteForm'

export default async function PacientesPage() {
  const pacientes = await fetchPacientes()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <User className="text-primary-500" />
            Gestión de Pacientes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Directorio central de pacientes registrados en la unidad</p>
        </div>
        <CreatePacienteForm />
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o CURP..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white text-sm"
          />
        </div>
        <select className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500">
           <option>Todos los estatus</option>
           <option>Activos</option>
           <option>Dados de alta</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientes.map((p: any) => (
          <div key={p.id} className="group bg-white dark:bg-[#020617] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-primary-500/40 transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-500 transition-colors">
                  <User size={28} />
                </div>
                <div className="flex gap-1">
                   <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                     <Trash2 size={18} />
                   </button>
                   <button className="p-2 text-slate-400 hover:text-primary-500">
                     <MoreVertical size={18} />
                   </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{p.nombre_completo}</h3>
              <p className="text-xs font-mono text-slate-400 mb-4">{p.curp}</p>

              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin size={14} className="text-primary-500" />
                    Cama: <span className="font-semibold text-slate-900 dark:text-slate-200">{p.numero_cama || 'S/A'}</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar size={14} className="text-primary-500" />
                    Ingreso: {new Date(p.fecha_ingreso).toLocaleDateString()}
                 </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
               <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                 p.estatus === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600'
               }`}>
                 {p.estatus === 'active' ? 'Paciente Activo' : 'Dado de Alta'}
               </span>
               <button className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                 Ver Expediente
               </button>
            </div>
          </div>
        ))}

        {pacientes.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
            <p className="text-slate-500 dark:text-slate-400">No hay pacientes registrados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
