import React, { useState, useEffect, useCallback } from 'react'
import { ChevronDown, Plus, X, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { api } from '../../utils/apiClient'
import { showError, showSuccess, showWarning } from '../../utils/toastConfig'

const ease = [0.22, 1, 0.36, 1]
const EMPTY_FORM = { categoryId: '', question: '', answer: '' }

// the API wraps results as { data: { key: [...] } }, this pulls the list out safely
const unwrap = (res, key) => (res?.data ?? res)?.[key] ?? []

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [openId, setOpenId] = useState(null)        // which question is expanded
  const [filter, setFilter] = useState('all')       // 'all' or a category id

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)  // null = adding a new FAQ
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [newCategory, setNewCategory] = useState('')

  const load = useCallback(async () => {
    try {
      const [f, c] = await Promise.all([api.get('/api/faqs/admin/list'), api.get('/api/faqs/admin/categories')])
      setFaqs(unwrap(f, 'faqs'))
      setCategories(unwrap(c, 'categories'))
      setLoadError('')
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visible = filter === 'all' ? faqs : faqs.filter((f) => f.categoryId === filter)

  /* ---------------- modal ---------------- */
  function openAdd() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, categoryId: filter !== 'all' ? filter : categories[0]?.id ?? '' })
    setIsModalOpen(true)
  }

  function openEdit(faq) {
    setEditingId(faq.id)
    setForm({ categoryId: faq.categoryId, question: faq.question, answer: faq.answer })
    setIsModalOpen(true)
  }

  function closeModal() {
    if (!saving) setIsModalOpen(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.categoryId || !form.question.trim() || !form.answer.trim()) {
      return showWarning('Please choose a category and fill in the question and the answer')
    }
    const payload = {
      categoryId: Number(form.categoryId),
      question: form.question.trim(),
      answer: form.answer.trim(),
    }
    setSaving(true)
    try {
      if (editingId) {
        await api.patch(`/api/faqs/admin/${editingId}`, payload)
        showSuccess('FAQ updated')
      } else {
        await api.post('/api/faqs/admin', payload)
        showSuccess('FAQ added')
      }
      setIsModalOpen(false)
      await load()
    } catch (err) {
      showError(err.message)
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- row actions ---------------- */
  async function togglePublished(faq) {
    try {
      await api.patch(`/api/faqs/admin/${faq.id}/published`, { isPublished: !faq.isPublished })
      showSuccess(faq.isPublished ? 'FAQ hidden from the website' : 'FAQ is now visible')
      await load()
    } catch (err) {
      showError(err.message)
    }
  }

  async function move(faq, direction) {
    try {
      await api.patch(`/api/faqs/admin/${faq.id}/move`, { direction })
      await load()
    } catch (err) {
      showError(err.message)
    }
  }

  async function handleDelete(faq) {
    if (!window.confirm('Delete this FAQ? This cannot be undone.')) return
    try {
      await api.delete(`/api/faqs/admin/${faq.id}`)
      showSuccess('FAQ deleted')
      await load()
    } catch (err) {
      showError(err.message)
    }
  }

  /* ---------------- categories ---------------- */
  async function addCategory(e) {
    e.preventDefault()
    if (newCategory.trim().length < 2) return showWarning('Type a category name first')
    try {
      await api.post('/api/faqs/admin/categories', { name: newCategory.trim() })
      setNewCategory('')
      showSuccess('Category added')
      await load()
    } catch (err) {
      showError(err.message)
    }
  }

  async function removeCategory(cat) {
    if (!window.confirm(`Delete the category "${cat.name}"?`)) return
    try {
      await api.delete(`/api/faqs/admin/categories/${cat.id}`)
      if (filter === cat.id) setFilter('all')
      showSuccess('Category deleted')
      await load()
    } catch (err) {
      showError(err.message) // e.g. "This category still has FAQs..."
    }
  }

  /* ---------------- screen ---------------- */
  return (
    <MotionConfig reducedMotion="user">
      <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden relative">
          <div className="p-6 md:p-10 flex flex-col lg:flex-row items-start gap-6">
            {/* LEFT: the questions */}
            <div className="flex-1 w-full min-w-0">
              <p className="text-teal-500 font-semibold">FAQ</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
                Unpacking Your General Questions
              </h1>

              {loadError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {loadError}{' '}
                  <button onClick={load} className="underline font-medium">Try again</button>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {loading ? (
                  [0, 1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-slate-100 animate-pulse" />)
                ) : visible.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500">
                    {faqs.length === 0 ? 'No FAQs yet. Click "Add FAQ" to write the first one.' : 'No FAQs in this category yet.'}
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {visible.map((faq) => {
                      const sameCategory = faqs.filter((f) => f.categoryId === faq.categoryId)
                      const position = sameCategory.findIndex((f) => f.id === faq.id)
                      const isOpen = openId === faq.id
                      return (
                        <motion.div
                          key={faq.id}
                          layout="position"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.3, ease }}
                          className={`border rounded-lg bg-white shadow-sm ${faq.isPublished ? 'border-slate-200' : 'border-dashed border-slate-300 bg-slate-50'}`}
                        >
                          <button
                            onClick={() => setOpenId(isOpen ? null : faq.id)}
                            className="w-full text-left px-4 py-4 flex items-center justify-between gap-4"
                          >
                            <span className="min-w-0">
                              <span className={`block font-medium ${faq.isPublished ? 'text-slate-800' : 'text-slate-500'}`}>
                                {faq.question}
                              </span>
                              <span className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  {faq.categoryName}
                                </span>
                                {!faq.isPublished && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">Hidden</span>
                                )}
                              </span>
                            </span>
                            <ChevronDown
                              className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                              size={20}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4">
                                  <p className="text-sm text-slate-600 whitespace-pre-line">{faq.answer}</p>

                                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                                    <IconBtn label="Edit" onClick={() => openEdit(faq)}><Pencil size={15} /> Edit</IconBtn>
                                    <IconBtn label={faq.isPublished ? 'Hide' : 'Show'} onClick={() => togglePublished(faq)}>
                                      {faq.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                                      {faq.isPublished ? 'Hide' : 'Show'}
                                    </IconBtn>
                                    <IconBtn label="Move up" disabled={position === 0} onClick={() => move(faq, 'up')}><ArrowUp size={15} /></IconBtn>
                                    <IconBtn label="Move down" disabled={position === sameCategory.length - 1} onClick={() => move(faq, 'down')}><ArrowDown size={15} /></IconBtn>
                                    <IconBtn label="Delete" danger onClick={() => handleDelete(faq)}><Trash2 size={15} /> Delete</IconBtn>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* RIGHT: categories */}
            <div className="w-full lg:w-80 lg:pl-6 lg:border-l border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">Categories</h3>
                <button
                  onClick={openAdd}
                  disabled={categories.length === 0}
                  className="inline-flex items-center gap-2 bg-teal-500 text-white text-sm px-3 py-2 rounded-lg shadow-sm hover:bg-teal-600 disabled:opacity-50"
                >
                  <Plus size={14} /> Add FAQ
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`text-xs px-3 py-1 rounded-lg border transition-colors ${filter === 'all' ? 'bg-teal-500 text-white border-teal-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  All ({faqs.length})
                </button>
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className={`inline-flex items-center gap-1 text-xs pl-3 pr-1 py-1 rounded-lg border transition-colors ${filter === cat.id ? 'bg-emerald-500 text-white border-emerald-500' : 'border-emerald-100 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                  >
                    <button onClick={() => setFilter(cat.id)}>{cat.name} ({cat.faqCount})</button>
                    <button
                      onClick={() => removeCategory(cat)}
                      aria-label={`Delete ${cat.name}`}
                      className="rounded p-0.5 opacity-60 hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={addCategory} className="mt-5 flex gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  maxLength={100}
                  className="flex-1 min-w-0 h-9 border border-slate-200 rounded-md px-3 text-sm focus:outline-none focus:border-teal-500"
                />
                <button type="submit" className="h-9 px-3 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50">Add</button>
              </form>
            </div>
          </div>

          {/* MODAL */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={closeModal}
                />
                <motion.div
                  className="relative bg-white rounded-xl shadow-2xl w-full max-w-[560px] p-6 z-50"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.97 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={closeModal} aria-label="Close">
                    <X />
                  </button>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Edit FAQ' : 'Add a FAQ'}</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Category</label>
                      <div className="relative">
                        <select
                          name="categoryId"
                          value={form.categoryId}
                          onChange={handleChange}
                          className="w-full h-10 border border-slate-200 rounded-md px-3 pr-10 text-sm bg-white appearance-none"
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600">Question <span className="text-red-500">*</span></label>
                      <input name="question" value={form.question} onChange={handleChange} maxLength={300}
                        className="mt-1 w-full h-10 border border-slate-200 rounded-md px-3 text-sm focus:outline-none focus:border-teal-500" />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-600">Answer <span className="text-red-500">*</span></label>
                      <textarea name="answer" value={form.answer} onChange={handleChange} maxLength={5000}
                        className="mt-1 w-full h-32 border border-slate-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-teal-500" />
                    </div>

                    <button type="submit" disabled={saving}
                      className="w-full h-10 bg-[#103e72] text-white rounded-md font-medium disabled:opacity-60">
                      {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add FAQ'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}

// a small reusable button for the row actions
function IconBtn({ children, onClick, disabled, danger, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}