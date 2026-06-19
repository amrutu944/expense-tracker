import {
  useEffect,
  useState,
} from 'react'

import {
  Receipt,
  TrendingDown,
  Calendar,
} from 'lucide-react'

import DashboardLayout from '../layouts/DashboardLayout'
import ExpenseTable from '../components/table/ExpenseTable'
import LineChartBox from '../components/charts/LineChartBox'
import PieChartBox from '../components/charts/PieChartBox'
import API from '../services/api'

function Expenses() {
  const [expenses, setExpenses] =
    useState([])

  const [showForm, setShowForm] =
    useState(false)

  const [title, setTitle] =
    useState('')

  const [amount, setAmount] =
    useState('')

  const [category, setCategory] =
    useState('')

  // FETCH EXPENSES
  const fetchExpenses =
    async () => {
      try {
        const { data } =
          await API.get(
            '/expenses'
          )

        setExpenses(data)
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    fetchExpenses()
  }, [])

  // ADD EXPENSE
  const handleAddExpense =
    async e => {
      e.preventDefault()

      if (
        !title ||
        !amount ||
        !category
      ) {
        alert(
          'Please fill all fields'
        )
        return
      }

      try {
        await API.post(
          '/expenses',
          {
            title,
            amount:
              Number(amount),
            category,
          }
        )

        setTitle('')
        setAmount('')
        setCategory('')
        setShowForm(false)

        fetchExpenses()
      } catch (error) {
        console.log(error)
      }
    }

  // TOTALS
  const totalExpenses =
    expenses.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    )

  const highestExpense =
    expenses.length > 0
      ? Math.max(
          ...expenses.map(
            item =>
              item.amount
          )
        )
      : 0

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">

        <div>

          <p className="text-red-400 uppercase tracking-widest font-semibold mb-2">

            Finance Tracker

          </p>

          <h1 className="text-5xl md:text-7xl font-black">

            Expenses

          </h1>

          <p className="text-slate-400 mt-4 text-lg">

            Manage and track
            all your expenses

          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(
              !showForm
            )
          }
          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 rounded-3xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          {showForm
            ? 'Close'
            : '+ Add Expense'}
        </button>

      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-10 p-8 rounded-[32px] border border-white/10 bg-[#111827]/70 backdrop-blur-xl">

          <h2 className="text-3xl font-black mb-8">

            Add Expense

          </h2>

          <form
            onSubmit={
              handleAddExpense
            }
            className="grid grid-cols-1 md:grid-cols-4 gap-5"
          >

            <input
              type="text"
              placeholder="Expense Title"
              value={title}
              onChange={e =>
                setTitle(
                  e.target
                    .value
                )
              }
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e =>
                setAmount(
                  e.target
                    .value
                )
              }
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={e =>
                setCategory(
                  e.target
                    .value
                )
              }
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl font-bold hover:scale-105 transition-all"
            >
              Add Expense
            </button>

          </form>

        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10">

        <div className="p-8 rounded-[32px] bg-[#111827]/70 border border-cyan-500/20 backdrop-blur-xl hover:scale-[1.01] transition-all">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">

                Total Expenses

              </p>

              <h1 className="text-5xl font-black text-cyan-400 mt-4">

                ₹
                {
                  totalExpenses
                }

              </h1>

            </div>

            <Receipt
              className="text-cyan-400"
              size={42}
            />

          </div>

        </div>

        <div className="p-8 rounded-[32px] bg-[#111827]/70 border border-red-500/20 backdrop-blur-xl hover:scale-[1.01] transition-all">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">

                Highest Expense

              </p>

              <h1 className="text-5xl font-black text-red-400 mt-4">

                ₹
                {
                  highestExpense
                }

              </h1>

            </div>

            <TrendingDown
              className="text-red-400"
              size={42}
            />

          </div>

        </div>

        <div className="p-8 rounded-[32px] bg-[#111827]/70 border border-purple-500/20 backdrop-blur-xl hover:scale-[1.01] transition-all">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">

                This Month

              </p>

              <h1 className="text-5xl font-black text-purple-400 mt-4">

                ₹
                {
                  totalExpenses
                }

              </h1>

            </div>

            <Calendar
              className="text-purple-400"
              size={42}
            />

          </div>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mb-10">

        {/* PIE */}
        <PieChartBox
          expenses={
            expenses
          }
        />

        {/* LINE */}
        <LineChartBox
          expenses={
            expenses
          }
        />

      </div>

      {/* TABLE */}
      <ExpenseTable
        expenses={
          expenses
        }
        income={[]}
        fetchExpenses={
          fetchExpenses
        }
      />

    </DashboardLayout>
  )
}

export default Expenses