import mongoose from 'mongoose'

const incomeSchema =
  mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: 'User',
        required: true,
      },

      source: {
        type: String,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )

export default mongoose.model(
  'Income',
  incomeSchema
)