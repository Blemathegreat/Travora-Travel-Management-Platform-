import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import DataTable from './DataTable'

export default function TableWithFilters({ title, columns, data, statusOptions = [] , searchPlaceholder = 'Search name' }){
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const filtered = useMemo(() => {
    if(!data) return []
    return data.filter((row) => {
      const matchSearch =
        search === '' ||
        Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())

      const matchStatus = status === '' || (row.status || row.autoStatus || '').toLowerCase() === status.toLowerCase()

      return matchSearch && matchStatus
    })
  }, [data, search, status])

  return (
    <div className="p-6 space-y-4 bg-transparent">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Search:</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm text-gray-700 w-64"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none cursor-pointer"
            >
              <option value="">All</option>
              {statusOptions.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* right side placeholder for future controls */}
        <div />
      </div>

      <DataTable title={title} columns={columns} data={filtered} />
    </div>
  )
}
