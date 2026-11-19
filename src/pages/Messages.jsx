import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { api } from '../utils/apiClient';
import usePolling from '../hooks/usePolling';
import { showError } from '../utils/toastConfig';
import { mergeMessages, dayKey, dayLabel } from '../utils/chatHelpers';
import MessageBubble from '../components/chats/Messagebubble';
import ChatComposer from '../components/chats/ChatComposer';

const ease = [0.22, 1, 0.36, 1];
const POLL_MS = 5000;

// apiClient hands back the parsed JSON: { success, data: {...} }
const unwrap = (res) => res?.data ?? res;

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [sending, setSending] = useState(false);

  const scrollRef = useRef(null);
  const stickToBottom = useRef(true); // is the person reading the newest messages?
  const previousCount = useRef(0);

  /* ---------- 1. FIRST LOAD ---------- */
  const loadFirst = useCallback(async () => {
    try {
      const data = unwrap(await api.get('/api/inbox/messages'));
      setMessages(data.messages || []);
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  /* ---------- 2. POLLING: "anything after the last message I have?" ---------- */
  const lastId = messages.length ? messages[messages.length - 1].id : 0;

  usePolling(
    async () => {
      const url = lastId ? `/api/inbox/messages?after=${lastId}` : '/api/inbox/messages';
      const data = unwrap(await api.get(url));
      const fresh = data.messages || [];
      if (fresh.length) setMessages((prev) => mergeMessages(prev, fresh));
    },
    POLL_MS,
    !loading && !loadError
  );

  /* ---------- 3. BLUE TICKS: tell the server we have seen the admin's messages ---------- */
  useEffect(() => {
    const hasUnread = messages.some((m) => m.senderRole === 'admin' && !m.readAt);
    if (!hasUnread || document.visibilityState !== 'visible') return;

    api
      .patch('/api/inbox/read')
      .then(() => {
        window.dispatchEvent(new Event('inbox:read')); // tells the Navbar to clear its badge
        const now = new Date().toISOString();
        setMessages((prev) =>
          prev.map((m) => (m.senderRole === 'admin' && !m.readAt ? { ...m, readAt: now } : m))
        );
      })
      .catch(() => {}); // not important enough to bother the person
  }, [messages]);

  /* ---------- 4. AUTO-SCROLL ---------- */
  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    // "near the bottom" = within 80px of it
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: previousCount.current === 0 ? 'auto' : 'smooth', // jump on first load, glide after
      });
    }
    previousCount.current = messages.length;
  }, [messages.length]);

  /* ---------- 5. SENDING ---------- */
  // The composer gives us { text, file }. We return true when it worked so it can clear itself.
  async function handleSend({ text, file }) {
    setSending(true);
    try {
      let payload;
      if (file) {
        payload = new FormData(); // a file must travel as multipart form data, not JSON
        payload.append('file', file);
        if (text) payload.append('body', text);
      } else {
        payload = { body: text };
      }
      const data = unwrap(await api.post('/api/inbox/messages', payload));
      stickToBottom.current = true; // after sending, always show my own message
      setMessages((prev) => mergeMessages(prev, [data.message]));
      return true;
    } catch (err) {
      showError(err.message); // the text and file stay in the composer so nothing is lost
      return false;
    } finally {
      setSending(false);
    }
  }

  /* ---------- screen ---------- */
  return (
    <MotionConfig reducedMotion="user">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <h1 className="text-[#001F3F] text-3xl font-semibold">Messages</h1>
          <p className="text-gray-600 mt-1">Chat with the Travora team. Your conversation is saved here.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.1 }}
          className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
        >
          {/* header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-[#001F3F]">
            <div className="size-10 rounded-full bg-[#05FBE6] flex items-center justify-center">
              <MessageCircle size={20} className="text-[#001F3F]" />
            </div>
            <div>
              <p className="text-white font-semibold leading-tight">Travora Support</p>
              <p className="text-white/60 text-sm">We reply here</p>
            </div>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-[55vh] min-h-[320px] overflow-y-auto px-4 sm:px-5 py-4 bg-[#f7f9fc] space-y-2"
          >
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-10 w-2/3 bg-gray-200 rounded-2xl" />
                <div className="h-10 w-1/2 bg-gray-200 rounded-2xl ml-auto" />
                <div className="h-10 w-3/5 bg-gray-200 rounded-2xl" />
              </div>
            ) : loadError ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                <p className="text-red-600 text-sm">{loadError}</p>
                <button
                  onClick={() => { setLoading(true); loadFirst(); }}
                  className="px-5 py-2 rounded bg-[#103e72] text-white text-sm hover:bg-blue-900"
                >
                  Try again
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-2">
                <MessageCircle size={36} className="text-gray-300" />
                <p className="font-medium text-gray-700">No messages yet</p>
                <p className="text-sm">Write your first message below and our team will reply here.</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m, i) => {
                  const mine = m.senderRole === 'user';
                  const newDay = i === 0 || dayKey(messages[i - 1].createdAt) !== dayKey(m.createdAt);
                  return (
                    <React.Fragment key={m.id}>
                      {newDay && (
                        <div className="flex justify-center py-2">
                          <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
                            {dayLabel(m.createdAt)}
                          </span>
                        </div>
                      )}
                      <MessageBubble message={m} mine={mine} accent="blue" />
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* composer */}
          <ChatComposer onSend={handleSend} sending={sending} disabled={loading || !!loadError} accent="blue" />
        </motion.div>
      </div>
    </MotionConfig>
  );
}