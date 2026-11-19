import React from 'react';
import { motion } from 'framer-motion';
import AttachmentCard from './attachmentCard.jsx';
import { formatClock } from '../../utils/chatHelpers';

const ease = [0.22, 1, 0.36, 1];

// "mine" = the bubble on the right, in the accent colour. Otherwise white, on the left.
const ACCENT = {
  blue: { mine: 'bg-[#0b4da0] text-white rounded-br-md', theirs: 'bg-white text-gray-800 border border-gray-100 rounded-bl-md', time: 'text-gray-400' },
  teal: { mine: 'bg-teal-600 text-white rounded-br-md', theirs: 'bg-white text-slate-800 border border-slate-100 rounded-bl-md', time: 'text-slate-400' },
};

export default function MessageBubble({ message, mine, accent = 'blue' }) {
  const style = ACCENT[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease }}
      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 shadow-sm ${mine ? style.mine : style.theirs}`}>
        {message.attachment && <AttachmentCard attachment={message.attachment} onColoredBubble={mine} />}

        {/* a file-only message has an empty body, so we draw no text line */}
        {message.body && (
          <p className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed px-1 ${message.attachment ? 'mt-2' : ''}`}>
            {message.body}
          </p>
        )}

        <p className={`text-[11px] mt-1 px-1 text-right ${mine ? 'text-white/70' : style.time}`}>{formatClock(message.createdAt)}</p>
      </div>
    </motion.div>
  );
}