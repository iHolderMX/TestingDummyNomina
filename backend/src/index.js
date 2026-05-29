import express from 'express'
import cors from 'cors'
import { initDb, getDb } from './database.js'
import authRoutes from './routes/auth.js'
import workerRoutes from './routes/workers.js'
import worksiteRoutes from './routes/worksites.js'
import contractorRoutes from './routes/contractors.js'
import attendanceRoutes from './routes/attendance.js'
import payrollRoutes from './routes/payroll.js'
import auditRoutes from './routes/audit.js'
import reportRoutes from './routes/reports.js'

await initDb()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/worksites', worksiteRoutes)
app.use('/api/contractors', contractorRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/payroll', payrollRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/reports', reportRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
