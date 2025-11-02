import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import githubRoutes from './routes/github.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(limiter)

app.use('/auth', authRoutes)
app.use('/api/github', githubRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CommitIQ API is running' })
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})