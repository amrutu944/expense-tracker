import {
  Search,
  Bell,
} from 'lucide-react'

import {
  useState,
  useMemo,
} from 'react'

function DashboardHeader({
  expenses = [],
  setFilteredExpenses,
}) {
  const [search, setSearch] =
    useState('')

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false)

  // USER DATA
  const storedUser =
    localStorage.getItem(
      'user'
    )

  const user = storedUser
    ? JSON.parse(storedUser)
    : {}

  // FIX USERNAME ISSUE
  const username =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.user?.name ||
    user?.email?.split(
      '@'
    )[0] ||
    'User'

  const userEmail =
    user?.email ||
    user?.user?.email ||
    'No Email'

  const userInitial =
    username
      ?.charAt(0)
      .toUpperCase()

  // DATE
  const today =
    new Date().toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    )

  // GREETING
  const greeting =
    useMemo(() => {
      const hour =
        new Date().getHours()

      if (hour < 12)
        return 'Good Morning'

      if (hour < 18)
        return 'Good Afternoon'

      return 'Good Evening'
    }, [])

  // SEARCH
  const handleSearch = e => {
    const value =
      e.target.value

    setSearch(value)

    const filtered =
      expenses.filter(item =>
        (
          item.title ||
          ''
        )
          .toLowerCase()
          .includes(
            value.toLowerCase()
          )
      )

    setFilteredExpenses(
      filtered
    )
  }

  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10">

      {/* LEFT */}
      <div>

        <p className="text-cyan-400 font-semibold tracking-widest uppercase mb-2">

          Expense Tracker

        </p>

        <h1 className="text-4xl md:text-6xl xl:text-7xl font-black leading-tight">

          {greeting},{' '}

          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

            {username}
          </span>

        </h1>

        <p className="text-slate-400 mt-4 text-lg">

          {today}

        </p>

      </div>

      {/* RIGHT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

        {/* SEARCH */}
        <div className="flex items-center gap-3 px-5 py-4 rounded-3xl bg-[#111827]/70 border border-white/10 backdrop-blur-xl w-full sm:w-[360px] focus-within:border-cyan-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]">

          <Search
            size={20}
            className="text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={
              handleSearch
            }
            placeholder="Search transactions..."
            className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
          />

        </div>

        {/* NOTIFICATIONS */}
        <div className="relative">

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="relative w-14 h-14 rounded-3xl bg-[#111827]/70 border border-white/10 flex items-center justify-center hover:scale-105 hover:bg-cyan-500/10 transition-all"
          >

            <Bell
              size={22}
              className="text-white"
            />

            <div className="absolute top-3 right-3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>

          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-[320px] p-5 rounded-[28px] bg-[#111827] border border-white/10 shadow-2xl z-50">

              <h3 className="text-xl font-black mb-5">

                Notifications

              </h3>

              <div className="space-y-4">

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">

                  <p className="font-bold">

                    Budget Status

                  </p>

                  <p className="text-sm text-slate-400 mt-1">

                    Your spending
                    is under
                    control.
                  </p>

                </div>

                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">

                  <p className="font-bold">

                    Monthly Report

                  </p>

                  <p className="text-sm text-slate-400 mt-1">

                    Analytics are
                    updated.
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* USER CARD */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-3xl bg-[#111827]/70 border border-white/10 backdrop-blur-xl min-w-[260px] hover:scale-[1.02] transition-all duration-300">

          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-black font-black text-xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">

            {userInitial}

          </div>

          <div className="overflow-hidden">

            <h3 className="font-bold text-white text-lg truncate">

              {username}

            </h3>

            <p className="text-slate-400 text-sm truncate">

              {userEmail}

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default DashboardHeader