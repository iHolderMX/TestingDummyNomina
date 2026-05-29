import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Workers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getWorkers().then(data => { setWorkers(data); setLoading(false) })
  }, [])

  if (loading) return <div className="text-gray-500">Cargando trabajadores...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trabajadores</h2>
        <span className="badge badge-blue">{workers.length} registros</span>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="table-header">ID</th>
              <th className="table-header">Nombre</th>
              <th className="table-header">Puesto</th>
              <th className="table-header">Sueldo Sem.</th>
              <th className="table-header">Contratista</th>
              <th className="table-header">QR</th>
              <th className="table-header">Estado</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="table-cell font-mono text-xs">{w.internal_id}</td>
                <td className="table-cell font-medium">{w.name}</td>
                <td className="table-cell">{w.role_title}</td>
                <td className="table-cell">${w.weekly_salary.toLocaleString()}</td>
                <td className="table-cell">{w.contractor_name || 'Directo'}</td>
                <td className="table-cell font-mono text-xs">{w.qr_code}</td>
                <td className="table-cell">
                  {w.active ? <span className="badge badge-green">Activo</span> : <span className="badge badge-red">Inactivo</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
