import { MoreVertical } from 'lucide-react';

export const consultationDTable = (onActionClick) => [
  { header: 'Con.. ID', accessor: 'consulId', width: 'w-[72px]' },
  { header: 'Who Are You', accessor: 'whoAreYou', width: 'w-[146px]' },
  { header: 'Email', accessor: 'email', width: 'w-[164px]' },
  { header: 'Phone Number', accessor: 'phoneNumber', width: 'w-[150px]' },
  { header: 'Age', accessor: 'age', width: 'w-[108px]' },
  { header: 'Service Type', accessor: 'serviceType', width: 'w-[156px]' },
  { header: 'Appointment Date & Time', accessor: 'appointmentDateTime', width: 'w-[176px]' },
  { header: 'Auto Description', accessor: 'autoDescription', width: 'w-[196px]' },
  {
    header: 'Auto Status',
    accessor: 'autoStatus',
    width: 'w-[108px]',
    render: (row) => {
      const statusStyles = {
        Completed: 'bg-teal-100 text-teal-700',
        Pending: 'bg-amber-100 text-amber-700',
        Scheduled: 'bg-purple-100 text-purple-700',
      };
      const style = statusStyles[row.autoStatus] || 'bg-gray-100 text-gray-600';
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
          • {row.autoStatus}
        </span>
      );
    }
  },
  {
    header: 'Action',
    accessor: 'action',
    width: 'w-[105px]',
    render: (row) => (
      <button
        className="text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => onActionClick?.(row)}  // ✅ ?. prevents crash if undefined
      >
        <MoreVertical size={20} />
      </button>
    )
  }
];