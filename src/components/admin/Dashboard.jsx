import React from 'react';
import { TrendingUp, MoreVertical } from 'lucide-react';
import { stats, consultations, recentActivities } from "./AdminDashboardData.js";

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-100`}
          >
            <div className="flex items-start justify-between py-4 ">
              <h3 className="text-[20px] font-medium text-[#1C1C1C]">
                {stat.title}
              </h3>
              <div className={`${stat.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
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
          </div>
        ))}
      </div>

      {/* Summary Consultation Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Summary Consultation Bookings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="px-6 py-4 text-left w-[72px] text-xs font-semibold uppercase tracking-wider">
                  Con.. ID
                </th>
                <th className="px-6 py-4 w-[146px] text-left text-xs font-semibold uppercase tracking-wider">
                  Who Are You
                </th>
                <th className="px-6 py-4 w-[164px] text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 w-[150px] text-left text-xs font-semibold uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-4 w-[108px] text-left text-xs font-semibold uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-4 w-[156px] text-left text-xs font-semibold uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-4 text-left w-[176px] text-xs font-semibold uppercase tracking-wider">
                  Appointment Date & Time
                </th>
                <th className="px-6 py-4 w-[196px] text-left text-xs font-semibold uppercase tracking-wider">
                  Auto Description
                </th>
                <th className="px-6 py-4 w-[108px] text-left text-xs font-semibold uppercase tracking-wider">
                  Auto Status
                </th>
                <th className="px-6 py-4 w-[105px] text-left text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {consultations.map((consultation, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {consultation.consulId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {consultation.whoAreYou}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {consultation.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {consultation.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {consultation.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {consultation.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {consultation.appointmentDateTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {consultation.autoDescription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {consultation.autoStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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