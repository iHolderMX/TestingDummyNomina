import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Building2, Users, MapPin, BadgeCheck, XCircle } from 'lucide-react'

export default function Worksites() {
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getWorksites().then(data => { setWorksites(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando obras...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 size={24} className="text-emerald-600" />
          Obras
        </h2>
        <span className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{worksites.length} registros</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {worksites.map(ws => (
          <div key={ws.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Building2 size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={13} />
                    {ws.location}
                  </p>
                </div>
              </div>
              {ws.active ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  <BadgeCheck size={12} />Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  <XCircle size={12} />Inactivo
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-50 pt-3">
              <Users size={15} className="text-gray-400" />
              <span className="font-medium text-gray-700">{ws.worker_count}</span>
              <span>trabajadores</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
