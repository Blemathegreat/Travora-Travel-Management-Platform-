import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminNavbar from "../components/ambasssador/DashNav.jsx";

const AdminLayout = () => {
  return (
    <div className=" bg-gray-50">
      {/* Sidebar */}
      
       <AdminNavbar /> 
      
      {/* Main Content Area */}
      <div className=" flex h-screen overflow-hidden">
        {/* Optional: Add AdminNavbar here if needed */}
         
         <AdminSidebar />
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;