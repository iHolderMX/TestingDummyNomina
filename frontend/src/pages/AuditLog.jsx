import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function AuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAuditLog({ limit: 50 })
      .then(data => { setLogs(data); setLoading(false) })
  }, [])

  if (loading) return <div className="text-gray-500">Cargando auditoría...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Auditoría de Cambios</h2>
      <p className="text-gray-500 text-sm mb-6">Registro de todas las correcciones manuales que afectan asistencia, devengados, deducciones o total neto.</p>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="table-header">Fecha</th>
              <th className="table-header">Usuario</th>
              <th className="table-header">Entidad</th>
              <th className="table-header">Campo</th>
              <th className="table-header">Anterior</th>
              <th className="table-header">Nuevo</th>
              <th className="table-header">Motivo</th>
              <th className="table-header">Período</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={8} className="table-cell text-center text-gray-400">Sin registros de auditoría</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="table-cell text-xs">{new Date(log.created_at + 'Z').toLocaleString()}</td>
                  <td className="table-cell font-medium">{log.user_name}</td>
                  <td className="table-cell">
                    <span className={`badge ${
                      log.entity_type === 'payroll' ? 'badge-blue' :
                      log.entity_type === 'attendance' ? 'badge-yellow' : 'badge-green'
                    }`}>{log.entity_type}</span>
                  </td>
                  <td className="table-cell font-mono text-xs">{log.field_name}</td>
                  <td className="table-cell text-red-600 font-mono text-xs">{log.old_value}</td>
                  <td className="table-cell text-green-600 font-mono text-xs">{log.new_value}</td>
                  <td className="table-cell max-w-[200px] truncate">{log.reason}</td>
                  <td className="table-cell text-xs">{log.period}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
