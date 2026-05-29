import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Payroll() {
  const [payroll, setPayroll] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState({ start: '2026-05-21', end: '2026-05-27' })
  const [editModal, setEditModal] = useState(null)
  const [correctionFields, setCorrectionFields] = useState({})
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPayroll()
  }, [period])

  const loadPayroll = () => {
    setLoading(true)
    api.getPayroll({ period_start: period.start, period_end: period.end })
      .then(data => { setPayroll(data); setLoading(false) })
  }

  const openEdit = (item) => {
    setEditModal(item)
    setCorrectionFields({})
    setReason('')
  }

  const handleFieldChange = (field, value) => {
    setCorrectionFields(prev => ({ ...prev, [field]: Number(value) || 0 }))
  }

  const handleCorrect = async () => {
    if (!Object.keys(correctionFields).length) return
    setSaving(true)
    try {
      await api.correctPayroll(editModal.id, { ...correctionFields, reason })
      setEditModal(null)
      loadPayroll()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status) => {
    const map = { calculado: 'badge-blue', corregido: 'badge-yellow', cerrado: 'badge-green' }
    return `badge ${map[status] || 'badge-gray'}`
  }

  if (loading) return <div className="text-gray-500">Cargando pre-nómina...</div>

  const worksites = [...new Set(payroll.map(p => p.worksite_name))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pre-Nómina Semanal</h2>
        <div className="flex gap-2">
          <input type="date" value={period.start} onChange={e => setPeriod(p => ({ ...p, start: e.target.value }))} className="input-field w-40" />
          <span className="text-gray-400 self-center">a</span>
          <input type="date" value={period.end} onChange={e => setPeriod(p => ({ ...p, end: e.target.value }))} className="input-field w-40" />
        </div>
      </div>

      {worksites.map(ws => {
        const wsPayroll = payroll.filter(p => p.worksite_name === ws)
        return (
          <div key={ws} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🏗️ {ws}</h3>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="table-header">Trabajador</th>
                    <th className="table-header">Sueldo Sem.</th>
                    <th className="table-header">Días J-S</th>
                    <th className="table-header">Días L-M</th>
                    <th className="table-header">HE J-D</th>
                    <th className="table-header">HE L-M</th>
                    <th className="table-header">Devengado</th>
                    <th className="table-header">Deducciones</th>
                    <th className="table-header">Neto</th>
                    <th className="table-header">Estado</th>
                    <th className="table-header"></th>
                  </tr>
                </thead>
                <tbody>
                  {wsPayroll.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="table-cell">
                        <p className="font-medium">{p.worker_name}</p>
                        <p className="text-xs text-gray-400">{p.role_title}</p>
                      </td>
                      <td className="table-cell">${p.weekly_salary.toLocaleString()}</td>
                      <td className="table-cell">{p.days_attended_jue_sab} — ${p.pay_days_jue_sab.toLocaleString()}</td>
                      <td className="table-cell">{p.days_attended_lun_mie} — ${p.pay_days_lun_mie.toLocaleString()}</td>
                      <td className="table-cell">{p.overtime_hours_jue_dom}h — ${p.overtime_pay_jue_dom.toLocaleString()}</td>
                      <td className="table-cell">{p.overtime_hours_lun_mie}h — ${p.overtime_pay_lun_mie.toLocaleString()}</td>
                      <td className="table-cell font-medium">${p.total_devengado.toLocaleString()}</td>
                      <td className="table-cell text-red-600">${p.total_deducciones.toLocaleString()}</td>
                      <td className="table-cell font-bold text-blue-600">${p.total_neto.toLocaleString()}</td>
                      <td className="table-cell">
                        <span className={getStatusBadge(p.status)}>{p.status}</span>
                      </td>
                      <td className="table-cell">
                        <button onClick={() => openEdit(p)} className="btn-secondary text-xs">Corregir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Corregir: {editModal.worker_name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Semana {editModal.period_start} / {editModal.period_end} — Obra: {editModal.worksite_name}
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Alimentos</label>
                  <input type="number" step="0.01" defaultValue={editModal.alimentos}
                    onChange={e => handleFieldChange('alimentos', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Viáticos</label>
                  <input type="number" step="0.01" defaultValue={editModal.viaticos}
                    onChange={e => handleFieldChange('viaticos', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Bono</label>
                  <input type="number" step="0.01" defaultValue={editModal.bono}
                    onChange={e => handleFieldChange('bono', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Préstamo</label>
                  <input type="number" step="0.01" defaultValue={editModal.prestamo}
                    onChange={e => handleFieldChange('prestamo', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Otros</label>
                  <input type="number" step="0.01" defaultValue={editModal.otros}
                    onChange={e => handleFieldChange('otros', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Retardos</label>
                  <input type="number" step="0.01" defaultValue={editModal.retardos}
                    onChange={e => handleFieldChange('retardos', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Cuota IMSS</label>
                  <input type="number" step="0.01" defaultValue={editModal.cuota_imss}
                    onChange={e => handleFieldChange('cuota_imss', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Infonavit</label>
                  <input type="number" step="0.01" defaultValue={editModal.infonavit}
                    onChange={e => handleFieldChange('infonavit', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">HE Jue-Dom (hrs)</label>
                  <input type="number" step="0.01" defaultValue={editModal.overtime_hours_jue_dom}
                    onChange={e => handleFieldChange('overtime_hours_jue_dom', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">HE Lun-Mié (hrs)</label>
                  <input type="number" step="0.01" defaultValue={editModal.overtime_hours_lun_mie}
                    onChange={e => handleFieldChange('overtime_hours_lun_mie', e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Motivo de corrección *</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)}
                  className="input-field" rows={2} placeholder="Ej: Ajuste de viáticos aprobado por gerencia" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleCorrect} disabled={saving || !reason} className="btn-primary flex-1">
                {saving ? 'Guardando...' : 'Guardar Corrección'}
              </button>
              <button onClick={() => setEditModal(null)} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
