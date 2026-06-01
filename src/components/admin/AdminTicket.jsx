import React, { useState } from 'react'
import DataTable from './DataTable'
import { MoreVertical } from 'lucide-react'

const initialTickets = [
  {
    id: '001',
    fullName: 'Kwetua Blankson',
    email: 'newerton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Resolved',
    date: new Date('2025-03-01'),
  },
  {
    id: '002',
    fullName: 'Kwetua Blankson',
    email: 'newerton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Pending',
    date: new Date('2025-03-03'),
  },
  {
    id: '003',
    fullName: 'Kwetua Blankson',
    email: 'neweton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Resolved',
    date: new Date('2025-03-05'),
  },
  {
    id: '004',
    fullName: 'Kwetua Blankson',
    email: 'newerton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Resolved',
  },
  {
    id: '005',
    fullName: 'Kwetua Blankson',
    email: 'newerton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Resolved',
  },
  {
    id: '006',
    fullName: 'Kwetua Blankson',
    email: 'newerton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Pending',
  },
  {
    id: '007',
    fullName: 'Kwetua Blankson',
    email: 'newerton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Pending',
  },
  {
    id: '008',
    fullName: 'Kwetua Blankson',
    email: 'newerton@gmail.com',
    phoneNumber: '+233596562042',
    message: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
    status: 'Resolved',
    date: new Date('2025-03-12'),
  },
]

const getTicketColumns = (onAction) => [
  { header: 'Ticket ID', accessor: 'id', width: 'w-[80px]' },
  { header: 'Full Name', accessor: 'fullName', width: 'w-[120px]' },
  { header: 'Email', accessor: 'email', width: 'w-[180px]' },
  { header: 'Phone Number', accessor: 'phoneNumber', width: 'w-[140px]' },
  { header: 'Message', accessor: 'message', width: 'w-[250px]' },
  {
    header: 'Status',
    accessor: 'status',
    width: 'w-[120px]',
    render: (row) => {
      const statusStyles = {
        Resolved: 'bg-blue-100 text-blue-700',
        Pending: 'bg-yellow-100 text-yellow-700',
      }
      const style = statusStyles[row.status] || 'bg-gray-100 text-gray-600'
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
          • {row.status}
        </span>
      )
    },
  },
  {
    header: 'Action',
    accessor: 'action',
    width: 'w-[80px]',
    render: (row) => (
      <button
        className="text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => onAction?.(row)}
      >
        <MoreVertical size={20} />
      </button>
    ),
  },
]

export default function AdminTicket() {
  const [tickets, setTickets] = useState(initialTickets)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')

  function handleAction(ticket) {
    console.log('Action clicked for ticket:', ticket.id)
  }

  const filtered = tickets.filter((t) => {
    const matchesSearch = [t.fullName, t.email, t.phoneNumber, t.message]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter

    let matchesDate = true
    if (dateFilter === 'Last 7 days') {
      const since = new Date()
      since.setDate(since.getDate() - 7)
      matchesDate = new Date(t.date) >= since
    } else if (dateFilter === 'Last 30 days') {
      const since = new Date()
      since.setDate(since.getDate() - 30)
      matchesDate = new Date(t.date) >= since
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search tickets</label>
              <input
                type="text"
                placeholder="Search by name, email, phone or message"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-slate-300"
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
                  className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-slate-300"
                >
                  <option>All</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <DataTable
          title="Support Tickets"
          columns={getTicketColumns(handleAction)}
          data={filtered}
        />
      </div>
    </div>
  )
}
