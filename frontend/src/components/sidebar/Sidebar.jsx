import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  User,
  LogOut,
} from 'lucide-react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

function Sidebar() {
  const location =
    useLocation()

  const navigate =
    useNavigate()

  // LOGOUT
  const logoutHandler =
    () => {
      localStorage.removeItem(
        'user'
      )

      navigate('/')
    }

  const navItems = [
    {
      name:
        'Dashboard',
      path:
        '/dashboard',
      icon: (
        <LayoutDashboard
          size={20}
        />
      ),
    },
    {
      name:
        'Expenses',
      path:
        '/expenses',
      icon: (
        <Receipt
          size={20}
        />
      ),
    },
    {
      name:
        'Income',
      path:
        '/income',
      icon: (
        <Wallet
          size={20}
        />
      ),
    },
    {
      name:
        'Analytics',
      path:
        '/analytics',
      icon: (
        <BarChart3
          size={20}
        />
      ),
    },
    {
      name:
        'Profile',
      path:
        '/profile',
      icon: (
        <User
          size={20}
        />
      ),
    },
  ]

  return (
    <aside className="w-[290px] h-screen bg-[#0b1120] border-r border-white/10 flex flex-col justify-between px-5 py-7 backdrop-blur-xl">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <Link to="/dashboard">

          <div className="mb-14">

            <h1 className="text-[38px] font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

              ExpenseFlow

            </h1>

            <p className="text-slate-500 text-sm mt-2">

              Smart Finance
              Tracker

            </p>

          </div>

        </Link>

        {/* NAVIGATION */}
        <div className="space-y-4">

          {navItems.map(
            item => {
              const isActive =
                location.pathname ===
                item.path

              return (
                <Link
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                >
                  <div
                    className={`group flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                        : 'text-slate-300 hover:bg-white/[0.04] hover:translate-x-1'
                    }`}
                  >

                    <div
                      className={`transition-all ${
                        isActive
                          ? 'scale-110'
                          : 'group-hover:scale-110'
                      }`}
                    >
                      {
                        item.icon
                      }
                    </div>

                    <span className="text-[18px] font-semibold">

                      {
                        item.name
                      }

                    </span>

                  </div>

                </Link>
              )
            }
          )}

        </div>

      </div>

      {/* LOGOUT */}
      <button
        onClick={
          logoutHandler
        }
        className="flex items-center gap-4 px-5 py-4 rounded-[24px] bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-300 hover:scale-[1.02]"
      >

        <LogOut
          size={22}
        />

        <span className="font-semibold text-lg">

          Logout

        </span>

      </button>

    </aside>
  )
}

export default Sidebar