import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Download, Loader2 } from 'lucide-react';
import { downloadFile } from '../../utils/downloadFile';
import { formatFileSize } from '../../utils/chatHelpers';
import { showError } from '../../utils/toastConfig';

// The little "file card" shown inside a chat message
export default function AttachmentCard({ attachment, onColoredBubble }) {
  const [busy, setBusy] = useState(false);
  const isImage = attachment.mime?.startsWith('image/');
  const Icon = isImage ? ImageIcon : FileText;

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      await downloadFile(`/api/inbox/attachments/${attachment.id}`, attachment.name);
    } catch (err) {
      showError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
        onColoredBubble ? 'bg-white/15' : 'bg-slate-50 border border-slate-200'
      }`}
    >
      <div className={`size-10 shrink-0 rounded-lg flex items-center justify-center ${onColoredBubble ? 'bg-white/20' : 'bg-white border border-slate-200'}`}>
        <Icon size={20} className={onColoredBubble ? 'text-white' : 'text-slate-600'} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${onColoredBubble ? 'text-white' : 'text-slate-800'}`} title={attachment.name}>
          {attachment.name}
        </p>
        <p className={`text-xs ${onColoredBubble ? 'text-white/70' : 'text-slate-500'}`}>{formatFileSize(attachment.size)}</p>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        aria-label={`Download ${attachment.name}`}
        className={`size-9 shrink-0 rounded-full flex items-center justify-center transition-colors disabled:opacity-60 ${
          onColoredBubble ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
        }`}
      >
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
      </button>
    </div>
  );
}