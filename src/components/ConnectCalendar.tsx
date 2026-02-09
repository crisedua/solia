import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ShareLink {
  linkId: string;
  url: string;
  expiresAt: string;
  expiresInHours: number;
}

export default function ConnectCalendar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'self' | 'share'>('self');
  const [ownerConnected, setOwnerConnected] = useState(false);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetch('/api/auth/status')
        .then((r) => r.json())
        .then((d) => setOwnerConnected(d.connected))
        .catch(() => {});
    }
  }, [open]);

  const handleConnectSelf = () => {
    window.location.href = '/auth';
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/connections/generate', { method: 'POST' });
      const data = await res.json();
      setShareLink(data);
    } catch (err) {
      console.error('Failed to generate link', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shareLink?.url) {
      navigator.clipboard.writeText(shareLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Icon icon="logos:google-calendar" width={24} />
            </div>
            <span className="text-base font-semibold text-white">Connect Google Calendar</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <Icon icon="solar:close-circle-linear" width={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setTab('self')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'self' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Connect yourself
          </button>
          <button
            onClick={() => setTab('share')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === 'share' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Share link
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'self' ? (
            <div className="text-center space-y-5">
              {ownerConnected ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Icon icon="solar:check-circle-bold" className="text-emerald-400" width={28} />
                  </div>
                  <p className="text-sm text-slate-300">Your Google Calendar is connected.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-400">
                    Sign in with your Google account to connect your calendar directly.
                  </p>
                  <button
                    onClick={handleConnectSelf}
                    className="w-full py-3 rounded-xl bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="logos:google-icon" width={18} />
                    Sign in with Google
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-slate-400">
                Generate a link and send it to your client. They'll authorize their Google Calendar through it. Links expire in 72 hours.
              </p>

              {!shareLink ? (
                <button
                  onClick={handleGenerateLink}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Icon icon="solar:refresh-linear" width={18} className="animate-spin" />
                  ) : (
                    <Icon icon="solar:link-round-linear" width={18} />
                  )}
                  {loading ? 'Generating...' : 'Generate share link'}
                </button>
              ) : (
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Icon icon="solar:link-round-bold" width={16} />
                    <span className="text-sm font-semibold">72 hour share link generated</span>
                  </div>
                  <p className="text-xs text-slate-400">Send it to the client to complete the connection.</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#0b101b] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 truncate font-mono">
                      {shareLink.url}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 px-4 py-2 rounded-lg border border-white/10 text-xs font-medium text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
                    >
                      <Icon icon={copied ? 'solar:check-read-linear' : 'solar:copy-linear'} width={14} />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <button
                    onClick={() => { setShareLink(null); }}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Generate a new link
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
