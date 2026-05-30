import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { ShieldCheck, ChevronDown, ChevronUp, HelpCircle, Clock, User, Tag, ArrowRightLeft, FileText } from 'lucide-react'

const preguntasSeguridad = [
  '¿Qué roles pueden ver sueldos?',
  '¿Qué roles pueden modificar deducciones?',
  '¿Qué roles pueden corregir asistencia?',
  '¿Qué datos personales son obligatorios?',
  '¿Cuánto tiempo se conservan asistencias y auditoría?',
]

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQuestions, setShowQuestions] = useState(false)

  useEffect(() => {
    api.getAuditLog({ limit: 50 })
      .then(data => { setLogs(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando auditoría...</div>
    </div>
  )

  const entityColors = {
    payroll: 'bg-blue-50 text-blue-700 border-blue-200',
    attendance: 'bg-amber-50 text-amber-700 border-amber-200',
    worker: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <ShieldCheck size={24} className="text-gray-700" />
        Auditoría de Cambios
      </h2>
      <p className="text-gray-500 text-sm mb-6">Registro de todas las correcciones manuales que afectan asistencia, devengados, deducciones o total neto.</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><Clock size={13} />Fecha</div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><User size={13} />Usuario</div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><Tag size={13} />Entidad</div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Anterior</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nuevo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><FileText size={13} />Motivo</div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Sin registros de auditoría</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.created_at + 'Z').toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{log.user_name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${entityColors[log.entity_type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {log.entity_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{log.field_name}</td>
                  <td className="px-4 py-3 text-red-600 font-mono text-xs">{log.old_value}</td>
                  <td className="px-4 py-3 text-green-600 font-mono text-xs">{log.new_value}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-gray-600">{log.reason}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{log.period}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <HelpCircle size={18} className="text-amber-500" />
            Preguntas pendientes — Seguridad y Control
            <span className="text-xs text-gray-400 font-normal ml-1">({preguntasSeguridad.length})</span>
          </div>
          {showQuestions ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {showQuestions && (
          <div className="px-5 pb-5 border-t border-gray-100">
            <ul className="mt-4 space-y-2">
              {preguntasSeguridad.map((q, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg text-sm">
                  <span className="text-amber-500 font-bold mt-0.5 shrink-0">{i + 1}.</span>
                  <span className="text-gray-700">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
