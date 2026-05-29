import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Worksites() {
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getWorksites().then(data => { setWorksites(data); setLoading(false) })
  }, [])

  if (loading) return <div className="text-gray-500">Cargando obras...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Obras</h2>
        <span className="badge badge-blue">{worksites.length} registros</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {worksites.map(ws => (
          <div key={ws.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                <p className="text-sm text-gray-500">{ws.location}</p>
              </div>
              {ws.active ? <span className="badge badge-green">Activo</span> : <span className="badge badge-red">Inactivo</span>}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👷 {ws.worker_count} trabajadores</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
