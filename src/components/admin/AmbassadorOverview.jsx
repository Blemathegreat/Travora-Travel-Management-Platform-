import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell } from 'recharts'
import { Users, ArrowRight } from 'lucide-react'
import EarningCards from '../ambasssador/EarningCards.jsx'
import EarningMetrics from '../ambasssador/EarningMetrics.jsx'
import { images } from '../../assets/Photo'

const referralSummary = [
  { title: 'Earnings this month', value: '$142.15', change: 3 },
  { title: 'Total earnings', value: '$1,245.78', change: 0 },
  { title: 'Bookings in a month', value: '5', change: 18 },
  { title: 'Total bookings (all-time)', value: '186', change: 0 },
  { title: 'Referrals', value: '80', change: 12 },
]

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


const referralRows = [
  { avatarImage: images.ambassador, user: 'James Doe', bookedDate: '27/02/2024', appointmentDate: '27/02/2024', ambassador: 'Kweiba Blankson', status: 'Successful' },
  { avatarImage: images.testimonial, user: 'John Doe', bookedDate: '27/02/2024', appointmentDate: '27/02/2024', ambassador: 'Kweiba Blankson', status: 'Successful' },
  { avatarImage: images.referal, user: 'Jane Doe', bookedDate: '27/02/2024', appointmentDate: '27/02/2024', ambassador: 'Kweiba Blankson', status: 'Successful' },
  { avatarImage: images.pexels1, user: 'Mary Jane', bookedDate: '27/02/2024', appointmentDate: '27/02/2024', ambassador: 'Kweiba Blankson', status: 'Successful' },
  { avatarImage: images.pexels2, user: 'Paul Smith', bookedDate: '27/02/2024', appointmentDate: '27/02/2024', ambassador: 'Kweiba Blankson', status: 'Successful' },
]

const statusOptions = ['All', 'Successful', 'Pending', 'Deactivated']

export default function AmbassadorOverview() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  const filteredRows = useMemo(() => {
    return referralRows.filter((row) => {
      const matchesSearch =
        row.user.toLowerCase().includes(search.toLowerCase()) ||
        row.ambassador.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'All' || row.status === status
      return matchesSearch && matchesStatus
    })
  }, [search, status])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin / Ambassador</p>
            <h1 className="text-3xl font-semibold text-slate-900">Ambassadors Referral Activity</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/ambassadors/list')}
            className="inline-flex items-center gap-2 rounded-full bg-[#345867] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/50 transition hover:bg-[#234156]"
          >
            <Users size={18} />
            Ambassadors
            <ArrowRight size={16} />
          </button>
        </div>

        <motion.section
          className="grid gap-4 xl:grid-cols-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {referralSummary.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
            >
              <EarningCards
                title={card.title}
                amount={card.value}
                percentageChange={card.change}
                subText={card.change === 0 ? '' : 'vs prev. period'}
              />
            </motion.div>
          ))}
        </motion.section>

        <section className="space-y-6">
           {/* Header */}
                 <div className="bg-white shadow-sm rounded-lg px-6 py-4">
                   <h1 className="text-xl font-bold text-[#333333]">Referral Analytics</h1>
                 </div>
                 
                 {/* Referrals and Distribution Section */}
                 <div className="flex flex-col md:flex-row items-center   gap-6 justify-between ">
                   
                   {/* Referrals Card */}
                   <div className="bg-white  p-6">
                     <div className="mb-6 flex items-center justify-between">
                       <h2 className="text-base font-semibold text-[#333333]">Referrals</h2>
                       <img src={images.referal} alt="Referral overview" className="h-20 w-auto object-contain" />
                     </div>
                     
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
                     
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                       
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

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Referrals 2024</p>
                <p className="text-sm text-slate-500">Track referral bookings and ambassador performance.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 min-w-0 items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />
                  </svg>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Booked Date</th>
                    <th className="px-6 py-4 font-semibold">Appointment Date</th>
                    <th className="px-6 py-4 font-semibold">Referred Ambassador</th>
                    <th className="px-6 py-4 font-semibold">Referral Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredRows.map((row) => (
                    <tr key={row.user} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                            <img
                              src={row.avatarImage}
                              alt={row.user}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-slate-900">{row.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{row.bookedDate}</td>
                      <td className="px-6 py-4">{row.appointmentDate}</td>
                      <td className="px-6 py-4">{row.ambassador}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Successful' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-end text-sm text-slate-500">
              <button className="inline-flex items-center gap-2 font-semibold text-slate-800 hover:text-slate-900">
                View all
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <EarningMetrics />
        </section>
      </div>
    </div>
  )
}
