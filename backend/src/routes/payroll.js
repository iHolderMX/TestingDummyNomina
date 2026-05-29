import { Router } from 'express'
import { getDb, saveDb } from '../database.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/', (req, res) => {
  const db = getDb()
  const { period_start, period_end, worksite_id } = req.query

  let sql = `SELECT p.*, w.name as worker_name, w.internal_id, w.role_title,
    ws.name as worksite_name
    FROM payroll p
    JOIN workers w ON p.worker_id = w.id
    JOIN worker_worksites ww ON w.id = ww.worker_id
    JOIN worksites ws ON ww.worksite_id = ws.id`
  const params = []
  const conditions = []

  if (period_start && period_end) {
    conditions.push('p.period_start = ? AND p.period_end = ?')
    params.push(period_start, period_end)
  }
  if (worksite_id) { conditions.push('ws.id = ?'); params.push(worksite_id) }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
  sql += ' ORDER BY ws.name, w.name'

  res.json(db._queryResult(sql, params))
})

router.get('/calculate', (req, res) => {
  const db = getDb()
  const { period_start, period_end } = req.query
  if (!period_start || !period_end) return res.status(400).json({ error: 'period_start y period_end requeridos' })

  const workers = db._queryResult(`
    SELECT w.*, ws.name as worksite_name, ws.id as worksite_id
    FROM workers w
    JOIN worker_worksites ww ON w.id = ww.worker_id
    JOIN worksites ws ON ww.worksite_id = ws.id
    WHERE w.active = 1
  `)

  const results = workers.map(w => {
    const daily = w.weekly_salary / 6
    const attendances = db._queryResult(
      'SELECT date, status FROM attendances WHERE worker_id = ? AND date >= ? AND date <= ? ORDER BY date',
      [w.id, period_start, period_end]
    )

    const days = attendances.filter(a => a.status === 'presente')
    const jueSabDays = days.filter(a => {
      const d = new Date(a.date + 'T00:00:00')
      return d.getDay() === 4 || d.getDay() === 5 || d.getDay() === 6
    })
    const lunMieDays = days.filter(a => {
      const d = new Date(a.date + 'T00:00:00')
      return d.getDay() === 1 || d.getDay() === 2 || d.getDay() === 3
    })

    const diasJueSab = jueSabDays.length
    const diasLunMie = lunMieDays.length
    const payJS = daily * diasJueSab
    const payLM = daily * diasLunMie
    const otJS = diasJueSab * 1
    const otLM = diasLunMie * 0
    const otPayJS = otJS * 100
    const otPayLM = otLM * 100
    const alim = 150
    const viaticos = 250
    const bono = 0
    const totalDev = payJS + payLM + otPayJS + otPayLM + alim + viaticos + bono
    const prestamo = 0, otros = 0, retardos_amount = 0
    const imss = Math.round(totalDev * 0.02 * 100) / 100
    const infonavit = Math.round(totalDev * 0.05 * 100) / 100
    const totalDed = prestamo + otros + retardos_amount + imss + infonavit
    const totalNeto = totalDev - totalDed

    return {
      worker_id: w.id, worker_name: w.name, internal_id: w.internal_id,
      role_title: w.role_title, worksite_name: w.worksite_name,
      weekly_salary: w.weekly_salary, daily_salary: daily,
      days_attended_jue_sab: diasJueSab, days_attended_lun_mie: diasLunMie,
      pay_days_jue_sab: payJS, pay_days_lun_mie: payLM,
      overtime_hours_jue_dom: otJS, overtime_pay_jue_dom: otPayJS,
      overtime_hours_lun_mie: otLM, overtime_pay_lun_mie: otPayLM,
      alimentos: alim, viaticos, bono, total_devengado: totalDev,
      prestamo, otros, retardos: retardos_amount, cuota_imss: imss, infonavit,
      total_deducciones: totalDed, total_neto: totalNeto,
    }
  })

  res.json(results)
})

router.post('/save', (req, res) => {
  const db = getDb()
  const { period_start, period_end, entries } = req.body

  try {
    db.run('BEGIN TRANSACTION')
    for (const e of entries) {
      db.run(`INSERT OR REPLACE INTO payroll (
        worker_id, period_start, period_end, weekly_salary, daily_salary,
        days_attended_jue_sab, days_attended_lun_mie,
        pay_days_jue_sab, pay_days_lun_mie,
        overtime_hours_jue_dom, overtime_pay_jue_dom,
        overtime_hours_lun_mie, overtime_pay_lun_mie,
        alimentos, viaticos, bono, total_devengado,
        prestamo, otros, retardos, cuota_imss, infonavit,
        total_deducciones, total_neto, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'calculado')`, [
        e.worker_id, period_start, period_end, e.weekly_salary, e.daily_salary,
        e.days_attended_jue_sab, e.days_attended_lun_mie,
        e.pay_days_jue_sab, e.pay_days_lun_mie,
        e.overtime_hours_jue_dom, e.overtime_pay_jue_dom,
        e.overtime_hours_lun_mie, e.overtime_pay_lun_mie,
        e.alimentos || 0, e.viaticos || 0, e.bono || 0, e.total_devengado,
        e.prestamo || 0, e.otros || 0, e.retardos || 0, e.cuota_imss || 0, e.infonavit || 0,
        e.total_deducciones, e.total_neto
      ])
    }
    db.run('COMMIT')
    saveDb()
    res.json({ status: 'ok', count: entries.length })
  } catch (e) {
    db.run('ROLLBACK')
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id/correct', (req, res) => {
  const db = getDb()
  const current = db._queryOne('SELECT * FROM payroll WHERE id = ?', [req.params.id])
  if (!current) return res.status(404).json({ error: 'Registro no encontrado' })

  const allowedFields = [
    'alimentos', 'viaticos', 'bono', 'prestamo', 'otros',
    'retardos', 'cuota_imss', 'infonavit',
    'overtime_hours_jue_dom', 'overtime_pay_jue_dom',
    'overtime_hours_lun_mie', 'overtime_pay_lun_mie'
  ]

  try {
    db.run('BEGIN TRANSACTION')

    const updates = []
    const params = []

    for (const field of allowedFields) {
      if (req.body[field] !== undefined && req.body[field] !== current[field]) {
        db.run(
          'INSERT INTO audit_log (user_id, entity_type, entity_id, field_name, old_value, new_value, reason, period) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [req.user.id, 'payroll', req.params.id, field, String(current[field]), String(req.body[field]),
            req.body.reason || 'Corrección manual', `${current.period_start} / ${current.period_end}`]
        )
        updates.push(`${field} = ?`)
        params.push(req.body[field])
      }
    }

    if (updates.length === 0) {
      db.run('ROLLBACK')
      return res.status(400).json({ error: 'Sin cambios' })
    }

    params.push(req.params.id)
    db.run(`UPDATE payroll SET ${updates.join(', ')}, status = 'corregido' WHERE id = ?`, params)

    const updated = db._queryOne('SELECT * FROM payroll WHERE id = ?', [req.params.id])

    const totalDev = updated.pay_days_jue_sab + updated.pay_days_lun_mie +
      updated.overtime_pay_jue_dom + updated.overtime_pay_lun_mie +
      updated.alimentos + updated.viaticos + updated.bono
    const totalDed = updated.prestamo + updated.otros + updated.retardos +
      updated.cuota_imss + updated.infonavit
    const totalNeto = totalDev - totalDed

    db.run('UPDATE payroll SET total_devengado = ?, total_deducciones = ?, total_neto = ? WHERE id = ?',
      [totalDev, totalDed, totalNeto, req.params.id])

    db.run('COMMIT')
    saveDb()
    const final = db._queryOne('SELECT * FROM payroll WHERE id = ?', [req.params.id])
    res.json(final)
  } catch (e) {
    db.run('ROLLBACK')
    res.status(400).json({ error: e.message })
  }
})

export default router
