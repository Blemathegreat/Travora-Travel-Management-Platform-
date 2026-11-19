import { MoreVertical, AlertCircle } from 'lucide-react';

export const formatTime = (time) => {
  if (!time || typeof time !== 'string') return '-';
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(`${String(date).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(date); // show the raw value instead of crashing
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
};

export const STATUS_STYLES = {
  confirmed: { label: 'Scheduled', style: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Completed', style: 'bg-teal-100 text-teal-700' },
  cancelled: { label: 'Cancelled', style: 'bg-gray-100 text-gray-600' },
  no_show: { label: 'No-show', style: 'bg-red-100 text-red-700' },
};

export const MODE_LABEL = { video: 'Video call', phone: 'Phone call', in_person: 'In person' };

export const consultationDTable = (onActionClick) => [
  { header: 'Reference', accessor: 'reference', width: 'w-[120px]' },
  { header: 'Who Are You', accessor: 'contactName', width: 'w-[146px]' },
  { header: 'Email', accessor: 'contactEmail', width: 'w-[164px]' },
  { header: 'Phone Number', accessor: 'contactPhone', width: 'w-[150px]' },
  { header: 'Age', accessor: 'age', width: 'w-[70px]' },
  { header: 'Service Type', accessor: 'serviceName', width: 'w-[156px]' },
  {
    header: 'Appointment Date & Time',
    accessor: 'date',
    width: 'w-[176px]',
    render: (row) => `${formatDate(row.date)}, ${formatTime(row.time)}`,
  },
  {
    header: 'Description',
    accessor: 'notes',
    width: 'w-[196px]',
    render: (row) => (
      <span title={row.notes} className="block max-w-[200px] truncate">
        {row.notes}
      </span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    width: 'w-[150px]',
    render: (row) => {
      const s = STATUS_STYLES[row.status] || { label: row.status, style: 'bg-gray-100 text-gray-600' };
      return (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${s.style}`}>
            • {s.label}
          </span>
          {row.needsAttention && (
            <span title="Appointment time has passed. Please update the status." className="text-amber-500">
              <AlertCircle size={18} />
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: 'Action',
    accessor: 'action',
    width: 'w-[105px]',
    render: (row) => (
      <button
        className="text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => onActionClick?.(row)}
        aria-label="Open booking"
      >
        <MoreVertical size={20} />
      </button>
    ),
  },
];