import React from 'react'
import Navbar from '../components/Navbar'
import Hero from "../components/Hero"
import Questions from "../components/Questions"
import Services from "../components/Services"
import Partnership from "../components/Partnership"
import TestimonialsSection  from "../components/TestimonialsSection "
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div className="">
    <Hero/>
    <Questions/>
    <Services/>
    <Partnership/>
    <TestimonialsSection/>
    <Newsletter/>
    
    </div>
  )
}
