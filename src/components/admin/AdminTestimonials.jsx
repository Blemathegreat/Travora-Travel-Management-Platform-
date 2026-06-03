import React, { useState } from 'react'
import { Search, Plus, Star, X } from 'lucide-react'
import { testimonials as initialTestimonials } from './AdminDashboardData'

const AdminTestimonials = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [testimonialList, setTestimonialList] = useState(initialTestimonials)
  const [form, setForm] = useState({
    name: '',
    role: '',
    rating: '5',
    quote: '',
    file: null,
  })

  const searchFilter = () =>
    testimonialList.filter((testimonial) =>
      testimonial.name.toLowerCase().includes(search.toLowerCase())
    )

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    handleChange('file', file)
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextId = testimonialList.length
      ? Math.max(...testimonialList.map((item) => item.id)) + 1
      : 1

    const newTestimonial = {
      id: nextId,
      name: form.name.trim() || 'Unnamed',
      role: form.role.trim() || 'Customer',
      quote: form.quote.trim() || 'No testimonial provided yet.',
      rating: Number(form.rating) || 5,
    }

    setTestimonialList((prev) => [newTestimonial, ...prev])
    setForm({ name: '', role: '', rating: '5', quote: '', file: null })
    closeModal()
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage testimonial cards and add new customer feedback.
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
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 transition-colors"
          >
            <Plus size={16} />
            Add Testimonial
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {searchFilter().map((testimonial) => {
          const ratingCount = testimonial.rating ? Math.min(Math.max(testimonial.rating, 1), 5) : 5
          return (
            <div
              key={testimonial.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4 mb-5">
                <div className="h-14 w-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-lg font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{testimonial.name}</h2>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-4">  
                    {[...Array(ratingCount)].map((_, index) => (
                      <Star key={index} className="text-amber-400" size={18} />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600">{testimonial.quote}</p>
            </div>
          )
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Add a Testimonial</h2>
                <p className="text-sm text-slate-500">Add new customer feedback to the testimonial dashboard.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Name
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Customer name"
                    className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Role
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="Customer role or profession"
                    className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Rating
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => handleChange('rating', e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-700">
                Testimonial
                <textarea
                  value={form.quote}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  rows="4"
                  placeholder="Write the customer feedback"
                  className="w-full rounded-3xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-3xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-3xl bg-teal-600 px-5 py-3 text-white hover:bg-teal-700"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTestimonials
