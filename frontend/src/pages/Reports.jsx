import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Reports() {
  const [data, setData] = useState({ contractors: [], overtime: [], netPay: [], worksiteSum: [], contractorSum: [], daily: [] })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overtime')
  const period = { start: '2026-05-21', end: '2026-05-27' }

  useEffect(() => {
    Promise.all([
      api.getContractorsByWorksites(),
      api.getTopOvertime(period),
      api.getTopNetPay(period),
      api.getWorksiteSummary(period),
      api.getContractorPayrollSummary(period),
      api.getDailyAttendanceSummary(period),
    ]).then(([c, o, n, w, cs, d]) => {
      setData({ contractors: c, overtime: o, netPay: n, worksiteSum: w, contractorSum: cs, daily: d })
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-gray-500">Cargando reportes...</div>

  const tabs = [
    { key: 'overtime', label: 'Top Horas Extra' },
    { key: 'netpay', label: 'Top Sueldo Neto' },
    { key: 'contractors', label: 'Contratistas x Obra' },
    { key: 'worksites', label: 'Resumen por Obra' },
    { key: 'daily', label: 'Asistencia Diaria' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reportes</h2>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overtime' && (
        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-4">🏆 Top Trabajadores con Más Horas Extra</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">#</th>
                <th className="table-header">Trabajador</th>
                <th className="table-header">Puesto</th>
                <th className="table-header">Obra</th>
                <th className="table-header">Horas Extra</th>
                <th className="table-header">Pago HE</th>
              </tr>
            </thead>
            <tbody>
              {data.overtime.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell font-bold">{i + 1}</td>
                  <td className="table-cell font-medium">{item.worker_name}</td>
                  <td className="table-cell">{item.role_title}</td>
                  <td className="table-cell">{item.worksite_name}</td>
                  <td className="table-cell">
                    <span className="badge badge-yellow">{item.total_overtime_hours}h</span>
                  </td>
                  <td className="table-cell font-medium">${item.total_overtime_pay?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'netpay' && (
        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-4">💰 Top Trabajadores por Sueldo Neto</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">#</th>
                <th className="table-header">Trabajador</th>
                <th className="table-header">Puesto</th>
                <th className="table-header">Obra</th>
                <th className="table-header">Contratista</th>
                <th className="table-header">Devengado</th>
                <th className="table-header">Deducciones</th>
                <th className="table-header">Neto</th>
              </tr>
            </thead>
            <tbody>
              {data.netPay.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell font-bold">{i + 1}</td>
                  <td className="table-cell font-medium">{item.worker_name}</td>
                  <td className="table-cell">{item.role_title}</td>
                  <td className="table-cell">{item.worksite_name}</td>
                  <td className="table-cell">{item.contractor_name || 'Directo'}</td>
                  <td className="table-cell">${item.total_devengado.toLocaleString()}</td>
                  <td className="table-cell text-red-600">${item.total_deducciones.toLocaleString()}</td>
                  <td className="table-cell font-bold text-blue-600">${item.total_neto.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'contractors' && (
        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-4">📋 Contratistas con Más Obras</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Contratista</th>
                <th className="table-header">Obras</th>
                <th className="table-header">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {data.contractors.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell font-medium">{item.contractor_name}</td>
                  <td className="table-cell">
                    <span className="badge badge-blue">{item.worksite_count}</span>
                  </td>
                  <td className="table-cell text-sm text-gray-500">{item.worksite_names}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'worksites' && (
        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-4">🏗️ Resumen Financiero por Obra</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Obra</th>
                <th className="table-header">Trabajadores</th>
                <th className="table-header">Total Devengado</th>
                <th className="table-header">Total Deducciones</th>
                <th className="table-header">Total Neto</th>
                <th className="table-header">Días Totales</th>
              </tr>
            </thead>
            <tbody>
              {data.worksiteSum.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell font-medium">{item.worksite_name}</td>
                  <td className="table-cell">{item.worker_count}</td>
                  <td className="table-cell">${item.total_devengado.toLocaleString()}</td>
                  <td className="table-cell text-red-600">${item.total_deducciones.toLocaleString()}</td>
                  <td className="table-cell font-bold text-blue-600">${item.total_neto.toLocaleString()}</td>
                  <td className="table-cell">{item.total_days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'daily' && (
        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-4">📅 Asistencia Diaria</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Fecha</th>
                <th className="table-header">Presentes</th>
                <th className="table-header">Faltas</th>
                <th className="table-header">Total</th>
                <th className="table-header">% Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {data.daily.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell font-medium">{item.date}</td>
                  <td className="table-cell">
                    <span className="badge badge-green">{item.presentes}</span>
                  </td>
                  <td className="table-cell">
                    {item.faltas > 0 ? <span className="badge badge-red">{item.faltas}</span> : <span className="badge badge-green">0</span>}
                  </td>
                  <td className="table-cell">{item.total}</td>
                  <td className="table-cell">
                    {item.total > 0 ? ((item.presentes / item.total) * 100).toFixed(0) + '%' : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
