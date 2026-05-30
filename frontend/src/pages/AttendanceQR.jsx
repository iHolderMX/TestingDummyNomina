import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { QrCode, ChevronDown, ChevronUp, HelpCircle, MapPin, User, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

const preguntasAsistencia = [
  '¿La confirmación posterior al QR será requerida o el QR basta?',
  '¿Qué pasa si el QR se escanea en la obra incorrecta?',
  '¿Qué pasa si el trabajador no está asignado a la obra?',
  '¿Debe funcionar offline?',
  '¿Debe validarse dispositivo autorizado?',
  '¿Cómo se distingue baja, salida y cambio de obra?',
  '¿Qué evidencia se conserva además del QR?',
]

export default function AttendanceQR() {
  const [worksites, setWorksites] = useState([])
  const [workers, setWorkers] = useState([])
  const [selectedWorksite, setSelectedWorksite] = useState('')
  const [selectedQR, setSelectedQR] = useState('')
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)

  useEffect(() => {
    api.getWorksites().then(setWorksites)
    api.getWorkers().then(setWorkers)
  }, [])

  const handleScan = async () => {
    if (!selectedQR || !selectedWorksite) return
    setScanning(true)
    setResult(null)
    try {
      const data = await api.scanQR(selectedQR, Number(selectedWorksite))
      setResult(data)
    } catch (e) {
      setResult({ status: 'error', message: e.message })
    } finally {
      setScanning(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro de Asistencia por QR</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <QrCode size={18} className="text-blue-600" />
            Escanear QR
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" />
                Obra
              </label>
              <select value={selectedWorksite} onChange={e => setSelectedWorksite(e.target.value)} className="input-field">
                <option value="">Seleccionar obra...</option>
                {worksites.map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <User size={14} className="text-gray-400" />
                Código QR
              </label>
              <select value={selectedQR} onChange={e => setSelectedQR(e.target.value)} className="input-field">
                <option value="">Seleccionar trabajador...</option>
                {workers.map(w => (
                  <option key={w.id} value={w.qr_code}>
                    {w.qr_code} — {w.name} ({w.role_title})
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleScan} disabled={scanning || !selectedQR || !selectedWorksite}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl text-sm transition-colors">
              <QrCode size={18} />
              {scanning ? 'Registrando...' : 'Simular Escaneo QR'}
            </button>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-xl text-sm border ${
              result.status === 'ok' ? 'bg-green-50 border-green-200 text-green-800' :
              result.status === 'duplicate' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2 font-medium mb-1">
                {result.status === 'ok' ? <CheckCircle2 size={16} /> :
                 result.status === 'duplicate' ? <AlertTriangle size={16} /> :
                 <XCircle size={16} />}
                {result.status === 'ok' ? 'Registro exitoso' : result.message}
              </div>
              {result.attendance && (
                <div className="mt-2 space-y-1 text-xs">
                  <p>Fecha: {result.attendance.date}</p>
                  <p>Hora: {result.attendance.entry_time}</p>
                  {result.worker_name && <p>Trabajador: {result.worker_name}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={18} className="text-blue-600" />
            Trabajadores disponibles
          </h3>
          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {workers.filter(w => w.active).map(w => (
              <div
                key={w.id}
                onClick={() => setSelectedQR(w.qr_code)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedQR === w.qr_code
                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{w.name}</p>
                    <p className="text-xs text-gray-500">{w.role_title} — {w.contractor_name || 'Directo'}</p>
                  </div>
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{w.qr_code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <HelpCircle size={18} className="text-amber-500" />
            Preguntas pendientes — Asistencia
            <span className="text-xs text-gray-400 font-normal ml-1">({preguntasAsistencia.length})</span>
          </div>
          {showQuestions ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {showQuestions && (
          <div className="px-5 pb-5 border-t border-gray-100">
            <ul className="mt-4 space-y-2">
              {preguntasAsistencia.map((q, i) => (
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
