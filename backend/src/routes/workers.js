import { Router } from 'express'
import { getDb, saveDb } from '../database.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/', (req, res) => {
  const db = getDb()
  const workers = db._queryResult(`
    SELECT w.*, c.name as contractor_name
    FROM workers w
    LEFT JOIN contractors c ON w.contractor_id = c.id
    ORDER BY w.name
  `)
  res.json(workers)
})

router.get('/:id', (req, res) => {
  const db = getDb()
  const worker = db._queryOne(`
    SELECT w.*, c.name as contractor_name
    FROM workers w
    LEFT JOIN contractors c ON w.contractor_id = c.id
    WHERE w.id = ?
  `, [req.params.id])
  if (!worker) return res.status(404).json({ error: 'Trabajador no encontrado' })

  const worksites = db._queryResult(`
    SELECT ws.* FROM worksites ws
    JOIN worker_worksites ww ON ws.id = ww.worksite_id
    WHERE ww.worker_id = ?
  `, [req.params.id])

  const courses = db._queryResult(`
    SELECT c.*, wc.completed_at, wc.expires_at, wc.status
    FROM courses c
    JOIN worker_courses wc ON c.id = wc.course_id
    WHERE wc.worker_id = ?
  `, [req.params.id])

  res.json({ ...worker, worksites, courses })
})

router.post('/', (req, res) => {
  const db = getDb()
  const { internal_id, name, role_title, weekly_salary, contractor_id } = req.body
  const qr_code = `QR-${internal_id}`

  try {
    const result = db._run(
      'INSERT INTO workers (internal_id, name, role_title, weekly_salary, contractor_id, qr_code) VALUES (?, ?, ?, ?, ?, ?)',
      [internal_id, name, role_title, weekly_salary, contractor_id || null, qr_code]
    )

    if (req.body.worksite_id) {
      db._run('INSERT INTO worker_worksites (worker_id, worksite_id) VALUES (?, ?)',
        [result.lastInsertRowid, req.body.worksite_id])
    }

    saveDb()
    const worker = db._queryOne('SELECT * FROM workers WHERE id = ?', [result.lastInsertRowid])
    res.status(201).json(worker)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', (req, res) => {
  const db = getDb()
  const { name, role_title, weekly_salary, contractor_id, active } = req.body

  const current = db._queryOne('SELECT * FROM workers WHERE id = ?', [req.params.id])
  if (!current) return res.status(404).json({ error: 'Trabajador no encontrado' })

  try {
    db.run('BEGIN TRANSACTION')

    db.run('UPDATE workers SET name = ?, role_title = ?, weekly_salary = ?, contractor_id = ?, active = ? WHERE id = ?', [
      name || current.name,
      role_title || current.role_title,
      weekly_salary || current.weekly_salary,
      contractor_id !== undefined ? contractor_id : current.contractor_id,
      active !== undefined ? active : current.active,
      req.params.id
    ])

    if (weekly_salary && weekly_salary !== current.weekly_salary) {
      db.run('INSERT INTO audit_log (user_id, entity_type, entity_id, field_name, old_value, new_value, reason) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, 'worker', req.params.id, 'weekly_salary', String(current.weekly_salary), String(weekly_salary), 'Actualización de sueldo'])
    }
    if (contractor_id !== undefined && contractor_id !== current.contractor_id) {
      db.run('INSERT INTO audit_log (user_id, entity_type, entity_id, field_name, old_value, new_value, reason) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, 'worker', req.params.id, 'contractor_id', String(current.contractor_id || ''), String(contractor_id || ''), 'Cambio de contratista'])
    }

    db.run('COMMIT')
    saveDb()

    const updated = db._queryOne('SELECT * FROM workers WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (e) {
    db.run('ROLLBACK')
    res.status(400).json({ error: e.message })
  }
})

export default router
