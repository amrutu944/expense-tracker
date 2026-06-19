import Expense from '../models/Expense.js'

// GET ALL EXPENSES
export const getExpenses =
  async (req, res) => {
    try {
      const expenses =
        await Expense.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        })

      res.json(expenses)
    } catch (error) {
      res.status(500).json({
        message:
          'Server Error',
      })
    }
  }

// ADD EXPENSE
export const addExpense =
  async (req, res) => {
    try {
      const {
        title,
        amount,
        category,
      } = req.body

      const expense =
        await Expense.create({
          user: req.user.id,
          title,
          amount,
          category,
        })

      res.status(201).json(
        expense
      )
    } catch (error) {
      res.status(500).json({
        message:
          'Server Error',
      })
    }
  }

// DELETE EXPENSE
export const deleteExpense =
  async (req, res) => {
    try {
      const expense =
        await Expense.findOne({
          _id: req.params.id,
          user: req.user.id,
        })

      if (!expense) {
        return res
          .status(404)
          .json({
            message:
              'Expense not found',
          })
      }

      await expense.deleteOne()

      res.json({
        message:
          'Expense deleted',
      })
    } catch (error) {
      res.status(500).json({
        message:
          'Server Error',
      })
    }
  }