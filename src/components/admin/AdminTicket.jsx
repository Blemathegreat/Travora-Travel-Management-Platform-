import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { MoreVertical, X, Send } from 'lucide-react';
import DataTable from './DataTable';
import { api } from '../../utils/apiClient';
import { showError, showSuccess } from '../../utils/toastConfig';

const ease = [0.22, 1, 0.36, 1];

const formatDateTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d);
};
const formatDay = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
};

const STATUS_STYLES = {
  resolved: { label: 'Resolved', style: 'bg-blue-100 text-blue-700' },
  pending: { label: 'Pending', style: 'bg-yellow-100 text-yellow-700' },
};

const getTicketColumns = (onAction) => [
  { header: 'Ticket ID', accessor: 'reference', width: 'w-[110px]' },
  { header: 'Full Name', accessor: 'fullName', width: 'w-[140px]' },
  { header: 'Email', accessor: 'email', width: 'w-[180px]' },
  { header: 'Phone Number', accessor: 'phone', width: 'w-[140px]', render: (row) => row.phone || '-' },
  {
    header: 'Message',
    accessor: 'message',
    width: 'w-[250px]',
    render: (row) => (
      <span title={row.message} className="block max-w-[250px] truncate">
        {row.message}
      </span>
    ),
  },
  { header: 'Date', accessor: 'createdAt', width: 'w-[120px]', render: (row) => formatDay(row.createdAt) },
  {
    header: 'Status',
    accessor: 'status',
    width: 'w-[120px]',
    render: (row) => {
      const s = STATUS_STYLES[row.status] || { label: row.status, style: 'bg-gray-100 text-gray-600' };
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${s.style}`}>• {s.label}</span>
      );
    },
  },
  {
    header: 'Action',
    accessor: 'action',
    width: 'w-[80px]',
    render: (row) => (
      <button className="text-gray-600 hover:text-gray-900 transition-colors" onClick={() => onAction?.(row)} aria-label="Open ticket">
        <MoreVertical size={20} />
      </button>
    ),
  },
];

export default function AdminTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const [open, setOpen] = useState(null); // the full ticket (with replies) shown in the side panel
  const [panelLoading, setPanelLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  // status + date range are filtered by the backend; the search box filters what is already loaded
  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.set('status', statusFilter.toLowerCase());
      if (dateFilter === 'Last 7 days') params.set('range', '7');
      if (dateFilter === 'Last 30 days') params.set('range', '30');
      const qs = params.toString();
      const res = await api.get(`/api/tickets${qs ? `?${qs}` : ''}`);
      const body = res?.data ?? res;
      setTickets(Array.isArray(body) ? body : body?.tickets || []);
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) =>
      [t.fullName, t.email, t.phone, t.reference, t.message].join(' ').toLowerCase().includes(q)
    );
  }, [tickets, search]);

  async function openTicket(row) {
    setOpen({ ...row, replies: [] });
    setReplyText('');
    setPanelLoading(true);
    try {
      const res = await api.get(`/api/tickets/${row.id}`);
      const body = res?.data ?? res;
      setOpen(body.ticket ?? body);
    } catch (err) {
      showError(err.message);
    } finally {
      setPanelLoading(false);
    }
  }

  async function refreshOpen(id) {
    const res = await api.get(`/api/tickets/${id}`);
    const body = res?.data ?? res;
    setOpen(body.ticket ?? body);
  }

  async function sendReply() {
    const message = replyText.trim();
    if (!message) return;
    setSaving(true);
    try {
      await api.post(`/api/tickets/${open.id}/replies`, { message });
      setReplyText('');
      showSuccess('Reply saved. Email sending is not connected yet.');
      await refreshOpen(open.id);
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(status) {
    setSaving(true);
    try {
      await api.patch(`/api/tickets/${open.id}/status`, { status });
      showSuccess(status === 'resolved' ? 'Ticket marked as resolved' : 'Ticket reopened');
      await refreshOpen(open.id);
      await load();
    } catch (err) {
      showError(err.message);
      await refreshOpen(open.id).catch(() => {});
      await load();
    } finally {
      setSaving(false);
    }
  }

  const st = open ? STATUS_STYLES[open.status] || { label: open.status, style: 'bg-gray-100 text-gray-600' } : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Search tickets</label>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, ticket ID or message"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-slate-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-slate-300 outline-none"
                  >
                    <option>All</option>
                    <option>Pending</option>
                    <option>Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-slate-300 outline-none"
                  >
                    <option>All</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {loadError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {loadError}
              <button onClick={load} className="underline ml-3 font-medium">Try again</button>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.1 }}>
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500 animate-pulse">Loading tickets...</div>
            ) : (
              <DataTable title="Support Tickets" columns={getTicketColumns(openTicket)} data={filtered} />
            )}
          </motion.div>
        </div>

        {/* Side panel: the conversation */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(null)}
                className="fixed inset-0 bg-black/40 z-40"
              />
              <motion.aside
                key="panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.4, ease }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between p-5 bg-slate-700 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">Ticket</p>
                    <p className="font-semibold">{open.reference}</p>
                  </div>
                  <button onClick={() => setOpen(null)} aria-label="Close" className="hover:opacity-70 transition">
                    <X size={22} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${st.style}`}>• {st.label}</span>
                    <span className="text-gray-400 text-xs">{formatDateTime(open.createdAt)}</span>
                  </div>

                  <dl className="grid grid-cols-3 gap-y-2 gap-x-2">
                    <dt className="text-gray-500">Name</dt><dd className="col-span-2 text-gray-900">{open.fullName}</dd>
                    <dt className="text-gray-500">Email</dt><dd className="col-span-2 text-gray-900 break-all">{open.email}</dd>
                    <dt className="text-gray-500">Phone</dt><dd className="col-span-2 text-gray-900">{open.phone || '-'}</dd>
                  </dl>

                  {/* Conversation */}
                  <div className="space-y-3 border-t border-gray-100 pt-5">
                    <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-gray-800 whitespace-pre-wrap">
                      {open.message}
                    </div>

                    {panelLoading && <p className="text-gray-400 animate-pulse">Loading replies...</p>}

                    <AnimatePresence initial={false}>
                      {(open.replies || []).map((r) => (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="ml-auto max-w-[90%]"
                        >
                          <div className="rounded-2xl rounded-tr-sm bg-slate-700 text-white px-4 py-3 whitespace-pre-wrap">{r.message}</div>
                          <p className="text-[11px] text-gray-400 mt-1 text-right">
                            {formatDateTime(r.createdAt)} · {r.emailedAt ? 'Emailed' : 'Not emailed yet'}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Reply box */}
                <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
                  <textarea
                    rows="3"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    maxLength={2000}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 resize-none bg-white"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <button
                      disabled={saving}
                      onClick={() => changeStatus(open.status === 'resolved' ? 'pending' : 'resolved')}
                      className={`px-4 h-10 rounded-lg text-sm font-medium border disabled:opacity-60 ${
                        open.status === 'resolved'
                          ? 'border-yellow-400 text-yellow-700 hover:bg-yellow-50'
                          : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {open.status === 'resolved' ? 'Reopen ticket' : 'Mark as resolved'}
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      disabled={saving || !replyText.trim()}
                      onClick={sendReply}
                      className="inline-flex items-center gap-2 px-5 h-10 rounded-lg bg-slate-700 text-white text-sm font-medium disabled:opacity-50"
                    >
                      <Send size={15} /> {saving ? 'Saving...' : 'Send reply'}
                    </motion.button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}