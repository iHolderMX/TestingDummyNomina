import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [workers, worksites, attendance, payroll] = await Promise.all([
          api.getWorkers(),
          api.getWorksites(),
          api.getAttendances({ date: '2026-05-27' }),
          api.getPayroll({ period_start: '2026-05-21', period_end: '2026-05-27' }),
        ])
        const totalDev = payroll.reduce((s, p) => s + p.total_devengado, 0)
        const totalNeto = payroll.reduce((s, p) => s + p.total_neto, 0)
        setStats({
          workers: workers.length,
          worksites: worksites.length,
          todayAttendance: attendance.filter(a => a.status === 'presente').length,
          todayFaltas: attendance.filter(a => a.status === 'falta').length,
          totalDevengado: totalDev,
          totalNeto,
          payrollCount: payroll.length,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="text-gray-500">Cargando dashboard...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
      <p className="text-gray-500 text-sm mb-6">Semana: 21-May al 27-May-2026</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-500 text-sm">Trabajadores</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.workers}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Obras activas</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.worksites}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Asistencia hoy (27-May)</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-green-600">{stats?.todayAttendance}</p>
            <span className="text-sm text-gray-400">presentes</span>
          </div>
          {stats?.todayFaltas > 0 && (
            <p className="text-xs text-red-500 mt-1">{stats.todayFaltas} faltas</p>
          )}
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Total Neto Semanal</p>
          <p className="text-3xl font-bold text-blue-600">${stats?.totalNeto?.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{stats?.payrollCount} registros</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/asistencia" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-4 text-center transition-colors">
            <span className="text-2xl">📱</span>
            <p className="text-sm font-medium text-blue-700 mt-1">Registrar Asistencia</p>
          </a>
          <a href="/trabajadores" className="block bg-green-50 hover:bg-green-100 rounded-lg p-4 text-center transition-colors">
            <span className="text-2xl">👷</span>
            <p className="text-sm font-medium text-green-700 mt-1">Ver Trabajadores</p>
          </a>
          <a href="/pre-nomina" className="block bg-purple-50 hover:bg-purple-100 rounded-lg p-4 text-center transition-colors">
            <span className="text-2xl">💰</span>
            <p className="text-sm font-medium text-purple-700 mt-1">Pre-Nómina</p>
          </a>
          <a href="/reportes" className="block bg-orange-50 hover:bg-orange-100 rounded-lg p-4 text-center transition-colors">
            <span className="text-2xl">📈</span>
            <p className="text-sm font-medium text-orange-700 mt-1">Reportes</p>
          </a>
        </div>
      </div>
    </div>
  )
}
