const now = new Date()
const today = now.toISOString().slice(0, 10)

const workers = [
  { id: 1, internal_id: 'W-001', qr_code: 'W-001', name: 'Juan Pérez López', role_title: 'Albañil', weekly_salary: 2800, contractor_id: 1, active: 1, contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.' },
  { id: 2, internal_id: 'W-002', qr_code: 'W-002', name: 'María García Hernández', role_title: 'Ayudante General', weekly_salary: 2100, contractor_id: 1, active: 1, contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.' },
  { id: 3, internal_id: 'W-003', qr_code: 'W-003', name: 'Carlos Martínez Rodríguez', role_title: 'Plomero', weekly_salary: 3200, contractor_id: 2, active: 1, contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.' },
  { id: 4, internal_id: 'W-004', qr_code: 'W-004', name: 'Ana Sánchez Cruz', role_title: 'Electricista', weekly_salary: 3500, contractor_id: 2, active: 1, contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.' },
  { id: 5, internal_id: 'W-005', qr_code: 'W-005', name: 'José Ramírez Morales', role_title: 'Carpintero', weekly_salary: 3000, contractor_id: 1, active: 1, contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.' },
  { id: 6, internal_id: 'W-006', qr_code: 'W-006', name: 'Luis Torres Vega', role_title: 'Soldador', weekly_salary: 3400, contractor_id: null, active: 1, contractor_name: null },
  { id: 7, internal_id: 'W-007', qr_code: 'W-007', name: 'Mónica Rangel Soto', role_title: 'Arquitecta', weekly_salary: 4500, contractor_id: 1, active: 1, contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.' },
  { id: 8, internal_id: 'W-008', qr_code: 'W-008', name: 'Roberto Delgado Núñez', role_title: 'Pintor', weekly_salary: 2500, contractor_id: 2, active: 1, contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.' },
  { id: 9, internal_id: 'W-009', qr_code: 'W-009', name: 'Laura Mendoza Ortiz', role_title: 'Supervisora', weekly_salary: 4200, contractor_id: null, active: 1, contractor_name: null },
  { id: 10, internal_id: 'W-010', qr_code: 'W-010', name: 'Pedro Castillo Silva', role_title: 'Ayudante General', weekly_salary: 2000, contractor_id: 1, active: 1, contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.' },
]

const worksites = [
  { id: 1, name: 'Edificio Corporativo Reforma', location: 'Av. Paseo de la Reforma #342, Col. Juárez', active: 1, worker_count: 6 },
  { id: 2, name: 'Residencial Las Lomas', location: 'Blvd. Adolfo López Mateos #120, Col. Lomas de Chapultepec', active: 1, worker_count: 4 },
]

const contractors = [
  { id: 1, name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.', contact: 'Ing. Ricardo Mendoza | ricardo@cep.mx', active: 1, worker_count: 5 },
  { id: 2, name: 'Instalaciones y Servicios Técnicos Integrales S.A.', contact: 'Lic. Patricia Huerta | patricia@isti.mx', active: 1, worker_count: 3 },
]

const dates = ['2026-05-21', '2026-05-22', '2026-05-26', '2026-05-27']
const attendanceRecords = []
let attId = 1
const absentees = { 'W-003': ['2026-05-22'], 'W-008': ['2026-05-26', '2026-05-27'] }

workers.forEach(w => {
  dates.forEach(d => {
    const isAbsent = absentees[w.internal_id]?.includes(d)
    attendanceRecords.push({
      id: attId++,
      worker_id: w.id,
      worker_name: w.name,
      worker_internal_id: w.internal_id,
      role_title: w.role_title,
      date: d,
      check_in: isAbsent ? null : '07:00',
      status: isAbsent ? 'falta' : 'presente',
      worksite_id: w.id % 2 === 0 ? 2 : 1,
    })
  })
})

workers.forEach(w => {
  const isAbsent = absentees[w.internal_id]
  attendanceRecords.push({
    id: attId++,
    worker_id: w.id,
    worker_name: w.name,
    worker_internal_id: w.internal_id,
    role_title: w.role_title,
    date: '2026-05-25',
    check_in: '07:00',
    status: 'presente',
    worksite_id: w.id % 2 === 0 ? 2 : 1,
  })
  attendanceRecords.push({
    id: attId++,
    worker_id: w.id,
    worker_name: w.name,
    worker_internal_id: w.internal_id,
    role_title: w.role_title,
    date: '2026-05-28',
    check_in: isAbsent ? null : '07:00',
    status: isAbsent ? 'falta' : 'presente',
    worksite_id: w.id % 2 === 0 ? 2 : 1,
  })
})

function calcPayrollItem(w, presentDays) {
  const salary = w.weekly_salary
  const dailyRate = salary / 6
  const base = dailyRate * presentDays
  const overtimeHours = [0, 2, 4, 5, 0, 3, 0, 1, 0, 2][w.id - 1]
  const overtimePay = Math.round(overtimeHours * (dailyRate / 8) * 2)
  const foodAllowance = 350
  const travelAllowance = 200
  const bonus = overtimeHours > 3 ? 300 : 0
  const devengado = base + overtimePay + foodAllowance + travelAllowance + bonus
  const loanDeduction = [500, 0, 300, 0, 200, 0, 1000, 0, 0, 150][w.id - 1]
  const imss = Math.round(salary * 0.02)
  const infonavit = Math.round(salary * 0.05)
  const deducciones = loanDeduction + imss + infonavit
  return {
    id: w.id,
    worker_id: w.id,
    worker_name: w.name,
    worker_internal_id: w.internal_id,
    role_title: w.role_title,
    worksite_name: w.id % 2 === 0 ? 'Residencial Las Lomas' : 'Edificio Corporativo Reforma',
    contractor_name: w.contractor_name,
    present_days: presentDays,
    base_pay: Math.round(base),
    overtime_hours: overtimeHours,
    overtime_pay: overtimePay,
    food_allowance: foodAllowance,
    travel_allowance: travelAllowance,
    bonus: bonus,
    total_devengado: devengado,
    loan_deduction: loanDeduction,
    imss_deduction: imss,
    infonavit_deduction: infonavit,
    total_deducciones: deducciones,
    total_neto: devengado - deducciones,
    period_start: '2026-05-21',
    period_end: '2026-05-27',
    status: 'calculated',
  }
}

const attendanceSummary = workers.map(w => {
  const recs = attendanceRecords.filter(r => r.worker_id === w.id && r.date >= '2026-05-21' && r.date <= '2026-05-27')
  const presentes = recs.filter(r => r.status === 'presente').length
  return {
    id: w.id,
    internal_id: w.internal_id,
    name: w.name,
    role_title: w.role_title,
    weekly_salary: w.weekly_salary,
    worksite_name: w.id % 2 === 0 ? 'Residencial Las Lomas' : 'Edificio Corporativo Reforma',
    dias_asistidos: presentes,
    faltas: recs.length - presentes,
  }
})

const presentDaysMap = workers.reduce((acc, w) => {
  const recs = attendanceRecords.filter(r => r.worker_id === w.id && r.date >= '2026-05-21' && r.date <= '2026-05-27')
  acc[w.id] = recs.filter(r => r.status === 'presente').length
  return acc
}, {})

const payroll = workers.map(w => calcPayrollItem(w, presentDaysMap[w.id]))

const auditLogs = [
  { id: 1, created_at: '2026-05-27T10:30:00', user_name: 'admin', entity_type: 'attendance', field_name: 'status', old_value: 'falta', new_value: 'presente', reason: 'El trabajador sí asistió, error de captura', period: '2026-05-21 al 2026-05-27' },
  { id: 2, created_at: '2026-05-27T11:15:00', user_name: 'admin', entity_type: 'payroll', field_name: 'food_allowance', old_value: '0', new_value: '350', reason: 'Se le pagó el alimento del día', period: '2026-05-21 al 2026-05-27' },
  { id: 3, created_at: '2026-05-27T14:00:00', user_name: 'admin', entity_type: 'payroll', field_name: 'total_neto', old_value: '2800', new_value: '3150', reason: 'Corrección por horas extra no consideradas', period: '2026-05-21 al 2026-05-27' },
  { id: 4, created_at: '2026-05-26T09:00:00', user_name: 'admin', entity_type: 'worker', field_name: 'weekly_salary', old_value: '2500', new_value: '2800', reason: 'Ajuste salarial por aumento general', period: 'NA' },
]

const user = { id: 1, username: 'admin', name: 'Administrador', role: 'admin' }

function delay(ms = 300) {
  return new Promise(r => setTimeout(r, ms))
}

export const mockApi = {
  async login(username, password) {
    await delay()
    if (username === 'admin' && password === 'admin123') return { token: 'mock-token-abc123', user }
    throw new Error('Credenciales inválidas')
  },

  async getMe() {
    await delay()
    return user
  },

  async getWorkers() {
    await delay()
    return workers
  },

  async getWorker(id) {
    await delay()
    return workers.find(w => w.id === Number(id)) || null
  },

  async createWorker(data) {
    await delay()
    const newId = workers.length + 1
    const w = { id: newId, internal_id: `W-${String(newId).padStart(3, '0')}`, active: 1, ...data }
    workers.push(w)
    return w
  },

  async updateWorker(id, data) {
    await delay()
    const idx = workers.findIndex(w => w.id === Number(id))
    if (idx === -1) throw new Error('No encontrado')
    workers[idx] = { ...workers[idx], ...data }
    return workers[idx]
  },

  async getWorksites() {
    await delay()
    return worksites
  },

  async getWorksite(id) {
    await delay()
    return worksites.find(w => w.id === Number(id)) || null
  },

  async getContractors() {
    await delay()
    return contractors
  },

  async getContractor(id) {
    await delay()
    return contractors.find(c => c.id === Number(id)) || null
  },

  async getAttendances(filters = {}) {
    await delay()
    let result = [...attendanceRecords]
    if (filters.date) result = result.filter(r => r.date === filters.date)
    if (filters.worksite_id) result = result.filter(r => r.worksite_id === Number(filters.worksite_id))
    if (filters.status) result = result.filter(r => r.status === filters.status)
    return result
  },

  async getAttendanceSummary(filters = {}) {
    await delay()
    let result = [...attendanceSummary]
    return result
  },

  async scanQR(qr_code, worksite_id) {
    await delay(500)
    const worker = workers.find(w => w.qr_code === qr_code)
    if (!worker) throw new Error('Trabajador no encontrado')
    const existing = attendanceRecords.find(r => r.worker_id === worker.id && r.date === today)
    if (existing && existing.status === 'presente') {
      return { status: 'duplicate', message: 'El trabajador ya registró asistencia hoy' }
    }
    const rec = {
      id: attendanceRecords.length + 1,
      worker_id: worker.id,
      worker_name: worker.name,
      worker_internal_id: worker.internal_id,
      role_title: worker.role_title,
      date: today,
      check_in: '07:00',
      status: 'presente',
      worksite_id: Number(worksite_id),
    }
    attendanceRecords.push(rec)
    return { status: 'ok', worker_name: worker.name, attendance: { date: today, entry_time: '07:00' } }
  },

  async scanAttendance(workerInternalId) {
    await delay()
    const worker = workers.find(w => w.internal_id === workerInternalId)
    if (!worker) throw new Error('Trabajador no encontrado')
    const existing = attendanceRecords.find(r => r.worker_id === worker.id && r.date === today && r.status === 'presente')
    if (existing) throw new Error('El trabajador ya registró asistencia hoy')
    const rec = {
      id: attendanceRecords.length + 1,
      worker_id: worker.id,
      worker_name: worker.name,
      worker_internal_id: worker.internal_id,
      role_title: worker.role_title,
      date: today,
      check_in: '07:00',
      status: 'presente',
      worksite_id: worker.id % 2 === 0 ? 2 : 1,
    }
    attendanceRecords.push(rec)
    return rec
  },

  async updateAttendance(id, data) {
    await delay()
    const idx = attendanceRecords.findIndex(r => r.id === Number(id))
    if (idx === -1) throw new Error('No encontrado')
    attendanceRecords[idx] = { ...attendanceRecords[idx], ...data }
    return attendanceRecords[idx]
  },

  async getPayroll(filters = {}) {
    await delay()
    let result = [...payroll]
    if (filters.period_start) result = result.filter(p => p.period_start >= filters.period_start)
    if (filters.period_end) result = result.filter(p => p.period_end <= filters.period_end)
    return result
  },

  async calculatePayroll(period) {
    await delay(500)
    return payroll
  },

  async savePayroll(period) {
    await delay(500)
    return { saved: true, count: payroll.length }
  },

  async correctPayroll(id, data) {
    await delay()
    const idx = payroll.findIndex(p => p.worker_id === Number(id))
    if (idx === -1) throw new Error('No encontrado')
    const original = { ...payroll[idx] }
    const correction = { ...payroll[idx], ...data }
    correction.total_devengado = (data.base_pay ?? payroll[idx].base_pay) +
      (data.overtime_pay ?? payroll[idx].overtime_pay) +
      (data.food_allowance ?? payroll[idx].food_allowance) +
      (data.travel_allowance ?? payroll[idx].travel_allowance) +
      (data.bonus ?? payroll[idx].bonus)
    correction.total_deducciones = (data.loan_deduction ?? payroll[idx].loan_deduction) +
      (data.imss_deduction ?? payroll[idx].imss_deduction) +
      (data.infonavit_deduction ?? payroll[idx].infonavit_deduction)
    correction.total_neto = correction.total_devengado - correction.total_deducciones
    correction.status = 'corrected'
    payroll[idx] = correction
    const keys = Object.keys(data).filter(k => k !== 'reason')
    auditLogs.unshift({
      id: auditLogs.length + 1,
      created_at: new Date().toISOString(),
      user_name: 'admin',
      entity_type: 'payroll',
      field_name: keys[0] || 'total_neto',
      old_value: String(original[keys[0]] ?? '-'),
      new_value: String(data[keys[0]] ?? '-'),
      reason: data.reason || 'Sin motivo',
      period: `${payroll[idx].period_start} al ${payroll[idx].period_end}`,
    })
    return correction
  },

  async getAuditLog(filters = {}) {
    await delay()
    let result = [...auditLogs]
    if (filters.entity_type) result = result.filter(l => l.entity_type === filters.entity_type)
    if (filters.period) result = result.filter(l => l.period.includes(filters.period))
    return result
  },

  async getContractorsByWorksites() {
    await delay()
    return [
      { contractor_name: 'Construcciones y Edificaciones Profesionales S.A. de C.V.', worksite_name: 'Edificio Corporativo Reforma', worker_count: 5 },
      { contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.', worksite_name: 'Edificio Corporativo Reforma', worker_count: 1 },
      { contractor_name: 'Instalaciones y Servicios Técnicos Integrales S.A.', worksite_name: 'Residencial Las Lomas', worker_count: 2 },
      { contractor_name: 'Sin contratista', worksite_name: 'Edificio Corporativo Reforma', worker_count: 1 },
      { contractor_name: 'Sin contratista', worksite_name: 'Residencial Las Lomas', worker_count: 1 },
    ]
  },

  async getTopOvertime() {
    await delay()
    return workers.map(w => {
      const p = payroll.find(pp => pp.worker_id === w.id)
      return { name: w.name, role_title: w.role_title, overtime_hours: p?.overtime_hours || 0 }
    }).sort((a, b) => b.overtime_hours - a.overtime_hours).slice(0, 5)
  },

  async getTopNetPay() {
    await delay()
    return workers.map(w => {
      const p = payroll.find(pp => pp.worker_id === w.id)
      return { name: w.name, role_title: w.role_title, total_neto: p?.total_neto || 0 }
    }).sort((a, b) => b.total_neto - a.total_neto).slice(0, 5)
  },

  async getWorksiteSummary() {
    await delay()
    return worksites.map(ws => {
      const wsPayroll = payroll.filter(p => p.worksite_name === ws.name)
      return {
        name: ws.name,
        worker_count: ws.worker_count,
        total_devengado: wsPayroll.reduce((s, p) => s + p.total_devengado, 0),
        total_deducciones: wsPayroll.reduce((s, p) => s + p.total_deducciones, 0),
        total_neto: wsPayroll.reduce((s, p) => s + p.total_neto, 0),
      }
    })
  },

  async getContractorPayrollSummary() {
    await delay()
    const contractorsSet = [...new Set(payroll.map(p => p.contractor_name).filter(Boolean))]
    return [
      ...contractorsSet.map(cn => {
        const cp = payroll.filter(p => p.contractor_name === cn)
        return {
          contractor_name: cn,
          worker_count: cp.length,
          total_devengado: cp.reduce((s, p) => s + p.total_devengado, 0),
          total_deducciones: cp.reduce((s, p) => s + p.total_deducciones, 0),
          total_neto: cp.reduce((s, p) => s + p.total_neto, 0),
        }
      }),
      {
        contractor_name: 'Sin contratista',
        worker_count: payroll.filter(p => !p.contractor_name).length,
        total_devengado: payroll.filter(p => !p.contractor_name).reduce((s, p) => s + p.total_devengado, 0),
        total_deducciones: payroll.filter(p => !p.contractor_name).reduce((s, p) => s + p.total_deducciones, 0),
        total_neto: payroll.filter(p => !p.contractor_name).reduce((s, p) => s + p.total_neto, 0),
      },
    ]
  },

  async getDailyAttendanceSummary(filters = {}) {
    await delay()
    const allDates = [...new Set(attendanceRecords.map(r => r.date))].sort()
    return allDates.map(d => {
      const recs = attendanceRecords.filter(r => r.date === d)
      return {
        date: d,
        total: recs.length,
        presentes: recs.filter(r => r.status === 'presente').length,
        faltas: recs.filter(r => r.status === 'falta').length,
      }
    })
  },
}