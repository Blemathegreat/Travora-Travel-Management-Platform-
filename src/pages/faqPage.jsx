import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../utils/apiClient'

const ease = [0.22, 1, 0.36, 1]

export default function FAQPage() {
  const [categories, setCategories] = useState([])
  const [active, setActive] = useState('all')   // 'all' or a category id
  const [openId, setOpenId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .get('/api/faqs')
      .then((res) => !cancelled && setCategories((res?.data ?? res).categories || []))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  const shown = active === 'all' ? categories : categories.filter((c) => c.id === active)

  return (
    <MotionConfig reducedMotion="user">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[#05a99b] font-semibold">FAQ</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-[#001F3F]">Frequently Asked Questions</h1>
          <p className="mt-3 text-gray-600">Quick answers to the things people ask us most.</p>
        </motion.div>

        {error && (
          <div className="mt-8 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : categories.length === 0 && !error ? (
          <div className="mt-12 rounded-xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
            Our FAQs are coming soon. In the meantime, feel free to <Link to="/contact" className="text-[#0b4da0] underline">contact us</Link>.
          </div>
        ) : (
          <>
            {/* category tabs */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActive(c.id); setOpenId(null) }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    active === c.id ? 'bg-[#0b4da0] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {c.name}
                </motion.button>
              ))}
            </div>

            <div className="mt-8 space-y-10">
              {shown.map((cat) => (
                <section key={cat.id}>
                  {active === 'all' && categories.length > 1 && (
                    <h2 className="mb-3 text-lg font-semibold text-[#001F3F]">{cat.name}</h2>
                  )}
                  <div className="space-y-3">
                    {cat.faqs.map((faq, i) => {
                      const isOpen = openId === faq.id
                      return (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease, delay: Math.min(i, 8) * 0.05 }}
                          className={`rounded-xl border bg-white transition-shadow ${isOpen ? 'border-[#0b4da0]/40 shadow-md' : 'border-gray-200 shadow-sm'}`}
                        >
                          <button
                            onClick={() => setOpenId(isOpen ? null : faq.id)}
                            aria-expanded={isOpen}
                            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                          >
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            <ChevronDown size={20} className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#0b4da0]' : ''}`} />
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
                                <p className="px-5 pb-5 text-gray-600 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 rounded-2xl bg-[#001F3F] p-8 text-center text-white">
              <h3 className="text-xl font-semibold">Still have a question?</h3>
              <p className="mt-2 text-white/70">Send us a message and we will get back to you.</p>
              <Link to="/contact" className="mt-5 inline-block rounded-lg bg-[#05FBE6] px-6 py-3 font-medium text-[#001F3F] hover:brightness-95">Contact us</Link>
            </div>
          </>
        )}
      </div>
    </MotionConfig>
  )
}