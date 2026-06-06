import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { BarChart3, DollarSign, Building2, Users, TrendingUp, TrendingDown } from 'lucide-react'

export default function FuerzaTrabajo() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getFuerzaTrabajo().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Calculando fuerza de trabajo...</div>
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <BarChart3 size={24} className="text-blue-600" />
        Fuerza de Trabajo
      </h2>
      <p className="text-gray-500 text-sm mb-6">Fecha de corte: {data.fecha}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-gray-400 tracking-wider mb-1">Plantilla Activa</p>
          <p className="text-3xl font-bold text-gray-900">{data.total_trabajadores_activos}</p>
          {data.total_trabajadores_baja > 0 && (
            <p className="text-xs text-red-500 mt-1">{data.total_trabajadores_baja} de baja</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-gray-400 tracking-wider mb-1">Costo Semanal Neto</p>
          <p className="text-3xl font-bold text-indigo-600">${data.costo_semanal_neto.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-gray-400 tracking-wider mb-1">Costo Diario</p>
          <p className="text-3xl font-bold text-amber-600">${data.costo_diario.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">aprox.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-gray-400 tracking-wider mb-1">Costo Mensual</p>
          <p className="text-3xl font-bold text-emerald-600">${data.costo_mensual.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-violet-600" />
            IMSS / Infonavit Semanal
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">IMSS (activos)</span>
              <span className="font-bold text-violet-600">${data.imss_semanal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Infonavit (activos)</span>
              <span className="font-bold text-blue-600">${data.infonavit_semanal.toLocaleString()}</span>
            </div>
            {data.imss_post_baja > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">IMSS (post-baja)</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 ml-2">
                    <TrendingDown size={10} />sigue corriendo
                  </span>
                </div>
                <span className="font-bold text-red-500">${data.imss_post_baja.toLocaleString()}</span>
              </div>
            )}
            {data.infonavit_post_baja > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">Infonavit (post-baja)</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 ml-2">
                    bimestral
                  </span>
                </div>
                <span className="font-bold text-amber-600">${data.infonavit_post_baja.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            Proyección Siguiente Mes
          </h3>
          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-4xl font-bold text-emerald-600">${data.proyeccion_siguiente_mes.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-2">Estimado +5% sobre costo actual</p>
            <div className="mt-4 bg-emerald-50 rounded-xl p-3 text-sm text-emerald-700 w-full">
              <p className="font-medium">Incluye:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                <li>Salarios + horas extra + bonos</li>
                <li>IMSS patronal + Infonavit</li>
                <li>IMSS/Infonavit post-baja vigentes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users size={18} className="text-gray-600" />
          Costos post-baja (trabajadores inactivos con obligaciones vigentes)
        </h3>
        <p className="text-sm text-gray-500 mb-4">Trabajadores dados de baja que aún generan costos IMSS (semanal) e Infonavit (bimestral).</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Trabajador</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Fecha Baja</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">SBC</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">IMSS</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Infonavit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Dynamically from workers with post-baja data */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
