import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TrendingUp, MoreVertical } from 'lucide-react';
import DataTable from "./DataTable.jsx"
import { consultationDTable } from './ConsultationDTable.jsx'; 
import { stats, consultations, recentActivities } from "./AdminDashboardData.js";

export default function Dashboard() {
  const handleAction = (row) => {
    console.log('Action clicked for:', row);
  };
    
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`${stat.bgColor} ${stat.border} rounded-xl p-6 shadow-sm `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
            >
            <div className={`flex items-start ${stat.border} justify-between py-4 `}>
              <h3 className="text-[20px] font-medium text-[#1C1C1C]">
                {stat.title}
              </h3>
              <div className={`${stat.iconBg}  w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-4xl font-bold text-gray-900">
                {stat.value}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <TrendingUp size={14} />
                  {stat.percentage}
                </span>
                <span className="text-gray-500">{stat.trend}</span>
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Reusable Table Component */}
      <DataTable 
        title="Summary Consultation Bookings"
        columns={consultationDTable(handleAction)}
        data={consultations}
      />

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Activity
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <p className="text-sm text-gray-700 font-medium">
                {activity.text}
              </p>
              <span className="text-sm text-gray-500 font-medium">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}