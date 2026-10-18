import React, { useState, useEffect } from 'react'
import { api } from '../../utils/apiClient'
import { showSuccess, showError } from '../../utils/toastConfig'

const methodLabels = {
  bank_transfer: 'Bank transfer',
  mobile_money: 'Mobile money',
  paypal: 'PayPal',
  crypto: 'Crypto',
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(value))
}

// 'accountNumber' -> 'Account number'
function prettyKey(key) {
  const spaced = key.replace(/([A-Z])/g, ' $1').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [busyId, setBusyId] = useState(null) // which payout is being processed right now

  useEffect(() => {
    loadPayouts()
  }, [])

  async function loadPayouts() {
    try {
      const res = await api.get('/api/ambassadors/payouts')
      setPayouts(res.data.payouts)
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // action is 'approve' or 'mark-paid' - they match the backend URLs exactly
  async function handleAction(payout, action) {
    const name = `${payout.first_name} ${payout.last_name}`
    const question =
      action === 'approve'
        ? `Approve the payout of ${formatMoney(payout.amount)} for ${name}?`
        : `Confirm that you have ALREADY sent ${formatMoney(payout.amount)} to ${name}?`

    if (!window.confirm(question)) return

    setBusyId(payout.id)
    try {
      await api.patch(`/api/ambassadors/payouts/${payout.id}/${action}`)
      showSuccess(action === 'approve' ? 'Payout approved' : 'Payout marked as paid')
      await loadPayouts()
    } catch (err) {
      showError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const visiblePayouts = payouts.filter(
    (p) => statusFilter === 'All' || p.status === statusFilter
  )

  const awaitingApproval = payouts.filter((p) => p.status === 'pending')
  const awaitingPayment = payouts.filter((p) => p.status === 'approved')
  const sumOf = (list) => list.reduce((total, p) => total + Number(p.amount), 0)

  if (loading) {
    return <div className="p-8 text-slate-500">Loading payouts...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">

        <div className="mb-8 space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin / Ambassadors</p>
          <h1 className="text-3xl font-semibold text-slate-900">Payout Requests</h1>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Awaiting approval</p>
            <p className="text-2xl font-semibold text-slate-900">
              {formatMoney(sumOf(awaitingApproval))}
            </p>
            <p className="text-xs text-slate-400">{awaitingApproval.length} request(s)</p>
          </div>
          <div className="rounded-3xl bg-white border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Approved, waiting to be paid</p>
            <p className="text-2xl font-semibold text-slate-900">
              {formatMoney(sumOf(awaitingPayment))}
            </p>
            <p className="text-xs text-slate-400">{awaitingPayment.length} request(s)</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center rounded-3xl bg-white border border-slate-200 p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Ambassador</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Pay to</th>
                  <th className="px-6 py-4 font-semibold">Requested</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {visiblePayouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{p.first_name} {p.last_name}</div>
                      <div className="text-xs text-slate-500">{p.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{formatMoney(p.amount)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {methodLabels[p.payoutMethod] || p.payoutMethod}
                      </div>
                      {p.payoutDetails &&
                        Object.entries(p.payoutDetails).map(([key, value]) => (
                          <div key={key} className="text-xs text-slate-500 break-all">
                            {prettyKey(key)}: {value}
                          </div>
                        ))}
                    </td>
                    <td className="px-6 py-4">{new Date(p.requested_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[p.status] || 'bg-slate-100 text-slate-700'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'pending' && (
                        <button
                          onClick={() => handleAction(p, 'approve')}
                          disabled={busyId === p.id}
                          className="rounded-full bg-[#345867] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2a4755] disabled:opacity-50"
                        >
                          {busyId === p.id ? 'Working...' : 'Approve'}
                        </button>
                      )}
                      {p.status === 'approved' && (
                        <button
                          onClick={() => handleAction(p, 'mark-paid')}
                          disabled={busyId === p.id}
                          className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {busyId === p.id ? 'Working...' : 'Mark as paid'}
                        </button>
                      )}
                      {p.status === 'paid' && (
                        <span className="text-xs text-slate-400">
                          Paid {p.processed_at ? new Date(p.processed_at).toLocaleDateString() : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {visiblePayouts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                      No payout requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}