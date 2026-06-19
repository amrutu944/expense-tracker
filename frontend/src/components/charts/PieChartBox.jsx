import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = [
  '#06b6d4',
  '#8b5cf6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
]

function PieChartBox({
  expenses = [],
}) {
  const categoryMap = {}

  expenses.forEach(item => {
    const category =
      item.category ||
      'Others'

    const amount =
      Number(
        item.amount
      ) || 0

    if (
      categoryMap[
        category
      ]
    ) {
      categoryMap[
        category
      ] += amount
    } else {
      categoryMap[
        category
      ] = amount
    }
  })

  const data =
    Object.keys(
      categoryMap
    ).map(key => ({
      name: key,
      value:
        categoryMap[key],
    }))

  return (
    <div className="p-8 rounded-[32px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.08)] hover:scale-[1.01] transition-all duration-300">

      {/* HEADER */}
      <div className="mb-8">

        <h2 className="text-4xl font-black">

          Expense Categories

        </h2>

        <p className="text-slate-400 mt-2">

          Spending
          distribution by
          category

        </p>

      </div>

      {/* EMPTY STATE */}
      {data.length ===
      0 ? (
        <div className="h-[340px] flex items-center justify-center text-slate-500 text-xl">

          No category data
          available

        </div>
      ) : (
        <>
          {/* PIE CHART */}
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>

              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
              >

                {data.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={
                        index
                      }
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip
                contentStyle={{
                  background:
                    '#0f172a',
                  border:
                    '1px solid rgba(255,255,255,0.1)',
                  borderRadius:
                    '18px',
                  color:
                    '#fff',
                }}
                formatter={value => [
                  `₹ ${value}`,
                  'Amount',
                ]}
              />

            </PieChart>

          </ResponsiveContainer>

          {/* CATEGORY LIST */}
          <div className="flex flex-wrap gap-4 mt-5">

            {data.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item.name
                  }
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10"
                >

                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background:
                        COLORS[
                          index %
                            COLORS.length
                        ],
                    }}
                  ></div>

                  <span className="text-slate-300 capitalize">

                    {
                      item.name
                    }

                  </span>

                  <span className="font-bold text-white">

                    ₹
                    {
                      item.value
                    }

                  </span>

                </div>
              )
            )}

          </div>
        </>
      )}

    </div>
  )
}

export default PieChartBox