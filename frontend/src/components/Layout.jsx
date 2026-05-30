import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  LayoutDashboard, Users, Building2, Briefcase, QrCode,
  CalendarCheck, DollarSign, TrendingUp, ShieldCheck, LogOut
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trabajadores', label: 'Trabajadores', icon: Users },
  { path: '/obras', label: 'Obras', icon: Building2 },
  { path: '/contratistas', label: 'Contratistas', icon: Briefcase },
  { path: '/asistencia', label: 'QR Asistencia', icon: QrCode },
  { path: '/resumen-asistencia', label: 'Resumen Asist.', icon: CalendarCheck },
  { path: '/pre-nomina', label: 'Pre-Nómina', icon: DollarSign },
  { path: '/reportes', label: 'Reportes', icon: TrendingUp },
  { path: '/auditoria', label: 'Auditoría', icon: ShieldCheck },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLabels = { admin: 'Administrador', encargado: 'Encargado de Obra', nomina: 'Nómina', contratista: 'Contratista' }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-gray-800 font-bold text-lg flex items-center gap-2">
            <Building2 size={22} className="text-blue-600" />
            Pre-Nómina Obras
          </h1>
          <p className="text-gray-400 text-xs mt-1">Control de Asistencia</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs">{roleLabels[user?.role] || user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-3 w-full flex items-center gap-1.5 text-gray-400 text-xs hover:text-red-600 transition-colors">
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
