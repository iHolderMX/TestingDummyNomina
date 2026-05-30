import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Building2, Users, TrendingUp, DollarSign, CalendarDays, ChevronDown, ChevronUp, Trophy, ClipboardList } from 'lucide-react'

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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando reportes...</div>
    </div>
  )

  const tabs = [
    { key: 'overtime', label: 'Top Horas Extra', icon: Trophy },
    { key: 'netpay', label: 'Top Sueldo Neto', icon: DollarSign },
    { key: 'contractors', label: 'Contratistas x Obra', icon: ClipboardList },
    { key: 'worksites', label: 'Resumen por Obra', icon: Building2 },
    { key: 'daily', label: 'Asistencia Diaria', icon: CalendarDays },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp size={24} className="text-amber-600" />
        Reportes
      </h2>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overtime' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Top Trabajadores con Más Horas Extra
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trabajador</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Puesto</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Horas Extra</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pago HE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.overtime.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-bold text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name || item.worker_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.role_title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      {item.overtime_hours || item.total_overtime_hours || 0}h
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">${(item.overtime_pay || item.total_overtime_pay || 0)?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'netpay' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign size={18} className="text-indigo-500" />
              Top Trabajadores por Sueldo Neto
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trabajador</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Puesto</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Devengado</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deducciones</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.netPay.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-bold text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name || item.worker_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.role_title}</td>
                  <td className="px-4 py-3 text-gray-800">${(item.total_devengado || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">${(item.total_deducciones || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-indigo-600">${item.total_neto.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'contractors' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-500" />
              Contratistas por Obra
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contratista</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Obra</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trabajadores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.contractors.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.contractor_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.worksite_names || item.worksite_name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <Users size={14} className="text-gray-400" />
                      <span className="font-medium">{item.worksite_count || item.worker_count}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'worksites' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 size={18} className="text-emerald-500" />
              Resumen Financiero por Obra
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Obra</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trabajadores</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Devengado</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Deducciones</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.worksiteSum.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name || item.worksite_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.worker_count}</td>
                  <td className="px-4 py-3 text-gray-800">${item.total_devengado.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">${item.total_deducciones.toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">${item.total_neto.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'daily' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-500" />
              Asistencia Diaria
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Presentes</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Faltas</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">% Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.daily.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">{item.presentes}</span>
                  </td>
                  <td className="px-4 py-3">
                    {item.faltas > 0
                      ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">{item.faltas}</span>
                      : <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">0</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.total}</td>
                  <td className="px-4 py-3">
                    {item.total > 0
                      ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{((item.presentes / item.total) * 100).toFixed(0)}%</span>
                      : <span className="text-gray-400">N/A</span>
                    }
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
