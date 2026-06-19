import { Link } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import { motion } from 'framer-motion'

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full"></div>

      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-6xl md:text-8xl font-bold leading-tight"
        >
          Track Expenses
          <br />
          <span className="text-cyan-400">
            Like a Pro
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 max-w-2xl text-lg text-slate-400"
        >
          Modern expense tracking dashboard with analytics,
          beautiful charts, premium animations, and secure
          financial management features.
        </motion.p>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex gap-6"
            >

            <Link to="/register">
                <button className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-all duration-300">
                Get Started
                </button>
            </Link>

            <Link to="/login">
                <button className="px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/10 transition-all duration-300">
                Login
                </button>
            </Link>

            </motion.div>
      </div>
    </div>
  )
}

export default Home