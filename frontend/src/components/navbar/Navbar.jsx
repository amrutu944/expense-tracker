import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-3xl font-bold text-cyan-400">
            ExpenseFlow
          </h1>
        </Link>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <Link to="/login">
            <button className="px-5 py-2 rounded-xl hover:bg-white/10 transition-all duration-300">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition-all duration-300">
              Get Started
            </button>
          </Link>

        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar