import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function AttendanceQR() {
  const [worksites, setWorksites] = useState([])
  const [workers, setWorkers] = useState([])
  const [selectedWorksite, setSelectedWorksite] = useState('')
  const [selectedQR, setSelectedQR] = useState('')
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(false)

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
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Escanear QR</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Obra</label>
              <select value={selectedWorksite} onChange={e => setSelectedWorksite(e.target.value)} className="input-field">
                <option value="">Seleccionar obra...</option>
                {worksites.map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código QR</label>
              <select value={selectedQR} onChange={e => setSelectedQR(e.target.value)} className="input-field">
                <option value="">Seleccionar trabajador...</option>
                {workers.map(w => (
                  <option key={w.id} value={w.qr_code}>
                    {w.qr_code} — {w.name} ({w.role_title})
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleScan} disabled={scanning || !selectedQR || !selectedWorksite} className="btn-primary w-full text-lg py-3">
              {scanning ? 'Registrando...' : '📱 Simular Escaneo QR'}
            </button>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-lg text-sm ${
              result.status === 'ok' ? 'bg-green-50 text-green-800' :
              result.status === 'duplicate' ? 'bg-yellow-50 text-yellow-800' :
              'bg-red-50 text-red-800'
            }`}>
              <p className="font-medium">{result.message || result.status}</p>
              {result.attendance && (
                <div className="mt-2 space-y-1">
                  <p>Fecha: {result.attendance.date}</p>
                  <p>Hora: {result.attendance.entry_time}</p>
                  {result.worker_name && <p>Trabajador: {result.worker_name}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Trabajadores disponibles</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {workers.filter(w => w.active).map(w => (
              <div
                key={w.id}
                onClick={() => setSelectedQR(w.qr_code)}
                className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                  selectedQR === w.qr_code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{w.name}</p>
                    <p className="text-xs text-gray-500">{w.role_title} — {w.contractor_name || 'Directo'}</p>
                  </div>
                  <span className="badge badge-blue text-xs">{w.qr_code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
