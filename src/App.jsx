import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Service from './pages/Services'
import Contact from './pages/Contact'
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
import ConsultationBookings from './pages/admin/ConsultationBookings'
import Inbox from './pages/admin/Inbox'
import FAQ from './pages/admin/FAQ'
import Users from './pages/admin/Users'

export default function App() {
  return (
    <Routes>
      
      <Route element={<PublicLayout />}>
        <Route path='/' element={<Home/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path="/ambassador-reward" element={<AmbassordorReward/>}/> 
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/blog/:id' element={<BlogDetail/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/ambassador' element={<Ambassador/>}/>
        <Route path='/ambassador/dashboard' element={<AmbassadorDashboard/>}/>
        <Route path='/partnership' element={<Partnership/>}/>
        <Route path='/referal-activities' element={<ReferalActivities/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path="/service" element={<Service/>}/>
      </Route>

      
      <Route path="/admin" element={<AdminLayout/>}>
        <Route index element={<AdminDashboard/>}/> {/* /admin */}
        <Route path="dashboard" element={<AdminDashboard/>}/> {/* /admin/dashboard */}
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