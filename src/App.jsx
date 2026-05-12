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
import Navbar from './components/Navbar'
import Footer from "./components/Footer"
import BlogDetail from "./components/blog/BlogDetail"
import ReferalActivities from './pages/ReferalActivities'



export default function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
     <Route path='/blog' element={<Blog/>}/>
      <Route path='/blog/:id' element={<BlogDetail/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/ambassador' element={<Ambassador/>}/>
      <Route path='/ambassador/dashboard' element={<AmbassadorDashboard/>}/>
      <Route path='/partnership' element={<Partnership/>}/>
      <Route path='/referal-activities' element={<ReferalActivities/>}/>
      <Route path='about' element={<About/>}/>
      <Route path="service" element={<Service/>}/>
      </Routes> 
      <Footer/>
      </div>
  )
}
