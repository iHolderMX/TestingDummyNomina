import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Workers from './pages/Workers.jsx'
import Worksites from './pages/Worksites.jsx'
import Contractors from './pages/Contractors.jsx'
import AttendanceQR from './pages/AttendanceQR.jsx'
import AttendanceSummary from './pages/AttendanceSummary.jsx'
import Payroll from './pages/Payroll.jsx'
import AuditLog from './pages/AuditLog.jsx'
import Reports from './pages/Reports.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="trabajadores" element={<Workers />} />
            <Route path="obras" element={<Worksites />} />
            <Route path="contratistas" element={<Contractors />} />
            <Route path="asistencia" element={<AttendanceQR />} />
            <Route path="resumen-asistencia" element={<AttendanceSummary />} />
            <Route path="pre-nomina" element={<Payroll />} />
            <Route path="auditoria" element={<AuditLog />} />
            <Route path="reportes" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
