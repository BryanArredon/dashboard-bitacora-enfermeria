'use client'

import { useState } from 'react'

export default function CheckList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Revisión de catéter Cama 104', done: false, urgent: true },
    { id: 2, text: 'Entrega de turno a las 15:00', done: false, urgent: false },
    { id: 3, text: 'Administración de antibióticos Sala B', done: true, urgent: false },
    { id: 4, text: 'Actualizar expediente de Pérez, M.', done: false, urgent: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const completed = tasks.filter(t => t.done).length
  const progress = Math.round((completed / tasks.length) * 100)

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            Tareas del Turno
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{completed} de {tasks.length} completadas</p>
        </div>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-6">
        <div className="bg-primary-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex-1 space-y-3">
        {tasks.map((task) => (
          <label 
            key={task.id} 
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
              task.done 
                ? 'bg-slate-50 border-transparent dark:bg-white/5 opacity-60' 
                : 'bg-white border-slate-200 shadow-sm dark:bg-slate-900/50 dark:border-white/10 hover:border-primary-500/50'
            }`}
          >
            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              task.done 
                ? 'bg-primary-500 border-primary-500 text-white' 
                : 'border-slate-300 dark:border-slate-600 bg-transparent'
            }`}>
              {task.done && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            <div className="flex-1 text-sm">
              <span className={`block ${task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                {task.text}
              </span>
              {task.urgent && !task.done && (
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded">
                  Urgente
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
