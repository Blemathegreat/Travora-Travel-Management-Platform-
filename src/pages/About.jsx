import React from 'react'
import PublicTitle from "../components/about/PublicTitle.jsx"
import WhoweAre from "../components/about/WhoweAre.jsx"
import Whatwedo from  "../components/about/WhatweDo.jsx"
import Newsletter from '../components/Newsletter.jsx'

export default function About() {
  return (
    <div>
      <PublicTitle title="About Us"/>
      <WhoweAre/>
      <Whatwedo/>
      <Newsletter/>
    </div>
  )
}
