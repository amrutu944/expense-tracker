import crypto from 'crypto'

import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import User from '../models/User.js'

import sendEmail, {
  isEmailConfigured,
} from '../utils/sendEmail.js'
import sendSms from '../utils/sendSms.js'
import {
  normalizePhone,
  validatePhoneE164,
} from '../utils/phone.js'

// GENERATE JWT TOKEN
const generateToken = id => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const getClientUrl = () => {
  return (
    process.env.CLIENT_URL ||
    'http://127.0.0.1:5173'
  ).replace(/\/$/, '')
}

// REGISTER USER
export const registerUser =
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
      } = req.body

      const sanitizedEmail = email
        ? String(email)
            .trim()
            .toLowerCase()
        : ''

      const normalizedPhone =
        phone
          ? normalizePhone(phone)
          : ''

      if (!name) {
        return res.status(400).json({
          message:
            'Name is required',
        })
      }

      if (
        !sanitizedEmail &&
        !normalizedPhone
      ) {
        return res.status(400).json({
          message:
            'Email or phone number is required',
        })
      }

      if (!password) {
        return res.status(400).json({
          message:
            'Password is required',
        })
      }

      if (
        normalizedPhone &&
        !validatePhoneE164(
          normalizedPhone
        )
      ) {
        return res.status(400).json({
          message:
            'Phone number must be in E.164 format (e.g., +919876543210)',
        })
      }

      // Check existing email
      if (sanitizedEmail) {
        const existingEmail =
          await User.findOne({
            email:
              sanitizedEmail,
          })

        if (existingEmail) {
          return res
            .status(400)
            .json({
              message:
                'Email already exists',
            })
        }
      }

      // Check existing phone
      if (normalizedPhone) {
        const existingPhone =
          await User.findOne({
            phone:
              normalizedPhone,
          })

        if (existingPhone) {
          return res
            .status(400)
            .json({
              message:
                'Phone number already exists',
            })
        }
      }

      const salt =
        await bcrypt.genSalt(10)

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        )

      const emailOtp =
        generateOtp()

      const mobileOtp =
        generateOtp()

      const user =
        await User.create({
          name,
          email:
            sanitizedEmail,
          phone:
            normalizedPhone,
          password:
            hashedPassword,

          emailVerified:
            false,

          phoneVerified:
            normalizedPhone
              ? false
              : true,

          emailOtp,
          emailOtpExpire:
            Date.now() +
            10 *
              60 *
              1000,

          mobileOtp:
            normalizedPhone
              ? mobileOtp
              : undefined,

          mobileOtpExpire:
            normalizedPhone
              ? Date.now() +
                10 *
                  60 *
                  1000
              : undefined,
        })

      // EMAIL OTP
      if (sanitizedEmail) {
        sendEmail(
          user.email,
          'Expense Tracker - Email Verification',
          `
          <div style="font-family:Arial,sans-serif;padding:20px;">

            <h1 style="color:#06b6d4;">
              Expense Tracker 💰
            </h1>

            <h2>
              Hi ${user.name},
            </h2>

            <p>
              Your email OTP is:
            </p>

            <h1 style="color:#2563eb;letter-spacing:4px;">
              ${emailOtp}
            </h1>

            <p>
              Valid for
              <b>
                10 minutes
              </b>.
            </p>

          </div>
          `
        ).catch(error => {
          console.log(
            'EMAIL FAILED:',
            error.message
          )
        })
      }

      // MOBILE OTP
      if (normalizedPhone) {
        sendSms(
          user.phone,
          `Hi ${user.name},

Welcome to Expense Tracker 💰

Your mobile OTP is:
${mobileOtp}

Valid for 10 minutes.

— Expense Tracker Team`
        ).catch(error => {
          console.log(
            'SMS FAILED:',
            error.message
          )
        })
      }

      return res.status(201).json({
        message:
          'Account created. OTP sent successfully.',
        user: {
          _id: user._id,
          name: user.name,
          email:
            user.email,
          phone:
            user.phone,
        },
      })
    } catch (error) {
      console.error(
        'REGISTER ERROR:',
        error
      )

      res.status(500).json({
        message:
          error.message,
      })
    }
  }

// LOGIN USER
export const loginUser =
  async (req, res) => {
    try {
      const {
        email,
        phone,
        password,
      } = req.body

      const sanitizedEmail =
        email
          ? String(email)
              .trim()
              .toLowerCase()
          : undefined

      const normalizedPhone =
        phone
          ? normalizePhone(
              phone
            )
          : undefined

      const user =
        await User.findOne(
          sanitizedEmail
            ? {
                email:
                  sanitizedEmail,
              }
            : {
                phone:
                  normalizedPhone,
              }
        )

      if (
        user &&
        (await bcrypt.compare(
          password,
          user.password
        ))
      ) {
        if (
          !user.emailVerified
        ) {
          return res
            .status(403)
            .json({
              message:
                'Please verify your email before logging in.',
            })
        }

        if (
          user.phone &&
          !user.phoneVerified
        ) {
          return res
            .status(403)
            .json({
              message:
                'Please verify your phone before logging in.',
            })
        }

        return res.json({
          _id: user._id,

          user: {
            _id: user._id,
            name: user.name,
            email:
              user.email,
            phone:
              user.phone,
          },

          token:
            generateToken(
              user._id
            ),
        })
      }

      res.status(401).json({
        message:
          'Invalid credentials',
      })
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      })
    }
  }
export const requestEmailOtp =
  async (req, res) => {
    try {
      const { email } = req.body
      const sanitizedEmail = email
        ? String(email).trim().toLowerCase()
        : undefined

      const user =
        await User.findOne({
          email: sanitizedEmail,
        })

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              'User not found',
          })
      }

      const otp = generateOtp()

      user.emailOtp = otp
      user.emailOtpExpire =
        Date.now() + 10 * 60 * 1000

      await user.save()

      await sendEmail(
  user.email,
  'Expense Tracker - Login OTP',
  `
  <div style="font-family:Arial,sans-serif;padding:20px;">

    <h1 style="color:#06b6d4;">
      Expense Tracker 🔐
    </h1>

    <h2>
      Hi ${user.name},
    </h2>

    <p>
      Your login OTP is:
    </p>

    <h1 style="color:#2563eb;letter-spacing:4px;">
      ${otp}
    </h1>

    <p>
      Valid for
      <b>10 minutes</b>.
    </p>

    <hr />

    <p style="color:gray;">
      Expense Tracker Team
    </p>

  </div>
  `
)

      res.json({
        message:
          'OTP sent to your email',
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }

export const requestMobileOtp =
  async (req, res) => {
    try {
      const { phone } = req.body
      const normalizedPhone = normalizePhone(phone)

      if (!normalizedPhone) {
        return res.status(400).json({
          message: 'Phone number is required',
        })
      }

      if (!validatePhoneE164(normalizedPhone)) {
        return res.status(400).json({
          message:
            'Phone number must be in E.164 format (e.g., +919876543210)',
        })
      }

      const user =
        await User.findOne({
          phone: normalizedPhone,
        })

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              'User not found',
          })
      }

      const otp = generateOtp()

      user.mobileOtp = otp
      user.mobileOtpExpire =
        Date.now() + 10 * 60 * 1000

      await user.save()

      await sendSms(
  user.phone,
  `Hi ${user.name},

Expense Tracker Login Verification 🔐

Your OTP is: ${otp}

Valid for 10 minutes.

— Expense Tracker Team`
)

      res.json({
        message:
          'OTP sent to your phone',
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }

export const verifyOtp =
  async (req, res) => {
    try {
      const { email, phone, otp } =
        req.body
      const sanitizedEmail = email
        ? String(email).trim().toLowerCase()
        : undefined

      if (!otp || (!sanitizedEmail && !phone)) {
        return res
          .status(400)
          .json({
            message:
              'Email or phone and OTP are required',
          })
      }

      const sanitizedPhone =
        phone ? normalizePhone(phone) : phone
      const query = sanitizedEmail
        ? { email: sanitizedEmail }
        : { phone: sanitizedPhone }

      const user =
        await User.findOne(query)

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              'User not found',
          })
      }

      const isEmailOtp = !!sanitizedEmail
      const otpValue = isEmailOtp
        ? user.emailOtp
        : user.mobileOtp
      const otpExpire = isEmailOtp
        ? user.emailOtpExpire
        : user.mobileOtpExpire

      if (
        !otpValue ||
        otpValue !== otp ||
        !otpExpire ||
        otpExpire < Date.now()
      ) {
        return res
          .status(400)
          .json({
            message:
              'Invalid or expired OTP',
          })
      }

      if (isEmailOtp) {
        user.emailVerified = true
        user.emailOtp = undefined
        user.emailOtpExpire = undefined
      } else {
        user.phoneVerified = true
        user.mobileOtp = undefined
        user.mobileOtpExpire = undefined
      }

      await user.save()

      if (
        !user.emailVerified ||
        (user.phone && !user.phoneVerified)
      ) {
        const followUp =
          !user.emailVerified
            ? 'Verify your email to access the site.'
            : 'Verify your phone to access the site.'

        return res
          .status(403)
          .json({
            message:
              isEmailOtp
                ? user.phone
                  ? 'Email verified successfully. Please verify your phone to access.'
                  : 'Email verified successfully. You can now log in.'
                : !user.emailVerified
                ? 'Phone verified successfully. Please verify your email to access.'
                : 'Phone verified successfully. You can now log in.',
          })
      }

      res.json({
        _id: user._id,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token: generateToken(user._id),
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }

export const verifyEmailOtp =
  async (req, res) => {
    try {
      const {
  email,
  otp,
} = req.body

const cleanOtp =
  String(otp).trim()
      const sanitizedEmail = email
        ? String(email).trim().toLowerCase()
        : undefined

      if (!sanitizedEmail || !otp) {
        return res
          .status(400)
          .json({
            message:
              'Email and OTP are required',
          })
      }

      const user =
        await User.findOne({ email: sanitizedEmail })

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              'User not found',
          })
      }

      if (
        
        !user.emailOtp ||
        user.emailOtp !== cleanOtp ||
        !user.emailOtpExpire ||
        user.emailOtpExpire < Date.now()
      ) {
        return res
          .status(400)
          .json({
            message:
              'Invalid or expired OTP',
          })
      }

      user.emailVerified = true
      user.emailOtp = undefined
      user.emailOtpExpire = undefined

      await user.save()

      if (
        !user.phone ||
        user.phoneVerified
      ) {
        return res.json({
          _id: user._id,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
          token: generateToken(user._id),
        })
      }

      res.json({
        message:
          'Email verified successfully. Please verify your phone to complete registration.',
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }

export const verifyMobileOtp =
  async (req, res) => {
    try {
      const {
  phone,
  otp,
} = req.body

const cleanOtp =
  String(otp).trim()
      const normalizedPhone = normalizePhone(phone)

      if (!normalizedPhone || !otp) {
        return res
          .status(400)
          .json({
            message:
              'Phone and OTP are required',
          })
      }

      if (!validatePhoneE164(normalizedPhone)) {
        return res.status(400).json({
          message:
            'Phone number must be in E.164 format (e.g., +919876543210)',
        })
      }

      const user =
        await User.findOne({ phone: normalizedPhone })

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              'User not found',
          })
      }

      if (
        !user.mobileOtp ||
        user.mobileOtp !== cleanOtp ||
        !user.mobileOtpExpire ||
        user.mobileOtpExpire < Date.now()
      ) {
        return res
          .status(400)
          .json({
            message:
              'Invalid or expired OTP',
          })
      }

      user.phoneVerified = true
      user.mobileOtp = undefined
      user.mobileOtpExpire = undefined

      await user.save()

      if (!user.emailVerified) {
        return res.json({
          message:
            'Phone verified successfully. Please verify your email to complete registration.',
        })
      }

      res.json({
        _id: user._id,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token: generateToken(user._id),
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }

// FORGOT PASSWORD
export const forgotPassword =
  async (req, res) => {
    try {
      const { email } =
        req.body
      const sanitizedEmail = email
        ? String(email).trim().toLowerCase()
        : undefined

      if (!sanitizedEmail) {
        return res.status(400).json({
          message: 'Email is required',
        })
      }

      const user =
        await User.findOne({
          email: sanitizedEmail,
        })

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              'User not found',
          })
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString('hex')

      user.resetPasswordToken =
        resetToken

      user.resetPasswordExpire =
        Date.now() +
        15 * 60 * 1000

      await user.save()

      const resetUrl =
        `${getClientUrl()}/reset-password/${resetToken}`

      if (!isEmailConfigured()) {
        return res.json({
          message:
            'Email is not configured. Use this reset link to continue.',
          resetUrl,
        })
      }

      await sendEmail(
  user.email,
  'Expense Tracker - Email Verification',
  `
  <div style="font-family:Arial,sans-serif;padding:20px;">

    <h1 style="color:#06b6d4;">
      Expense Tracker 💰
    </h1>

    <h2>
      Hi ${user.name},
    </h2>

    <p>
      Welcome to
      <b>Expense Tracker</b>
    </p>

    <p>
      Your verification OTP is:
    </p>

    <h1 style="color:#2563eb;letter-spacing:4px;">
      ${user.emailOtp}
    </h1>

    <p>
      This OTP expires in
      <b>10 minutes</b>.
    </p>

    <hr />

    <p style="color:gray;">
      Expense Tracker Team
    </p>

  </div>
  `
)

      res.json({
        message:
          'Password reset email sent',
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }

// RESET PASSWORD
export const resetPassword =
  async (req, res) => {
    try {
      const { token } =
        req.params

      const { password } =
        req.body

      if (!password || password.length < 6) {
        return res.status(400).json({
          message:
            'Password must be at least 6 characters',
        })
      }

      const user =
        await User.findOne({
          resetPasswordToken:
            token,

          resetPasswordExpire: {
            $gt: Date.now(),
          },
        })

      if (!user) {
        return res
          .status(400)
          .json({
            message:
              'Invalid or expired token',
          })
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        )

      user.password =
        hashedPassword

      user.resetPasswordToken =
        undefined

      user.resetPasswordExpire =
        undefined

      await user.save()

      res.json({
        message:
          'Password reset successful',
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }
