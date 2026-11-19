import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { Search, X, Settings } from 'lucide-react';
import DataTable from './DataTable.jsx';
import { consultationDTable, formatDate, formatTime, STATUS_STYLES, MODE_LABEL } from './ConsultationDTable.jsx';
import { api } from '../../utils/apiClient';
import { showError, showSuccess } from '../../utils/toastConfig';

const ease = [0.22, 1, 0.36, 1];

// Unwrap { data: { consultations: [...] } } in one place
const pick = (res, key) => {
  const body = res?.data ?? res;
  if (Array.isArray(body)) return body;
  return body?.[key] ?? [];
};

const ACTIONS = [
  { status: 'completed', label: 'Mark completed', btn: 'bg-teal-600 hover:bg-teal-700 text-white', warn: 'The client attended. This cannot be undone and may create an ambassador commission.' },
  { status: 'no_show', label: 'Mark no-show', btn: 'bg-amber-500 hover:bg-amber-600 text-white', warn: 'The client did not attend. This cannot be undone.' },
  { status: 'cancelled', label: 'Cancel booking', btn: 'bg-red-600 hover:bg-red-700 text-white', warn: 'The booking will be cancelled and the time freed for others. This cannot be undone.' },
];

export default function Consultation() {
     console.log('NEW CONSULTATION PAGE LOADED');
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [needsAttention, setNeedsAttention] = useState(false);

  const [selected, setSelected] = useState(null); // the booking open in the side panel
  const [pending, setPending] = useState(null); // the status action waiting for confirmation
  const [reason, setReason] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Filters that the BACKEND understands are sent as query params; search is done in the browser.
  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (date) params.set('date', date);
      if (needsAttention) params.set('needsAttention', 'true');
      const qs = params.toString();
      const res = await api.get(`/api/consultations${qs ? `?${qs}` : ''}`);
      setRows(pick(res, 'consultations'));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, date, needsAttention]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.contactName?.toLowerCase().includes(q) ||
        r.contactEmail?.toLowerCase().includes(q) ||
        r.reference?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const openRow = (row) => {
    setSelected(row);
    setPending(null);
    setReason('');
    setLinkInput(row.meetingLink || '');
  };
  const closePanel = () => {
    setSelected(null);
    setPending(null);
  };

  async function applyStatus() {
    setSaving(true);
    try {
      const body = { status: pending.status };
      if (reason.trim()) body.reason = reason.trim();
      const res = await api.patch(`/api/consultations/${selected.id}/status`, body);
      const commission = (res?.data ?? res)?.commission;
      showSuccess(commission ? 'Marked completed. An ambassador commission was created.' : 'Booking updated');
      closePanel();
      await load();
    } catch (err) {
      showError(err.message);
      await load(); // someone else may have changed it
    } finally {
      setSaving(false);
    }
  }

  async function saveLink() {
    setSaving(true);
    try {
      await api.patch(`/api/consultations/${selected.id}/meeting-link`, { meetingLink: linkInput.trim() });
      showSuccess('Meeting link saved');
      setSelected((prev) => ({ ...prev, meetingLink: linkInput.trim() }));
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const isConfirmed = selected?.status === 'confirmed';
  const st = selected ? STATUS_STYLES[selected.status] || { label: selected.status, style: 'bg-gray-100 text-gray-600' } : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="p-6 space-y-6">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/admin/consultation-settings')}
            className="flex items-center gap-2 text-xl font-bold text-[#FFFFFF] bg-[#008395] border border-teal-200 px-4 py-2 rounded-lg"
          >
            <Settings size={20} /> Consultation Settings
          </motion.button>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Search</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-teal-400">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, email or ref"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none text-sm text-gray-700 w-40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value="">All</option>
                <option value="confirmed">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No-show</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 h-[38px] cursor-pointer select-none">
              <input type="checkbox" checked={needsAttention} onChange={(e) => setNeedsAttention(e.target.checked)} />
              Needs attention
            </label>
          </div>
        </motion.div>

        {loadError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
            <button onClick={load} className="underline ml-3 font-medium">
              Try again
            </button>
          </div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500 animate-pulse">
              Loading bookings...
            </div>
          ) : (
            <DataTable title="Summary Consultation Bookings" columns={consultationDTable(openRow)} data={filtered} />
          )}
        </motion.div>

        {/* Side panel */}
        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePanel}
                className="fixed inset-0 bg-black/40 z-40"
              />
              <motion.aside
                key="panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.4, ease }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-slate-700 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">Booking</p>
                    <p className="font-semibold">{selected.reference}</p>
                  </div>
                  <button onClick={closePanel} aria-label="Close" className="hover:opacity-70 transition">
                    <X size={22} />
                  </button>
                </div>

                <div className="p-5 space-y-5 text-sm">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${st.style}`}>• {st.label}</span>

                  <dl className="grid grid-cols-3 gap-y-3 gap-x-2">
                    <dt className="text-gray-500">Name</dt><dd className="col-span-2 text-gray-900">{selected.contactName}</dd>
                    <dt className="text-gray-500">Email</dt><dd className="col-span-2 text-gray-900 break-all">{selected.contactEmail}</dd>
                    <dt className="text-gray-500">Phone</dt><dd className="col-span-2 text-gray-900">{selected.contactPhone}</dd>
                    {selected.age && (<><dt className="text-gray-500">Age</dt><dd className="col-span-2 text-gray-900">{selected.age}</dd></>)}
                    <dt className="text-gray-500">Service</dt><dd className="col-span-2 text-gray-900">{selected.serviceName}</dd>
                    <dt className="text-gray-500">When</dt><dd className="col-span-2 text-gray-900">{formatDate(selected.date)}, {formatTime(selected.time)}</dd>
                    <dt className="text-gray-500">Meeting type</dt><dd className="col-span-2 text-gray-900">{MODE_LABEL[selected.mode] || selected.mode}</dd>
                    <dt className="text-gray-500">Notes</dt><dd className="col-span-2 text-gray-900 whitespace-pre-wrap">{selected.notes}</dd>
                    {selected.status === 'cancelled' && (
                      <>
                        <dt className="text-gray-500">Cancelled by</dt><dd className="col-span-2 text-gray-900">{selected.cancelledBy}</dd>
                        {selected.cancelReason && (<><dt className="text-gray-500">Reason</dt><dd className="col-span-2 text-gray-900">{selected.cancelReason}</dd></>)}
                      </>
                    )}
                  </dl>

                  {selected.needsAttention && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 p-3">
                      The appointment time has passed. Please mark it completed, no-show or cancelled.
                    </div>
                  )}

                  {isConfirmed && (
                    <div className="border-t border-gray-100 pt-5">
                      <label className="block text-gray-700 font-medium mb-2">Meeting link</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={linkInput}
                          onChange={(e) => setLinkInput(e.target.value)}
                          placeholder="https://meet.google.com/..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        <button
                          disabled={saving || !linkInput.trim()}
                          onClick={saveLink}
                          className="px-4 rounded-lg bg-[#008395] text-white font-medium disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">The customer sees this link on their My Consultations page.</p>
                    </div>
                  )}

                  {isConfirmed && (
                    <div className="border-t border-gray-100 pt-5">
                      <p className="text-gray-700 font-medium mb-3">Update status</p>
                      <div className="flex flex-wrap gap-2">
                        {ACTIONS.map((a) => (
                          <motion.button
                            key={a.status}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              setPending(a);
                              setReason('');
                            }}
                            className={`px-4 py-2 rounded-lg font-medium ${a.btn} ${pending && pending.status !== a.status ? 'opacity-40' : ''}`}
                          >
                            {a.label}
                          </motion.button>
                        ))}
                      </div>

                      <AnimatePresence initial={false}>
                        {pending && (
                          <motion.div
                            key={pending.status}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                              <p className="text-gray-700">{pending.warn}</p>
                              <label className="block text-gray-600 text-xs mt-3 mb-1">Note (optional)</label>
                              <textarea
                                rows="2"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-400"
                              />
                              <div className="flex gap-2 mt-3">
                                <button
                                  disabled={saving}
                                  onClick={applyStatus}
                                  className={`px-4 py-2 rounded-lg font-medium disabled:opacity-60 ${pending.btn}`}
                                >
                                  {saving ? 'Saving...' : `Yes, ${pending.label.toLowerCase()}`}
                                </button>
                                <button onClick={() => setPending(null)} className="px-4 py-2 rounded-lg border border-gray-300">
                                  Back
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}