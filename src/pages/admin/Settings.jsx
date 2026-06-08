import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { showSuccess, showError, showWarning } from '../../utils/toastConfig'

export default function Settings() {
  const navigate = useNavigate()
  const [info, setInfo] = useState({ fullName: '', phone: '', email: '' })
  const [passwords, setPasswords] = useState({ newPassword: '', confirm: '' })

  function handleInfoChange(e) {
    const { name, value } = e.target
    setInfo((s) => ({ ...s, [name]: value }))
  }

  function handlePasswordsChange(e) {
    const { name, value } = e.target
    setPasswords((s) => ({ ...s, [name]: value }))
  }

  function handleUpdate(e) {
    e.preventDefault()
    // placeholder: save profile info (no backend hooked)
    showSuccess('Profile updated successfully')
  }

  function handleChangePassword(e) {
    e.preventDefault()
    if (!passwords.newPassword) return showError('Please enter a new password')
    if (passwords.newPassword !== passwords.confirm) return showError('Passwords do not match')
    showSuccess('Password changed successfully')
    setPasswords({ newPassword: '', confirm: '' })
  }

  // Logout is handled from the sidebar; removed from this settings screen.

  return (
    <div className="bg-slate-50 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Admin Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <form onSubmit={handleUpdate} className="space-y-6">
              <section>
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Admin Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Full Name</label>
                    <input name="fullName" value={info.fullName} onChange={handleInfoChange} className="w-full h-11 rounded-md border border-slate-200 px-3 text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Phone number</label>
                    <input name="phone" value={info.phone} onChange={handleInfoChange} className="w-full h-11 rounded-md border border-slate-200 px-3 text-sm" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-2">Email Address</label>
                    <input name="email" value={info.email} onChange={handleInfoChange} className="w-full h-11 rounded-md border border-slate-200 px-3 text-sm" />
                  </div>
                </div>
                <div className="mt-4">
                  <button type="submit" className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md text-sm">Update</button>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">New Password</label>
                    <input name="newPassword" type="password" value={passwords.newPassword} onChange={handlePasswordsChange} className="w-full h-11 rounded-md border border-slate-200 px-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Confirm Password</label>
                    <input name="confirm" type="password" value={passwords.confirm} onChange={handlePasswordsChange} className="w-full h-11 rounded-md border border-slate-200 px-3 text-sm" />
                  </div>
                </div>
                <div className="mt-4">
                  <button onClick={handleChangePassword} className="inline-flex items-center gap-2 bg-[#103e72] text-white px-4 py-2 rounded-md text-sm">Change Password</button>
                </div>
              </section>
            </form>
          </div>

        
        </div>

        {/* logout modal removed from settings - use sidebar logout */}
      </div>
    </div>
  )
}
