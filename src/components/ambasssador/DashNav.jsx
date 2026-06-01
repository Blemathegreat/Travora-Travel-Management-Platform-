import React from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { images } from '../../assets/Photo';

export default function DashNav({ onToggleSidebar }) {
  return (
    <motion.div
      className="w-full bg-[#012E41]"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between py-4 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={onToggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-lg border border-white/20 p-2 text-white hover:bg-white/10 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </motion.button>
          <img src={images.logo} alt="ambassador" className="w-10 h-10 rounded-full object-cover" />
        </div>

        <div className='flex items-center gap-3 md:gap-6'>
          <img src={images.notification} alt="notification" className="w-6 h-6" />
          <img src={images.ambassador} alt="dropdown" className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}
