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
import Partnership from './pages/Partnership'
import Navbar from './components/Navbar'



export default function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/blog' element={<Blog/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/ambassador' element={<Ambassador/>}/>
      <Route path='/partnership' element={<Partnership/>}/>
      <Route path='about' element={About}/>
      <Route path="service" element={Service}/>
      </Routes> 
      </div>
  )
}
