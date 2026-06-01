import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { images } from '../../assets/Photo'
import { useAmbassadors } from '../../context/AmbassadorContext'

export default function AmbassadorDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getAmbassadorById, loadAmbassador, loadingAmbassador } = useAmbassadors()

  const [ambassador, setAmbassador] = useState(null)
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all-time')

  const payoutHistory = ambassador?.payoutHistory || []
  const hasPayoutHistory = payoutHistory.length > 0
  const showHistoryTabs = hasPayoutHistory
  const balanceText = ambassador?.payoutSetup ? ambassador.currentBalance || '$--' : '$--'

  useEffect(() => {
    const load = async () => {
      const cached = getAmbassadorById(id)
      if (cached) {
        setAmbassador(cached)
        return
      }
      const data = await loadAmbassador(id)
      setAmbassador(data)
    }

    load()
  }, [id, getAmbassadorById, loadAmbassador])

  if (loadingAmbassador && !ambassador) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!ambassador) {
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/ambassadors/list')}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-3"
          >
            <ArrowLeft size={18} /> Back to List
          </button>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Admin / Ambassador</p>
          <h1 className="text-4xl font-bold text-slate-900">Ambassador Earnings</h1>
        </div>

        {/* Top Summary Cards - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Earnings this month', value: ambassador.earningsThisMonth },
            { label: 'Pending Earnings', value: ambassador.pendingEarnings },
            { label: 'Total Paid Earnings', value: ambassador.totalPaid },
            { label: 'Unpaid Earnings', value: ambassador.unpaidEarnings },
          ].map((card, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-slate-200 p-5 flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              </div>
              <button className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition">
                <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
                  <path d="M1 1H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Earning Metrics (2/3 width) */}
          <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-8">
            <h2 className="text-base font-semibold text-slate-900 mb-8">Earning Metrics</h2>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Current Earning Balance */}
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Current Earning Balance</p>
                <p className="text-sm text-slate-500 mb-4">Transferable Amount</p>
                <p className="text-5xl font-bold text-slate-900 mb-6">
                  {balanceText}
                </p>
                <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
                  {ambassador.payoutSetup 
                    ? 'Payout method has been set up successfully' 
                    : 'Payout not available'}
                </div>
              </div>

              {/* Payout History */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-slate-900">Payout History</h3>
                  {showHistoryTabs && (
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                      <option value="all-time">All time</option>
                      <option value="30-days">Last 30 days</option>
                      <option value="90-days">Last 90 days</option>
                    </select>
                  )}
                </div>

                {showHistoryTabs && (
                  <div className="flex gap-3 mb-5">
                    {['all', 'deposits', 'transfers'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedTab === tab
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tab === 'all' ? 'All' : tab === 'deposits' ? 'Earning Deposits' : 'Earning Transfers'}
                      </button>
                    ))}
                  </div>
                )}

                {/* History Items or Empty State */}
                {hasPayoutHistory ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {payoutHistory.map((item) => (
                      <div key={item.id} className="flex items-start justify-between bg-slate-50 p-4 rounded-lg border border-slate-100 hover:bg-slate-100 transition">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.date}</p>
                        </div>
                        <p className={`text-sm font-semibold whitespace-nowrap ml-4 ${
                          item.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {item.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                    <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">{ambassador.payoutSetup ? 'No payout history yet' : 'No Payment Information yet'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Payout Account Information (1/3 width) */}
          <div className="rounded-3xl bg-white border border-slate-200 p-8">
            <h3 className="text-base font-semibold text-slate-900 mb-6">Payout account information</h3>

            {ambassador.payoutSetup && ambassador.payoutAccountInfo ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Payment method</p>
                  <p className="text-sm text-slate-700 font-semibold mt-1">{ambassador.payoutAccountInfo.method}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bank Name</p>
                  <p className="text-sm text-slate-700 font-semibold mt-1">{ambassador.payoutAccountInfo.bankName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account Number</p>
                  <p className="text-sm text-slate-700 font-semibold mt-1">{ambassador.payoutAccountInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bank Branch</p>
                  <p className="text-sm text-slate-700 font-semibold mt-1">{ambassador.payoutAccountInfo.bankBranch}</p>
                </div>
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
