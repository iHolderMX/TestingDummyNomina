import { initDb, getDb, saveDb } from './database.js'

await initDb()
const db = getDb()

db.run('DELETE FROM audit_log')
db.run('DELETE FROM payroll')
db.run('DELETE FROM attendances')
db.run('DELETE FROM worker_courses')
db.run('DELETE FROM courses')
db.run('DELETE FROM worker_worksites')
db.run('DELETE FROM workers')
db.run('DELETE FROM worksites')
db.run('DELETE FROM contractors')
db.run('DELETE FROM users')

db.run(`INSERT INTO users (username, password, name, role) VALUES ('admin','admin123','Maria Administradora','admin')`)
db.run(`INSERT INTO users (username, password, name, role) VALUES ('juanencargado','obra123','Juan Encargado','encargado')`)
db.run(`INSERT INTO users (username, password, name, role) VALUES ('pedroencargado','obra123','Pedro Encargado','encargado')`)
db.run(`INSERT INTO users (username, password, name, role) VALUES ('laura_nomina','nom123','Laura Nómina','nomina')`)

db.run(`INSERT INTO contractors (name, contact) VALUES ('Construcciones Rápidas SA','555-1000')`)
db.run(`INSERT INTO contractors (name, contact) VALUES ('Acabados Finos SC','555-2000')`)

db.run(`INSERT INTO worksites (name, location) VALUES ('Edificio Central','Av. Reforma 100, CDMX')`)
db.run(`INSERT INTO worksites (name, location) VALUES ('Residencial Norte','Blvd. Norte 250, CDMX')`)

const workers = [
  { name: 'Carlos Méndez', role: 'Oficial Albañil', salary: 3000, contractor: 1 },
  { name: 'Juan Pérez', role: 'Ayudante', salary: 2500, contractor: 1 },
  { name: 'Pedro López', role: 'Oficial Albañil', salary: 3000, contractor: 1 },
  { name: 'Miguel Torres', role: 'Yesero', salary: 3500, contractor: null },
  { name: 'Luis García', role: 'Ayudante', salary: 2500, contractor: null },
  { name: 'Antonio Ruiz', role: 'Oficial Albañil', salary: 3200, contractor: 2 },
  { name: 'Rafael Castro', role: 'Pintor', salary: 3300, contractor: 2 },
  { name: 'José Martínez', role: 'Electricista', salary: 4000, contractor: 2 },
  { name: 'Diego Rivera', role: 'Plomero', salary: 3800, contractor: null },
  { name: 'Fernando Vargas', role: 'Ayudante', salary: 2500, contractor: null },
]

for (let i = 0; i < workers.length; i++) {
  const w = workers[i]
  const id = `TR-00${i + 1}`
  const qr = `QR-TR00${i + 1}`
  const ci = w.contractor || 'NULL'
  db.run(`INSERT INTO workers (internal_id, name, role_title, weekly_salary, contractor_id, qr_code) VALUES ('${id}','${w.name}','${w.role}',${w.salary},${ci},'${qr}')`)
}

for (let i = 1; i <= 5; i++) db.run(`INSERT INTO worker_worksites (worker_id, worksite_id) VALUES (${i},1)`)
for (let i = 6; i <= 10; i++) db.run(`INSERT INTO worker_worksites (worker_id, worksite_id) VALUES (${i},2)`)

db.run(`INSERT INTO courses (name, description, validity_months) VALUES ('Seguridad en Obra','Curso básico de seguridad',12)`)
db.run(`INSERT INTO courses (name, description, validity_months) VALUES ('Manejo de Herramienta Eléctrica','Certificación de manejo seguro',24)`)
db.run(`INSERT INTO courses (name, description, validity_months) VALUES ('Trabajo en Alturas','Certificación para trabajo en alturas',12)`)

db.run(`INSERT INTO worker_courses (worker_id, course_id, completed_at, expires_at, status) VALUES (1,1,'2026-01-15','2027-01-15','active')`)
db.run(`INSERT INTO worker_courses (worker_id, course_id, completed_at, expires_at, status) VALUES (1,2,'2026-02-01','2028-02-01','active')`)
db.run(`INSERT INTO worker_courses (worker_id, course_id, completed_at, expires_at, status) VALUES (3,1,'2026-03-10','2027-03-10','active')`)
db.run(`INSERT INTO worker_courses (worker_id, course_id, completed_at, expires_at, status) VALUES (6,1,'2025-12-01','2026-12-01','active')`)
db.run(`INSERT INTO worker_courses (worker_id, course_id, completed_at, expires_at, status) VALUES (8,3,'2026-04-20','2027-04-20','active')`)
db.run(`INSERT INTO worker_courses (worker_id, course_id, completed_at, expires_at, status) VALUES (8,1,'2026-01-05','2027-01-05','active')`)
db.run(`INSERT INTO worker_courses (worker_id, course_id, completed_at, expires_at, status) VALUES (9,2,'2026-02-15','2028-02-15','active')`)

const weekDays = ['2026-05-21','2026-05-22','2026-05-23','2026-05-25','2026-05-26','2026-05-27']
const entryTimes = ['07:00','07:15','06:50','07:30','07:05','07:10']

const attendancePattern = [
  [1,1,1,1,1,1],
  [1,1,1,0,1,1],
  [0,1,1,1,1,1],
  [1,1,1,1,1,0],
  [1,0,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,0,1,1,1],
  [1,1,1,1,1,1],
  [0,0,1,1,1,1],
  [1,1,1,1,0,1],
]

for (let wi = 0; wi < 10; wi++) {
  const wsId = wi < 5 ? 1 : 2
  for (let di = 0; di < 6; di++) {
    const present = attendancePattern[wi][di]
    const time = present ? `'${entryTimes[wi % 6]}'` : 'NULL'
    const status = present ? "'presente'" : "'falta'"
    const notes = present ? 'NULL' : "'No se presentó'"
    db.run(`INSERT OR IGNORE INTO attendances (worker_id, worksite_id, date, entry_time, status, notes, registered_by) VALUES (${wi + 1},${wsId},'${weekDays[di]}',${time},${status},${notes},2)`)
  }
}

for (let wi = 0; wi < 10; wi++) {
  const w = workers[wi]
  const daily = w.salary / 6
  const pattern = attendancePattern[wi]
  const jueSab = pattern[0] + pattern[1] + pattern[2]
  const lunMie = pattern[3] + pattern[4] + pattern[5]
  const payJS = daily * jueSab
  const payLM = daily * lunMie

  const otJS = jueSab * (wi < 4 ? 0 : (wi < 7 ? 2 : 1))
  const otLM = lunMie * (wi < 4 ? 1 : (wi < 7 ? 2 : 0))
  const otPayJS = otJS * 100
  const otPayLM = otLM * 100

  const alim = wi % 3 === 0 ? 200 : 150
  const viaticos = wi % 2 === 0 ? 300 : 250
  const bono = wi === 9 ? 500 : 0
  const totalDev = payJS + payLM + otPayJS + otPayLM + alim + viaticos + bono

  const prestamo = wi === 2 ? 500 : (wi === 5 ? 300 : 0)
  const otros = wi === 7 ? 150 : 0
  const retardos_count = pattern.reduce((s, v, i) => s + (v === 1 && wi === 3 ? 20 : 0), 0)
  const imss = Math.round(totalDev * 0.02 * 100) / 100
  const infonavit = Math.round(totalDev * 0.05 * 100) / 100
  const totalDed = prestamo + otros + retardos_count + imss + infonavit
  const totalNeto = totalDev - totalDed

  db.run(`INSERT OR IGNORE INTO payroll (worker_id, period_start, period_end, weekly_salary, daily_salary, days_attended_jue_sab, days_attended_lun_mie, pay_days_jue_sab, pay_days_lun_mie, overtime_hours_jue_dom, overtime_pay_jue_dom, overtime_hours_lun_mie, overtime_pay_lun_mie, alimentos, viaticos, bono, total_devengado, prestamo, otros, retardos, cuota_imss, infonavit, total_deducciones, total_neto) VALUES (${wi + 1},'2026-05-21','2026-05-27',${w.salary},${daily},${jueSab},${lunMie},${payJS},${payLM},${otJS},${otPayJS},${otLM},${otPayLM},${alim},${viaticos},${bono},${totalDev},${prestamo},${otros},${retardos_count},${imss},${infonavit},${totalDed},${totalNeto})`)
}

saveDb()

const usersCount = db._queryResult('SELECT COUNT(*) as c FROM users')[0].c
const workersCount = db._queryResult('SELECT COUNT(*) as c FROM workers')[0].c
console.log(`Seed completed: ${usersCount} users, ${workersCount} workers, 10 payroll records`)
