import { Router } from 'express'
import { getDb, saveDb } from '../database.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/', (req, res) => {
  const db = getDb()
  const worksites = db._queryResult(`
    SELECT ws.id, ws.name, ws.location, ws.active,
           COUNT(ww.id) as worker_count
    FROM worksites ws
    LEFT JOIN worker_worksites ww ON ws.id = ww.worksite_id
    GROUP BY ws.id ORDER BY ws.name
  `)
  res.json(worksites)
})

router.get('/:id', (req, res) => {
  const db = getDb()
  const worksite = db._queryOne('SELECT * FROM worksites WHERE id = ?', [req.params.id])
  if (!worksite) return res.status(404).json({ error: 'Obra no encontrada' })

  const workers = db._queryResult(`
    SELECT w.*, c.name as contractor_name
    FROM workers w
    JOIN worker_worksites ww ON w.id = ww.worker_id
    LEFT JOIN contractors c ON w.contractor_id = c.id
    WHERE ww.worksite_id = ?
  `, [req.params.id])

  res.json({ ...worksite, workers })
})

router.post('/', (req, res) => {
  const db = getDb()
  const { name, location } = req.body
  const result = db._run('INSERT INTO worksites (name, location) VALUES (?, ?)', [name, location])
  saveDb()
  const worksite = db._queryOne('SELECT * FROM worksites WHERE id = ?', [result.lastInsertRowid])
  res.status(201).json(worksite)
})

router.put('/:id', (req, res) => {
  const db = getDb()
  const { name, location, active } = req.body
  const current = db._queryOne('SELECT * FROM worksites WHERE id = ?', [req.params.id])
  if (!current) return res.status(404).json({ error: 'Obra no encontrada' })

  db.run('UPDATE worksites SET name = ?, location = ?, active = ? WHERE id = ?', [
    name || current.name, location || current.location,
    active !== undefined ? active : current.active, req.params.id
  ])
  saveDb()
  const updated = db._queryOne('SELECT * FROM worksites WHERE id = ?', [req.params.id])
  res.json(updated)
})

export default router
