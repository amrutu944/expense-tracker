import mongoose from 'mongoose'

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        unique: true,
        sparse: true,
      },

      phone: {
        type: String,
        unique: true,
        sparse: true,
      },

      password: {
        type: String,
        required: true,
      },

      emailVerified: {
        type: Boolean,
        default: false,
      },

      phoneVerified: {
        type: Boolean,
        default: false,
      },

      emailOtp: {
        type: String,
      },

      emailOtpExpire: {
        type: Date,
      },

      mobileOtp: {
        type: String,
      },

      mobileOtpExpire: {
        type: Date,
      },

      // RESET PASSWORD
      resetPasswordToken: {
        type: String,
      },

      resetPasswordExpire: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  )

const User = mongoose.model(
  'User',
  userSchema
)

export default User