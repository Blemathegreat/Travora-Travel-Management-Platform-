import React, { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Star, X, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { api } from '../../utils/apiClient'
import { cdn } from '../../utils/image'
import { showError, showSuccess, showWarning } from '../../utils/toastConfig'

const ease = [0.22, 1, 0.36, 1]
const EMPTY_FORM = { name: '', role: '', rating: '5', quote: '' }

const unwrap = (res, key) => (res?.data ?? res)?.[key] ?? []

const AdminTestimonials = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null) // null = adding
  const [form, setForm] = useState(EMPTY_FORM)
  const [photoFile, setPhotoFile] = useState(null)      // NEW file picked now
  const [photoPreview, setPhotoPreview] = useState('')  // what we show in the circle
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await api.get('/api/testimonials/admin/list')
      setItems(unwrap(res, 'testimonials'))
      setLoadError('')
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // release the temporary preview address when it changes or the page closes
  useEffect(() => {
    return () => {
      if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const filtered = items.filter((t) => t.name.toLowerCase().includes(search.trim().toLowerCase()))

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setPhotoFile(null)
    setPhotoPreview('')
    setIsModalOpen(true)
  }

  function openEdit(t) {
    setEditingId(t.id)
    setForm({ name: t.name, role: t.role, rating: String(t.rating), quote: t.quote })
    setPhotoFile(null)
    setPhotoPreview(t.photoUrl ? cdn(t.photoUrl, 200) : '')
    setIsModalOpen(true)
  }

  function closeModal() {
    if (!saving) setIsModalOpen(false)
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return showWarning('Please choose a JPG, PNG or WebP image')
    if (file.size > 5 * 1024 * 1024) return showWarning('Image is too large. Maximum size is 5MB.')
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.name.trim().length < 2 || form.role.trim().length < 2) return showWarning('Please enter the name and role')
    if (form.quote.trim().length < 10) return showWarning('The testimonial must be at least 10 characters')

    // a photo can't travel as JSON, so we use FormData
    const data = new FormData()
    data.append('name', form.name.trim())
    data.append('role', form.role.trim())
    data.append('rating', form.rating)
    data.append('quote', form.quote.trim())
    if (photoFile) data.append('image', photoFile) // the backend reads the field called "image"

    setSaving(true)
    try {
      if (editingId) {
        await api.patch(`/api/testimonials/admin/${editingId}`, data)
        showSuccess('Testimonial updated')
      } else {
        await api.post('/api/testimonials/admin', data)
        showSuccess('Testimonial added')
      }
      setIsModalOpen(false)
      await load()
    } catch (err) {
      showError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function togglePublished(t) {
    try {
      await api.patch(`/api/testimonials/admin/${t.id}/published`, { isPublished: !t.isPublished })
      showSuccess(t.isPublished ? 'Hidden from the website' : 'Now visible on the website')
      await load()
    } catch (err) {
      showError(err.message)
    }
  }

  async function handleDelete(t) {
    if (!window.confirm(`Delete the testimonial from ${t.name}? This cannot be undone.`)) return
    try {
      await api.delete(`/api/testimonials/admin/${t.id}`)
      showSuccess('Testimonial deleted')
      await load()
    } catch (err) {
      showError(err.message)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Testimonials</h1>
            <p className="text-sm text-slate-500 mt-1">
              Only add feedback from real customers who agreed to be featured.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 transition-colors"
            >
              <Plus size={16} />
              Add Testimonial
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError} <button onClick={load} className="underline font-medium">Try again</button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-56 rounded-3xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            {items.length === 0 ? 'No testimonials yet. Click "Add Testimonial" to add the first real one.' : 'No testimonial matches your search.'}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease, delay: Math.min(i, 8) * 0.04 }}
                  className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col ${t.isPublished ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-80'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {t.photoUrl ? (
                      <img src={cdn(t.photoUrl, 120)} alt={t.name} className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-lg font-semibold">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!t.isPublished && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">Hidden</span>
                    )}
                  </div>

                  <div className="flex gap-3 items-center justify-between mb-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-slate-900 truncate">{t.name}</h2>
                      <p className="text-sm text-slate-500 truncate">{t.role}</p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(t.rating)].map((_, k) => (
                        <Star key={k} className="text-amber-400 fill-amber-400" size={16} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-slate-600 flex-1">{t.quote}</p>

                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <button onClick={() => openEdit(t)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => togglePublished(t)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
                      {t.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                      {t.isPublished ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handleDelete(t)} className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50" aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ duration: 0.25, ease }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Testimonial' : 'Add a Testimonial'}</h2>
                    <p className="text-sm text-slate-500">Feedback from a real customer.</p>
                  </div>
                  <button type="button" onClick={closeModal} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100" aria-label="Close modal">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700">
                      Name
                      <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} maxLength={100}
                        placeholder="Customer name"
                        className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      Role
                      <input type="text" value={form.role} onChange={(e) => handleChange('role', e.target.value)} maxLength={100}
                        placeholder="e.g. Student, University of Toronto"
                        className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700">
                      Rating
                      <select value={form.rating} onChange={(e) => handleChange('rating', e.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
                        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </label>
                    <div className="space-y-2 text-sm text-slate-700">
                      Photo (optional)
                      <div className="flex items-center gap-3">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-slate-100" />
                        )}
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange}
                          className="min-w-0 flex-1 text-sm text-slate-700 file:mr-3 file:rounded-full file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-teal-700" />
                      </div>
                    </div>
                  </div>

                  <label className="block space-y-2 text-sm text-slate-700">
                    Testimonial
                    <textarea value={form.quote} onChange={(e) => handleChange('quote', e.target.value)} rows="4" maxLength={800}
                      placeholder="Write the customer feedback"
                      className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={closeModal} className="rounded-3xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={saving} className="rounded-3xl bg-teal-600 px-5 py-3 text-white hover:bg-teal-700 disabled:opacity-60">
                      {saving ? 'Saving...' : editingId ? 'Save changes' : 'Save Testimonial'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default AdminTestimonials