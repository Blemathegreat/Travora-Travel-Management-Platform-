import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { Search, ArrowLeft, MessageSquare, Paperclip } from 'lucide-react';
import { api } from '../../utils/apiClient';
import usePolling from '../../hooks/usePolling';
import { mergeMessages, formatClock, dayKey, dayLabel, formatListTime } from '../../utils/chatHelpers';
import { showError } from '../../utils/toastConfig';
import MessageBubble from '../chats/Messagebubble';
import ChatComposer from '../chats/ChatComposer';

const ease = [0.22, 1, 0.36, 1];

const unwrap = (res) => res?.data ?? res;

const ROLE_LABEL = { customer: 'Customer', ambassador: 'Ambassador' };

const initialOf = (name = '') => (name.trim().charAt(0) || '?').toUpperCase();

export default function AdminInbox() {
  /* ----- the chat list (left side) ----- */
  const [conversations, setConversations] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(''); // the search text after the admin stops typing

  /* ----- the open chat (right side) ----- */
  const [selectedId, setSelectedId] = useState(null);
  const [thread, setThread] = useState(null); // header info: name, email, role
  const [messages, setMessages] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState('');
  const [sending, setSending] = useState(false);

  const selectedRef = useRef(null); // always holds the id of the chat that is open RIGHT NOW
  const scrollRef = useRef(null);
  const stickToBottom = useRef(true);
  const previousCount = useRef(0);

  /* ================= CHAT LIST ================= */

  // wait 400ms after the last keystroke before searching
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadList = useCallback(async () => {
    try {
      const url = `/api/inbox/admin/conversations${query ? `?search=${encodeURIComponent(query)}` : ''}`;
      const data = unwrap(await api.get(url));
      setConversations(data.conversations || []);
      setListError('');
    } catch (err) {
      setListError(err.message);
    } finally {
      setListLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // keep the list fresh: new customers and new unread numbers show up by themselves
  usePolling(loadList, 8000, true);

  /* ================= OPEN ONE CHAT ================= */

  async function openConversation(id) {
    selectedRef.current = id;
    setSelectedId(id);
    setThread(null);
    setMessages([]);
    setThreadError('');
    setThreadLoading(true);
    previousCount.current = 0;
    stickToBottom.current = true;

    try {
      const data = unwrap(await api.get(`/api/inbox/admin/conversations/${id}/messages`));
      if (selectedRef.current !== id) return; // the admin already clicked another chat, ignore this answer
      setThread(data.conversation);
      setMessages(data.messages || []);
    } catch (err) {
      if (selectedRef.current === id) setThreadError(err.message);
    } finally {
      if (selectedRef.current === id) setThreadLoading(false);
    }
  }

  function closeConversation() {
    selectedRef.current = null;
    setSelectedId(null);
    setThread(null);
    setMessages([]);
  }

  /* ================= POLLING THE OPEN CHAT ================= */

  const lastId = messages.length ? messages[messages.length - 1].id : 0;

  usePolling(
    async () => {
      const id = selectedRef.current;
      if (!id) return;
      const base = `/api/inbox/admin/conversations/${id}/messages`;
      const data = unwrap(await api.get(lastId ? `${base}?after=${lastId}` : base));
      if (selectedRef.current !== id) return; // stale answer, the admin moved on
      const fresh = data.messages || [];
      if (fresh.length) setMessages((prev) => mergeMessages(prev, fresh));
    },
    5000,
    !!selectedId && !threadLoading && !threadError
  );

  /* ================= BLUE TICKS ================= */

  useEffect(() => {
    if (!selectedId || threadLoading) return;
    const hasUnread = messages.some((m) => m.senderRole === 'user' && !m.readAt);
    if (!hasUnread || document.visibilityState !== 'visible') return;

    const id = selectedId;
    api
      .patch(`/api/inbox/admin/conversations/${id}/read`)
      .then(() => {
        if (selectedRef.current !== id) return;
        const now = new Date().toISOString();
        setMessages((prev) => prev.map((m) => (m.senderRole === 'user' && !m.readAt ? { ...m, readAt: now } : m)));
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
        window.dispatchEvent(new Event('admin-inbox:changed')); // tells the sidebar badge to refresh
      })
      .catch(() => {});
  }, [messages, selectedId, threadLoading]);

  /* ================= AUTO-SCROLL ================= */

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: previousCount.current === 0 ? 'auto' : 'smooth' });
    }
    previousCount.current = messages.length;
  }, [messages.length]);

  /* ================= SENDING A REPLY ================= */

  async function handleSend({ text, file }) {
    const id = selectedId;
    if (!id) return false;

    setSending(true);
    try {
      let payload;
      if (file) {
        payload = new FormData();
        payload.append('file', file);
        if (text) payload.append('body', text);
      } else {
        payload = { body: text };
      }
      const data = unwrap(await api.post(`/api/inbox/admin/conversations/${id}/messages`, payload));
      stickToBottom.current = true;
      setMessages((prev) => mergeMessages(prev, [data.message]));

      // move this chat to the top of the list with the new preview
      setConversations((prev) => {
        const target = prev.find((c) => c.id === id);
        if (!target) return prev;
        return [
          { ...target, lastMessage: text, lastAttachmentName: data.message.attachment?.name || null, lastMessageAt: data.message.createdAt },
          ...prev.filter((c) => c.id !== id),
        ];
      });
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    } finally {
      setSending(false);
    }
  }

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  /* ================= SCREEN ================= */
  return (
    <MotionConfig reducedMotion="user">
      <div className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            Messages from customers and ambassadors{totalUnread > 0 ? ` · ${totalUnread} unread` : ''}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.08 }}
          className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex h-[calc(100vh-200px)] min-h-[520px]"
        >
          {/* ---------- LEFT: chat list ---------- */}
          <aside className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 shrink-0 flex-col border-r border-slate-200`}>
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email"
                  maxLength={100}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {listLoading ? (
                <div className="p-3 space-y-3 animate-pulse">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="size-11 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-1/2 bg-slate-200 rounded" />
                        <div className="h-3 w-3/4 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : listError ? (
                <div className="p-6 text-center text-sm text-red-600">
                  {listError}{' '}
                  <button onClick={() => { setListLoading(true); loadList(); }} className="underline font-medium">Try again</button>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  {query ? 'No conversation matches your search.' : 'No conversations yet. When a customer sends a message, it will appear here.'}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {conversations.map((c) => {
                    const active = c.id === selectedId;
                    return (
                      <motion.button
                        key={c.id}
                        layout="position"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease }}
                        onClick={() => openConversation(c.id)}
                        className={`w-full text-left flex gap-3 px-4 py-3 border-l-4 transition-colors ${
                          active ? 'bg-teal-50 border-teal-600' : 'border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <div className="size-11 shrink-0 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">
                          {initialOf(c.userName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`truncate text-sm ${c.unreadCount > 0 ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'}`}>
                              {c.userName}
                            </p>
                            <span className="shrink-0 text-xs text-slate-400">{formatListTime(c.lastMessageAt)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className={`truncate text-sm flex items-center gap-1 ${c.unreadCount > 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                              {!c.lastMessage && c.lastAttachmentName && <Paperclip size={13} className="shrink-0" />}
                              <span className="truncate">{c.lastMessage || c.lastAttachmentName}</span>
                            </p>
                            {c.unreadCount > 0 && (
                              <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-teal-600 text-white text-xs font-semibold flex items-center justify-center">
                                {c.unreadCount > 99 ? '99+' : c.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </aside>

          {/* ---------- RIGHT: the open chat ---------- */}
          <section className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 flex-col`}>
            {!selectedId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 gap-2 p-6">
                <MessageSquare size={40} className="text-slate-300" />
                <p className="font-medium text-slate-700">Select a conversation</p>
                <p className="text-sm">Choose a chat on the left to read and reply.</p>
              </div>
            ) : (
              <>
                {/* header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
                  <button onClick={closeConversation} className="md:hidden p-1 text-slate-500 hover:text-slate-900" aria-label="Back to the list">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="size-10 shrink-0 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">
                    {initialOf(thread?.userName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{thread?.userName || '...'}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {thread ? `${thread.userEmail} · ${ROLE_LABEL[thread.userRole] || thread.userRole}` : ''}
                    </p>
                  </div>
                </div>

                {/* messages */}
                <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-4 bg-[#f7f9fc] space-y-2">
                  {threadLoading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-10 w-2/3 bg-slate-200 rounded-2xl" />
                      <div className="h-10 w-1/2 bg-slate-200 rounded-2xl ml-auto" />
                      <div className="h-10 w-3/5 bg-slate-200 rounded-2xl" />
                    </div>
                  ) : threadError ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                      <p className="text-sm text-red-600">{threadError}</p>
                      <button onClick={() => openConversation(selectedId)} className="px-5 py-2 rounded bg-teal-600 text-white text-sm hover:bg-teal-700">
                        Try again
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages.map((m, i) => {
                        const mine = m.senderRole === 'admin'; // the admin's own messages go on the right
                        const newDay = i === 0 || dayKey(messages[i - 1].createdAt) !== dayKey(m.createdAt);
                        return (
                          <React.Fragment key={m.id}>
                            {newDay && (
                              <div className="flex justify-center py-2">
                                <span className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
                                  {dayLabel(m.createdAt)}
                                </span>
                              </div>
                            )}
                            <MessageBubble message={m} mine={mine} accent="teal" />
                          </React.Fragment>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>

                {/* composer */}
                <ChatComposer
                  onSend={handleSend}
                  sending={sending}
                  disabled={threadLoading || !!threadError}
                  accent="teal"
                  placeholder="Type your reply..."
                />
              </>
            )}
          </section>
        </motion.div>
      </div>
    </MotionConfig>
  );
}