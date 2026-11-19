import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { images, navbar } from '../assets/Photo'
import Logo from "./Logo.jsx"
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/apiClient'
import usePolling from '../hooks/usePolling'
import { showSuccess, showError } from '../utils/toastConfig'

// Links everybody can see. "My Bookings" is NOT public any more, it is added below for customers only.
const PUBLIC_LINKS = navbar.filter(
  (item) => item.label !== 'My Bookings' && item.href !== '/my-consultations'
)

const linkClass =
  "relative text-[#FFFFFF] text-[18px] xl:text-[22px] font-medium tracking-[0%] leading-[100%] cursor-pointer hover:text-gray-300 transition-colors"
const pillClass =
  "border-2 border-[#05FBE6] text-[#05FBE6] rounded-[68px] px-6 md:px-10 py-2.5 hover:bg-[#05FBE6] hover:text-[#001F3F] transition-colors"

// The little aqua number bubble
function Badge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute -top-3 -right-4 min-w-[20px] h-5 px-1 rounded-full bg-[#05FBE6] text-[#001F3F] text-xs font-bold flex items-center justify-center"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const [unread, setUnread] = useState(0)
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isChatUser = !!user && (user.role === 'customer' || user.role === 'ambassador')
  const firstName = user?.firstName ?? user?.first_name ?? ''

  /* ---------- unread badge (customers and ambassadors only) ---------- */
  const refreshUnread = useCallback(async () => {
    const res = await api.get('/api/inbox/unread-count')
    setUnread((res?.data ?? res).unread || 0)
  }, [])

  // fetch when the person logs in and every time they go to another page
  useEffect(() => {
    if (!isChatUser) {
      setUnread(0)
      return
    }
    refreshUnread().catch(() => {})
  }, [isChatUser, location.pathname, refreshUnread])

  // ...and keep checking every 15 seconds (only while logged in)
  usePolling(refreshUnread, 15000, isChatUser)

  // The chat page announces "I just marked everything as read", so the badge clears instantly
  useEffect(() => {
    const clear = () => setUnread(0)
    window.addEventListener('inbox:read', clear)
    return () => window.removeEventListener('inbox:read', clear)
  }, [])

  /* ---------- which links does THIS person get? ---------- */
  const accountLinks = []
  if (user?.role === 'customer') accountLinks.push({ label: 'My Bookings', href: '/my-consultations' })
  if (isChatUser) accountLinks.push({ label: 'Messages', href: '/messages', badge: unread })
  if (user?.role === 'ambassador') accountLinks.push({ label: 'Dashboard', href: '/ambassador/dashboard' })
  if (user?.role === 'admin') accountLinks.push({ label: 'Admin Panel', href: '/admin' })

  // while we are still checking the session, show only the public links (no flicker of wrong links)
  const links = [...PUBLIC_LINKS, ...(loading ? [] : accountLinks)]

  async function handleLogout() {
    try {
      await logout()
      setVisible(false)
      showSuccess('You have been logged out')
      navigate('/')
    } catch (err) {
      showError(err.message)
    }
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className="bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${images.background})` }}>
        <div className="h-full items-center">
          <div className=" sm:w-full backdrop-blur-sm bg-[#0017219E]/10 py-2 px-4 md:px-10 lg:px-16">
            <div className="flex justify-between gap-2 items-center">
              <div>
                <Logo />
              </div>

              <div className="hidden lg:flex gap-x-5 xl:gap-x-7 items-center">
                {links.map((item) => (
                  <NavLink key={item.href} to={item.href} className={linkClass}>
                    {item.label}
                    {item.badge !== undefined && <Badge count={item.badge} />}
                  </NavLink>
                ))}
              </div>

              <div className="py-4 hidden lg:flex items-center gap-4">
                {loading ? null : user ? (
                  <>
                    {firstName && <span className="text-white/80">Hi, {firstName}</span>}
                    <button onClick={handleLogout} className={pillClass}>Logout</button>
                  </>
                ) : (
                  <Link to="/login" className={pillClass}>Login</Link>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <Menu onClick={() => setVisible(true)} className='w-10 lg:hidden cursor-pointer text-white' />
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <motion.div
          className="fixed top-0 right-0 bottom-0 z-[9999] bg-red-500 h-screen bg-center bg-cover bg-no-repeat overflow-hidden"
          style={{ backgroundImage: `url(${images.background})` }}
          animate={{ width: visible ? '100%' : '0%' }}
          initial={{ width: '0%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="flex flex-col  p-3">
            <div onClick={() => setVisible(false)} className="flex gap-3 items-center">
              <img alt="dropdown" src={images.dropdown} className="w-3 rotate-180" />
              <p className="text-white text-[18px] font-medium">Back</p>
            </div>
            <div className="flex flex-col items-center gap-6 mt-10">
              {links.map((item) => (
                <NavLink
                  onClick={() => setVisible(false)}
                  to={item.href}
                  key={item.href}
                  className="relative text-[#FFFFFF] text-[24px] font-medium tracking-[0%] leading-[100%] cursor-pointer hover:text-gray-300"
                >
                  {item.label}
                  {item.badge !== undefined && <Badge count={item.badge} />}
                </NavLink>
              ))}

              {!loading &&
                (user ? (
                  <button onClick={handleLogout} className={`${pillClass} mt-4`}>Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setVisible(false)} className={`${pillClass} mt-4`}>Login</Link>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}