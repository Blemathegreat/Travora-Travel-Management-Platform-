import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { CalendarDays, Clock, Video, Phone, MapPin, ExternalLink, Plus } from "lucide-react";
import { api } from "../utils/apiClient";
import { showError, showSuccess } from "../utils/toastConfig";

// apiClient hands us the parsed JSON; unwrap { data: ... } or { data: { key: [...] } } in one place.
const pick = (res, key) => {
  const body = res?.data ?? res;
  if (Array.isArray(body)) return body;
  return body?.[key] ?? res?.[key] ?? [];
};

const formatTime = (time = "") => {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(
    new Date(`${String(date).slice(0, 10)}T00:00:00`)
  );

const STATUS = {
  confirmed: { label: "Confirmed", dot: "bg-[#0b4da0]", chip: "bg-blue-50 text-[#0b4da0] border-blue-200" },
  completed: { label: "Completed", dot: "bg-green-500", chip: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", dot: "bg-gray-400", chip: "bg-gray-100 text-gray-600 border-gray-200" },
  no_show: { label: "Missed", dot: "bg-red-500", chip: "bg-red-50 text-red-700 border-red-200" },
};

const MODE = {
  video: { label: "Video call", Icon: Video },
  phone: { label: "Phone call", Icon: Phone },
  in_person: { label: "In person", Icon: MapPin },
};

const MAX_RESCHEDULES = 2; // the server enforces this too; here it only hides the button

// ---- animation recipes ----
const ease = [0.22, 1, 0.36, 1]; // smooth "ease-out-expo" feel
const list = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};
const panel = {
  hidden: { height: 0, opacity: 0 },
  show: { height: "auto", opacity: 1, transition: { duration: 0.35, ease } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.25, ease } },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="h-5 w-2/3 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-1/3 bg-gray-100 rounded" />
    </div>
  );
}

export default function MyConsultations() {
  const [items, setItems] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [active, setActive] = useState(null); // { id, type: 'cancel' | 'reschedule' }
  const [reason, setReason] = useState("");
  const [newSlotId, setNewSlotId] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const [mine, open] = await Promise.all([
        api.get("/api/consultations/mine"),
        api.get("/api/consultations/slots"),
      ]);
      setItems(pick(mine, "consultations"));
      setSlots(pick(open, "slots"));
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const openPanel = (id, type) => {
    setActive({ id, type });
    setReason("");
    setNewSlotId("");
  };
  const closePanel = () => setActive(null);

  async function confirmCancel(id) {
    setSaving(true);
    try {
      const body = reason.trim() ? { reason: reason.trim() } : {};
      await api.patch(`/api/consultations/${id}/cancel`, body);
      showSuccess("Booking cancelled");
      closePanel();
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmReschedule(id) {
    if (!newSlotId) return showError("Please choose a new time");
    setSaving(true);
    try {
      await api.patch(`/api/consultations/${id}/reschedule`, { slotId: Number(newSlotId) });
      showSuccess("Booking moved to your new time");
      closePanel();
      await load();
    } catch (err) {
      showError(err.message);
      await load(); // the time may have just been taken
    } finally {
      setSaving(false);
    }
  }

  const sorted = useMemo(
    () => [...items].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)),
    [items]
  );

  const upcomingCount = items.filter((c) => c.status === "confirmed").length;

  return (
    // MotionConfig "user" = people who turned on "reduce motion" in their OS get no animation
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-gradient-to-b from-[#f3f7fb] to-white">
        {/* Header band, same navy as the rest of the site */}
        <div className="bg-[#001F3F] relative overflow-hidden">
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#05FBE6]/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="max-w-3xl mx-auto px-4 py-12 relative">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="text-[#05FBE6] text-sm font-medium tracking-wide uppercase"
            >
              Your bookings
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.08 }}
              className="text-white text-3xl md:text-4xl font-semibold mt-2"
            >
              My Consultations
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.16 }}
              className="flex flex-wrap items-center justify-between gap-4 mt-4"
            >
              <p className="text-white/70 text-sm">
                {loading
                  ? "Loading..."
                  : upcomingCount > 0
                  ? `You have ${upcomingCount} upcoming ${upcomingCount === 1 ? "consultation" : "consultations"}.`
                  : "Manage, move or cancel your appointments here."}
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/consultation"
                  className="inline-flex items-center gap-2 px-5 h-10 rounded-full border-2 border-[#05FBE6] text-[#05FBE6] text-sm font-medium hover:bg-[#05FBE6] hover:text-[#001F3F] transition-colors"
                >
                  <Plus size={16} /> Book new
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {loading && (
            <div className="space-y-5">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading && loadError && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
            >
              {loadError}
              <button onClick={load} className="underline ml-3 font-medium">
                Try again
              </button>
            </motion.div>
          )}

          {!loading && !loadError && sorted.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-5 w-16 h-16 rounded-full bg-[#001F3F]/5 flex items-center justify-center"
              >
                <CalendarDays className="text-[#001F3F]" size={28} />
              </motion.div>
              <p className="text-gray-900 font-medium text-lg">No consultations yet</p>
              <p className="text-gray-500 text-sm mt-1 mb-6">Book a free session and we will take it from there.</p>
              <Link
                to="/consultation"
                className="inline-flex items-center px-6 h-11 rounded-full bg-[#001F3F] text-white text-sm font-medium hover:opacity-90 transition"
              >
                Book your first consultation
              </Link>
            </motion.div>
          )}

          <motion.div variants={list} initial="hidden" animate="show" className="space-y-5">
            <AnimatePresence mode="popLayout">
              {sorted.map((c) => {
                const st = STATUS[c.status] || { label: c.status, dot: "bg-gray-400", chip: "bg-gray-100 text-gray-600 border-gray-200" };
                const isConfirmed = c.status === "confirmed";
                const canReschedule = isConfirmed && (c.rescheduleCount ?? 0) < MAX_RESCHEDULES;
                const isOpenHere = active?.id === c.id;
                const otherSlots = slots.filter((s) => !(s.date === c.date && s.time === c.time));
                const serviceName = c.serviceName ?? c.service?.name ?? c.service ?? "Consultation";
                const mode = MODE[c.mode];

                return (
                  <motion.div
                    key={c.id}
                    layout
                    variants={card}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ y: -3 }}
                    transition={{ layout: { duration: 0.35, ease } }}
                    className={`rounded-2xl bg-white border shadow-sm hover:shadow-md transition-shadow p-6 ${
                      isConfirmed ? "border-gray-100" : "border-gray-100 opacity-80"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{serviceName}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-gray-600 text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={15} className="text-[#0b4da0]" /> {formatDate(c.date)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={15} className="text-[#0b4da0]" /> {formatTime(c.time)}
                          </span>
                          {mode && (
                            <span className="inline-flex items-center gap-1.5">
                              <mode.Icon size={15} className="text-[#0b4da0]" /> {mode.label}
                            </span>
                          )}
                        </div>
                        {c.reference && <p className="text-xs text-gray-400 mt-2 tracking-wide">Ref: {c.reference}</p>}
                      </div>

                      <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border ${st.chip}`}>
                        <span className="relative flex h-2 w-2">
                          {isConfirmed && (
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${st.dot}`} />
                          )}
                          <span className={`relative inline-flex h-2 w-2 rounded-full ${st.dot}`} />
                        </span>
                        {st.label}
                      </span>
                    </div>

                    {isConfirmed && c.meetingLink && (
                      <motion.a
                        whileHover={{ x: 3 }}
                        href={c.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-4 h-9 rounded-full bg-[#0b4da0] text-white text-sm font-medium"
                      >
                        Join meeting <ExternalLink size={14} />
                      </motion.a>
                    )}
                    {isConfirmed && !c.meetingLink && c.mode === "video" && (
                      <p className="text-sm text-gray-400 mt-4">Your meeting link will appear here once it is ready.</p>
                    )}
                    {c.status === "cancelled" && c.cancelReason && (
                      <p className="text-sm text-gray-500 mt-4">Reason: {c.cancelReason}</p>
                    )}

                    {isConfirmed && !isOpenHere && (
                      <div className="flex flex-wrap gap-3 mt-5">
                        {canReschedule && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => openPanel(c.id, "reschedule")}
                            className="px-5 h-9 rounded-full border border-[#001F3F] text-[#001F3F] text-sm font-medium hover:bg-[#001F3F] hover:text-white transition-colors"
                          >
                            Reschedule
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => openPanel(c.id, "cancel")}
                          className="px-5 h-9 rounded-full border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          Cancel booking
                        </motion.button>
                      </div>
                    )}

                    {/* Smoothly expanding panels */}
                    <AnimatePresence initial={false}>
                      {isOpenHere && active.type === "cancel" && (
                        <motion.div key="cancel" variants={panel} initial="hidden" animate="show" exit="exit" className="overflow-hidden">
                          <div className="mt-5 border-t border-gray-100 pt-5">
                            <label className="block text-sm text-gray-700 mb-2">Reason (optional)</label>
                            <textarea
                              rows="2"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-[#0b4da0] focus:ring-2 focus:ring-[#0b4da0]/20 transition"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Bookings can only be cancelled up to 12 hours before the appointment.
                            </p>
                            <div className="flex gap-3 mt-4">
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                disabled={saving}
                                onClick={() => confirmCancel(c.id)}
                                className="px-5 h-9 rounded-full bg-red-600 text-white text-sm font-medium disabled:opacity-60"
                              >
                                {saving ? "Cancelling..." : "Yes, cancel it"}
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={closePanel}
                                className="px-5 h-9 rounded-full border border-gray-300 text-sm"
                              >
                                Keep booking
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {isOpenHere && active.type === "reschedule" && (
                        <motion.div key="reschedule" variants={panel} initial="hidden" animate="show" exit="exit" className="overflow-hidden">
                          <div className="mt-5 border-t border-gray-100 pt-5">
                            <label className="block text-sm text-gray-700 mb-2">Choose a new time</label>
                            <select
                              value={newSlotId}
                              onChange={(e) => setNewSlotId(e.target.value)}
                              className="w-full h-11 rounded-xl border border-gray-300 px-3 bg-white text-sm outline-none focus:border-[#0b4da0] focus:ring-2 focus:ring-[#0b4da0]/20 transition"
                            >
                              <option value="">{otherSlots.length ? "Select a time" : "No free times right now"}</option>
                              {otherSlots.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {formatDate(s.date)} - {formatTime(s.time)}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                              You can reschedule up to {MAX_RESCHEDULES} times, at least 12 hours before the appointment.
                            </p>
                            <div className="flex gap-3 mt-4">
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                disabled={saving}
                                onClick={() => confirmReschedule(c.id)}
                                className="px-5 h-9 rounded-full bg-[#001F3F] text-white text-sm font-medium disabled:opacity-60"
                              >
                                {saving ? "Moving..." : "Confirm new time"}
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={closePanel}
                                className="px-5 h-9 rounded-full border border-gray-300 text-sm"
                              >
                                Back
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}