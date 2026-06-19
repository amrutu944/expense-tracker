import {
  useEffect,
  useState,
} from 'react'

import toast from 'react-hot-toast'

import {
  Wallet,
  Trash2,
} from 'lucide-react'

import DashboardLayout from '../layouts/DashboardLayout'
import LineChartBox from '../components/charts/LineChartBox'
import PieChartBox from '../components/charts/PieChartBox'
import API from '../services/api'

function Income() {
  const [income, setIncome] =
    useState([])

  const [formData, setFormData] =
    useState({
      source: '',
      amount: '',
    })

  // FETCH INCOME
  const fetchIncome =
    async () => {
      try {
        const { data } =
          await API.get('/income')

        setIncome(data)
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    fetchIncome()
  }, [])

  // HANDLE CHANGE
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  // ADD INCOME
  const handleSubmit =
    async e => {
      e.preventDefault()

      try {
        await API.post(
          '/income',
          {
            ...formData,
            amount:
              Number(
                formData.amount
              ),
          }
        )

        toast.success(
          'Income added'
        )

        setFormData({
          source: '',
          amount: '',
        })

        fetchIncome()
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'Failed to add income'
        )
      }
    }

  // DELETE INCOME
  const deleteIncome =
    async id => {
      try {
        await API.delete(
          `/income/${id}`
        )

        toast.success(
          'Income deleted'
        )

        fetchIncome()
      } catch {
        toast.error(
          'Delete failed'
        )
      }
    }

  // TOTAL
  const totalIncome =
    income.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    )

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-10">

        <p className="text-emerald-400 uppercase tracking-widest font-semibold mb-2">

          Finance Tracker

        </p>

        <h1 className="text-6xl md:text-7xl font-black">

          Income

        </h1>

        <p className="text-slate-400 mt-3 text-lg">

          Track and manage
          all your income
          sources

        </p>

      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mb-10">

        {/* TOTAL CARD */}
        <div className="rounded-[32px] bg-[#111827]/70 border border-emerald-500/20 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:scale-[1.01] transition-all">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400 text-lg">

                Total Income

              </p>

              <h1 className="text-5xl md:text-6xl font-black text-emerald-400 mt-4">

                ₹ {totalIncome}

              </h1>

            </div>

            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">

              <Wallet size={38} />

            </div>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl p-8 space-y-5"
        >

          <h2 className="text-3xl font-black">

            Add Income

          </h2>

          <input
            type="text"
            name="source"
            placeholder="Income source"
            value={
              formData.source
            }
            onChange={
              handleChange
            }
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={
              formData.amount
            }
            onChange={
              handleChange
            }
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
          />

          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 font-bold hover:scale-[1.02] transition-all">

            Add Income

          </button>

        </form>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mb-10">

        {/* PIE CHART */}
        <PieChartBox
          expenses={income.map(
            item => ({
              ...item,
              category:
                item.source,
            })
          )}
        />

        {/* LINE CHART */}
        <LineChartBox
          expenses={income}
        />

      </div>

      {/* LIST */}
      <div className="space-y-5">

        {income.map(item => (
          <div
            key={item._id}
            className="p-7 rounded-[30px] bg-[#111827]/70 border border-white/10 flex justify-between items-center hover:scale-[1.01] transition-all"
          >

            <div>

              <h2 className="text-2xl font-bold">

                {
                  item.source
                }

              </h2>

              <p className="text-slate-400 mt-2">

                {new Date(
                  item.createdAt
                ).toLocaleDateString(
                  'en-IN',
                  {
                    day: '2-digit',
                    month:
                      'short',
                    year:
                      'numeric',
                  }
                )}

              </p>

            </div>

            <div className="flex items-center gap-6">

              <h1 className="text-3xl font-black text-emerald-400">

                ₹
                {
                  item.amount
                }

              </h1>

              <button
                onClick={() =>
                  deleteIncome(
                    item._id
                  )
                }
                className="w-14 h-14 rounded-2xl bg-red-500/15 hover:bg-red-500/20 flex items-center justify-center text-red-400"
              >

                <Trash2
                  size={22}
                />

              </button>

            </div>

          </div>
        ))}

      </div>

    </DashboardLayout>
  )
}

export default Income