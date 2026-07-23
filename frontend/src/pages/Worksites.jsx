import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Building2, Users, MapPin, ChevronDown, ChevronUp, FileText, Coins, Clock, ShieldCheck, Hash, FileBadge } from 'lucide-react'

export default function Worksites() {
  const [worksites, setWorksites] = useState([])
  const [contratosByObra, setContratosByObra] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    Promise.all([
      api.getWorksites(),
      api.getContratos(),
    ]).then(([wsData, ctosData]) => {
      setWorksites(wsData)
      const map = {}
      ctosData.forEach(c => {
        if (!map[c.obra_id]) map[c.obra_id] = []
        map[c.obra_id].push(c)
      })
      setContratosByObra(map)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando obras...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 size={24} className="text-emerald-600" />
          Obras
        </h2>
      </div>

      <div className="space-y-4">
        {worksites.map(ws => (
          <div key={ws.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setExpanded(expanded === ws.id ? null : ws.id)}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Building2 size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={13} />{ws.location}</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1"><Users size={13} />{ws.worker_count} trab.</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Activa</span>
                {expanded === ws.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </div>
            </button>

            {expanded === ws.id && (() => {
              const ctos = contratosByObra[ws.id] || []
              return (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="mt-4 mb-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <FileBadge size={13} />Contratos y SIROCs ({ctos.length})
                  </h4>
                  <div className="space-y-2">
                    {ctos.map(cto => (
                      <div key={cto.id} className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-semibold text-gray-800">{cto.numero_contrato}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Hash size={10} />{cto.siroc}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <div><span className="text-gray-400">Contratista</span><p className="text-gray-700 font-medium">{cto.contratista_name}</p></div>
                          <div><span className="text-gray-400">Cliente</span><p className="text-gray-700">{cto.cliente}</p></div>
                          <div><span className="text-gray-400">Tipo</span><p className="text-gray-600">{cto.tipo_trabajo}</p></div>
                          <div><span className="text-gray-400">Vigencia</span><p className="text-gray-600">{cto.fecha_inicio} al {cto.fecha_fin}</p></div>
                          <div><span className="text-gray-400">Monto contrato</span><p className="font-bold text-emerald-600">${cto.monto?.toLocaleString()}</p></div>
                          <div><span className="text-gray-400">Mano de obra</span><p className="text-gray-700">${cto.monto_mano_obra?.toLocaleString()}</p></div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1"><ShieldCheck size={10} />Fianza: <b className="text-indigo-600">${cto.fianza_monto?.toLocaleString()}</b> hasta {cto.fianza_vigencia}</span>
                          {cto.addendums.length > 0 && <span className="text-[10px] text-amber-600">{cto.addendums.length} addendum(s)</span>}
                        </div>
                        {cto.addendums.length > 0 && cto.addendums.map((a, i) => (
                          <div key={i} className="mt-1.5 p-2 bg-amber-50 rounded-lg text-[10px]">
                            <span className="font-medium text-amber-700 uppercase">{a.tipo}</span> — {a.fecha}
                            <span className="text-amber-600 ml-2">${a.monto_original?.toLocaleString()} → ${a.monto_nuevo?.toLocaleString()}</span>
                            <p className="text-amber-500 mt-0.5">{a.motivo}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Coins size={13} />IMSS / Infonavit (por contrato)
                  </h4>
                  <div className="space-y-1.5">
                    {ctos.map(cto => (
                      <div key={cto.id} className="flex items-center justify-between text-xs py-1">
                        <span className="text-gray-500 font-mono">{cto.numero_contrato}</span>
                        <div className="flex gap-3">
                          <span className="text-violet-600 font-medium">IMSS: ${cto.monto_imss?.toLocaleString()}</span>
                          <span className="text-blue-600 font-medium">Infonavit: ${cto.monto_infonavit?.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )
            })()}
          </div>
        ))}
      </div>
    </div>
  )
}
