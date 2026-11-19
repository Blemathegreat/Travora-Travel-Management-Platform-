import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell } from "recharts";
import EarningMetrics from "./EarningMetrics"
import EarningCards from "./EarningCards.jsx"
import { images } from '../../assets/Photo'
import { api } from '../../utils/apiClient'
import { formatMoney } from '../../utils/money'

const ease = [0.22, 1, 0.36, 1]
const PALETTE = ["#FF6C00", "#B3206F", "#D33333", "#1F283D", "#FFC9A0"]
const referralsColors = ["#FF7711", "#1F283D"]

// "no_show" -> "No show"
const nice = (text) => {
  const spaced = String(text).replace(/_/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

// One small donut chart with its legend. We use it four times, so we write it once.
function DonutCard({ title, data, index }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease, delay: index * 0.08 }}
      className="flex flex-col items-center"
    >
      <h3 className="text-xs font-semibold text-gray-600 mb-3">{title}</h3>
      {total === 0 ? (
        <div className="h-[140px] w-[140px] rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400 text-center px-4">
          No data yet
        </div>
      ) : (
        <PieChart width={160} height={160}>
          <Pie data={data} dataKey="value" cx={75} cy={75} innerRadius={45} outerRadius={70}>
            {data.map((item, i) => (
              <Cell key={item.name} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      )}
      <div className="mt-3 space-y-1 text-xs w-full max-w-[200px]">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2.5 h-[24px]">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }}></div>
            <span className="text-[#666666] text-[11px] leading-[16px] truncate">{nice(item.name)}</span>
            <span className="ml-auto font-semibold text-[#333333] text-[11px]">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ReferralAnalysis() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0) // changing this number makes the effect run again ("Try again")

  useEffect(() => {
    let ignore = false // if the page closes or the year changes, we ignore the old answer
    setLoading(true)
    setError('')
    api
      .get(`/api/ambassadors/me/referral-activity?year=${year}`)
      .then((res) => { if (!ignore) setData(res?.data ?? res) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [year, reloadKey])

  // first load: nothing to show yet
  if (loading && !data) {
    return <div className="max-w-[1400px] mx-auto p-10 text-gray-500">Loading your referral activity...</div>
  }

  if (error && !data) {
    return (
      <div className="max-w-[1400px] mx-auto p-10 text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="px-5 py-2 rounded bg-[#345867] text-white hover:bg-[#2a4755]"
        >
          Try again
        </button>
      </div>
    )
  }

  const { cards, pies, referrals, monthlyEarnings, years } = data
  const successful = cards.successfulReferrals
  const pending = cards.pendingReferrals
  const total = cards.totalReferrals
  const referralsData = [
    { name: "Successful", value: successful },
    { name: "Pending", value: pending },
  ]
  const conversion = total === 0 ? 0 : Math.round((successful / total) * 100)

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen bg-[#ffffff] p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="bg-white  px-6 py-4">
          <h1 className="text-xl font-bold text-[#333333]">Referral Activity</h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg px-6 py-4">
          <h1 className="text-xl font-bold text-[#333333]">Referral Performance Overview</h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 py-4 w-full'>
          <EarningCards title="Earnings this month" amount={formatMoney(cards.earningsThisMonth)} percentageChange={null} subText="Approved and paid" />
          <EarningCards title="Total Earning (All Time)" amount={formatMoney(cards.earningsAllTime)} percentageChange={null} subText="Approved and paid" />
          <EarningCards title="Total Referral (All-time)" amount={String(total)} percentageChange={null} subText="People who signed up with your code" />
          <EarningCards title="Successful Referral" amount={String(successful)} percentageChange={null} subText="Earned you a commission" />
          <EarningCards title="Pending Referral" amount={String(pending)} percentageChange={null} subText="Signed up, no commission yet" />
        </div>

        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg px-6 py-4">
          <h1 className="text-xl font-bold text-[#333333]">Referral Analytics</h1>
        </div>

        {/* Referrals and Distribution Section */}
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 lg:gap-[50px] justify-between ">

          {/* Referrals Card */}
          <div className="bg-white  p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#333333]">Referrals</h2>
              <img src={images.referal} alt="Referral overview" className="h-20 w-auto object-contain" />
            </div>

            <div className="flex flex-col items-center">
              <div className="text-center mb-2">
                <div className="text-4xl font-bold text-[#333333]">{total}</div>
                <div className="text-sm text-gray-500">Referrals</div>
              </div>

              {/* Gauge Chart */}
              <div className="relative">
                {total === 0 ? (
                  <div className="h-[150px] w-[260px] flex items-center justify-center text-sm text-gray-400">No referrals yet</div>
                ) : (
                  <PieChart width={260} height={150}>
                    <Pie data={referralsData} dataKey="value" startAngle={180} endAngle={0} innerRadius={70} outerRadius={90} cy={120}>
                      {referralsData.map((entry, index) => (
                        <Cell key={index} fill={referralsColors[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-10 ">
                <div className="flex flex-col items-start gap-2">
                  <div className="text-lg font-bold text-start text-[#333333]">{successful}</div>
                  <div className="text-center flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF7711]"></div>
                    <div className="text-xs text-gray-500">Successful</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-bold text-start text-[#333333]">{pending}</div>
                  <div className="text-center flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1F283D]"></div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                </div>
              </div>

              {/* Blue banner */}
              <div className="mt-6 bg-[#00A3FF] text-white text-sm px-6 py-2 rounded">
                Conversion rate: {conversion}%
              </div>
            </div>
          </div>

          {/* Referral Distribution Card */}
          <div className="bg-white  p-6">
            <h2 className="text-base font-semibold text-[#333333] mb-6">Referral Distribution</h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <DonutCard index={0} title="Referral Status" data={pies.referralStatus} />
              <DonutCard index={1} title="Commission Status" data={pies.commissionStatus} />
              <DonutCard index={2} title="Services Booked" data={pies.servicesBooked} />
              <DonutCard index={3} title="Bookings Status" data={pies.bookingStatus} />
            </div>
          </div>

        </div>

        {/* EarningMetrics: now fed with real data */}
        <EarningMetrics
          monthly={monthlyEarnings}
          year={year}
          years={years}
          onYearChange={setYear}
          pendingEarnings={cards.pendingEarnings}
        />

        {/* The people she referred */}
        <div className="bg-white shadow-sm rounded-lg px-6 py-4">
          <h1 className="text-xl font-bold text-[#333333]">Your Referrals</h1>
        </div>
        <div className="px-2 sm:px-6 pb-10">
          {referrals.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              Nobody has signed up with your link yet. Share your referral link to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="py-3 pr-4 font-medium">Customer</th>
                    <th className="py-3 pr-4 font-medium">Joined</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease, delay: i * 0.05 }}
                      className="border-b border-gray-100"
                    >
                      <td className="py-3 pr-4 text-[#333333] font-medium">{r.name}</td>
                      <td className="py-3 pr-4 text-gray-600">{formatDate(r.joinedAt)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            r.status === 'earned' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {r.status === 'earned' ? 'Earned a commission' : 'Signed up'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}