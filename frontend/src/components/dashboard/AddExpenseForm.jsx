import { useState } from 'react'
import toast from 'react-hot-toast'
import API from '../../services/api'

function AddExpenseForm({
  fetchExpenses,
}) {

  const [formData, setFormData] =
    useState({
      title: '',
      amount: '',
      category: '',
    })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await API.post(
        '/expenses',
        formData
      )

      toast.success(
        'Expense added'
      )

      setFormData({
        title: '',
        amount: '',
        category: '',
      })

      fetchExpenses()

    } catch (_error) {

      toast.error(
        'Failed to add expense'
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 p-7 rounded-[28px] bg-[#0f172a] border border-white/5"
    >

      <h2 className="text-[28px] font-bold mb-7">

        Add Expense

      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={formData.title}
          onChange={handleChange}
          className="px-5 h-[58px] rounded-2xl bg-[#111827] border border-white/10 outline-none"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="px-5 h-[58px] rounded-2xl bg-[#111827] border border-white/10 outline-none"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="px-5 h-[58px] rounded-2xl bg-[#111827] border border-white/10 outline-none"
        />

      </div>

      <button className="mt-6 px-7 h-[56px] rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-all">

        Add Expense

      </button>

    </form>
  )
}

export default AddExpenseForm