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

function LineChartBox({
  expenses = [],
}) {
  // GROUP BY DATE
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

      groupedData[day] =
        (groupedData[
          day
        ] || 0) +
        item.amount
    }
  )

  const data = Object.keys(
    groupedData
  ).map(key => ({
    day: key,
    amount:
      groupedData[key],
  }))

  return (
    <div className="p-8 rounded-[32px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.08)] hover:scale-[1.01] transition-all duration-300">

      {/* HEADER */}
      <div className="mb-10">

        <h2 className="text-4xl font-black">

          Expense Trends

        </h2>

        <p className="text-slate-400 mt-2">

          Daily spending
          analytics overview

        </p>

      </div>

      {/* EMPTY STATE */}
      {data.length ===
      0 ? (
        <div className="h-[350px] flex items-center justify-center text-slate-500 text-xl">

          No analytics data
          available

        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <ComposedChart
            data={data}
          >
            {/* GRADIENT */}
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
                  stopColor="#8b5cf6"
                  stopOpacity={
                    0
                  }
                />

              </linearGradient>

            </defs>

            {/* GRID */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            {/* AXIS */}
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                background:
                  '#0f172a',
                border:
                  '1px solid rgba(255,255,255,0.1)',
                borderRadius:
                  '20px',
                color: '#fff',
              }}
              formatter={value => [
                `₹ ${value}`,
                'Expense',
              ]}
            />

            {/* BAR */}
            <Bar
              dataKey="amount"
              fill="#8b5cf6"
              radius={[
                12,
                12,
                0,
                0,
              ]}
              barSize={42}
            />

            {/* LINE + AREA */}
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
  )
}

export default LineChartBox