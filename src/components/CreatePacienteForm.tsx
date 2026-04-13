'use client'

import { useState } from 'react'
import { UserPlus, X, Heart, CreditCard, Bed, Calendar, User } from 'lucide-react'
import { createPaciente } from '@/app/actions'

export default function CreatePacienteForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      nombre_completo: formData.get('nombre_completo'),
      curp: formData.get('curp'),
      fecha_nacimiento: formData.get('fecha_nacimiento'),
      genero: formData.get('genero'),
      numero_cama: formData.get('numero_cama')
    }

    try {
      await createPaciente(data)
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || 'Error al registrar paciente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 whitespace-nowrap"
      >
        <UserPlus size={20} />
        Registrar Nuevo Paciente
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
                  <Heart size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-slate-900 dark:text-white">Alta de Paciente</h2>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Completa el expediente inicial del paciente</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm font-medium border border-red-200">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <User size={14} className="text-primary-500" />
                    Nombre Completo
                  </label>
                  <input
                    name="nombre_completo"
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez García"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <CreditCard size={14} className="text-primary-500" />
                    CURP
                  </label>
                  <input
                    name="curp"
                    type="text"
                    required
                    maxLength={18}
                    placeholder="ABCD123456XXXXXX00"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <Calendar size={14} className="text-primary-500" />
                    F. Nacimiento
                  </label>
                  <input
                    name="fecha_nacimiento"
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Género
                  </label>
                  <select
                    name="genero"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <Bed size={14} className="text-primary-500" />
                    No. Cama
                  </label>
                  <input
                    name="numero_cama"
                    type="text"
                    required
                    placeholder="Ej. 101-A"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20"
                >
                  {loading ? 'Registrando...' : 'Finalizar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
