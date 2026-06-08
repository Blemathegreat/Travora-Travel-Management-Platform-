import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function EarningMetrics() {
  const [selectedYear, setSelectedYear] = useState('2023')
  
  // Monthly earnings data
  const monthlyData = [
    { month: 'Jan', amount: 35 },
    { month: 'Feb', amount: 40 },
    { month: 'Mar', amount: 38 },
    { month: 'Apr', amount: 45 },
    { month: 'May', amount: 42 },
    { month: 'Jun', amount: 50 },
    { month: 'Jul', amount: 48 },
    { month: 'Aug', amount: 55 },
    { month: 'Sep', amount: 52 },
    { month: 'Oct', amount: 47 },
    { month: 'Nov', amount: 53 },
    { month: 'Dec', amount: 50 },
  ]
  
  const years = ['2021', '2022', '2023', '2024']
  
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
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-[#333333] font-medium cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
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
              <div className="h-[220px] sm:h-[260px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={monthlyData}
                    margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#E5E7EB" 
                      vertical={true}
                    />
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
                      ticks={[0, 10, 20, 30, 40, 50, 60]}
                      domain={[0, 60]}
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
                <p className="text-sm text-gray-500 font-medium">Pending Earnings this month</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F283D] tracking-tight">$142.15</h2>
                
                {/* Growth indicator */}
                <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-base font-bold text-emerald-600">+3%</span>
                </div>
                
                <p className="text-xs text-gray-400 mt-2">vs previous month</p>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  )
}