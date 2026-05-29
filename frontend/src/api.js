const API_BASE = '/api'

async function request(url, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  if (token) headers['Authorization'] = token

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('No autorizado')
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error de servidor')
  return data
}

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getMe: () => request('/auth/me'),

  getWorkers: () => request('/workers'),
  getWorker: (id) => request(`/workers/${id}`),
  createWorker: (data) => request('/workers', { method: 'POST', body: JSON.stringify(data) }),
  updateWorker: (id, data) => request(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getWorksites: () => request('/worksites'),
  getWorksite: (id) => request(`/worksites/${id}`),

  getContractors: () => request('/contractors'),
  getContractor: (id) => request(`/contractors/${id}`),

  getAttendances: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/attendance${qs ? '?' + qs : ''}`)
  },
  getAttendanceSummary: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/attendance/summary${qs ? '?' + qs : ''}`)
  },
  scanQR: (qr_code, worksite_id) => request('/attendance/scan', { method: 'POST', body: JSON.stringify({ qr_code, worksite_id }) }),
  updateAttendance: (id, data) => request(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getPayroll: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/payroll${qs ? '?' + qs : ''}`)
  },
  calculatePayroll: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/payroll/calculate${qs ? '?' + qs : ''}`)
  },
  savePayroll: (data) => request('/payroll/save', { method: 'POST', body: JSON.stringify(data) }),
  correctPayroll: (id, data) => request(`/payroll/${id}/correct`, { method: 'PUT', body: JSON.stringify(data) }),

  getAuditLog: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/audit${qs ? '?' + qs : ''}`)
  },

  getContractorsByWorksites: () => request('/reports/contractors-by-worksites'),
  getTopOvertime: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/reports/top-overtime${qs ? '?' + qs : ''}`)
  },
  getTopNetPay: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/reports/top-net-pay${qs ? '?' + qs : ''}`)
  },
  getWorksiteSummary: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/reports/worksite-summary${qs ? '?' + qs : ''}`)
  },
  getDailyAttendanceSummary: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/reports/daily-attendance-summary${qs ? '?' + qs : ''}`)
  },
  getContractorPayrollSummary: (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/reports/contractor-payroll-summary${qs ? '?' + qs : ''}`)
  },
}
