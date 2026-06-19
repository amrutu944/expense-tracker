import { useState } from 'react'

import toast from 'react-hot-toast'

import API from '../../services/api'

function AddIncomeForm({
  fetchIncome,
}) {
  const [formData, setFormData] =
    useState({
      source: '',
      amount: '',
    })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  const submitHandler = async e => {
    e.preventDefault()

    try {
      await API.post(
        '/income',
        formData
      )

      toast.success(
        'Income added'
      )

      setFormData({
        source: '',
        amount: '',
      })

      fetchIncome()
    } catch (_error) {
      toast.error(
        'Failed to add income'
      )
    }
  }

  return (
    <div className="mt-10 p-8 rounded-[30px] bg-[#111827]/80 border border-white/10">

      <h2 className="text-[28px] font-bold mb-7">
        Add Income
      </h2>

      <form
        onSubmit={submitHandler}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >

        <input
          type="text"
          name="source"
          placeholder="Income Source"
          value={formData.source}
          onChange={handleChange}
          className="px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 outline-none"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 outline-none"
        />

        <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-slate-900 hover:scale-105 transition-all duration-300">

          Add Income

        </button>

      </form>

    </div>
  )
}

export default AddIncomeForm