import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function AttendanceSummary() {
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState({ start: '2026-05-21', end: '2026-05-27' })

  useEffect(() => {
    api.getAttendanceSummary({ period_start: period.start, period_end: period.end })
      .then(data => { setSummary(data); setLoading(false) })
  }, [period])

  if (loading) return <div className="text-gray-500">Cargando resumen...</div>

  const worksites = [...new Set(summary.map(s => s.worksite_name))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Resumen de Asistencia</h2>
        <div className="flex gap-2">
          <input type="date" value={period.start} onChange={e => setPeriod(p => ({ ...p, start: e.target.value }))} className="input-field w-40" />
          <span className="text-gray-400 self-center">a</span>
          <input type="date" value={period.end} onChange={e => setPeriod(p => ({ ...p, end: e.target.value }))} className="input-field w-40" />
        </div>
      </div>

      {worksites.map(ws => (
        <div key={ws} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🏗️ {ws}</h3>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header">ID</th>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Puesto</th>
                  <th className="table-header">Sueldo Sem.</th>
                  <th className="table-header">Días Asistidos</th>
                  <th className="table-header">Faltas</th>
                </tr>
              </thead>
              <tbody>
                {summary.filter(s => s.worksite_name === ws).map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="table-cell font-mono text-xs">{s.internal_id}</td>
                    <td className="table-cell font-medium">{s.name}</td>
                    <td className="table-cell">{s.role_title}</td>
                    <td className="table-cell">${s.weekly_salary.toLocaleString()}</td>
                    <td className="table-cell">
                      <span className={`badge ${s.dias_asistidos >= 5 ? 'badge-green' : s.dias_asistidos >= 3 ? 'badge-yellow' : 'badge-red'}`}>
                        {s.dias_asistidos} de 6
                      </span>
                    </td>
                    <td className="table-cell">
                      {s.faltas > 0 ? <span className="badge badge-red">{s.faltas}</span> : <span className="badge badge-green">0</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
