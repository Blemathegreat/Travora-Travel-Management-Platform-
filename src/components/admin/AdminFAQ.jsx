import React, { useState } from 'react'
import { ChevronDown, Plus, X } from 'lucide-react'

const initialFaqs = [
  {
    id: 1,
    question: 'What types of clients does Viaggio Abroad work with?',
    answer:
      'Viaggio Abroad works with students, professionals, and families seeking visa, travel and relocation support. We tailor services based on each client’s needs.',
  },
  {
    id: 2,
    question: 'Do I need to be in Accra or Ghana to use your services?',
    answer:
      'No — most of our consultations, documentation and application support can be handled remotely. Some services may require in-person visits.',
  },
  {
    id: 3,
    question: 'What makes Viaggio Abroad different from others travel agencies ?',
    answer:
      'We combine personalized guidance with end-to-end support across visas, travel bookings, and post-arrival assistance to reduce friction for our clients.',
  },
  {
    id: 4,
    question: 'What should I expect after reaching out to Viaggio Abroad?',
    answer:
      'A short intake call, a needs assessment, and a clear next-steps plan including pricing and timelines.',
  },
  {
    id: 5,
    question: 'How do I get started with Viaggio Abroad?',
    answer:
      'Click the "Add FAQ" button or contact our support team. We will guide you through the onboarding and next steps.',
  },
]

const initialTags = [
  'Visa Consultation & Application Support',
  'Scholarship Assistance',
  'Flight Bookings & Airport Transfer',
  'Accommodation Services',
  'Immigration & Legal Document Support',
  'Tourism & Leisure Packages',
  'Student Mentorship & Support',
  'Conference & Delegation Travel Planning',
  'Visa Application Booking Services',
  'Legal Translation & Document Authentication',
]

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [openId, setOpenId] = useState(null)
  const [tags] = useState(initialTags)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form, setForm] = useState({ category: '', question: '', explanation: '' })

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id))

  function openModal() {
    setForm({ category: '', question: '', explanation: '' })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.question.trim() || !form.explanation.trim()) return
    const newFaq = {
      id: Date.now(),
      question: form.question.trim(),
      answer: form.explanation.trim(),
    }
    setFaqs((s) => [newFaq, ...s])
    closeModal()
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden relative">
        <div className="p-8 md:p-10 flex items-start gap-6">
          <div className="flex-1">
            <p className="text-teal-500 font-semibold">FAQ</p>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
              Unpacking Your General Questions
            </h1>

            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-lg bg-white shadow-sm"
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left px-4 py-4 flex items-center justify-between gap-4"
                  >
                    <span className="text-slate-800 font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`text-slate-400 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>

                  <div
                    className={`px-4 pb-4 text-sm text-slate-600 transition-all ${openId === faq.id ? 'block' : 'hidden'}`}
                  >
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-80 pl-6 border-l border-slate-100 hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-700">General</h3>
              <button onClick={openModal} className="inline-flex items-center gap-2 bg-teal-500 text-white text-sm px-3 py-2 rounded-lg shadow-sm hover:bg-teal-600">
                <Plus size={14} /> Add FAQ
              </button>
            </div>

            <div className="space-y-3">
              {tags.map((tag, i) => (
                <div key={i} className="inline-block">
                  <span className="text-xs inline-block px-3 py-1 border border-emerald-100 rounded-lg text-emerald-600 bg-emerald-50">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />

            <div className="relative bg-white rounded-xl shadow-2xl w-[560px] p-6 z-50">
              <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={closeModal}>
                <X />
              </button>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full h-10 border border-slate-200 rounded-md px-3 pr-10 text-sm bg-white"
                      >
                        <option value="">Select category</option>
                        {tags.map((t, i) => (
                          <option key={i} value={t}>{t}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600">Question <span className="text-red-500">*</span></label>
                    <input name="question" value={form.question} onChange={handleChange} className="mt-1 w-full h-10 border border-slate-200 rounded-md px-3 text-sm" required />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600">Explanation <span className="text-red-500">*</span></label>
                    <textarea name="explanation" value={form.explanation} onChange={handleChange} className="mt-1 w-full h-28 border border-slate-200 rounded-md px-3 py-2 text-sm resize-none" required />
                  </div>

                  <div>
                    <button type="submit" className="w-full h-10 bg-[#103e72] text-white rounded-md font-medium">Send</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
