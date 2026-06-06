import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Users, BadgeCheck, XCircle, Phone, MapPin, ShieldCheck, AlertTriangle, DollarSign } from 'lucide-react'

export default function Workers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.getWorkers().then(data => { setWorkers(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando trabajadores...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Trabajadores
          </h2>
          <p className="text-gray-500 text-sm mt-1">10 registros — clic en un trabajador para ver detalle</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Puesto</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SBC</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Obras</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contrato</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {workers.map(w => (
              <tr key={w.id} onClick={() => setSelected(selected?.id === w.id ? null : w)}
                className={`cursor-pointer transition-colors ${selected?.id === w.id ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                <td className="px-3 py-3 font-mono text-xs text-gray-500">{w.internal_id}</td>
                <td className="px-3 py-3 font-medium text-gray-900">{w.name}</td>
                <td className="px-3 py-3 text-gray-600 text-sm">{w.role_title}</td>
                <td className="px-3 py-3 font-mono text-sm text-gray-700">${w.sbc}<span className="text-xs text-gray-400">/día</span></td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {w.obra_ids.length > 0 ? w.obra_ids.map(oid => (
                      <span key={oid} className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Obra {oid}
                      </span>
                    )) : (
                      <span className="text-xs text-gray-400 italic">Sin obra</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {w.tiene_contrato
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><BadgeCheck size={11} />Sí</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"><XCircle size={11} />No</span>
                  }
                </td>
                <td className="px-3 py-3">
                  {w.active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><BadgeCheck size={11} />Activo</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><XCircle size={11} />Baja {w.fecha_baja}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="mt-6 bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-blue-50/30">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Detalle: {selected.name} <span className="text-xs text-gray-400 font-normal">({selected.internal_id})</span>
            </h3>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={13} />Datos Personales
              </h4>
              <div><span className="text-gray-400">NSS</span><p className="font-mono text-gray-800 font-medium">{selected.nss}</p></div>
              <div><span className="text-gray-400">RFC</span><p className="font-mono text-gray-800 font-medium">{selected.rfc}</p></div>
              <div><span className="text-gray-400">CURP</span><p className="font-mono text-xs text-gray-800 font-medium">{selected.curp}</p></div>
              <div><span className="text-gray-400">Domicilio</span><p className="text-gray-700 flex items-center gap-1"><MapPin size={12} className="text-gray-400" />{selected.domicilio}</p></div>
              <div><span className="text-gray-400">Tel. Emergencia</span><p className="text-gray-700 flex items-center gap-1"><Phone size={12} className="text-gray-400" />{selected.telefono_emergencia}</p></div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={13} />Datos Laborales
              </h4>
              <div><span className="text-gray-400">Sueldo Semanal</span><p className="font-bold text-gray-800">${selected.weekly_salary.toLocaleString()}</p></div>
              <div><span className="text-gray-400">Sueldo Diario</span><p className="text-gray-700">${selected.daily_salary}</p></div>
              <div><span className="text-gray-400">SBC</span><p className="text-gray-700">${selected.sbc}/día</p></div>
              <div><span className="text-gray-400">Registro Patronal</span><p className="font-mono text-gray-800">{selected.registro_patronal}</p></div>
              <div><span className="text-gray-400">Tiene contrato</span><p>{selected.tiene_contrato ? 'Sí' : 'No'}</p></div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} />DS3 & Obras
              </h4>
              <div>
                <span className="text-gray-400">DS3</span>
                <p>{selected.ds3_activo
                  ? <span className="inline-flex items-center gap-1 text-green-700"><BadgeCheck size={12} />Activo — vence {selected.ds3_vigencia}</span>
                  : <span className="inline-flex items-center gap-1 text-red-600"><XCircle size={12} />Sin DS3 activo</span>
                }</p>
              </div>
              <div>
                <span className="text-gray-400">Obras asignadas</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {selected.obra_ids.length > 0 ? selected.obra_ids.map(oid => (
                    <span key={oid} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Obra {oid}</span>
                  )) : <span className="text-gray-400 italic text-xs">Administrativo (sin obra)</span>}
                </div>
              </div>
              {selected.incapacidades && selected.incapacidades.length > 0 && (
                <div>
                  <span className="text-gray-400 flex items-center gap-1"><AlertTriangle size={12} className="text-amber-500" />Incapacidades</span>
                  {selected.incapacidades.map((inc, i) => (
                    <p key={i} className="text-xs text-amber-700 mt-0.5">{inc.tipo}: {inc.fecha_inicio} al {inc.fecha_fin} — {inc.justificante}</p>
                  ))}
                </div>
              )}
              {!selected.active && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg text-xs">
                  <p className="font-medium text-red-700">Trabajador de baja ({selected.fecha_baja})</p>
                  {selected.imss_post_baja && <p className="text-red-600 mt-1">IMSS semanal sigue corriendo</p>}
                  {selected.infonavit_post_baja && <p className="text-red-600">Infonavit bimestral vigente</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
