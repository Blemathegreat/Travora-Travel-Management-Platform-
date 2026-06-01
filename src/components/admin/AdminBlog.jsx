import React, { useState } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import { useBlogContext } from '../../context/BlogContext'
import { Link } from 'react-router-dom'

export default function AdminBlog() {
  const { blogs, addBlog, removeBlog } = useBlogContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ image: null, imagePreview: '', date: '', title: '', excerpt: '', content: '', readTime: '' })

  function openModal() {
    setForm({ image: null, imagePreview: '', date: '', title: '', excerpt: '', readTime: '' })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm((s) => ({ ...s, image: reader.result, imagePreview: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.image) return
    const newPost = {
      image: form.image,
      date: form.date ? new Date(form.date) : new Date(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      blogDetails: form.content.trim() || form.excerpt.trim(),
      readTime: form.readTime || '5 min read',
    }
    addBlog(newPost)
    closeModal()
  }

  function handleDelete(id) {
    removeBlog(id)
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-end mb-6">
          <button onClick={openModal} className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-teal-600">
            <Plus size={16} /> Add Blog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((p) => (
            <div key={p.id} className="relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                aria-label="Delete blog post"
              >
                <Trash2 size={18} />
              </button>
              <Link to={`/blog/${p.id}`} className="block">
                <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="text-xs text-slate-400 mb-2">{p.date instanceof Date ? p.date.toLocaleDateString() : p.date}</div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">{p.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{p.excerpt}</p>
                  <div className="text-xs text-teal-600 font-medium">{p.readTime}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
            <div className="relative bg-white rounded-xl shadow-2xl w-[640px] max-h-[90vh] overflow-y-auto p-6 z-50">
              <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={closeModal}>
                <X size={24} />
              </button>

              <h2 className="text-lg font-semibold text-slate-900 mb-6">Add New Blog Post</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Blog Image <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                    {form.imagePreview ? (
                      <div className="relative">
                        <img src={form.imagePreview} alt="preview" className="w-full h-40 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setForm((s) => ({ ...s, image: null, imagePreview: '' }))}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block text-center py-8">
                        <p className="text-sm text-slate-600">Click to upload or drag & drop</p>
                        <p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blog Title <span className="text-red-500">*</span></label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    className="w-full h-20 border border-slate-200 rounded-md px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Brief summary of the blog post"
                  />
                </div>

                {/* Full Blog Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Blog Content</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full h-28 border border-slate-200 rounded-md px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter the full blog details your readers will see on the blog detail page"
                  />
                </div>

                {/* Date & Read Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Publication Date</label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Read Time</label>
                    <input
                      name="readTime"
                      value={form.readTime}
                      onChange={handleChange}
                      className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., 5 min read"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#103e72] text-white rounded-md font-medium hover:bg-blue-900 transition-colors"
                  >
                    Publish Blog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

