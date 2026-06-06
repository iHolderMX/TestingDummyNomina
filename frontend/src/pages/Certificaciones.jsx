import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { FileBadge, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react'

const estadoConfig = {
  vigente: { icon: CheckCircle2, color: 'bg-green-50 text-green-700 border-green-200', label: 'Vigente' },
  por_vencer: { icon: AlertTriangle, color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Por vencer' },
  vencido: { icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200', label: 'Vencido' },
  pendiente: { icon: Clock, color: 'bg-gray-50 text-gray-600 border-gray-200', label: 'Pendiente' },
}

export default function Certificaciones() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCertificacionesDS3().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando certificaciones...</div>
    </div>
  )

  const stats = {
    total: data.length,
    vigentes: data.filter(d => d.estado === 'vigente').length,
    porVencer: data.filter(d => d.estado === 'por_vencer').length,
    vencidos: data.filter(d => d.estado === 'vencido').length,
    pendientes: data.filter(d => d.estado === 'pendiente').length,
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <FileBadge size={24} className="text-blue-600" />
        Certificaciones DS3
      </h2>
      <p className="text-gray-500 text-sm mb-6">Control de certificados DS3 por trabajador. Vigencia aproximada de 1 año. Se debe renovar al cambiar de obra.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <p className="text-xs text-green-600 uppercase tracking-wider font-medium">Vigentes</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.vigentes}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-xs text-amber-600 uppercase tracking-wider font-medium">Por vencer</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{stats.porVencer}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <p className="text-xs text-red-600 uppercase tracking-wider font-medium">Vencidos</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{stats.vencidos}</p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Pendientes</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.pendientes}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trabajador</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Norma</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vigencia</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Días restantes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, i) => {
              const cfg = estadoConfig[item.estado]
              const Icon = cfg.icon
              return (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.internal_id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.worker_name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{item.ds3_norma || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.ds3_vigencia || '-'}</td>
                  <td className="px-4 py-3">
                    {item.dias_restantes !== null ? (
                      <span className={`font-mono text-sm font-medium ${
                        item.dias_restantes <= 0 ? 'text-red-600' :
                        item.dias_restantes <= 30 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {item.dias_restantes} días
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                      <Icon size={12} />{cfg.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
