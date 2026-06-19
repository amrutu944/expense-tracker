import Income from '../models/Income.js'

// GET INCOME
export const getIncome =
  async (req, res) => {
    try {
      const income =
        await Income.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        })

      res.json(income)
    } catch (error) {
      res.status(500).json({
        message:
          'Server Error',
      })
    }
  }

// ADD INCOME
export const addIncome =
  async (req, res) => {
    try {
      const {
        source,
        amount,
      } = req.body

      const income =
        await Income.create({
          user: req.user.id,
          source,
          amount,
        })

      res.status(201).json(
        income
      )
    } catch (error) {
      res.status(500).json({
        message:
          'Server Error',
      })
    }
  }

// DELETE INCOME
export const deleteIncome =
  async (req, res) => {
    try {
      const income =
        await Income.findOne({
          _id: req.params.id,
          user: req.user.id,
        })

      if (!income) {
        return res
          .status(404)
          .json({
            message:
              'Income not found',
          })
      }

      await income.deleteOne()

      res.json({
        message:
          'Income deleted',
      })
    } catch (error) {
      res.status(500).json({
        message:
          'Server Error',
      })
    }
  }