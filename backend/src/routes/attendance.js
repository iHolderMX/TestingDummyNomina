import { Router } from 'express'
import { getDb, saveDb } from '../database.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/', (req, res) => {
  const db = getDb()
  const { date, worksite_id } = req.query

  let sql = `SELECT a.*, w.name as worker_name, w.internal_id, w.role_title,
    ws.name as worksite_name, u.name as registered_by_name
    FROM attendances a
    JOIN workers w ON a.worker_id = w.id
    JOIN worksites ws ON a.worksite_id = ws.id
    LEFT JOIN users u ON a.registered_by = u.id`
  const params = []
  const conditions = []

  if (date) { conditions.push('a.date = ?'); params.push(date) }
  if (worksite_id) { conditions.push('a.worksite_id = ?'); params.push(worksite_id) }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
  sql += ' ORDER BY a.date DESC, w.name'

  res.json(db._queryResult(sql, params))
})

router.get('/summary', (req, res) => {
  const db = getDb()
  const { period_start, period_end, worksite_id } = req.query

  let sql = `SELECT w.id, w.internal_id, w.name, w.role_title, w.weekly_salary,
    ws.name as worksite_name, ws.id as worksite_id,
    COUNT(CASE WHEN a.status = 'presente' THEN 1 END) as dias_asistidos,
    COUNT(CASE WHEN a.status = 'falta' THEN 1 END) as faltas
    FROM workers w
    JOIN worker_worksites ww ON w.id = ww.worker_id
    JOIN worksites ws ON ww.worksite_id = ws.id
    LEFT JOIN attendances a ON w.id = a.worker_id AND a.date >= ? AND a.date <= ?
    WHERE w.active = 1`
  const params = [period_start, period_end]

  if (worksite_id) { sql += ' AND ws.id = ?'; params.push(worksite_id) }
  sql += ' GROUP BY w.id, ws.id ORDER BY ws.name, w.name'

  res.json(db._queryResult(sql, params))
})

router.post('/scan', (req, res) => {
  const db = getDb()
  const { qr_code, worksite_id } = req.body
  const today = new Date().toISOString().slice(0, 10)
  const now = new Date().toTimeString().slice(0, 5)

  const worker = db._queryOne(
    'SELECT * FROM workers WHERE qr_code = ? AND qr_valid = 1 AND active = 1',
    [qr_code]
  )
  if (!worker) return res.status(404).json({ error: 'QR inválido o trabajador inactivo' })

  const assignment = db._queryOne(
    'SELECT * FROM worker_worksites WHERE worker_id = ? AND worksite_id = ?',
    [worker.id, worksite_id]
  )
  if (!assignment) return res.status(400).json({ error: 'Trabajador no asignado a esta obra', pending: true, worker, worksite_id })

  const existing = db._queryOne(
    'SELECT * FROM attendances WHERE worker_id = ? AND date = ?',
    [worker.id, today]
  )
  if (existing) return res.json({ status: 'duplicate', message: 'Asistencia ya registrada hoy', attendance: existing })

  const result = db._run(
    'INSERT INTO attendances (worker_id, worksite_id, date, entry_time, status, registered_by) VALUES (?, ?, ?, ?, ?, ?)',
    [worker.id, worksite_id, today, now, 'presente', req.user.id]
  )
  saveDb()

  const attendance = db._queryOne('SELECT * FROM attendances WHERE id = ?', [result.lastInsertRowid])
  res.status(201).json({ status: 'ok', attendance, worker_name: worker.name })
})

router.put('/:id', (req, res) => {
  const db = getDb()
  const { status, notes, entry_time, reason } = req.body

  const current = db._queryOne('SELECT * FROM attendances WHERE id = ?', [req.params.id])
  if (!current) return res.status(404).json({ error: 'Registro no encontrado' })

  try {
    db.run('BEGIN TRANSACTION')

    db.run('UPDATE attendances SET status = ?, notes = ?, entry_time = ? WHERE id = ?', [
      status || current.status, notes || current.notes, entry_time || current.entry_time, req.params.id
    ])

    if (status && status !== current.status) {
      db.run(
        'INSERT INTO audit_log (user_id, entity_type, entity_id, field_name, old_value, new_value, reason, period) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, 'attendance', req.params.id, 'status', current.status, status, reason || 'Corrección manual', current.date]
      )
    }

    db.run('COMMIT')
    saveDb()
    const updated = db._queryOne('SELECT * FROM attendances WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (e) {
    db.run('ROLLBACK')
    res.status(400).json({ error: e.message })
  }
})

export default router
