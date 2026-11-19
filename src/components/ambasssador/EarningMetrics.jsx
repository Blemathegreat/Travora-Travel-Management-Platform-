import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatMoney } from '../../utils/money'

// The parent (ReferralAnalysis) loads the data and passes it in.
// This component only DRAWS: it holds no data of its own.
export default function EarningMetrics({ monthly = [], year, years = [], onYearChange, pendingEarnings = 0 }) {
  const hasEarnings = monthly.some((m) => m.amount > 0)

  return (
    <div className="  w-full sm:max-w-[1400px]   bg-[#ffffff] p-2 sm:p-6">
      <div className=" w-full sm:max-w-[1200px] mx-auto space-y-6">

        {/* Earning Metrics Section */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg px-6 py-4">
            <h1 className="text-xl font-bold text-[#333333]">Earning Metrics</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-center px-6 justify-between ">

            {/* Left Side - Bar Chart */}
            <div className="w-full lg:w-[700px]  lg:p-8">
              {/* Header with Dropdown */}
              <div className="flex gap-3 items-center justify-between mb-8">
                <h3 className="text-base font-semibold text-[#333333]">Monthly Earnings</h3>

                {/* Year Dropdown */}
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-[#333333] font-medium cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {/* Dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-[220px] sm:h-[260px] md:h-[300px] w-full relative">
                {!hasEarnings && (
                  <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 z-10 pointer-events-none">
                    No earnings in {year} yet
                  </p>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthly}
                    margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={true} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 13 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 13 }}
                      allowDecimals={false}
                      tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                    />
                    <Tooltip
                      cursor={{ fill: '#F3F4F6' }}
                      formatter={(value) => [formatMoney(value), 'Earned']}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#1F283D"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={12}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-gray-200"></div>

            {/* Right Side - Pending Earnings */}
            <div className="w-full flex flex-col items-center px-4 shadow-[0px_2px_8px_rgba(0,0,0,0.08)] justify-center py-8 md:px-10 lg:w-[400px]">
              <div className="text-center space-y-4 ">
                <p className="text-sm text-gray-500 font-medium">Pending earnings</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-[#1F283D] tracking-tight">{formatMoney(pendingEarnings)}</h2>
                <p className="text-xs text-gray-400 mt-2">Waiting for admin approval</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}