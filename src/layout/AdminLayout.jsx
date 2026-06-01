import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminNavbar from "../components/ambasssador/DashNav.jsx";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveSidebarOpen = isDesktop || sidebarOpen;

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex min-h-screen">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <AdminSidebar open={effectiveSidebarOpen} onClose={() => setSidebarOpen(false)} />

        <motion.main
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;