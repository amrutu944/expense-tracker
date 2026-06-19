import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import API from '../../services/api'

function ExpenseTable({
  expenses = [],
  income = [],
  fetchExpenses,
  fetchIncome,
}) {
  // DELETE EXPENSE
  const deleteExpense =
    async id => {
      try {
        await API.delete(
          `/expenses/${id}`
        )

        toast.success(
          'Expense deleted'
        )

        fetchExpenses()
      } catch (error) {
        toast.error(
          'Delete failed'
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
      } catch (error) {
        toast.error(
          'Delete failed'
        )
      }
    }

  // COMBINE TRANSACTIONS
  const transactions = [
    ...expenses.map(item => ({
      ...item,
      type: 'expense',
      displayTitle:
        item.title,
    })),

    ...income.map(item => ({
      ...item,
      title: item.source,
      category:
        'Income',
      type: 'income',
      displayTitle:
        item.source,
    })),
  ]

  // SORT BY DATE
  const sortedTransactions =
    transactions.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    )

  return (
    <div className="mt-10 rounded-[32px] overflow-hidden border border-white/10 bg-[#111827]/70 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.15)]">

      {/* HEADER */}
      <div className="p-8 border-b border-white/10">

        <h1 className="text-4xl font-black">

          Recent Transactions

        </h1>

        <p className="text-slate-400 mt-2 text-lg">

          Track your latest
          financial activity

        </p>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-white/[0.03]">

            <tr>

              <th className="text-left px-8 py-6 text-lg font-semibold">

                Title

              </th>

              <th className="text-left px-8 py-6 text-lg font-semibold">

                Category

              </th>

              <th className="text-left px-8 py-6 text-lg font-semibold">

                Type

              </th>

              <th className="text-left px-8 py-6 text-lg font-semibold">

                Date

              </th>

              <th className="text-left px-8 py-6 text-lg font-semibold">

                Amount

              </th>

              <th className="text-left px-8 py-6 text-lg font-semibold">

                Action

              </th>

            </tr>

          </thead>

          <tbody>

            {sortedTransactions.length ===
            0 ? (
              <tr>

                <td
                  colSpan="6"
                  className="text-center py-20 text-slate-500 text-xl"
                >

                  No transactions
                  found

                </td>

              </tr>
            ) : (
              sortedTransactions.map(
                item => (
                  <tr
                    key={
                      item._id
                    }
                    className="border-t border-white/5 hover:bg-white/[0.03] transition-all duration-300"
                  >

                    {/* TITLE */}
                    <td className="px-8 py-7">

                      <h3 className="font-bold text-lg text-white">

                        {
                          item.displayTitle
                        }

                      </h3>

                    </td>

                    {/* CATEGORY */}
                    <td className="px-8 py-7">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border capitalize ${
                          item.type ===
                          'income'
                            ? 'bg-green-500/15 text-green-400 border-green-500/20'
                            : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
                        }`}
                      >

                        {
                          item.category
                        }

                      </span>

                    </td>

                    {/* TYPE */}
                    <td className="px-8 py-7">

                      <span
                        className={`font-bold capitalize ${
                          item.type ===
                          'income'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >

                        {
                          item.type
                        }

                      </span>

                    </td>

                    {/* DATE */}
                    <td className="px-8 py-7 text-slate-300">

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

                    </td>

                    {/* AMOUNT */}
                    <td className="px-8 py-7">

                      <h2
                        className={`text-2xl font-black ${
                          item.type ===
                          'income'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >

                        ₹
                        {
                          item.amount
                        }

                      </h2>

                    </td>

                    {/* ACTION */}
                    <td className="px-8 py-7">

                      <button
                        onClick={() =>
                          item.type ===
                          'income'
                            ? deleteIncome(
                                item._id
                              )
                            : deleteExpense(
                                item._id
                              )
                        }
                        className="px-5 py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105"
                      >

                        <Trash2
                          size={18}
                        />

                        Delete

                      </button>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ExpenseTable