import express from 'express'

import {
  addExpense,
  getExpenses,
  deleteExpense,
} from '../controllers/expenseController.js'

import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// GET ALL EXPENSES
router.get(
  '/',
  protect,
  getExpenses
)

// ADD EXPENSE
router.post(
  '/',
  protect,
  addExpense
)

// DELETE EXPENSE
router.delete(
  '/:id',
  protect,
  deleteExpense
)

export default router