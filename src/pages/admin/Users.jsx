import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, AlertTriangle } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import { api } from '../../utils/apiClient'
import { showSuccess } from '../../utils/toastConfig'

const ease = [0.22, 1, 0.36, 1]
const PAGE_SIZE = 10

const STATUS_STYLE = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-yellow-100 text-yellow-700',
  deactivated: 'bg-red-100 text-red-700',
}
const ROLE_STYLE = {
  admin: 'bg-purple-100 text-purple-700',
  ambassador: 'bg-blue-100 text-blue-700',
  customer: 'bg-gray-100 text-gray-700',
}
const AMBASSADOR_TAG_STYLE = {
  suspended: 'bg-yellow-100 text-yellow-800',
  pending_approval: 'bg-blue-50 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
}

// What each choice means, shown to the admin before they confirm
const STATUS_HELP = {
  suspended: 'Temporary block. The user cannot log in. If they are an ambassador, their ambassador account is suspended and their money is frozen.',
  deactivated: 'Account closed. The user cannot log in. Not allowed while an ambassador still has unpaid money.',
  active: 'The user can log in again. An ambassador account must be reviewed separately on the Ambassadors page.',
}
const CONFIRM_STYLE = {
  suspended: 'bg-yellow-600 hover:bg-yellow-700',
  deactivated: 'bg-red-600 hover:bg-red-700',
  active: 'bg-green-600 hover:bg-green-700',
}
const REASON_CHIPS = {
  suspended: ['Under review', 'Suspected fraud', 'Policy violation'],
  deactivated: ['Customer request', 'Account closed by admin'],
  active: ['Reviewed and cleared', 'Suspended by mistake'],
}

const nice = (text) => {
  const spaced = String(text).replace(/_/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

/* ------------------------------------------------------------------ */
/*  The pop-up where the admin changes a user's status                 */
/* ------------------------------------------------------------------ */
function StatusModal({ user, onClose, onDone }) {
  const options = ['active', 'suspended', 'deactivated'].filter((s) => s !== user.status)
  const [status, setStatus] = useState(options[0])
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Escape closes the pop-up
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !saving) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [saving, onClose])

  async function submit(e) {
    e.preventDefault()
    if (reason.trim().length < 3) return setError('Please give a reason (at least 3 characters).')
    setSaving(true)
    setError('')
    try {
      const res = await api.patch(`/api/admin/users/${user.id}/status`, { status, reason: reason.trim() })
      onDone(res?.data ?? res, user)
    } catch (err) {
      setError(err.message) // for example: "This ambassador still has ₦6,000.00 unpaid..."
      setSaving(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !saving && onClose()}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Change account status</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {user.firstName} {user.lastName} · currently{' '}
              <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_STYLE[user.status]}`}>{nice(user.status)}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <label className="block text-xs font-medium text-slate-500 mb-1">New status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={saving}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-slate-500"
        >
          {options.map((s) => <option key={s} value={s}>{nice(s)}</option>)}
        </select>
        <p className="text-xs text-slate-500 mt-2">{STATUS_HELP[status]}</p>

        <label className="block text-xs font-medium text-slate-500 mt-4 mb-1">Reason (required)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={saving}
          rows={3}
          maxLength={255}
          autoFocus
          placeholder="Why are you making this change?"
          className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {REASON_CHIPS[status].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setReason(chip)}
              disabled={saving}
              className="px-3 py-1 rounded-full border border-gray-200 text-xs text-slate-600 hover:bg-gray-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-5 py-2 rounded-lg text-white text-sm disabled:opacity-60 ${CONFIRM_STYLE[status]}`}
          >
            {saving ? 'Saving...' : `Set ${status}`}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  The page                                                           */
/* ------------------------------------------------------------------ */
export default function Users() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [managing, setManaging] = useState(null) // the user whose pop-up is open
  const [notice, setNotice] = useState(null)     // the "ambassador still suspended" banner

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')

    const params = new URLSearchParams({ page, limit: PAGE_SIZE })
    if (query) params.set('search', query)
    if (role) params.set('role', role)
    if (status) params.set('status', status)

    api
      .get(`/api/admin/users?${params.toString()}`)
      .then((res) => { if (!ignore) setData(res?.data ?? res) })
      .catch((err) => { if (!ignore) setError(err.message) })
      .finally(() => { if (!ignore) setLoading(false) })

    return () => { ignore = true }
  }, [page, query, role, status, reloadKey])

  function changeRole(value) { setRole(value); setPage(1) }
  function changeStatus(value) { setStatus(value); setPage(1) }

  // called by the pop-up when the server said OK
  function handleDone(result, user) {
    setManaging(null)
    showSuccess(`${user.firstName} is now ${result.user.status}`)
    setNotice(result.warning ? { ...result.warning, name: `${user.firstName} ${user.lastName}` } : null)
    setReloadKey((k) => k + 1) // reload the table so it shows the new status
  }

  // The columns live inside the component because the Action button needs setManaging
  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id', width: 'w-20' },
    { header: 'Name', accessor: 'name', render: (row) => `${row.firstName} ${row.lastName}` },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone Number', accessor: 'phone', render: (row) => row.phone || '-' },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs ${ROLE_STYLE[row.role]}`}>{nice(row.role)}</span>
          {/* only shown when the ambassador account needs attention, so normal rows stay clean */}
         {row.role === 'ambassador' && row.status === 'active' && row.ambassadorStatus && row.ambassadorStatus !== 'active' &&  (
            <Link
              to={`/admin/ambassadors/${row.ambassadorId}`}
              title={`Ambassador account: ${nice(row.ambassadorStatus)}. Click to review.`}
              className={`px-2 py-1 rounded-full text-[11px] font-medium ${AMBASSADOR_TAG_STYLE[row.ambassadorStatus] || 'bg-gray-100 text-gray-700'}`}
            >
            ● Ambassador {row.ambassadorStatus.replace('_', ' ')}
            </Link>
          )}
        </div>
      ),
    },
    { header: 'Registered', accessor: 'createdAt', render: (row) => formatDate(row.createdAt) },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span
          title={row.statusReason || ''}
          className={`px-3 py-1 rounded-full text-xs ${STATUS_STYLE[row.status]}`}
        >
          {nice(row.status)}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) =>
        row.role === 'admin' ? (
          <span className="text-gray-300">-</span>
        ) : (
          <button
            onClick={() => setManaging(row)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-slate-700 hover:bg-gray-50"
          >
            Manage
          </button>
        ),
    },
  ], [])

  const users = data?.users || []
  const pagination = data?.pagination
  const from = pagination && pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0
  const to = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className="p-6">
      <div className="p-6 space-y-4 bg-transparent">

        {/* the "review the ambassador" banner; stays until the admin closes it */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3">
                <AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-yellow-900">
                  <p className="font-medium">{notice.name}</p>
                  <p>{notice.message}</p>
                  <Link to={`/admin/ambassadors/${notice.ambassadorId}`} className="inline-block mt-1 font-medium underline">
                    Review ambassador
                  </Link>
                </div>
                <button onClick={() => setNotice(null)} aria-label="Dismiss" className="text-yellow-700 hover:text-yellow-900">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* filters */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Search:</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email"
                value={search}
                maxLength={100}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm text-gray-700 w-64"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Role:</label>
            <select value={role} onChange={(e) => changeRole(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none cursor-pointer">
              <option value="">All</option>
              <option value="customer">Customer</option>
              <option value="ambassador">Ambassador</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Status:</label>
            <select value={status} onChange={(e) => changeStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none cursor-pointer">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <button onClick={() => setReloadKey((k) => k + 1)} className="px-5 py-2 rounded bg-slate-700 text-white text-sm hover:bg-slate-800">
              Try again
            </button>
          </div>
        ) : loading && !data ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">Loading users...</div>
        ) : (
          <div className={`transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}>
            <DataTable title="Users" columns={columns} data={users} />

            <div className="flex flex-wrap items-center justify-between gap-3 -mt-4 text-sm text-gray-600">
              <p>
                {pagination && pagination.total > 0
                  ? `Showing ${from}-${to} of ${pagination.total} users`
                  : 'No users match your filters'}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!pagination || pagination.page <= 1 || loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span>Page {pagination?.page || 1} of {pagination?.totalPages || 1}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination || pagination.page >= pagination.totalPages || loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {managing && (
          <StatusModal user={managing} onClose={() => setManaging(null)} onDone={handleDone} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}