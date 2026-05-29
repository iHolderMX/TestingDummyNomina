import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/trabajadores', label: 'Trabajadores', icon: '👷' },
  { path: '/obras', label: 'Obras', icon: '🏗️' },
  { path: '/contratistas', label: 'Contratistas', icon: '📋' },
  { path: '/asistencia', label: 'QR Asistencia', icon: '📱' },
  { path: '/resumen-asistencia', label: 'Resumen Asist.', icon: '📅' },
  { path: '/pre-nomina', label: 'Pre-Nómina', icon: '💰' },
  { path: '/reportes', label: 'Reportes', icon: '📈' },
  { path: '/auditoria', label: 'Auditoría', icon: '🔍' },
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
      <aside className="w-64 bg-gray-900 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-white font-bold text-lg">Pre-Nómina Obras</h1>
          <p className="text-gray-400 text-xs mt-1">Control de Asistencia</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs">{roleLabels[user?.role] || user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-3 w-full text-left text-gray-400 text-xs hover:text-white transition-colors">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
