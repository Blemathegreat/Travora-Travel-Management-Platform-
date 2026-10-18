import { useEffect, useState } from 'react';
import { api } from '../../utils/apiClient'
import { showSuccess, showError } from '../../utils/toastConfig' // copy from AdminPayouts.jsx

const formatMoney = (v) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(v || 0));

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const loadCommissions = async () => {
    try {
      const res = await api.get('/api/ambassadors/commissions');
      setCommissions(res.data.commissions);
    } catch (err) {
      showError(err.message || 'Could not load commissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissions();
  }, []);

  const handleAction = async (commission, action) => {
    let body = {};

    if (action === 'approve') {
      const ok = window.confirm(
        `Approve ${formatMoney(commission.amount)} for ${commission.first_name}? It will count toward their available balance.`
      );
      if (!ok) return;
    } else {
      const reason = window.prompt('Reason for rejecting (optional):');
      if (reason === null) return; // admin pressed Cancel
      body = { reason };
    }

    setBusyId(commission.id);
    try {
      await api.patch(`/api/ambassadors/commissions/${commission.id}/${action}`, body);
      showSuccess(action === 'approve' ? 'Commission approved' : 'Commission rejected');
      await loadCommissions();
    } catch (err) {
      showError(err.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const pending = commissions.filter((c) => c.status === 'pending');
  const approved = commissions.filter((c) => c.status === 'approved');
  const sum = (list) => list.reduce((total, c) => total + Number(c.amount), 0);
  const visible = filter === 'all' ? commissions : commissions.filter((c) => c.status === filter);

  if (loading) return <div className="p-8 text-gray-500">Loading commissions...</div>;

  return (
    <div className="p-6 md:p-8">
      <p className="text-xs tracking-widest text-gray-500 uppercase">Admin / Ambassadors</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Commissions</h1>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-3xl border bg-white p-5">
          <p className="text-sm text-gray-500">Awaiting review</p>
          <p className="text-2xl font-bold">{formatMoney(sum(pending))}</p>
          <p className="text-xs text-gray-400">{pending.length} commission(s)</p>
        </div>
        <div className="rounded-3xl border bg-white p-5">
          <p className="text-sm text-gray-500">Approved, in ambassadors' balance</p>
          <p className="text-2xl font-bold">{formatMoney(sum(approved))}</p>
          <p className="text-xs text-gray-400">{approved.length} commission(s)</p>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-full border px-4 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="rounded-3xl border bg-white overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Ambassador</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Source</th>
              <th className="p-4">Created</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  No commissions to show.
                </td>
              </tr>
            )}
            {visible.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4 font-semibold">{c.id}</td>
                <td className="p-4">
                  <div className="font-medium">{c.first_name} {c.last_name}</div>
                  <div className="text-xs text-gray-500">{c.email}</div>
                </td>
                <td className="p-4 font-semibold">{formatMoney(c.amount)}</td>
                <td className="p-4 text-gray-600">{c.sourceType} #{c.sourceId}</td>
                <td className="p-4">{formatDate(c.createdAt)}</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4">
                  {c.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        disabled={busyId === c.id}
                        onClick={() => handleAction(c, 'approve')}
                        className="rounded-full bg-teal-600 px-4 py-1.5 text-white disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busyId === c.id}
                        onClick={() => handleAction(c, 'reject')}
                        className="rounded-full border border-red-300 px-4 py-1.5 text-red-600 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : c.status === 'rejected' && c.rejectedReason ? (
                    <span className="text-xs text-gray-500">{c.rejectedReason}</span>
                  ) : (
                    <span className="text-xs text-gray-400">{formatDate(c.reviewedAt)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}