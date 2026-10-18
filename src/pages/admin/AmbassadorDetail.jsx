import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../../utils/apiClient'
import { showError } from '../../utils/toastConfig'

// One place that decides how money looks. To change the currency
// later, you change this one line.
const formatMoney = (value) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(value))

const methodLabels = {
  mobile_money: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
  paypal: 'PayPal',
  crypto: 'Crypto',
}

const payoutStatusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AmbassadorDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      try {
        const res = await api.get(`/api/ambassadors/${id}`)
        setDetail(res.data)
      } catch (err) {
        showError(err.message)
        setDetail(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <button
            onClick={() => navigate('/admin/ambassadors/list')}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-4"
          >
            <ArrowLeft size={18} /> Back to List
          </button>
          <p className="text-slate-600">Ambassador not found</p>
        </div>
      </div>
    )
  }

  const { ambassador, stats, payoutHistory } = detail
  const payoutSetup = Boolean(ambassador.payout_method && ambassador.payout_details)

  const summaryCards = [
    { label: 'Earnings this month', value: stats.earningsThisMonth },
    { label: 'Pending Earnings', value: stats.pendingEarnings },
    { label: 'Total Paid Earnings', value: stats.totalPaid },
    { label: 'Unpaid Earnings', value: stats.unpaidEarnings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/ambassadors/list')}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-3"
          >
            <ArrowLeft size={18} /> Back to List
          </button>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Admin / Ambassador</p>
          <h1 className="text-4xl font-bold text-slate-900">
            {ambassador.first_name} {ambassador.last_name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{ambassador.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-2xl bg-white border border-slate-200 p-5">
              <p className="text-xs text-slate-500 font-medium mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{formatMoney(card.value)}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-8">
            <h2 className="text-base font-semibold text-slate-900 mb-8">Earning Metrics</h2>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Current Earning Balance</p>
                <p className="text-sm text-slate-500 mb-4">Transferable Amount</p>
                <p className="text-5xl font-bold text-slate-900 mb-6">
                  {payoutSetup ? formatMoney(stats.availableBalance) : '--'}
                </p>
                <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
                  {payoutSetup
                    ? 'Payout method has been set up successfully'
                    : 'Payout not available'}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-6">Payout History</h3>

                {payoutHistory.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {payoutHistory.map((item) => (
                      <div key={item.id} className="flex items-start justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Payout request #{item.id}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(item.requested_at).toLocaleDateString()}
                          </p>
                          <span className={`inline-flex mt-2 rounded-full px-2 py-0.5 text-xs font-semibold ${payoutStatusStyles[item.status]}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold whitespace-nowrap ml-4 text-slate-900">
                          {formatMoney(item.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm">{payoutSetup ? 'No payout history yet' : 'No Payment Information yet'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-8">
            <h3 className="text-base font-semibold text-slate-900 mb-6">Payout account information</h3>

            {payoutSetup ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Payment method</p>
                  <p className="text-sm text-slate-700 font-semibold mt-1">
                    {methodLabels[ambassador.payout_method] || ambassador.payout_method}
                  </p>
                </div>
                {Object.entries(ambassador.payout_details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm text-slate-700 font-semibold mt-1">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No Payment Information yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}