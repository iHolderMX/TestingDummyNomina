import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pre-Nómina Obras</h1>
          <p className="text-gray-500 mt-2">Control de Asistencia y Pre-Nómina</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input-field"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="admin123"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">Usuarios demo:</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="bg-gray-50 rounded p-2">
              <span className="font-medium">Admin:</span> admin / admin123
            </div>
            <div className="bg-gray-50 rounded p-2">
              <span className="font-medium">Encargado:</span> juanencargado / obra123
            </div>
            <div className="bg-gray-50 rounded p-2">
              <span className="font-medium">Nómina:</span> laura_nomina / nom123
            </div>
            <div className="bg-gray-50 rounded p-2">
              <span className="font-medium">Encargado 2:</span> pedroencargado / obra123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
