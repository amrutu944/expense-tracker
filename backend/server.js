import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import incomeRoutes from './routes/incomeRoutes.js'

dotenv.config()

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://expense-tracker-beta-teal.vercel.app',
    ],
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
    ],
  })
)

app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/income', incomeRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Running',
  })
})

// API test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API Working',
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})