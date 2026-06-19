import {
  useEffect,
  useState,
} from 'react'

import DashboardLayout from '../layouts/DashboardLayout'

import API from '../services/api'

import PieChartBox from '../components/charts/PieChartBox'

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

function Analytics() {
  const [expenses, setExpenses] =
    useState([])

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

  // GROUP DATA BY DATE
  const groupedData = {}

  ;(expenses || []).forEach(
    item => {
      const date = new Date(
        item.createdAt
      )

      const day =
        date.toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'short',
          }
        )

      if (groupedData[day]) {
        groupedData[day] +=
          item.amount
      } else {
        groupedData[day] =
          item.amount
      }
    }
  )

  const chartData = Object.keys(
    groupedData
  ).map(key => ({
    day: key,
    amount: groupedData[key],
  }))

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-12">

        <h1 className="text-6xl md:text-7xl font-black">

          Analytics

        </h1>

        <p className="text-slate-400 mt-4 text-lg">

          Financial insights and spending trends

        </p>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* PIE CHART */}
        <PieChartBox
          expenses={expenses}
        />

        {/* TREND CHART */}
        <div className="p-8 rounded-[30px] bg-[#111827]/80 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.05)]">

          <div className="flex items-center justify-between mb-10">

            <div>

              <h2 className="text-4xl font-black">

                Expense Trends

              </h2>

              <p className="text-slate-400 mt-2">

                Daily spending overview

              </p>

            </div>

          </div>

          {chartData.length ===
          0 ? (
            <div className="h-[350px] flex items-center justify-center text-slate-500 text-lg">

              No analytics data found

            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <ComposedChart
                data={chartData}
              >
                <defs>

                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#06b6d4"
                      stopOpacity={
                        0.9
                      }
                    />

                    <stop
                      offset="95%"
                      stopColor="#06b6d4"
                      stopOpacity={
                        0
                      }
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                />

                <YAxis stroke="#94a3b8" />

                <Tooltip
                  contentStyle={{
                    background:
                      '#0f172a',
                    border:
                      '1px solid rgba(255,255,255,0.1)',
                    borderRadius:
                      '16px',
                    color: '#fff',
                  }}
                />

                <Bar
                  dataKey="amount"
                  fill="#0ea5e9"
                  radius={[
                    12,
                    12,
                    0,
                    0,
                  ]}
                  barSize={45}
                />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#22d3ee"
                  fill="url(#expenseGradient)"
                  strokeWidth={4}
                />

              </ComposedChart>
            </ResponsiveContainer>
          )}

        </div>

      </div>

    </DashboardLayout>
  )
}

export default Analytics