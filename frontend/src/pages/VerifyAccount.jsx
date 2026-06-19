import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../services/api'

function VerifyAccount() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState(
    searchParams.get('email') || ''
  )
  const [phone, setPhone] = useState(
    searchParams.get('phone') || ''
  )
  const [emailOtp, setEmailOtp] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  const showEmailVerification =
    Boolean(email) || !phone
  const showPhoneVerification =
    Boolean(phone) || !email

  const sendEmailOtp = async () => {
    const emailValue = email.trim()

    if (!emailValue) {
      return toast.error('Enter your email address')
    }

    setEmail(emailValue)
    setLoading(true)

    try {
      await API.post('/auth/request-email-otp', {
        email: emailValue,
      })

      toast.success('Email OTP sent. Check your inbox.')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to send email OTP'
      )
    } finally {
      setLoading(false)
    }
  }

  const sendPhoneOtp = async () => {
    const phoneValue = phone
      .replace(/[^\d+]/g, '')
      .trim()

    if (!phoneValue) {
      return toast.error('Enter your phone number')
    }

    if (!phoneValue.startsWith('+')) {
      return toast.error(
        'Phone must include country code (e.g., +91 98765 43210)'
      )
    }

    setPhone(phoneValue)
    setLoading(true)

    try {
      await API.post('/auth/request-mobile-otp', {
        phone: phoneValue,
      })

      toast.success('Mobile OTP sent. Check your phone.')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to send mobile OTP'
      )
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async () => {
    const emailValue = email.trim()

    if (!emailValue || !emailOtp) {
      return toast.error(
        'Enter email and OTP to verify'
      )
    }

    setEmail(emailValue)
    setLoading(true)

    try {
      const { data } = await API.post(
        '/auth/verify-email-otp',
        {
          email: emailValue,
          otp: emailOtp.trim(),
        }
      )

      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )
        localStorage.setItem('registrationComplete', 'true')
        toast.success(
          'Email verified. Registration complete.'
        )
        navigate('/dashboard')
      } else {
        setEmailVerified(true)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to verify email OTP'
      )
    } finally {
      setLoading(false)
    }
  }

  const verifyPhone = async () => {
    const phoneValue = phone
      .replace(/[^\d+]/g, '')
      .trim()

    if (!phoneValue || !phoneOtp) {
      return toast.error(
        'Enter phone and OTP to verify'
      )
    }

    setLoading(true)

    try {
      const { data } = await API.post(
        '/auth/verify-mobile-otp',
        {
          phone: phoneValue,
          otp: phoneOtp.trim(),
        }
      )

      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )
        localStorage.setItem('registrationComplete', 'true')
        toast.success(
          'Phone verified. Registration complete.'
        )
        navigate('/dashboard')
      } else {
        setPhoneVerified(true)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to verify phone OTP'
      )
    } finally {
      setLoading(false)
    }
  }

  const completeVerification =
    (email || phone) &&
    (!email || emailVerified) &&
    (!phone || phoneVerified)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl p-8 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white">
            Verify Your Account
          </h1>
          <p className="text-slate-400 mt-3">
            Complete the OTP verification before accessing your dashboard.
          </p>
        </div>

        <div className="grid gap-8">
          {showEmailVerification && (
          <div className="space-y-4 bg-slate-900/70 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-semibold text-white">
              Email Verification
            </h2>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={sendEmailOtp}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-black"
              >
                Resend Email OTP
              </button>
              <button
                type="button"
                onClick={verifyEmail}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-500 text-slate-900 font-black"
              >
                Verify Email
              </button>
            </div>
            <input
              type="text"
              value={emailOtp}
              onChange={e => setEmailOtp(e.target.value.trim())}
              placeholder="Enter email OTP"
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400"
            />
            {emailVerified && (
              <p className="text-emerald-300">
                Email verified successfully.
              </p>
            )}
          </div>
          )}

          {showPhoneVerification && (
            <div className="space-y-4 bg-slate-900/70 p-6 rounded-3xl border border-white/10">
              <h2 className="text-xl font-semibold text-white">
                Phone Verification
              </h2>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400"
              />
              <p className="text-xs text-gray-400">
                Include country code: +91 (India), +1 (USA), +44 (UK), etc.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={sendPhoneOtp}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-black"
                >
                  Resend Phone OTP
                </button>
                <button
                  type="button"
                  onClick={verifyPhone}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-500 text-slate-900 font-black"
                >
                  Verify Phone
                </button>
              </div>
              <input
                type="text"
                value={phoneOtp}
                onChange={e => setPhoneOtp(e.target.value.trim())}
                placeholder="Enter phone OTP"
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400"
              />
              {phoneVerified && (
                <p className="text-emerald-300">
                  Phone verified successfully.
                </p>
              )}
            </div>
          )}

          {completeVerification && (
            <div className="bg-emerald-950/70 p-6 rounded-3xl border border-emerald-500/20 text-white">
              <h3 className="text-xl font-semibold">
                Account verified
              </h3>
              <p className="mt-2 text-slate-300">
                Your account is now fully verified. Click below to continue.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-black"
              >
                Continue to Login
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyAccount
