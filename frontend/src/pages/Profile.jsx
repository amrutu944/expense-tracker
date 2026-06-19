import {
  useEffect,
  useState,
} from 'react'

import {
  User,
  Mail,
  Wallet,
  Receipt,
  PiggyBank,
  Pencil,
} from 'lucide-react'

import DashboardLayout from '../layouts/DashboardLayout'
import API from '../services/api'

function Profile() {
  // USER DATA
  const storedUser =
    JSON.parse(
      localStorage.getItem(
        'user'
      )
    ) || {}

  const actualUser =
    storedUser?.user ||
    storedUser

  const [expenses, setExpenses] =
    useState([])

  const [income, setIncome] =
    useState([])

  const [editing, setEditing] =
    useState(false)

  const [name, setName] =
    useState(
      actualUser?.name ||
        actualUser?.fullName ||
        actualUser?.username ||
        'User'
    )

  const [email, setEmail] =
    useState(
      actualUser?.email ||
        'No Email'
    )

  // FETCH
  const fetchExpenses =
    async () => {
      try {
        const { data } =
          await API.get(
            '/expenses'
          )

        setExpenses(
          data || []
        )
      } catch (error) {
        console.log(error)
      }
    }

  const fetchIncome =
    async () => {
      try {
        const { data } =
          await API.get(
            '/income'
          )

        setIncome(
          data || []
        )
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    fetchExpenses()
    fetchIncome()
  }, [])

  // TOTALS
  const totalExpenses =
    expenses.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    )

  const totalIncome =
    income.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    )

  const savings =
    totalIncome -
    totalExpenses

  // SAVE PROFILE
  const handleSave = () => {
    const updatedUser = {
      ...storedUser,
      user: {
        ...actualUser,
        name,
        email,
      },
    }

    localStorage.setItem(
      'user',
      JSON.stringify(
        updatedUser
      )
    )

    setEditing(false)

    window.location.reload()
  }

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-12">

        <p className="text-cyan-400 uppercase tracking-widest font-semibold mb-2">

          Account Center

        </p>

        <h1 className="text-5xl md:text-7xl font-black">

          Profile

        </h1>

        <p className="text-slate-400 mt-4 text-lg">

          Manage your
          personal account
          information

        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="rounded-[36px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl p-10 text-center shadow-[0_0_40px_rgba(6,182,212,0.08)] hover:scale-[1.01] transition-all duration-300">

          {/* AVATAR */}
          <div className="w-40 h-40 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-6xl font-black text-black mx-auto shadow-[0_0_40px_rgba(6,182,212,0.35)]">

            {name
              ?.charAt(0)
              .toUpperCase()}

          </div>

          <h1 className="text-4xl font-black mt-8 break-words">

            {name}

          </h1>

          <p className="text-slate-400 mt-3 break-all">

            {email}

          </p>

          <button
            onClick={() =>
              setEditing(true)
            }
            className="mt-8 px-8 py-4 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition-all font-bold text-slate-900 flex items-center gap-3 mx-auto"
          >

            <Pencil
              size={18}
            />

            Edit Profile

          </button>

        </div>

        {/* RIGHT */}
        <div className="xl:col-span-2 space-y-8">

          {/* ACCOUNT INFO */}
          <div className="rounded-[36px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl p-10">

            <h2 className="text-4xl font-black mb-8">

              Account
              Information

            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-6">

                <User className="text-cyan-400 mb-4" />

                <p className="text-slate-400">

                  Full Name

                </p>

                <h3 className="text-2xl font-bold mt-2">

                  {name}

                </h3>

              </div>

              <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-6">

                <Mail className="text-purple-400 mb-4" />

                <p className="text-slate-400">

                  Email

                </p>

                <h3 className="text-xl font-bold mt-2 break-all">

                  {email}

                </h3>

              </div>

            </div>

          </div>

          {/* STATS */}
          <div className="rounded-[36px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl p-10">

            <h2 className="text-4xl font-black mb-8">

              Financial Stats

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">

                <Receipt className="text-cyan-400 mb-4" />

                <p className="text-slate-400">

                  Expenses

                </p>

                <h1 className="text-4xl font-black text-cyan-400 mt-4">

                  ₹
                  {
                    totalExpenses
                  }

                </h1>

              </div>

              <div className="p-6 rounded-3xl bg-green-500/10 border border-green-500/20">

                <Wallet className="text-green-400 mb-4" />

                <p className="text-slate-400">

                  Income

                </p>

                <h1 className="text-4xl font-black text-green-400 mt-4">

                  ₹
                  {
                    totalIncome
                  }

                </h1>

              </div>

              <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20">

                <PiggyBank className="text-purple-400 mb-4" />

                <p className="text-slate-400">

                  Savings

                </p>

                <h1 className="text-4xl font-black text-purple-400 mt-4">

                  ₹
                  {savings}

                </h1>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-5">

          <div className="w-full max-w-xl rounded-[36px] bg-[#111827] border border-white/10 p-10">

            <h2 className="text-4xl font-black mb-8">

              Edit Profile

            </h2>

            <div className="space-y-5">

              <input
                type="text"
                value={name}
                onChange={e =>
                  setName(
                    e.target
                      .value
                  )
                }
                className="w-full p-5 rounded-2xl bg-[#1e293b] border border-white/10 outline-none"
              />

              <input
                type="email"
                value={email}
                onChange={e =>
                  setEmail(
                    e.target
                      .value
                  )
                }
                className="w-full p-5 rounded-2xl bg-[#1e293b] border border-white/10 outline-none"
              />

              <div className="flex gap-4 pt-4">

                <button
                  onClick={
                    handleSave
                  }
                  className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-slate-900"
                >
                  Save
                </button>

                <button
                  onClick={() =>
                    setEditing(
                      false
                    )
                  }
                  className="flex-1 p-4 rounded-2xl bg-red-500/20 border border-red-500/30"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  )
}

export default Profile