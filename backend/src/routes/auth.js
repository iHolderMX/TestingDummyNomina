import { Router } from 'express'
import { getDb } from '../database.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body
  const db = getDb()
  const user = db._queryOne(
    'SELECT id, username, name, role FROM users WHERE username = ? AND password = ?',
    [username, password]
  )
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })
  res.json({ user, token: `${username}:${password}` })
})

router.get('/me', (req, res) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).json({ error: 'No autorizado' })
  const parts = token.split(':')
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' })

  const db = getDb()
  const user = db._queryOne(
    'SELECT id, username, name, role FROM users WHERE username = ? AND password = ?',
    [parts[0], parts[1]]
  )
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })
  res.json({ user })
})

export default router
