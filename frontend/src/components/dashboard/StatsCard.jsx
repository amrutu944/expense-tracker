import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from 'lucide-react'

function StatsCard({
  title,
  amount,
  color = 'cyan',
  isPercentage = false,
}) {
  const cardStyles = {
    green: {
      bg: 'from-emerald-500/20 to-green-500/10',
      border:
        'border-emerald-500/20',
      text: 'text-emerald-400',
      glow:
        'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
      icon: (
        <TrendingUp
          size={30}
        />
      ),
    },

    red: {
      bg: 'from-red-500/20 to-rose-500/10',
      border:
        'border-red-500/20',
      text: 'text-red-400',
      glow:
        'shadow-[0_0_40px_rgba(239,68,68,0.15)]',
      icon: (
        <TrendingDown
          size={30}
        />
      ),
    },

    cyan: {
      bg: 'from-cyan-500/20 to-blue-500/10',
      border:
        'border-cyan-500/20',
      text: 'text-cyan-400',
      glow:
        'shadow-[0_0_40px_rgba(6,182,212,0.15)]',
      icon: (
        <Wallet size={30} />
      ),
    },

    purple: {
      bg: 'from-purple-500/20 to-pink-500/10',
      border:
        'border-purple-500/20',
      text:
        'text-purple-400',
      glow:
        'shadow-[0_0_40px_rgba(168,85,247,0.15)]',
      icon: (
        <PiggyBank
          size={30}
        />
      ),
    },
  }

  const style =
    cardStyles[color]

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] border ${style.border} bg-[#111827]/70 backdrop-blur-xl p-7 transition-all duration-300 hover:scale-[1.03] ${style.glow}`}
    >

      {/* Gradient Glow */}
      <div
        className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${style.bg} blur-3xl opacity-70`}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">

        <div>

          <p className="text-slate-400 text-lg font-medium">

            {title}

          </p>

          <h1
            className={`text-4xl md:text-5xl font-black mt-5 ${style.text}`}
          >

            {isPercentage
              ? amount
              : `₹ ${amount}`}

          </h1>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${style.bg} ${style.text}`}
        >

          {style.icon}

        </div>

      </div>

    </div>
  )
}

export default StatsCard