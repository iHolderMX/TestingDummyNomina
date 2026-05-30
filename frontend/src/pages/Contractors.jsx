import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Briefcase, Users, Phone, BadgeCheck, XCircle } from 'lucide-react'

export default function Contractors() {
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getContractors().then(data => { setContractors(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando contratistas...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase size={24} className="text-blue-600" />
          Contratistas
        </h2>
        <span className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{contractors.length} registros</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contractors.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Briefcase size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone size={13} />
                    {c.contact}
                  </p>
                </div>
              </div>
              {c.active ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 shrink-0">
                  <BadgeCheck size={12} />Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 shrink-0">
                  <XCircle size={12} />Inactivo
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-50 pt-3">
              <Users size={15} className="text-gray-400" />
              <span className="font-medium text-gray-700">{c.worker_count}</span>
              <span>trabajadores</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
