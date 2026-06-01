import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MoreVertical, Eye, Ban, XCircle } from 'lucide-react'
import { useAmbassadors } from '../../context/AmbassadorContext'

export default function AmbassadorList() {
  const navigate = useNavigate()
  const { ambassadors, updateAmbassadorStatus } = useAmbassadors()

  const [activeMenu, setActiveMenu] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const menuRefs = useRef({})

  const getStatusColor = (status) => {
    switch (status) {
      case 'Productive':
        return 'bg-blue-100 text-blue-700'
      case 'Suspended':
        return 'bg-yellow-100 text-yellow-700'
      case 'Deactivated':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const handleStatusChange = (id, newStatus) => {
    updateAmbassadorStatus(id, newStatus)
    setActiveMenu(null)
  }

  const filteredAmbassadors = ambassadors.filter(amb => {
    const matchesSearch = amb.name.toLowerCase().includes(search.toLowerCase()) || 
                          amb.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || amb.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenu && !menuRefs.current[activeMenu]?.contains(e.target)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin / Ambassadors</p>
            <h1 className="text-3xl font-semibold text-slate-900">Ambassador List</h1>
          </div>
          <button
            onClick={() => navigate('/admin/ambassadors')}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft size={18} /> Back to Overview
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center rounded-3xl bg-white border border-slate-200 p-4">
          <div className="flex items-center gap-3 flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Productive">Productive</option>
            <option value="Suspended">Suspended</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone Number</th>
                  <th className="px-6 py-4 font-semibold">Registration Date</th>
                  <th className="px-6 py-4 font-semibold">Last Login</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAmbassadors.map((amb) => (
                  <tr key={amb.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{amb.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900">{amb.name}</div>
                        <div className="text-xs text-slate-500">{amb.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{amb.phone}</td>
                    <td className="px-6 py-4">{amb.regDate}</td>
                    <td className="px-6 py-4">{amb.lastLogin}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(amb.status)}`}>
                        {amb.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative" ref={el => menuRefs.current[amb.id] = el}>
                        <button
                          onClick={() => setActiveMenu(activeMenu === amb.id ? null : amb.id)}
                          className="inline-flex items-center justify-center rounded-full p-2 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical size={18} className="text-slate-600" />
                        </button>

                        {activeMenu === amb.id && (
                          <div className="absolute right-0 top-10 z-50 rounded-2xl bg-white border border-slate-200 shadow-lg">
                            <button
                              onClick={() => navigate(`/admin/ambassadors/${amb.id}`)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-xl"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            {amb.status !== 'Suspended' && (
                              <button
                                onClick={() => handleStatusChange(amb.id, 'Suspended')}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-200"
                              >
                                <Ban size={16} />
                                Suspend
                              </button>
                            )}
                            {amb.status !== 'Deactivated' && (
                              <button
                                onClick={() => handleStatusChange(amb.id, 'Deactivated')}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-200 last:rounded-b-xl"
                              >
                                <XCircle size={16} />
                                Deactivate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
