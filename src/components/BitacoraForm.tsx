'use client'

import { useActionState } from 'react'
import { guardarBitacora } from '../app/actions'

export default function BitacoraForm() {
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
          <input 
            type="text" 
            name="paciente"
            required
            placeholder="Ej. González, A."
            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Cama #</label>
          <input 
            type="text" 
            name="cama"
            required
            placeholder="Ej. 102"
            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Signos Vitales</label>
        <input 
          type="text" 
          name="signosVitales"
          placeholder="Ej. TA 120/80, Temp 37°C"
          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Notas de Evolución</label>
        <textarea 
          name="notas"
          rows={3}
          placeholder="Medicamentos administrados, observaciones..."
          className="w-full px-3 py-2 text-sm rounded-lg glass-input resize-none"
        ></textarea>
      </div>

      <div className="space-y-2 pb-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Nivel de Urgencia</label>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="urgencia" value="Estable" className="accent-green-500 w-4 h-4" defaultChecked />
            <span className="text-sm text-slate-700 dark:text-slate-300">Estable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="urgencia" value="Observación" className="accent-amber-500 w-4 h-4" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Observación</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="urgencia" value="Crítico" className="accent-red-500 w-4 h-4" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Crítico</span>
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
