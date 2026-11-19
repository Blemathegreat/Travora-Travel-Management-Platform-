import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { TrendingUp, TrendingDown, CalendarCheck, Inbox } from 'lucide-react';
import DataTable from './DataTable.jsx';
import { consultationDTable } from './ConsultationDTable.jsx';
import { api } from '../../utils/apiClient';

const ease = [0.22, 1, 0.36, 1];

// "5 minutes ago" from a timestamp
function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(then));
}

// The look of each card stays exactly as before. Only the numbers are real now.
const CARDS = [
  { key: 'total', title: 'Consultations', icon: '👥', border: 'border-b-4 border-emerald-100', iconBg: 'bg-emerald-100' },
  { key: 'scheduled', title: 'Upcoming (Scheduled)', icon: '📋', border: 'border-b-4 border-amber-100', iconBg: 'bg-amber-100' },
  { key: 'completed', title: 'Completed', icon: '📄', border: 'border-b-4 border-orange-100', iconBg: 'bg-orange-100' },
  { key: 'needsAttention', title: 'Needs Attention', icon: '⚠️', border: 'border-b-4 border-blue-100', iconBg: 'bg-blue-100' },
];

function Trend({ change }) {
  if (change === undefined) return <span className="text-gray-500">appointment time has passed, not updated</span>;
  if (change === null) return <span className="text-gray-500">new in the last 2 weeks</span>;
  const up = change >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <>
      <span className={`${up ? 'text-green-600' : 'text-red-600'} font-semibold flex items-center gap-1`}>
        <Icon size={14} />
        {up ? '+' : ''}
        {change}%
      </span>
      <span className="text-gray-500">in the last 2 weeks</span>
    </>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [dash, list] = await Promise.all([api.get('/api/admin/dashboard'), api.get('/api/consultations')]);
      const d = dash?.data ?? dash;
      setStats(d.stats);
      setActivity(d.activity || []);
      const body = list?.data ?? list;
      const rows = Array.isArray(body) ? body : body?.consultations || [];
      setBookings(rows.slice(0, 8)); // the dashboard only shows the latest few
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button onClick={load} className="underline ml-3 font-medium">Try again</button>
          </div>
        )}

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatePresence>
            {CARDS.map((card, index) => {
              const stat = stats?.[card.key];
              return (
                <motion.div
                  key={card.key}
                  className={`bg-white ${card.border} rounded-xl p-6 shadow-sm`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`flex items-start ${card.border} justify-between py-4`}>
                    <h3 className="text-[20px] font-medium text-[#1C1C1C]">{card.title}</h3>
                    <div className={`${card.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                      {card.icon}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-900">
                      {loading ? <span className="inline-block h-9 w-16 rounded bg-gray-200 animate-pulse" /> : stat?.value ?? 0}
                    </p>
                    {!loading && stat && (
                      <div className="flex items-center gap-2 text-xs">
                        <Trend change={stat.change} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Latest bookings, same table component as the bookings page */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.2 }}>
          <DataTable
            title="Summary Consultation Bookings"
            columns={consultationDTable(() => navigate('/admin/consultation-bookings'))}
            data={bookings}
          />
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>

          {!loading && activity.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              <Inbox className="mx-auto mb-3 text-gray-300" size={32} />
              Nothing has happened yet. New bookings and commissions will show up here.
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {activity.map((a, index) => (
              <motion.div
                key={`${a.type}-${a.happenedAt}-${index}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease, delay: 0.35 + index * 0.04 }}
                className="p-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <p className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <CalendarCheck size={16} className={a.type === 'commission' ? 'text-amber-500' : 'text-teal-500'} />
                  {a.text}
                </p>
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{timeAgo(a.happenedAt)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}