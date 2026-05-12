import React from 'react'
import { PieChart, Pie, Cell } from "recharts";
import EarningMetrics from "./EarningMetrics"
import EarningCards from "./EarningCards.jsx"

export default function ReferralAnalysis() {
  // Referrals data
  const referralsData = [
    { name: "Successful", value: 329 },
    { name: "Pending", value: 110 },
  ]
  
  // Distribution data for the other pie charts
  const referralSourceData = [
    { name: "E-comm, 30% referrals", value: 30, color: "#FF6C00" },
    { name: "Social, 25% referrals", value: 25, color: "#B3206F" },
    { name: "LinkedIn, 20% referrals", value: 20, color: "#D33333" },
    { name: "Others, 25% referrals", value: 25, color: "#14213D" },
  ]
  
  const genderData = [
    { name: "Male", value: 50, color: "#FF7711" },
    { name: "Female", value: 50, color: "#1F283D" },
  ]
  
  const ageData = [
    { name: "18-25", value: 25, color: "#B3206F" },
    { name: "26-35", value: 35, color: "#FF6C00" },
    { name: "36-50", value: 30, color: "#1F283D" },
    { name: "50-70", value: 10, color: "#FFC9A0" },
      { name: "70-280", value: 10, color: "#D33333" },
  ]
  
  const locationData = [
    { name: "Victoria", value: 30, color: "#FF6C00" },
    { name: "Lagos", value: 25, color: "#D33333" },
    { name: "Ibadan", value: 20, color: "#1F283D" },
    { name: "Benin", value: 15, color: "#B3206F" },
    { name: "Bayelsa", value: 10, color: "#FFC9A0" },
  ]
  
  const referralsColors = ["#FF7711", "#1F283D"]
  const totalReferrals = referralsData.reduce((sum, item) => sum + item.value, 0)

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
            {/* Card 1 - Earnings this month */}
            <EarningCards
              title="Earnings this month"
              amount="$142.15"
               percentageChange={3}
              
              
            />
             <EarningCards
              title="Total Earning(All Time)"
              amount="$142.15"
               percentageChange={''}
              
            
            />
        
            {/* Card 2 - Total earnings */}
            <EarningCards
              title="Total Referral (All-time)"
              amount="12"
              percentageChange={0}
              subText=""
            />
        
            {/* Card 3 - Referrals */}
            <EarningCards
              title="Succesfull Referral"
              amount="5"
              percentageChange={21}
              subText="vs previous period"
            />
        
            {/* Card 4 - Current Earnings with button */}
            <EarningCards
              title="Pending Referral"
              amount="$132.45"
              percentageChange={5}
              subText= "vs previous period"
              
            />
          </div>
        
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg px-6 py-4">
          <h1 className="text-xl font-bold text-[#333333]">Referral Analytics</h1>
        </div>
        
        {/* Referrals and Distribution Section */}
        <div className="flex flex-col md:flex-row items-center   gap-6 justify-between ">
          
          {/* Referrals Card */}
          <div className="bg-white  p-6">
            <h2 className="text-base font-semibold text-[#333333] mb-6">Referrals</h2>
            
            <div className="flex flex-col items-center">
              {/* Total Referrals - centered above gauge */}
              <div className="text-center mb-2">
                <div className="text-4xl font-bold text-[#333333]">{totalReferrals}</div>
                <div className="text-sm text-gray-500">Referrals</div>
              </div>
              
              {/* Gauge Chart */}
              <div className="relative">
                <PieChart width={260} height={150}>
                  <Pie
                    data={referralsData}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={90}
                    cy={120}
                  
                  >
                    {referralsData.map((entry, index) => (
                      <Cell key={index} fill={referralsColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-10 ">
                <div className="flex flex-col items-start gap-2">
                  <div className="text-lg font-bold text-start text-[#333333]">329</div>
                  <div className="text-center flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#FF7711]"></div>
                   
                    <div className="text-xs text-gray-500">Successful</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-bold text-start text-[#333333]">329</div>
                  <div className="text-center flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#1F283D]"></div>
                   
                    <div className="text-xs text-gray-500">pending</div>
                  </div>
                </div>
              </div>
              
              {/* Blue banner */}
              <div className="mt-6 bg-[#00A3FF] text-white text-sm px-6 py-2 rounded">
                Click rate: 3.200%
              </div>
            </div>
          </div>
          
          {/* Referral Distribution Card */}
          <div className="bg-white  p-6">
            <h2 className="text-base font-semibold text-[#333333] mb-6">Referral Distribution</h2>
            
            <div className="grid grid-cols-4 gap-6">
              
              {/* Referral Source */}
              <div className="flex flex-col items-center">
                <h3 className="text-xs font-semibold text-gray-600 mb-3">Referral Source</h3>
                <PieChart width={140} height={140}>
                  <Pie
                    data={referralSourceData}
                    dataKey="value"
                    cx={60}
                    cy={60}
                    innerRadius={40}
                    outerRadius={60}
                  >
                    {referralSourceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="mt-3 space-y-1 text-xs w-full">
                  {referralSourceData.map((item, index) => (
                    <div key={index} className="flex items-center h-[24px] gap-2.5">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#666666] w-[154px] h-[17px] text-[11px] leading-[16px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Gender */}
              <div className="flex flex-col items-center">
                <h3 className="text-xs font-semibold text-gray-600 mb-3">Gender</h3>
                <PieChart width={160} height={160}>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    startAngle={90}
                    endAngle={90 + 360}   
                    cx={70}
                    cy={70}
                    outerRadius={70}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="mt-3  flex items-center space-x-3 text-xs">
                  {genderData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#666666] text-[11px] leading-[150%] tracking-[0.5%]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Age */}
              <div className="flex flex-col items-center">
                <h3 className="text-xs font-semibold text-gray-600 mb-3">Age</h3>
                <PieChart width={160} height={160}>
                  <Pie
                    data={ageData}
                    dataKey="value"
                    cx={70}
                    cy={70}
                    outerRadius={70}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="mt-3 grid grid-cols-2 space-x-4  space-y-1 text-sm">
                  {ageData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5 h-[24px]">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#666666]  leading-[150%] tracking-[0.5%]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location */}
              <div className="flex flex-col items-center">
                <h3 className="text-xs font-semibold text-gray-600 mb-3">Location</h3>
                <PieChart width={160} height={160}>
                  <Pie
                    data={locationData}
                    dataKey="value"
                    cx={70}
                    cy={70}
                    outerRadius={70}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
             <div className="mt-3 grid grid-cols-2 gap-x-10 gap-y-1 text-xs">
  {locationData.map((item, index) => (
    <div key={index} className="flex items-center h-[24px] gap-2.5">
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
      <span className="text-[#666666] leading-[150%] tracking-[0.5%]">{item.name}</span>
    </div>
  ))}
</div>
              </div>
              
            </div>
          </div>
          
        </div>
        {/* EarningMetrics  */}
      
        <EarningMetrics/>
        
      </div>
    </div>
  )
}