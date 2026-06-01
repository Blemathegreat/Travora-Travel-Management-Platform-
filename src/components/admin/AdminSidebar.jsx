import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Inbox,
  Share2,
  Ticket,
  Ambulance,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Consultation Bookings', icon: Users, path: '/admin/consultation-bookings' },
    { name: 'Testimonial', icon: FileText, path: '/admin/testimonials' },
    { name: 'FAQ', icon: FileText, path: '/admin/faq' },
    { name: 'Inbox', icon: Inbox, path: '/admin/inbox' },
    { name: 'Blogpost', icon: Share2, path: '/admin/blog' },
    { name: 'Ticket', icon: Ticket, path: '/admin/tickets' },
    { name: 'Ambassador Overview', icon: Ambulance, path: '/admin/ambassadors' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-40 w-64 bg-white text-slate-900 flex flex-col h-full border-r border-slate-200 md:relative"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: open ? 0 : -320, opacity: open ? 1 : 0.9 }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
    >
      <div className="px-6 pt-6 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-2xl font-bold leading-[150%] text-[#444444]">MENU</h1>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-900 md:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-2 md:py-4 px-3 md:px-6 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
            onClick={onClose}
          >
            <item.icon size={20} />
            <span className="text-[14px] leading-[150%] h-[21px] font-medium text-[#1C1C1C]">{item.name}</span>
          </NavLink>
        ))}

        <button
          className="w-full flex items-center gap-3 px-4 py-3 mt-8 text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={20} />
          <span className="text-[14px] leading-[150%] h-[21px] font-medium text-[#1C1C1C]">Logout Account</span>
        </button>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowLogoutModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
              aria-label="Close logout confirmation"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Confirm logout</h2>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to log out? This will end your current session.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  navigate('/');
                }}
                className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}