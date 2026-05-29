import { getDb } from '../database.js'

export function authenticate(req, res, next) {
  const token = req.headers.authorization
  if (!token) return res.status(401).json({ error: 'No autorizado' })

  const parts = token.split(':')
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' })

  const db = getDb()
  const user = db._queryOne(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [parts[0], parts[1]]
  )

  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

  req.user = user
  next()
}
