import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Users, Building2, CalendarCheck, DollarSign, QrCode, TrendingUp, ArrowRight } from 'lucide-react'

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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando dashboard...</div>
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Semana: 21-May al 27-May-2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Trabajadores</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.workers}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Building2 size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Obras activas</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.worksites}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CalendarCheck size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Asistencia hoy (27-May)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-green-600">{stats?.todayAttendance}</p>
            <span className="text-sm text-gray-400">presentes</span>
          </div>
          {stats?.todayFaltas > 0 && (
            <p className="text-xs text-red-500 mt-1">{stats.todayFaltas} faltas</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <DollarSign size={20} className="text-indigo-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Neto Semanal</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">${stats?.totalNeto?.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{stats?.payrollCount} registros</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-5">Acciones rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/asistencia" className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 rounded-xl p-4 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <QrCode size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Registrar Asistencia</p>
              <ArrowRight size={14} className="text-blue-400 mt-0.5" />
            </div>
          </Link>
          <Link to="/trabajadores" className="flex items-center gap-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl p-4 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Users size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">Ver Trabajadores</p>
              <ArrowRight size={14} className="text-emerald-400 mt-0.5" />
            </div>
          </Link>
          <Link to="/pre-nomina" className="flex items-center gap-3 bg-violet-50 hover:bg-violet-100 rounded-xl p-4 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
              <DollarSign size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-violet-700">Pre-Nómina</p>
              <ArrowRight size={14} className="text-violet-400 mt-0.5" />
            </div>
          </Link>
          <Link to="/reportes" className="flex items-center gap-3 bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700">Reportes</p>
              <ArrowRight size={14} className="text-amber-400 mt-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
