import initSqlJs from 'sql.js'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DB_PATH = join(__dirname, '..', 'data', 'payroll.db')

let db = null

function queryResult(db, sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

function queryOne(db, sql, params = []) {
  const rows = queryResult(db, sql, params)
  return rows.length ? rows[0] : null
}

function runStmt(db, sql, params = []) {
  db.run(sql, params)
  const id = queryOne(db, 'SELECT last_insert_rowid() as id')
  return { lastInsertRowid: id ? id.id : 0, changes: db.getRowsModified() }
}

function createTables(db) {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('encargado','admin','nomina','contratista')))`,
    `CREATE TABLE IF NOT EXISTS contractors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, contact TEXT, active INTEGER NOT NULL DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS worksites (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT, active INTEGER NOT NULL DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS workers (id INTEGER PRIMARY KEY AUTOINCREMENT, internal_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, role_title TEXT NOT NULL, weekly_salary REAL NOT NULL, contractor_id INTEGER REFERENCES contractors(id), qr_code TEXT NOT NULL UNIQUE, qr_valid INTEGER NOT NULL DEFAULT 1, active INTEGER NOT NULL DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS worker_worksites (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id INTEGER NOT NULL REFERENCES workers(id), worksite_id INTEGER NOT NULL REFERENCES worksites(id), assigned_at TEXT NOT NULL DEFAULT (datetime('now','localtime')), UNIQUE(worker_id, worksite_id))`,
    `CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, validity_months INTEGER NOT NULL DEFAULT 12)`,
    `CREATE TABLE IF NOT EXISTS worker_courses (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id INTEGER NOT NULL REFERENCES workers(id), course_id INTEGER NOT NULL REFERENCES courses(id), completed_at TEXT NOT NULL, expires_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','expired')))`,
    `CREATE TABLE IF NOT EXISTS attendances (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id INTEGER NOT NULL REFERENCES workers(id), worksite_id INTEGER NOT NULL REFERENCES worksites(id), date TEXT NOT NULL, entry_time TEXT, status TEXT NOT NULL DEFAULT 'presente' CHECK(status IN ('presente','falta','baja','salida','retardo')), notes TEXT, registered_by INTEGER REFERENCES users(id), created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')), UNIQUE(worker_id, worksite_id, date))`,
    `CREATE TABLE IF NOT EXISTS payroll (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id INTEGER NOT NULL REFERENCES workers(id), period_start TEXT NOT NULL, period_end TEXT NOT NULL, weekly_salary REAL NOT NULL, daily_salary REAL NOT NULL, days_attended_jue_sab INTEGER NOT NULL DEFAULT 0, days_attended_lun_mie INTEGER NOT NULL DEFAULT 0, pay_days_jue_sab REAL NOT NULL DEFAULT 0, pay_days_lun_mie REAL NOT NULL DEFAULT 0, overtime_hours_jue_dom REAL NOT NULL DEFAULT 0, overtime_pay_jue_dom REAL NOT NULL DEFAULT 0, overtime_hours_lun_mie REAL NOT NULL DEFAULT 0, overtime_pay_lun_mie REAL NOT NULL DEFAULT 0, alimentos REAL NOT NULL DEFAULT 0, viaticos REAL NOT NULL DEFAULT 0, bono REAL NOT NULL DEFAULT 0, total_devengado REAL NOT NULL DEFAULT 0, prestamo REAL NOT NULL DEFAULT 0, otros REAL NOT NULL DEFAULT 0, retardos REAL NOT NULL DEFAULT 0, cuota_imss REAL NOT NULL DEFAULT 0, infonavit REAL NOT NULL DEFAULT 0, total_deducciones REAL NOT NULL DEFAULT 0, total_neto REAL NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'calculado' CHECK(status IN ('calculado','corregido','cerrado')), created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')), UNIQUE(worker_id, period_start, period_end))`,
    `CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id), entity_type TEXT NOT NULL, entity_id INTEGER NOT NULL, field_name TEXT NOT NULL, old_value TEXT, new_value TEXT, reason TEXT NOT NULL, period TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')))`,
  ]
  for (const t of tables) db.run(t)
}

export async function initDb() {
  const dataDir = join(__dirname, '..', 'data')
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })

  const SQL = await initSqlJs()

  if (existsSync(DB_PATH)) {
    const buf = readFileSync(DB_PATH)
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
  }

  db.run('PRAGMA foreign_keys = ON')

  db._queryResult = (sql, params) => queryResult(db, sql, params)
  db._queryOne = (sql, params) => queryOne(db, sql, params)
  db._run = (sql, params) => runStmt(db, sql, params)

  createTables(db)
  saveDb()

  return db
}

export function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.')
  return db
}

export function saveDb() {
  if (!db) return
  const data = db.export()
  writeFileSync(DB_PATH, Buffer.from(data))
}

export { DB_PATH }
