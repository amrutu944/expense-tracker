import { useState } from 'react'

import toast from 'react-hot-toast'

import API from '../services/api'

function ForgotPassword() {
  const [email, setEmail] =
    useState('')
  const [resetUrl, setResetUrl] =
    useState('')

  const handleSubmit =
    async e => {
      e.preventDefault()
      setResetUrl('')

      if (!email.trim()) {
        return toast.error('Enter your email address')
      }

      try {
        const { data } =
          await API.post(
            '/auth/forgot-password',
            { email: email.trim() }
          )

        toast.success(
          data.message
        )

        if (data.resetUrl) {
          setResetUrl(data.resetUrl)
        }
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'Unable to send reset link'
        )
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">

      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-md p-8 rounded-3xl bg-white/10 border border-white/10"
      >

        <h1 className="text-4xl font-bold text-cyan-400 text-center">

          Forgot Password

        </h1>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e =>
            setEmail(
              e.target.value
            )
          }
          className="w-full mt-8 px-4 py-4 rounded-2xl bg-white/10 border border-white/10 outline-none"
        />

        {resetUrl && (
          <a
            href={resetUrl}
            className="block mt-5 break-all rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-200"
          >
            {resetUrl}
          </a>
        )}

        <button className="w-full mt-6 py-4 rounded-2xl bg-cyan-500 text-black font-bold">

          Send Reset Link

        </button>

      </form>

    </div>
  )
}

export default ForgotPassword
