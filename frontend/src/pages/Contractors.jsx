import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Briefcase, Users, Phone, ChevronDown, ChevronUp, Home, Car, Wrench } from 'lucide-react'

export default function Contractors() {
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.getContractors().then(data => { setContractors(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando contratistas...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase size={24} className="text-blue-600" />
          Contratistas
        </h2>
      </div>

      <div className="space-y-4">
        {contractors.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              className="w-full p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Briefcase size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500 flex items-center gap-1"><Phone size={13} />{c.contact}</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1"><Users size={13} />{c.worker_count} trab.</span>
                    <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {c.obras_ids?.length || 0} obras
                    </span>
                  </div>
                </div>
              </div>
              {expanded === c.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            {expanded === c.id && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Home size={13} />Casas de Renta
                    </h4>
                    {c.casas && c.casas.length > 0 ? (
                      <>
                        {c.casas.map((casa, i) => (
                          <div key={i} className="p-2.5 bg-emerald-50 rounded-lg">
                            <p className="text-xs text-gray-700 font-medium">{casa.direccion}</p>
                            <p className="text-xs text-emerald-700 font-bold mt-0.5">${casa.costo_mensual.toLocaleString()}/mes</p>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-400">Costo semanal (prorrateado)</p>
                          <p className="font-bold text-emerald-600">${Math.round(c.casas.reduce((s, ca) => s + ca.costo_mensual, 0) / 4).toLocaleString()}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-xs italic">Sin casas registradas</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Car size={13} />Viáticos
                    </h4>
                    {c.viaticos_monto ? (
                      <>
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                          <p className="text-xs text-gray-700">Monto: <span className="font-bold text-amber-700">${c.viaticos_monto.toLocaleString()}</span></p>
                          <p className="text-xs text-amber-600">Período: {c.viaticos_periodo}</p>
                        </div>
                        <p className="text-xs text-gray-400 italic">El contratista decide cómo distribuir los viáticos (boletos, gasolina, etc.)</p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-xs italic">Sin viáticos asignados</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench size={13} />Préstamo Herramienta
                    </h4>
                    {c.prestamo_herramienta ? (
                      <div className="p-2.5 bg-violet-50 rounded-lg">
                        <p className="text-xs text-gray-700">Total: <span className="font-bold text-violet-700">${c.prestamo_herramienta.monto_total.toLocaleString()}</span></p>
                        <p className="text-xs text-violet-600">Saldo: ${c.prestamo_herramienta.saldo_pendiente.toLocaleString()}</p>
                        <p className="text-xs text-violet-600">Cuota semanal: ${c.prestamo_herramienta.cuota_semanal}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs italic">Sin préstamo de herramienta</p>
                    )}
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
