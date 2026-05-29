import { Router } from 'express'
import { getDb } from '../database.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/', (req, res) => {
  const db = getDb()
  const { entity_type, period, limit } = req.query

  let sql = `SELECT al.*, u.name as user_name
    FROM audit_log al
    JOIN users u ON al.user_id = u.id`
  const params = []
  const conditions = []

  if (entity_type) { conditions.push('al.entity_type = ?'); params.push(entity_type) }
  if (period) { conditions.push('al.period LIKE ?'); params.push(`%${period}%`) }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
  sql += ' ORDER BY al.created_at DESC'
  if (limit) { sql += ' LIMIT ?'; params.push(Number(limit)) }

  res.json(db._queryResult(sql, params))
})

export default router
