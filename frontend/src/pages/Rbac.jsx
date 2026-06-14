import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Shield, Users, UserCog, Key, Lock, Eye, Pencil, Trash2, FileCheck, Download, BadgeCheck } from 'lucide-react'

export default function Rbac() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('roles')

  useEffect(() => {
    api.getRbacData().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando RBAC...</div>
    </div>
  )

  const permIcons = { read: Eye, write: Pencil, delete: Trash2, correct: Pencil, close: FileCheck, export: Download }
  const permColors = {
    read: 'bg-blue-50 text-blue-700 border-blue-200',
    write: 'bg-amber-50 text-amber-700 border-amber-200',
    delete: 'bg-red-50 text-red-700 border-red-200',
    correct: 'bg-violet-50 text-violet-700 border-violet-200',
    close: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    export: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Shield size={24} className="text-gray-700" />
        RBAC — Control de Acceso
      </h2>
      <p className="text-gray-500 text-sm mb-6">Usuarios · Roles · Grupos de Permiso · Permisos y Recursos (4 capas)</p>

      {/* Capa visual */}
      <div className="hidden lg:flex items-center justify-center gap-2 mb-8 text-xs font-mono text-gray-400 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-medium">USUARIO</span>
        <span className="text-gray-300">→ pertenece →</span>
        <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-medium">ROL</span>
        <span className="text-gray-300">→ contiene →</span>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium">GRUPO PERMISO</span>
        <span className="text-gray-300">→ contiene →</span>
        <span className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 font-medium">PERMISO/RECURSO</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'roles', label: 'Roles', icon: UserCog },
          { key: 'users', label: 'Usuarios', icon: Users },
          { key: 'groups', label: 'Grupos de Permiso', icon: Key },
          { key: 'matriz', label: 'Matriz', icon: Lock },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {/* TAB: Roles */}
      {tab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.roles.map(role => (
            <div key={role.key} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <UserCog size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.label}</h3>
                    <p className="text-xs text-gray-500 font-mono">{role.key}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">{role.description}</p>
              </div>
              <div className="p-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Grupos de permiso asignados</h4>
                <div className="flex flex-wrap gap-1.5">
                  {role.groups.map(g => {
                    const group = data.groups.find(x => x.key === g)
                    return (
                      <span key={g} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        group?.color || 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        <Key size={10} />{group?.label || g}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Usuarios */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtro</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      u.role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      u.role === 'encargado' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      u.role === 'nomina' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>{data.roles.find(r => r.key === u.role)?.label || u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.filtro || 'Global'}</td>
                  <td className="px-4 py-3">
                    {u.active
                      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><BadgeCheck size={11} />Activo</span>
                      : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">Inactivo</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Grupos de Permiso */}
      {tab === 'groups' && (
        <div className="space-y-4">
          {data.groups.map(group => (
            <div key={group.key} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${group.color?.replace('text-','bg-').replace('700','50').replace('600','50') || 'bg-gray-50'}`}>
                    <Key size={20} className={group.color?.split(' ')[1] || 'text-gray-600'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{group.label}</h3>
                    <p className="text-xs text-gray-500 font-mono">{group.key}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{group.permissions.length} permisos</span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5">
                  {group.permissions.map(perm => {
                    const [recurso, accion] = perm.split('.')
                    const pConfig = data.permissions.find(p => p.key === perm)
                    const Icon = permIcons[accion] || Eye
                    const color = permColors[accion] || 'bg-gray-50 text-gray-600 border-gray-200'
                    return (
                      <span key={perm} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${color}`}>
                        <Icon size={11} />{pConfig?.label || perm}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Matriz */}
      {tab === 'matriz' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recurso</th>
                {data.roles.map(r => (
                  <th key={r.key} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{r.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.matriz.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.recurso}</td>
                  {data.roles.map(role => {
                    const perms = row.roles[role.key]
                    return (
                      <td key={role.key} className="px-4 py-3 text-center">
                        {perms === '—' ? (
                          <span className="text-gray-300 text-lg">—</span>
                        ) : (
                          <div className="flex flex-wrap justify-center gap-1">
                            {perms.split(', ').map(p => {
                              const Icon = permIcons[p] || Eye
                              const color = permColors[p] || 'bg-gray-50 text-gray-600 border-gray-200'
                              return (
                                <span key={p} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${color}`}>
                                  <Icon size={9} />{p}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(permIcons).map(([k, Icon]) => (
          <div key={k} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${permColors[k]}`}>
            <Icon size={11} />{k}
          </div>
        ))}
      </div>
    </div>
  )
}
