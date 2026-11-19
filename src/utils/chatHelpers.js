// src/utils/chatHelpers.js
// Small helper functions shared by the chat screens (customer and admin).

// Add only the messages we don't already have (by id). If nothing is new we return the SAME
// array, so React doesn't re-render for nothing.
export function mergeMessages(prev, incoming) {
  const seen = new Set(prev.map((m) => m.id));
  const fresh = incoming.filter((m) => !seen.has(m.id));
  return fresh.length ? [...prev, ...fresh] : prev;
}

export const formatClock = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' });
};

// Used to detect "a new day started" between two messages
export const dayKey = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toDateString();
};

// "Today", "Yesterday" or a full date, for the separators inside a chat
export const dayLabel = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

// The small time shown in the chat LIST: clock today, "Yesterday", or a short date
export const formatListTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const label = dayLabel(iso);
  if (label === 'Today') return formatClock(iso);
  if (label === 'Yesterday') return label;
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
};

/* ---------------- files (attachments) ---------------- */

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB, same limit as the server

const OK_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];
const OK_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'docx'];

// Tells the file picker which files to show
export const FILE_ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf,.docx';

// Returns '' when the file is fine, or a message explaining the problem.
// (The server checks again by reading the file itself. This is only a quick, friendly check.)
export function validateFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const typeOk = OK_TYPES.includes(file.type) || (file.type === '' && OK_EXTENSIONS.includes(ext));
  if (!typeOk) return 'Please choose a JPG, PNG, WebP, PDF or Word (.docx) file.';
  if (file.size === 0) return 'That file is empty.';
  if (file.size > MAX_FILE_BYTES) return 'File is too large. Maximum size is 10MB.';
  return '';
}

// 2516582 -> "2.4 MB"
export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}