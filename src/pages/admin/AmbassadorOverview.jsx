import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell } from 'recharts'
import { Users, ArrowRight } from 'lucide-react'
import EarningCards from '../../components/ambasssador/EarningCards.jsx'
import EarningMetrics from '../../components/ambasssador/EarningMetrics.jsx'
import { images } from '../../assets/Photo'

const referralSummary = [
  { title: 'Earnings this month', value: '$142.15', change: 3 },
  { title: 'Total earnings', value: '$1,245.78', change: 0 },
  { title: 'Bookings in a month', value: '5', change: 18 },
  { title: 'Total bookings (all-time)', value: '186', change: 0 },
  { title: 'Referrals', value: '80', change: 12 },
]

const referralAnalytics = {
  score: 186,
  successful: 329,
  pending: 110,
  clickRate: '3.2%',
  source: [
    { name: 'E-comm', value: 30, color: '#FF6C00' },
    { name: 'Social', value: 25, color: '#B3206F' },
    { name: 'LinkedIn', value: 20, color: '#D33333' },
    { name: 'Others', value: 25, color: '#14213D' },
  ],
  gender: [
    { name: 'Male', value: 50, color: '#FF7711' },
    { name: 'Female', value: 50, color: '#1F283D' },
  ],
  age: [
    { name: '18-25', value: 25, color: '#B3206F' },
    { name: '26-35', value: 35, color: '#FF6C00' },
    { name: '36-50', value: 30, color: '#1F283D' },
    { name: '50-70', value: 10, color: '#FFC9A0' },
  ],
  location: [
    { name: 'Victoria', value: 30, color: '#FF6C00' },
    { name: 'Lagos', value: 25, color: '#D33333' },
    { name: 'Ibadan', value: 20, color: '#1F283D' },
    { name: 'Benin', value: 15, color: '#B3206F' },
    { name: 'Bayelsa', value: 10, color: '#FFC9A0' },
  ],
}

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
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="rounded-3xl bg-slate-50 p-4 mb-6 text-sm font-semibold text-slate-700">
              Referral Analytics
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Referrals</p>
                  </div>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-5">
                    <div>
                      <p className="text-4xl font-bold text-slate-900">{referralAnalytics.score}</p>
                      <p className="text-sm text-slate-500">Referrals</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                        <p className="text-sm font-semibold text-slate-900">329</p>
                        <p className="text-xs text-slate-500">Successful</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                        <p className="text-sm font-semibold text-slate-900">110</p>
                        <p className="text-xs text-slate-500">Pending</p>
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto max-w-[360px]">
                    <PieChart width={360} height={180}>
                      <Pie
                        data={[
                          { name: 'Successful', value: referralAnalytics.successful },
                          { name: 'Pending', value: referralAnalytics.pending },
                        ]}
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={70}
                        outerRadius={90}
                        cx="50%"
                        cy="100%"
                      >
                        <Cell fill="#FF7711" />
                        <Cell fill="#1F283D" />
                      </Pie>
                    </PieChart>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {[
                  { title: 'Referral Source', data: referralAnalytics.source },
                  { title: 'Gender', data: referralAnalytics.gender },
                  { title: 'Age', data: referralAnalytics.age },
                  { title: 'Location', data: referralAnalytics.location },
                ].map((section) => (
                  <div key={section.title} className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900 mb-4">{section.title}</p>
                    <div className="flex justify-center">
                      <PieChart width={140} height={140}>
                        <Pie
                          data={section.data}
                          dataKey="value"
                          cx={70}
                          cy={70}
                          innerRadius={34}
                          outerRadius={60}
                        >
                          {section.data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                    <div className="mt-4 grid gap-2 text-xs text-slate-600">
                      {section.data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
