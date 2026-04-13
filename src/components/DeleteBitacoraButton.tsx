'use client'

import { Trash2 } from 'lucide-react'
import { deleteBitacora } from '@/app/actions'
import { useState } from 'react'

export default function DeleteBitacoraButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return
    
    setLoading(true)
    try {
      await deleteBitacora(id)
    } catch (error) {
      alert('Error al eliminar el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Eliminar Registro"
    >
      <Trash2 size={16} />
    </button>
  )
}
