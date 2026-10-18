import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MoreVertical, Eye, Ban, XCircle } from 'lucide-react'
import { api } from '../../utils/apiClient'
import { showSuccess, showError } from '../../utils/toastConfig'

export default function AmbassadorList() {
  const navigate = useNavigate()

  const [ambassadors, setAmbassadors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const menuRefs = useRef({})

  useEffect(() => {
    fetchAmbassadors()
  }, [])

  async function fetchAmbassadors() {
    try {
      const res = await api.get('/api/ambassadors')
      setAmbassadors(res.data.ambassadors)
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Database values on the left, what we show on screen on the right -
  // one single place that maps between the two, so the rest of this
  // file never has to think about database spelling at all.
  const statusLabels = {
    pending_approval: 'Pending Approval',
    active: 'Productive',
    suspended: 'Suspended',
    rejected: 'Rejected',
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'pending_approval':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const handleApprove = async (id) => {
  try {
    await api.patch(`/api/ambassadors/${id}/approve`)
    showSuccess('Ambassador approved')
    setActiveMenu(null)
    fetchAmbassadors()
  } catch (err) {
    showError(err.message)
  }
}

const handleReject = async (id) => {
  try {
    await api.patch(`/api/ambassadors/${id}/reject`)
    showSuccess('Ambassador rejected')
    setActiveMenu(null)
    fetchAmbassadors()
  } catch (err) {
    showError(err.message)
  }
}

  const handleSuspend = async (id) => {
    try {
      await api.patch(`/api/ambassadors/${id}/suspend`)
      showSuccess('Ambassador suspended')
      setActiveMenu(null)
      fetchAmbassadors()
    } catch (err) {
      showError(err.message)
    }
  }

  const filteredAmbassadors = ambassadors.filter(amb => {
    const fullName = `${amb.first_name} ${amb.last_name}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
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

  if (loading) {
    return <div className="p-8 text-slate-500">Loading ambassadors...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
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

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center rounded-3xl bg-white border border-slate-200 p-4">
          <div className="flex items-center gap-3 flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          >
            <option value="All">All Status</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="active">Productive</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name / Email</th>
                  <th className="px-6 py-4 font-semibold">Phone Number</th>
                  <th className="px-6 py-4 font-semibold">Registered</th>
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
                        <div className="font-medium text-slate-900">{amb.first_name} {amb.last_name}</div>
                        <div className="text-xs text-slate-500">{amb.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{amb.phone || '—'}</td>
                    <td className="px-6 py-4">{new Date(amb.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(amb.status)}`}>
                        {statusLabels[amb.status] || amb.status}
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
                            {amb.status === 'pending_approval' && (
  <>
    <button
      onClick={() => handleApprove(amb.id)}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-green-700 hover:bg-slate-50 transition-colors border-t border-slate-200"
    >
      <Eye size={16} />
      Approve
    </button>
    <button
      onClick={() => handleReject(amb.id)}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-slate-50 transition-colors border-t border-slate-200"
    >
      <XCircle size={16} />
      Reject
    </button>
  </>
)}
                            {amb.status === 'active' && (
                              <button
                                onClick={() => handleSuspend(amb.id)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-200 last:rounded-b-xl"
                              >
                                <Ban size={16} />
                                Suspend
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