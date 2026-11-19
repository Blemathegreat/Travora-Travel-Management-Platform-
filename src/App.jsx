import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Service from './pages/Services'
import Consultation from './pages/Consultation'
import Contact from './pages/Contact'
import AdminCommissions from './pages/admin/AdminCommissions';
import Blog from './pages/Blog'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Ambassador from './pages/Ambassador'
import AmbassadorDashboard from './pages/AmbassadorDashboard'
import Partnership from './pages/Partnership'
import BlogDetail from "./components/blog/BlogDetail"
import ReferalActivities from './pages/ReferalActivities'
import AmbassordorReward from './pages/AmbassadorReward'
import AdminConsultationSettings from "./pages/admin/AdminConsultationsSettings"
import Messages from './pages/Messages'
import ProtectedRoute from './components/ProtectedRoute'

import PublicLayout from './layout/PublicLayout'
import AdminLayout from './layout/AdminLayout'


import AdminDashboard from './pages/admin/AdminDashboard'
import Testimonials from './pages/admin/Testimonials'
import BlogPost from './pages/admin/BlogPost'
import Tickets from './pages/admin/Tickets'
import Settings from './pages/admin/Settings'
import AmbassadorOverview from './pages/admin/AmbassadorOverview'
import AmbassadorList from './pages/admin/AmbassadorList'
import AmbassadorDetail from './pages/admin/AmbassadorDetail'
import AdminPayouts from './pages/admin/AdminPayouts'
import ConsultationBookings from './pages/admin/ConsultationBookings'
import Inbox from './pages/admin/Inbox'
import FAQ from './pages/admin/FAQ'
import Users from './pages/admin/Users'
import MyConsultations from './pages/MyConsultations'

export default function App() {
  return (
    <Routes>

      <Route element={<PublicLayout />}>
        <Route path='/' element={<Home/>}/>
        <Route path='/consultation' element={<Consultation/>}/>
        <Route
  path='/my-consultations'
  element={
    <ProtectedRoute allowedRoles={['customer']}>
      <MyConsultations />
    </ProtectedRoute>
  }
/>

<Route
  path='/messages'
  element={
    <ProtectedRoute allowedRoles={['customer', 'ambassador']}>
      <Messages/>
    </ProtectedRoute>
  }
/>

        <Route path='/contact' element={<Contact/>}/>
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/blog/:id' element={<BlogDetail/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/ambassador' element={<Ambassador/>}/>
        <Route path='/partnership' element={<Partnership/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path="/service" element={<Service/>}/>

        {/* Ambassador-only pages */}
        <Route
          path='/ambassador/dashboard'
          element={
            <ProtectedRoute allowedRoles={['ambassador']}>
              <AmbassadorDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ambassador-reward"
          element={
            <ProtectedRoute allowedRoles={['ambassador']}>
              <AmbassordorReward/>
            </ProtectedRoute>
          }
        />
        <Route
          path='/referal-activities'
          element={
            <ProtectedRoute allowedRoles={['ambassador']}>
              <ReferalActivities/>
            </ProtectedRoute>
          }
        />
      </Route>


      {/* Admin-only section: the gate wraps the layout, so every page inside is protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout/>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard/>}/> {/* /admin */}
        <Route path="dashboard" element={<AdminDashboard/>}/> {/* /admin/dashboard */}
        <Route path="payouts" element={<AdminPayouts/>}/>
        <Route path="commissions" element={<AdminCommissions />} />
        <Route path="consultation-settings" element={<AdminConsultationSettings/>}/>
        <Route path="consultation-bookings" element={<ConsultationBookings/>}/>
        <Route path="testimonials" element={<Testimonials/>}/>
        <Route path="faq" element={<FAQ/>}/>
        <Route path="inbox" element={<Inbox/>}/>
        <Route path="blog" element={<BlogPost/>}/>
        <Route path="tickets" element={<Tickets/>}/>
        <Route path="ambassadors" element={<AmbassadorOverview/>}/>
        <Route path="ambassadors/list" element={<AmbassadorList/>}/>
        <Route path="ambassadors/:id" element={<AmbassadorDetail/>}/>
        <Route path="users" element={<Users/>}/>
        <Route path="settings" element={<Settings/>}/>
      </Route>
    </Routes>
  )
}