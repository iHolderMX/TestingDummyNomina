import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Contractors() {
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getContractors().then(data => { setContractors(data); setLoading(false) })
  }, [])

  if (loading) return <div className="text-gray-500">Cargando contratistas...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contratistas</h2>
        <span className="badge badge-blue">{contractors.length} registros</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contractors.map(c => (
          <div key={c.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.contact}</p>
              </div>
              {c.active ? <span className="badge badge-green">Activo</span> : <span className="badge badge-red">Inactivo</span>}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👷 {c.worker_count} trabajadores</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
