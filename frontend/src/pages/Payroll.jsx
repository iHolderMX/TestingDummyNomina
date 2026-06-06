import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { DollarSign, Building2, ChevronDown, ChevronUp, HelpCircle, Edit3, X, Save } from 'lucide-react'

const preguntasPreNomina = [
  'ISR queda fuera del MVP o debe contemplarse?',
  'Alimentos, viaticos y bonos son por dia, por semana, por trabajador o captura libre?',
  'Cuando se cierra la pre-nomina?',
  'Quien puede reabrir o corregir un periodo cerrado?',
  'Bono de puntualidad: como se calcula?',
  'Como se muestran costos IMSS/Infonavit de trabajadores dados de baja?',
]

export default function Payroll() {
  const [payroll, setPayroll] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState({ start: '2026-05-21', end: '2026-05-27' })
  const [editModal, setEditModal] = useState(null)
  const [correctionFields, setCorrectionFields] = useState({})
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)

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
    const map = {
      calculated: 'bg-blue-50 text-blue-700 border-blue-200',
      corrected: 'bg-amber-50 text-amber-700 border-amber-200',
      cerrado: 'bg-green-50 text-green-700 border-green-200',
    }
    return `inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando pre-nómina...</div>
    </div>
  )

  const worksites = [...new Set(payroll.map(p => p.worksite_name))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign size={24} className="text-violet-600" />
          Pre-Nómina Semanal
        </h2>
        <div className="flex items-center gap-2">
          <input type="date" value={period.start} onChange={e => setPeriod(p => ({ ...p, start: e.target.value }))} className="input-field w-40" />
          <span className="text-gray-400 text-sm">a</span>
          <input type="date" value={period.end} onChange={e => setPeriod(p => ({ ...p, end: e.target.value }))} className="input-field w-40" />
        </div>
      </div>

      {worksites.map(ws => {
        const wsPayroll = payroll.filter(p => p.worksite_name === ws)
        return (
          <div key={ws} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Building2 size={18} className="text-emerald-600" />
              {ws}
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trabajador</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sueldo Sem.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Días J-S</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Días L-M</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">HE J-D</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">HE L-M</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Devengado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deducciones</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Neto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {wsPayroll.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{p.worker_name}</p>
                        <p className="text-xs text-gray-400">{p.role_title}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">${p.weekly_salary?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{p.days_attended_jue_sab || p.present_days || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{p.days_attended_lun_mie || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{p.overtime_hours_jue_dom || p.overtime_hours || '-'}h</td>
                      <td className="px-4 py-3 text-gray-600">{p.overtime_hours_lun_mie || '-'}h</td>
                      <td className="px-4 py-3 font-medium text-gray-800">${p.total_devengado.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-600">${p.total_deducciones.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">${p.total_neto.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadge(p.status)}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(p)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-violet-600 hover:bg-violet-50 px-2.5 py-1.5 rounded-lg transition-colors">
                          <Edit3 size={13} />
                          Corregir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <HelpCircle size={18} className="text-amber-500" />
            Preguntas pendientes — Pre-Nómina
            <span className="text-xs text-gray-400 font-normal ml-1">({preguntasPreNomina.length})</span>
          </div>
          {showQuestions ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {showQuestions && (
          <div className="px-5 pb-5 border-t border-gray-100">
            <ul className="mt-4 space-y-2">
              {preguntasPreNomina.map((q, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg text-sm">
                  <span className="text-amber-500 font-bold mt-0.5 shrink-0">{i + 1}.</span>
                  <span className="text-gray-700">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit3 size={18} className="text-violet-600" />
                Corregir: {editModal.worker_name}
              </h3>
              <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Semana {editModal.period_start} / {editModal.period_end} — Obra: {editModal.worksite_name}
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Alimentos', field: 'food_allowance', def: editModal.food_allowance },
                  { label: 'Viáticos', field: 'travel_allowance', def: editModal.travel_allowance },
                  { label: 'Bono', field: 'bonus', def: editModal.bonus },
                  { label: 'Préstamo', field: 'loan_deduction', def: editModal.loan_deduction },
                  { label: 'Cuota IMSS', field: 'imss_deduction', def: editModal.imss_deduction },
                  { label: 'Infonavit', field: 'infonavit_deduction', def: editModal.infonavit_deduction },
                  { label: 'HE Jue-Dom (hrs)', field: 'overtime_hours', def: editModal.overtime_hours },
                  { label: 'Base Pay', field: 'base_pay', def: editModal.base_pay },
                ].map(f => (
                  <div key={f.field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input type="number" step="0.01" defaultValue={f.def}
                      onChange={e => handleFieldChange(f.field, e.target.value)} className="input-field" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Motivo de corrección *</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)}
                  className="input-field" rows={2} placeholder="Ej: Ajuste de viáticos aprobado por gerencia" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleCorrect} disabled={saving || !reason}
                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors">
                <Save size={16} />
                {saving ? 'Guardando...' : 'Guardar Corrección'}
              </button>
              <button onClick={() => setEditModal(null)}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
