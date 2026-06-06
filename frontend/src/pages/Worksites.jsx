import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Building2, Users, MapPin, ChevronDown, ChevronUp, FileText, Coins, Clock, ShieldCheck } from 'lucide-react'

export default function Worksites() {
  const [worksites, setWorksites] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.getWorksites().then(data => { setWorksites(data); setLoading(false) })
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

            {expanded === ws.id && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={13} />Contrato
                    </h4>
                    <div><span className="text-gray-400">Número</span><p className="font-mono font-medium text-gray-800">{ws.numero_contrato}</p></div>
                    <div><span className="text-gray-400">Cliente</span><p className="text-gray-700">{ws.cliente}</p></div>
                    <div><span className="text-gray-400">Monto contrato</span><p className="font-bold text-emerald-600">${ws.monto_contrato?.toLocaleString()}</p></div>
                    <div><span className="text-gray-400">Mano de obra</span><p className="text-gray-700">${ws.monto_mano_obra?.toLocaleString()}</p></div>
                    <div><span className="text-gray-400">ZIroc g</span><p className="font-mono text-gray-800">{ws.numero_ziroc}</p></div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={13} />Fianzas
                    </h4>
                    <div><span className="text-gray-400">Monto</span><p className="font-bold text-indigo-600">${ws.fianza_monto?.toLocaleString()}</p></div>
                    <div><span className="text-gray-400">Vigencia</span><p className="text-gray-700">{ws.fianza_vigencia}</p></div>
                    {ws.addendums && ws.addendums.length > 0 && (
                      <div>
                        <span className="text-gray-400">Addendums</span>
                        {ws.addendums.map((a, i) => (
                          <div key={i} className="mt-1.5 p-2 bg-amber-50 rounded-lg text-xs">
                            <p className="font-medium text-amber-700">{a.tipo} — {a.fecha}</p>
                            <p className="text-amber-600">${a.monto_original?.toLocaleString()} → ${a.monto_nuevo?.toLocaleString()}</p>
                            <p className="text-amber-500 mt-0.5">{a.motivo}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Coins size={13} />IMSS / Infonavit
                    </h4>
                    <div><span className="text-gray-400">IMSS (contrato)</span><p className="font-bold text-violet-600">${ws.monto_imss?.toLocaleString()}</p></div>
                    <div><span className="text-gray-400">Infonavit (contrato)</span><p className="font-bold text-blue-600">${ws.monto_infonavit?.toLocaleString()}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
