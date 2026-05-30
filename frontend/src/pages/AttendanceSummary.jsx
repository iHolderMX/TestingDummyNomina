import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { CalendarCheck, Building2 } from 'lucide-react'

export default function AttendanceSummary() {
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState({ start: '2026-05-21', end: '2026-05-27' })

  useEffect(() => {
    api.getAttendanceSummary({ period_start: period.start, period_end: period.end })
      .then(data => { setSummary(data); setLoading(false) })
  }, [period])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando resumen...</div>
    </div>
  )

  const worksites = [...new Set(summary.map(s => s.worksite_name))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarCheck size={24} className="text-blue-600" />
          Resumen de Asistencia
        </h2>
        <div className="flex items-center gap-2">
          <input type="date" value={period.start} onChange={e => setPeriod(p => ({ ...p, start: e.target.value }))} className="input-field w-40" />
          <span className="text-gray-400 text-sm">a</span>
          <input type="date" value={period.end} onChange={e => setPeriod(p => ({ ...p, end: e.target.value }))} className="input-field w-40" />
        </div>
      </div>

      {worksites.map(ws => (
        <div key={ws} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600" />
            {ws}
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Puesto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sueldo Sem.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Días Asistidos</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Faltas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {summary.filter(s => s.worksite_name === ws).map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.internal_id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.role_title}</td>
                    <td className="px-4 py-3 text-gray-700">${s.weekly_salary.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        s.dias_asistidos >= 5 ? 'bg-green-50 text-green-700 border-green-200' :
                        s.dias_asistidos >= 3 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {s.dias_asistidos} de 6
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.faltas > 0
                        ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">{s.faltas}</span>
                        : <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">0</span>
                      }
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
