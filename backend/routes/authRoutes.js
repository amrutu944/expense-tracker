import express from 'express'

import {
  registerUser,
  loginUser,
  requestEmailOtp,
  requestMobileOtp,
  verifyOtp,
  verifyEmailOtp,
  verifyMobileOtp,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'

import sendEmail from '../utils/sendEmail.js'

const router = express.Router()

// REGISTER
router.post(
  '/register',
  registerUser
)

// LOGIN
router.post(
  '/login',
  loginUser
)

// EMAIL OTP
router.post(
  '/request-email-otp',
  requestEmailOtp
)

// MOBILE OTP
router.post(
  '/request-mobile-otp',
  requestMobileOtp
)

// VERIFY OTP LOGIN / AUTH
router.post(
  '/verify-otp',
  verifyOtp
)

// VERIFY REGISTRATION
router.post(
  '/verify-email-otp',
  verifyEmailOtp
)

router.post(
  '/verify-mobile-otp',
  verifyMobileOtp
)

// FORGOT PASSWORD
router.post(
  '/forgot-password',
  forgotPassword
)

// RESET PASSWORD
router.post(
  '/reset-password/:token',
  resetPassword
)

// TEST EMAIL ROUTE
router.get(
  '/test-email',
  async (req, res) => {
    try {
      await sendEmail(
        'harish6361414944@gmail.com',
        'Expense Tracker Test Email',
        `
        <div style="font-family:Arial;padding:20px;">
          <h1>
            Expense Tracker 💰
          </h1>

          <h2>
            Email Working Successfully ✅
          </h2>

          <p>
            Your email integration is working.
          </p>
        </div>
        `
      )

      res.json({
        success: true,
        message:
          'Test email sent successfully',
      })
    } catch (error) {
      console.error(
        'EMAIL TEST ERROR:',
        error
      )

      res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }
)

export default router