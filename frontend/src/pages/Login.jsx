import {
  useState,
  useContext,
  useEffect,
} from 'react'

import { useNavigate } from 'react-router-dom'

import { motion } from 'framer-motion'

import toast from 'react-hot-toast'

import API from '../services/api'

import { AuthContext } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()

  const { login } =
    useContext(AuthContext)

  const [loading, setLoading] =
    useState(false)

  const [loginMode, setLoginMode] =
    useState('password')

  const [otpType, setOtpType] =
    useState('email')

  const [otpSent, setOtpSent] =
    useState(false)

  const [otpValue, setOtpValue] =
    useState('')

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
      phone: '',
    })

  // REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
  const token =
    localStorage.getItem('token')

  const currentPath =
    window.location.pathname

  if (
    token &&
    currentPath === '/login'
  ) {
    navigate('/dashboard', {
      replace: true,
    })
  }
}, [])

  // HANDLE INPUT CHANGE
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  // HANDLE LOGIN
  const handleSubmit = async e => {
    e.preventDefault()

    setLoading(true)

    try {
      const { data } =
        await API.post(
          '/auth/login',
          formData
        )

      localStorage.setItem(
        'token',
        data.token
      )

      localStorage.setItem(
        'user',
        JSON.stringify(
          data.user
        )
      )

      login(data)

      toast.success(
        `Welcome ${data.user.name}`
      )

      navigate('/dashboard')
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          'Invalid credentials'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp =
    async () => {
      const phoneValue = formData.phone
        .replace(/[^\d+]/g, '')
        .trim()

      if (
        otpType === 'email' &&
        !formData.email
      ) {
        return toast.error(
          'Enter your email address'
        )
      }

      if (
        otpType === 'mobile' &&
        !phoneValue
      ) {
        return toast.error(
          'Enter your phone number'
        )
      }

      if (
        otpType === 'mobile' &&
        !phoneValue.startsWith('+')
      ) {
        return toast.error(
          'Phone must include country code (e.g., +91 98765 43210)'
        )
      }

      setLoading(true)

      try {
        await API.post(
          `/auth/${
            otpType === 'email'
              ? 'request-email-otp'
              : 'request-mobile-otp'
          }`,
          otpType === 'email'
            ? { email: formData.email }
            : { phone: phoneValue }
        )

        setOtpSent(true)
        toast.success(
          'OTP sent. Check your inbox or phone.'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'Unable to send OTP'
        )
      } finally {
        setLoading(false)
      }
    }

  const handleVerifyOtp =
    async () => {
      if (!otpValue) {
        return toast.error(
          'Enter the OTP code'
        )
      }

      setLoading(true)

      try {
      const phoneValue = formData.phone
        .replace(/[^\d+]/g, '')
        .trim()

      const payload =
          otpType === 'email'
            ? {
                email:
                  formData.email,
                otp: otpValue,
              }
            : {
                phone: phoneValue,
                otp: otpValue,
              }

        const { data } =
          await API.post(
            '/auth/verify-otp',
            payload
          )

        localStorage.setItem(
          'token',
          data.token
        )

        localStorage.setItem(
          'user',
          JSON.stringify(
            data.user
          )
        )

        login(data)

        toast.success(
          `Welcome ${data.user.name}`
        )

        navigate('/dashboard')
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'OTP verification failed'
        )
      } finally {
        setLoading(false)
      }
    }

  const handleFormSubmit =
    async e => {
      if (loginMode === 'password') {
        await handleSubmit(e)
      } else {
        e.preventDefault()
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 overflow-hidden relative">

      {/* CYAN GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full"></div>

      {/* PURPLE GLOW */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full"></div>

      {/* LOGIN CARD */}
      <motion.form
        onSubmit={handleFormSubmit}
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative z-10 w-full max-w-md p-8 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
      >

        {/* LOGO */}
        <div className="mb-8 text-center">

          <h1 className="text-5xl font-black leading-none">

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

              Expense

            </span>

            <br />

            <span className="text-white">

              Flow

            </span>

          </h1>

          <p className="text-slate-400 mt-3">

            Smart Finance Tracker

          </p>

        </div>

        <div className="mb-6 flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              setLoginMode('password')
              setOtpSent(false)
            }}
            className={`px-4 py-2 rounded-2xl font-semibold transition ${
              loginMode === 'password'
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Password
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMode('otp')
              setOtpSent(false)
            }}
            className={`px-4 py-2 rounded-2xl font-semibold transition ${
              loginMode === 'otp'
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            OTP
          </button>
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center text-white">

          Welcome Back 👋

        </h2>

        <p className="text-center text-slate-400 mt-3">

          Login to continue managing your finances

        </p>

        {/* FORM */}
        <div className="mt-8 space-y-5">

          {(loginMode === 'password' || otpType === 'email') && (
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required={loginMode === 'password' || otpType === 'email'}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400 focus:border-cyan-400 transition"
            />
          )}

          {loginMode === 'password' && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400 focus:border-cyan-400 transition"
            />
          )}

          {loginMode === 'otp' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOtpType('email')
                    setOtpSent(false)
                    setOtpValue('')
                  }}
                  className={`w-full py-3 rounded-2xl font-semibold transition ${
                    otpType === 'email'
                      ? 'bg-cyan-500 text-slate-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Email OTP
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpType('mobile')
                    setOtpSent(false)
                    setOtpValue('')
                  }}
                  className={`w-full py-3 rounded-2xl font-semibold transition ${
                    otpType === 'mobile'
                      ? 'bg-cyan-500 text-slate-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Mobile OTP
                </button>
              </div>

              {otpType === 'mobile' && (
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400 focus:border-cyan-400 transition"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Include country code: +91 (India), +1 (USA), +44 (UK), etc.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] text-slate-900 font-black transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                {loading
                  ? 'Sending OTP...'
                  : otpSent
                  ? 'Resend OTP'
                  : 'Send OTP'}
              </button>

              {otpSent && (
                <>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otpValue}
                    onChange={e => setOtpValue(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-slate-400 focus:border-cyan-400 transition"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-500 hover:scale-[1.02] text-slate-900 font-black transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    {loading
                      ? 'Verifying OTP...'
                      : 'Verify OTP'}
                  </button>
                </>
              )}
            </>
          )}

          {loginMode === 'password' && (
            <>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] text-slate-900 font-black transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                {loading
                  ? 'Logging in...'
                  : 'Login'}
              </button>

              <p className="text-center mt-5">
                <a
                  href="/forgot-password"
                  className="text-cyan-400 hover:underline"
                >
                  Forgot Password?
                </a>
              </p>

              <p className="text-center text-slate-400 mt-6">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Sign up here
                </a>
              </p>
            </>
          )}

          {loginMode === 'otp' && (
            <p className="text-center text-slate-400 mt-3">
              Enter the 6-digit code sent to your email or phone.
            </p>
          )}

        </div>

      </motion.form>

    </div>
  )
}

export default Login
