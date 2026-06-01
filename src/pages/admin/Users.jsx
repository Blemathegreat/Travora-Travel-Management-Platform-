import React from 'react'
import TableWithFilters from '../../components/admin/TableWithFilters'
import { users } from '../../components/admin/UsersData'

const columns = [
  { header: 'ID', accessor: 'id', width: 'w-20' },
  { header: 'Email', accessor: 'email' },
  { header: 'Phone Number', accessor: 'phone' },
  { header: 'RegistrationDate', accessor: 'registrationDate' },
  { header: 'Last Login', accessor: 'lastLogin' },
  { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-3 py-1 rounded-full text-xs ${row.status === 'Productive' ? 'bg-blue-100 text-blue-700' : row.status === 'Dormant' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
        {row.status}
      </span>
    )},
  { header: 'Action', accessor: 'action', render: () => <div className="text-gray-400">•••</div> }
]

export default function Users() {
  return (
    <div className="p-6">
      <TableWithFilters title="Users" columns={columns} data={users} statusOptions={["Productive","Dormant","Deactivated"]} />
    </div>
  )
}
