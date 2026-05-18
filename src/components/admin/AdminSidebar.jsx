import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, Inbox, Share2, 
  Ticket, Ambulance, Settings, LogOut
} from 'lucide-react';

export default function AdminSidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Consultation Bookings', icon: Users, path: '/admin/consultation-bookings' },
    { name: 'Testimonial', icon: FileText, path: '/admin/testimonials' },
    { name: 'Inbox', icon: Inbox, path: '/admin/inbox' },
    { name: 'Blogpost', icon: Share2, path: '/admin/blog' },
    { name: 'Ticket', icon: Ticket, path: '/admin/tickets' },
    { name: 'Ambassador Overview', icon: Ambulance, path: '/admin/ambassadors' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] text-white flex flex-col h-full">
      {/* Logo Section */}
      <div className="px-6 pt-6   border-slate-700">
        <h1 className="text-2xl font-bold leading-[150%]  text-[#444444]">MENU</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-2 md:py-4 px-3 md:px-6 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[14px] leading-[150%] h-[21px] font-medium text-[#1C1C1C] ">{item.name}</span>
          </NavLink>
        ))}
        
        {/* Logout Button */}
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 mt-8 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all"
          onClick={() => {
            // Add logout logic here
            console.log('Logout clicked');
          }}
        >
          <LogOut size={20} />
          <span className="text-[14px] leading-[150%] h-[21px] font-medium text-[#1C1C1C] font-medium">Logout Account</span>
        </button>
      </nav>
    </aside>
  );
}