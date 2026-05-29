import { Router } from 'express'
import { getDb } from '../database.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/contractors-by-worksites', (req, res) => {
  const db = getDb()
  const data = db._queryResult(`
    SELECT c.name as contractor_name, c.id as contractor_id,
      COUNT(DISTINCT ww.worksite_id) as worksite_count
    FROM contractors c
    JOIN workers w ON w.contractor_id = c.id
    JOIN worker_worksites ww ON w.id = ww.worker_id
    JOIN worksites ws ON ww.worksite_id = ws.id
    GROUP BY c.id ORDER BY worksite_count DESC
  `)

  for (const d of data) {
    const worksites = db._queryResult(`
      SELECT DISTINCT ws.name FROM worksites ws
      JOIN worker_worksites ww ON ws.id = ww.worksite_id
      JOIN workers w ON ww.worker_id = w.id
      WHERE w.contractor_id = ?
    `, [d.contractor_id])
    d.worksite_names = worksites.map(w => w.name).join(', ')
  }

  res.json(data)
})

router.get('/top-overtime', (req, res) => {
  const db = getDb()
  const { period_start, period_end } = req.query
  res.json(db._queryResult(`
    SELECT w.name as worker_name, w.internal_id, w.role_title,
      ws.name as worksite_name,
      p.overtime_hours_jue_dom + p.overtime_hours_lun_mie as total_overtime_hours,
      p.overtime_pay_jue_dom + p.overtime_pay_lun_mie as total_overtime_pay
    FROM payroll p
    JOIN workers w ON p.worker_id = w.id
    JOIN worker_worksites ww ON w.id = ww.worker_id
    JOIN worksites ws ON ww.worksite_id = ws.id
    WHERE p.period_start = ? AND p.period_end = ?
    ORDER BY total_overtime_hours DESC
  `, [period_start || '2026-05-21', period_end || '2026-05-27']))
})

router.get('/top-net-pay', (req, res) => {
  const db = getDb()
  const { period_start, period_end } = req.query
  res.json(db._queryResult(`
    SELECT w.name as worker_name, w.internal_id, w.role_title,
      ws.name as worksite_name, c.name as contractor_name,
      p.total_devengado, p.total_deducciones, p.total_neto
    FROM payroll p
    JOIN workers w ON p.worker_id = w.id
    JOIN worker_worksites ww ON w.id = ww.worker_id
    JOIN worksites ws ON ww.worksite_id = ws.id
    LEFT JOIN contractors c ON w.contractor_id = c.id
    WHERE p.period_start = ? AND p.period_end = ?
    ORDER BY p.total_neto DESC
  `, [period_start || '2026-05-21', period_end || '2026-05-27']))
})

router.get('/worksite-summary', (req, res) => {
  const db = getDb()
  const { period_start, period_end } = req.query
  res.json(db._queryResult(`
    SELECT ws.name as worksite_name,
      COUNT(DISTINCT p.worker_id) as worker_count,
      SUM(p.total_devengado) as total_devengado,
      SUM(p.total_deducciones) as total_deducciones,
      SUM(p.total_neto) as total_neto,
      SUM(p.days_attended_jue_sab + p.days_attended_lun_mie) as total_days
    FROM payroll p
    JOIN workers w ON p.worker_id = w.id
    JOIN worker_worksites ww ON w.id = ww.worker_id
    JOIN worksites ws ON ww.worksite_id = ws.id
    WHERE p.period_start = ? AND p.period_end = ?
    GROUP BY ws.id
  `, [period_start || '2026-05-21', period_end || '2026-05-27']))
})

router.get('/daily-attendance-summary', (req, res) => {
  const db = getDb()
  const { period_start, period_end } = req.query
  res.json(db._queryResult(`
    SELECT a.date,
      COUNT(CASE WHEN a.status = 'presente' THEN 1 END) as presentes,
      COUNT(CASE WHEN a.status = 'falta' THEN 1 END) as faltas,
      COUNT(*) as total
    FROM attendances a
    WHERE a.date >= ? AND a.date <= ?
    GROUP BY a.date ORDER BY a.date
  `, [period_start || '2026-05-21', period_end || '2026-05-27']))
})

router.get('/contractor-payroll-summary', (req, res) => {
  const db = getDb()
  const { period_start, period_end } = req.query
  res.json(db._queryResult(`
    SELECT COALESCE(c.name, 'Directo') as contractor_name,
      COUNT(DISTINCT p.worker_id) as worker_count,
      SUM(p.total_devengado) as total_devengado,
      SUM(p.total_deducciones) as total_deducciones,
      SUM(p.total_neto) as total_neto
    FROM payroll p
    JOIN workers w ON p.worker_id = w.id
    LEFT JOIN contractors c ON w.contractor_id = c.id
    WHERE p.period_start = ? AND p.period_end = ?
    GROUP BY w.contractor_id ORDER BY total_neto DESC
  `, [period_start || '2026-05-21', period_end || '2026-05-27']))
})

export default router
