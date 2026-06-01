import React, { useState, useMemo } from 'react'
import {useNavigate} from "react-router-dom"
import DataTable from './DataTable.jsx';
import { consultationDTable } from './ConsultationDTable.jsx';  
import { consultations } from "./AdminDashboardData.js";
import { Search } from 'lucide-react';

export default function Consultation() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  // Action handler — customize this to open modal, delete, navigate etc.
  const handleAction = (row) => {
    console.log('Action clicked for:', row);
  };

  const filtered = useMemo(() => {
    return consultations.filter((row) => {
      const matchSearch =
        search === '' ||
        row.whoAreYou.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        status === '' || row.autoStatus.toLowerCase() === status.toLowerCase();

      const matchDate =
        date === '' || row.appointmentDateTime.includes(date);

      return matchSearch && matchStatus && matchDate;
    });
  }, [search, status, date]);

  return (
    <div className="p-6 space-y-6">

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4" onClick={()=>navigate("/admin/consultation-settings")}>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#FFFFFF] bg-[#008395] border border-teal-200 
                       px-4 py-2 rounded-lg">
          Consultation Settings
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">

          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Search</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg 
                            px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-teal-400">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm text-gray-700 w-40"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                         text-gray-700 bg-white outline-none focus:ring-2 
                         focus:ring-teal-400 cursor-pointer"
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                         text-gray-700 bg-white outline-none focus:ring-2 
                         focus:ring-teal-400 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Summary Consultation Bookings"
        columns={consultationDTable(handleAction)}
        data={filtered}
      />

    </div>
  );
}