import { Router } from 'express'
import { getDb, saveDb } from '../database.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/', (req, res) => {
  const db = getDb()
  const contractors = db._queryResult(`
    SELECT c.*, COUNT(w.id) as worker_count
    FROM contractors c
    LEFT JOIN workers w ON c.id = w.contractor_id AND w.active = 1
    GROUP BY c.id ORDER BY c.name
  `)
  res.json(contractors)
})

router.get('/:id', (req, res) => {
  const db = getDb()
  const contractor = db._queryOne('SELECT * FROM contractors WHERE id = ?', [req.params.id])
  if (!contractor) return res.status(404).json({ error: 'Contratista no encontrado' })

  const workers = db._queryResult(`
    SELECT w.*
    FROM workers w
    WHERE w.contractor_id = ?
  `, [req.params.id])

  res.json({ ...contractor, workers })
})

router.post('/', (req, res) => {
  const db = getDb()
  const { name, contact } = req.body
  const result = db._run('INSERT INTO contractors (name, contact) VALUES (?, ?)', [name, contact])
  saveDb()
  const contractor = db._queryOne('SELECT * FROM contractors WHERE id = ?', [result.lastInsertRowid])
  res.status(201).json(contractor)
})

router.put('/:id', (req, res) => {
  const db = getDb()
  const { name, contact, active } = req.body
  const current = db._queryOne('SELECT * FROM contractors WHERE id = ?', [req.params.id])
  if (!current) return res.status(404).json({ error: 'Contratista no encontrado' })

  db.run('UPDATE contractors SET name = ?, contact = ?, active = ? WHERE id = ?', [
    name || current.name, contact || current.contact,
    active !== undefined ? active : current.active, req.params.id
  ])
  saveDb()
  const updated = db._queryOne('SELECT * FROM contractors WHERE id = ?', [req.params.id])
  res.json(updated)
})

export default router
