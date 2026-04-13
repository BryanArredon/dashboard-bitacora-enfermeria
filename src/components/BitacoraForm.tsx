'use client'

import { useActionState } from 'react'
import { guardarBitacora } from '../app/actions'

interface BitacoraFormProps {
  pacientes: any[]
  perfiles: any[]
}

export default function BitacoraForm({ pacientes, perfiles }: BitacoraFormProps) {
  // En Next 15/React 19, usamos useActionState en lugar de useFormState
  const [state, formAction, isPending] = useActionState(guardarBitacora, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl text-sm">
          Registro guardado exitosamente.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Paciente</label>
          <select 
            name="paciente_id"
            required
            className="w-full px-3 py-2 text-sm rounded-lg glass-input bg-transparent"
          >
            <option value="" disabled selected>Selecciona un paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id} className="text-slate-800">
                {p.nombre_completo} {p.numero_cama ? `(Cama ${p.numero_cama})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Enfermero(a)</label>
          <select 
            name="enfermero_id"
            required
            className="w-full px-3 py-2 text-sm rounded-lg glass-input bg-transparent"
          >
            <option value="" disabled selected>Enfermero(a) a cargo</option>
            {perfiles.map((p) => (
              <option key={p.id} value={p.id} className="text-slate-800">
                {p.nombre_completo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Signos Vitales</label>
        <div className="grid grid-cols-3 gap-3">
          <input 
            type="text" 
            name="presionArterial"
            placeholder="TA (ej. 120/80)"
            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
          />
          <input 
            type="number" 
            step="0.1"
            name="temperatura"
            placeholder="Temp (°C)"
            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
          />
          <input 
            type="number" 
            name="frecuenciaCardiaca"
            placeholder="FC (bpm)"
            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Notas de Evolución</label>
        <textarea 
          name="notas"
          rows={3}
          required
          placeholder="Medicamentos administrados, observaciones..."
          className="w-full px-3 py-2 text-sm rounded-lg glass-input resize-none"
        ></textarea>
      </div>

      <div className="space-y-2 pb-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Turno</label>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="turno" value="matutino" className="accent-blue-500 w-4 h-4" defaultChecked />
            <span className="text-sm text-slate-700 dark:text-slate-300">Matutino</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="turno" value="vespertino" className="accent-amber-500 w-4 h-4" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Vespertino</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="turno" value="nocturno" className="accent-indigo-500 w-4 h-4" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Nocturno</span>
          </label>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="btn-primary flex items-center gap-2 py-2 px-6 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar Registro'}
          {!isPending && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}
