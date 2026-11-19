import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, FileText, Loader2 } from 'lucide-react';
import { showWarning } from '../../utils/toastConfig';
import { formatFileSize, validateFile, FILE_ACCEPT } from '../../utils/chatHelpers';

const MAX_LENGTH = 2000;

const ACCENT = {
  blue: { button: 'bg-[#0b4da0] hover:bg-blue-900', field: 'focus:border-[#0b4da0] focus:ring-blue-100', clip: 'hover:text-[#0b4da0]' },
  teal: { button: 'bg-teal-600 hover:bg-teal-700', field: 'focus:border-teal-500 focus:ring-teal-100', clip: 'hover:text-teal-700' },
};

// The bottom bar of a chat: paperclip, text box, send button.
// The parent gives us `onSend({ text, file })`, which must resolve to true when the message was sent.
export default function ChatComposer({ onSend, sending, disabled, accent = 'blue', placeholder = 'Type your message...' }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const style = ACCENT[accent];

  // a small picture preview for images (a temporary local address; nothing is uploaded yet)
  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handlePick(e) {
    const picked = e.target.files?.[0];
    e.target.value = ''; // so choosing the same file twice still fires
    if (!picked) return;
    const problem = validateFile(picked);
    if (problem) return showWarning(problem);
    setFile(picked);
  }

  const canSend = (text.trim() || file) && !sending && !disabled;

  async function submit(e) {
    if (e) e.preventDefault();
    if (!canSend) return;
    const ok = await onSend({ text: text.trim(), file });
    if (ok) {
      setText('');
      setFile(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function handleChange(e) {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  }

  return (
    <form onSubmit={submit} className="border-t border-gray-100 bg-white px-4 sm:px-5 py-3">
      {/* the chosen file, waiting to be sent */}
      <AnimatePresence initial={false}>
        {file && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              {previewUrl ? (
                <img src={previewUrl} alt="" className="size-10 rounded-lg object-cover" />
              ) : (
                <div className="size-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <FileText size={20} className="text-slate-600" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                disabled={sending}
                aria-label="Remove the file"
                className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 sm:gap-3">
        <input ref={fileInputRef} type="file" accept={FILE_ACCEPT} onChange={handlePick} className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || sending}
          aria-label="Attach a file"
          className={`size-12 shrink-0 rounded-full flex items-center justify-center text-slate-500 transition-colors disabled:opacity-40 ${style.clip} hover:bg-slate-100`}
        >
          <Paperclip size={21} />
        </button>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={MAX_LENGTH}
            placeholder={file ? 'Add a message (optional)' : placeholder}
            disabled={disabled}
            className={`w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-[15px] outline-none focus:ring-2 disabled:bg-gray-50 ${style.field}`}
          />
          {text.length > MAX_LENGTH - 200 && <p className="text-xs text-gray-400 text-right mt-1">{text.length}/{MAX_LENGTH}</p>}
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.92 }}
          disabled={!canSend}
          aria-label="Send message"
          className={`size-12 shrink-0 rounded-full text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${style.button}`}
        >
          {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </motion.button>
      </div>
    </form>
  );
}