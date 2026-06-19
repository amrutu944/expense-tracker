import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../services/api'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    })

  const [countryCode, setCountryCode] =
    useState('+91')

  const [loading, setLoading] =
    useState(false)

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const emailValue =
      formData.email
        .trim()
        .toLowerCase()

    const phoneDigits =
      formData.phone
        .replace(/\D/g, '')
        .replace(/^0+/, '')

    const phoneValue =
      `${countryCode}${phoneDigits}`

    if (!formData.name.trim()) {
      return toast.error(
        'Name is required'
      )
    }

    if (!emailValue) {
      return toast.error(
        'Email is required'
      )
    }

    if (!phoneDigits) {
      return toast.error(
        'Phone number is required'
      )
    }

    if (!formData.password) {
      return toast.error(
        'Password is required'
      )
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      return toast.error(
        'Passwords do not match'
      )
    }

    setLoading(true)

    try {
      const { data } =
        await API.post(
          '/auth/register',
          {
            name:
              formData.name.trim(),

            email:
              emailValue,

            phone:
              phoneValue,

            password:
              formData.password,

            mode:
              'register',
          }
        )

      toast.success(
        'OTP sent to email & phone'
      )

      const query =
        new URLSearchParams()

      query.set(
        'email',
        data.user.email
      )

      query.set(
        'phone',
        data.user.phone
      )

      navigate(
        `/verify-account?${query.toString()}`
      )
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full max-w-md p-8 rounded-[30px] bg-[#111827]/80 backdrop-blur-2xl border border-white/10"
      >
        <h1 className="text-5xl font-black text-center mb-10 text-white">
          Create Account
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 outline-none text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 outline-none text-white"
          />

          <div className="flex gap-3">
            <select
              value={
                countryCode
              }
              onChange={e =>
                setCountryCode(
                  e.target.value
                )
              }
              className="px-4 py-4 rounded-2xl bg-[#1e293b] border border-white/10 text-white outline-none"
            >
              <option value="+91">
                +91 India
              </option>

              <option value="+1">
                +1 USA
              </option>

              <option value="+44">
                +44 UK
              </option>
            </select>

            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              className="flex-1 px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 outline-none text-white"
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            autoComplete="new-password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 outline-none text-white"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="new-password"
            value={
              formData.confirmPassword
            }
            onChange={
              handleChange
            }
            className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 outline-none text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-slate-900"
          >
            {loading
              ? 'Sending OTP...'
              : 'Register & Send OTP'}
          </button>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-cyan-400 font-semibold hover:underline"
            >
              Login here
            </a>
          </p>
        </div>
      </motion.form>
    </div>
  )
}

export default Register