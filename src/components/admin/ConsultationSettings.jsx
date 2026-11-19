import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { Calendar, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { api } from '../../utils/apiClient';
import { showError, showSuccess, showWarning } from '../../utils/toastConfig';

const ease = [0.22, 1, 0.36, 1];
const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 60;

// "2026-11-05" helpers. We do date maths in UTC so the browser timezone can never shift a day.
const toISO = (ms) => new Date(ms).toISOString().slice(0, 10);
const isoToMs = (iso) => Date.parse(`${iso}T00:00:00Z`);
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDate = (iso) => {
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(d);
};
const formatTime = (time) => {
  if (!time || typeof time !== 'string') return '-';
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  return `${h % 12 || 12}:${String(m).padStart(2, '0')}${h >= 12 ? 'PM' : 'AM'}`;
};

// 06:00 ... 18:00 every 30 minutes (what the backend expects: "HH:MM")
const TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const mins = 6 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
});

const WEEKDAYS = [
  { value: 1, label: 'Mon' }, { value: 2, label: 'Tue' }, { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' }, { value: 5, label: 'Fri' }, { value: 6, label: 'Sat' }, { value: 0, label: 'Sun' },
];

const pick = (res, key) => {
  const body = res?.data ?? res;
  if (Array.isArray(body)) return body;
  return body?.[key] ?? [];
};

const slotStatus = (s) => s.status ?? (s.isOpen === false ? 'closed' : 'free');

const CHIP = {
  free: 'bg-teal-500 text-white hover:bg-teal-600 cursor-pointer',
  booked: 'bg-amber-400 text-white cursor-not-allowed',
  closed: 'bg-gray-300 text-gray-600 line-through hover:bg-gray-400 cursor-pointer',
};

export default function ConsultationSetting() {
  // ---------- slots ----------
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5]);
  const [times, setTimes] = useState([]);
  const [creating, setCreating] = useState(false);

  // ---------- services ----------
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [newService, setNewService] = useState('');
  const [editing, setEditing] = useState(null); // { id, name }
  const [busyId, setBusyId] = useState(null);

  const loadSlots = useCallback(async () => {
    try {
      const from = todayISO();
      const to = toISO(isoToMs(from) + WINDOW_DAYS * DAY_MS);
      const res = await api.get(`/api/consultations/slots/all?from=${from}&to=${to}`);
      setSlots(pick(res, 'slots'));
      setSlotsError('');
    } catch (err) {
      setSlotsError(err.message);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const loadServices = useCallback(async () => {
    try {
      const res = await api.get('/api/consultations/services/all');
      setServices(pick(res, 'services'));
    } catch (err) {
      showError(err.message);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots();
    loadServices();
  }, [loadSlots, loadServices]);

  // Group the flat slot list into one row per date
  const grouped = useMemo(() => {
    const byDate = {};
    slots.forEach((s) => {
      (byDate[s.date] ||= []).push(s);
    });
    return Object.keys(byDate)
      .sort()
      .map((date) => ({ date, items: byDate[date].sort((a, b) => a.time.localeCompare(b.time)) }));
  }, [slots]);

  // ---------- slot actions ----------
  async function toggleSlot(slot) {
    const status = slotStatus(slot);
    if (status === 'booked') {
      showWarning('A customer has booked this time. Cancel the booking first if you need to remove it.');
      return;
    }
    try {
      await api.patch(`/api/consultations/slots/${slot.id}/${status === 'free' ? 'close' : 'reopen'}`);
      await loadSlots();
    } catch (err) {
      showError(err.message);
      await loadSlots();
    }
  }

  async function closeWholeDay(group) {
    const free = group.items.filter((s) => slotStatus(s) === 'free');
    if (free.length === 0) {
      showWarning('There are no open times left on this day.');
      return;
    }
    if (!window.confirm(`Close ${free.length} open time(s) on ${formatDate(group.date)}? Booked times stay as they are.`)) return;
    try {
      await Promise.all(free.map((s) => api.patch(`/api/consultations/slots/${s.id}/close`)));
      showSuccess('Day closed');
    } catch (err) {
      showError(err.message);
    }
    await loadSlots();
  }

  const toggleWeekday = (v) => setWeekdays((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  const toggleTime = (t) => setTimes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t].sort()));

  async function handleCreate() {
    const end = dateTo || dateFrom;
    if (!dateFrom) return showWarning('Please choose a start date');
    if (end < dateFrom) return showWarning('The end date cannot be before the start date');
    if ((isoToMs(end) - isoToMs(dateFrom)) / DAY_MS > 62) return showWarning('Please choose a range of 62 days or less');
    if (weekdays.length === 0) return showWarning('Choose at least one day of the week');
    if (times.length === 0) return showWarning('Choose at least one time');

    setCreating(true);
    try {
      const res = await api.post('/api/consultations/slots', { dateFrom, dateTo: end, weekdays, times });
      const r = res?.data ?? res;
      showSuccess(
        `${r.created ?? 0} time(s) added` +
          (r.skippedExisting ? `, ${r.skippedExisting} already existed` : '') +
          (r.skippedPast ? `, ${r.skippedPast} skipped because they are in the past` : '')
      );
      setShowAddForm(false);
      setTimes([]);
      await loadSlots();
    } catch (err) {
      showError(err.message);
    } finally {
      setCreating(false);
    }
  }

  // ---------- service actions ----------
  async function addService() {
    const name = newService.trim();
    if (name.length < 2) return showWarning('Please enter a service name');
    setBusyId('new');
    try {
      await api.post('/api/consultations/services', { name });
      setNewService('');
      showSuccess('Service added');
      await loadServices();
    } catch (err) {
      showError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function saveRename() {
    const name = editing.name.trim();
    if (name.length < 2) return showWarning('Please enter a service name');
    setBusyId(editing.id);
    try {
      await api.patch(`/api/consultations/services/${editing.id}`, { name });
      setEditing(null);
      showSuccess('Service renamed');
      await loadServices();
    } catch (err) {
      showError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleService(service) {
    setBusyId(service.id);
    try {
      await api.patch(`/api/consultations/services/${service.id}`, { isActive: !service.isActive });
      await loadServices();
    } catch (err) {
      showError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* ================= TIME SLOTS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="bg-white rounded-lg shadow-md border border-gray-200"
        >
          <div className="grid grid-cols-2 bg-slate-600 text-white rounded-t-lg overflow-hidden">
            <div className="px-6 py-4 border-r border-slate-500">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Date</h3>
            </div>
            <div className="px-6 py-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Time</h3>
            </div>
          </div>

          {slotsLoading && <div className="p-8 text-center text-gray-500 animate-pulse">Loading times...</div>}

          {!slotsLoading && slotsError && (
            <div className="p-6 text-sm text-red-700 bg-red-50">
              {slotsError}
              <button onClick={loadSlots} className="underline ml-3 font-medium">Try again</button>
            </div>
          )}

          {!slotsLoading && !slotsError && grouped.length === 0 && (
            <div className="p-8 text-center text-gray-500">No appointment times yet. Click "Add new" below to create some.</div>
          )}

          <div className="divide-y divide-gray-200">
            <AnimatePresence initial={false}>
              {grouped.map((group) => (
                <motion.div
                  key={group.date}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="grid grid-cols-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="px-6 py-4 border-r border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(group.date)}
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((slot) => {
                        const status = slotStatus(slot);
                        return (
                          <motion.button
                            key={slot.id}
                            whileHover={status === 'booked' ? {} : { scale: 1.06 }}
                            whileTap={status === 'booked' ? {} : { scale: 0.94 }}
                            onClick={() => toggleSlot(slot)}
                            title={
                              status === 'free' ? 'Open. Click to close this time'
                                : status === 'closed' ? 'Closed. Click to reopen'
                                : 'Booked by a customer'
                            }
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${CHIP[status] || CHIP.free}`}
                          >
                            {formatTime(slot.time)}
                          </motion.button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => closeWholeDay(group)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                      title="Close all open times on this day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="px-6 py-3 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-teal-500" /> Open</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-400" /> Booked</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-300" /> Closed</span>
            <span className="text-gray-400">Click a time to close or reopen it.</span>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setShowAddForm((v) => !v);
                setDateFrom((v) => v || todayISO());
              }}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add new
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 border-t border-gray-200 bg-white space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From date</label>
                      <input
                        type="date"
                        min={todayISO()}
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">To date (optional, for several days)</label>
                      <input
                        type="date"
                        min={dateFrom || todayISO()}
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">On these days of the week</p>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((d) => (
                        <motion.button
                          key={d.value}
                          type="button"
                          whileTap={{ scale: 0.93 }}
                          onClick={() => toggleWeekday(d.value)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            weekdays.includes(d.value) ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-600 border-gray-300'
                          }`}
                        >
                          {d.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">At these times</p>
                      <button
                        type="button"
                        onClick={() => setTimes(times.length === TIME_OPTIONS.length ? [] : [...TIME_OPTIONS])}
                        className="text-xs text-teal-600 hover:underline"
                      >
                        {times.length === TIME_OPTIONS.length ? 'Clear all' : 'Select all'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TIME_OPTIONS.map((t) => (
                        <motion.button
                          key={t}
                          type="button"
                          whileTap={{ scale: 0.93 }}
                          onClick={() => toggleTime(t)}
                          className={`px-3 py-1 rounded text-sm border transition-colors ${
                            times.includes(t) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                          }`}
                        >
                          {formatTime(t)}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCreate}
                      disabled={creating}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-60"
                    >
                      {creating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ================= SERVICES ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md border border-gray-200"
        >
          <div className="grid grid-cols-[1fr_auto] bg-slate-600 text-white rounded-t-lg overflow-hidden">
            <div className="px-6 py-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Services customers can book</h3>
            </div>
            <div className="px-6 py-4 text-sm uppercase tracking-wide font-semibold hidden sm:block">Status</div>
          </div>

          {servicesLoading && <div className="p-8 text-center text-gray-500 animate-pulse">Loading services...</div>}

          <div className="divide-y divide-gray-200">
            {services.map((s) => (
              <motion.div
                key={s.id}
                layout
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {editing?.id === s.id ? (
                  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                    <input
                      autoFocus
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <button onClick={saveRename} disabled={busyId === s.id} className="p-2 text-teal-600 hover:bg-teal-50 rounded" title="Save">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditing(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded" title="Cancel">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${s.isActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{s.name}</span>
                    <span className="text-xs text-gray-400">{s.bookingCount ?? 0} booking(s)</span>
                    <button
                      onClick={() => setEditing({ id: s.id, name: s.name })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Rename"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => toggleService(s)}
                  disabled={busyId === s.id}
                  role="switch"
                  aria-checked={!!s.isActive}
                  title={s.isActive ? 'Visible to customers. Click to hide' : 'Hidden. Click to show'}
                  className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-60 ${s.isActive ? 'bg-teal-500' : 'bg-gray-300'}`}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow ${s.isActive ? 'right-0.5' : 'left-0.5'}`}
                  />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center gap-3">
            <input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addService()}
              placeholder="New service name"
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            />
            <button
              onClick={addService}
              disabled={busyId === 'new'}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-60"
            >
              <Plus className="w-4 h-4" /> Add service
            </button>
          </div>
          <p className="px-6 pb-4 text-xs text-gray-500 bg-gray-50 rounded-b-lg">
            Services are hidden, not deleted, so old bookings keep their service name.
          </p>
        </motion.div>
      </div>
    </MotionConfig>
  );
}