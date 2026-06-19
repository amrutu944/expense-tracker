import { useEffect, useState } from 'react'

import DashboardLayout from '../layouts/DashboardLayout'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatsCard from '../components/dashboard/StatsCard'
import ExpenseTable from '../components/table/ExpenseTable'
import PieChartBox from '../components/charts/PieChartBox'
import LineChartBox from '../components/charts/LineChartBox'
import AddExpenseForm from '../components/dashboard/AddExpenseForm'
import AddIncomeForm from '../components/dashboard/AddIncomeForm'

import API from '../services/api'

function Dashboard() {
  const [expenses, setExpenses] =
    useState([])

  const [income, setIncome] =
    useState([])

  const [filteredExpenses, setFilteredExpenses] =
    useState([])

  // FETCH EXPENSES
  const fetchExpenses =
    async () => {
      try {
        const { data } =
          await API.get(
            '/expenses'
          )

        setExpenses(data)
        setFilteredExpenses(
          data
        )
      } catch (error) {
        console.log(error)
      }
    }

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
    fetchExpenses()
    fetchIncome()
  }, [])

  // TOTALS
  const totalExpenses =
    expenses.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    )

  const totalIncome =
    income.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    )

  const remainingBalance =
    totalIncome -
    totalExpenses

  const savingsPercentage =
    totalIncome > 0
      ? (
          (remainingBalance /
            totalIncome) *
          100
        ).toFixed(1)
      : 0

  return (
    <DashboardLayout>

      {/* HEADER */}
      <DashboardHeader
        expenses={expenses}
        setFilteredExpenses={
          setFilteredExpenses
        }
      />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">

        <StatsCard
          title="Income"
          amount={totalIncome}
          color="green"
        />

        <StatsCard
          title="Expenses"
          amount={
            totalExpenses
          }
          color="red"
        />

        <StatsCard
          title="Balance"
          amount={
            remainingBalance
          }
          color="cyan"
        />

        <StatsCard
          title="Savings %"
          amount={`${savingsPercentage}%`}
          color="purple"
          isPercentage
        />

      </div>

      {/* FORMS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mt-8">

        <div className="rounded-[32px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl p-7 shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:scale-[1.01] transition-all duration-300">

          <AddExpenseForm
            fetchExpenses={
              fetchExpenses
            }
          />

        </div>

        <div className="rounded-[32px] bg-[#111827]/70 border border-white/10 backdrop-blur-xl p-7 shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:scale-[1.01] transition-all duration-300">

          <AddIncomeForm
            fetchIncome={
              fetchIncome
            }
          />

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mt-10">

        <PieChartBox
          expenses={
            filteredExpenses
          }
        />

        <LineChartBox
          expenses={
            filteredExpenses
          }
        />

      </div>

      {/* RECENT TRANSACTIONS */}
      <ExpenseTable
        expenses={
          filteredExpenses
        }
        income={income}
        fetchExpenses={
          fetchExpenses
        }
        fetchIncome={
          fetchIncome
        }
      />

    </DashboardLayout>
  )
}

export default Dashboard