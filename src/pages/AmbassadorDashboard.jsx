import React from 'react';
import { Link } from 'react-router-dom';
import DashNav from '../components/ambasssador/DashNav.jsx';
import DashBody from '../components/ambasssador/DashBody.jsx';

export default function AmbassadorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashNav />
      <DashBody />

     
    </div>
  );
}
