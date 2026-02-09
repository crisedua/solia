import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

type Status = 'loading' | 'valid' | 'expired' | 'used' | 'not_found';

export default function ConnectionPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    if (!linkId) return;
    fetch(`/api/connections/${linkId}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setExpiresAt(data.expiresAt);
          setStatus('valid');
        } else if (res.status === 410) {
          const data = await res.json();
          setStatus(data.error.includes('used') ? 'used' : 'expired');
        } else {
          setStatus('not_found');
        }
      })
      .catch(() => setStatus('not_found'));
  }, [linkId]);

  const handleConnect = () => {
    window.location.href = `/auth/connect/${linkId}`;
  };

  return (
    <div className="min-h-screen bg-[#0b101b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Icon icon="logos:google-calendar" width={24} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Connect Google Calendar</h1>
            <p className="text-xs text-slate-500">VoiceFlow AI</p>
          </div>
        </div>

        <div className="p-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Icon icon="solar:refresh-linear" width={24} className="text-slate-400 animate-spin" />
              <p className="text-sm text-slate-400">Verifying link...</p>
            </div>
          )}

          {status === 'valid' && (
            <div className="space-y-5">
              <p className="text-sm text-slate-400 leading-relaxed">
                You've been invited to connect your Google Calendar. This allows VoiceFlow AI to check your availability and schedule meetings on your behalf.
              </p>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Icon icon="solar:clock-circle-linear" width={14} />
                Expires {new Date(expiresAt).toLocaleDateString()}
              </div>
              <button
                onClick={handleConnect}
                className="w-full py-3 rounded-xl bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Icon icon="logos:google-icon" width={18} />
                Connect with Google
              </button>
              <p className="text-[10px] text-slate-600 text-center">
                Only calendar access is requested. We never read your emails.
              </p>
            </div>
          )}

          {status === 'expired' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <Icon icon="solar:clock-circle-linear" className="text-red-400" width={24} />
              </div>
              <p className="text-sm text-white font-medium">Link expired</p>
              <p className="text-xs text-slate-400">Ask the sender for a new connection link.</p>
            </div>
          )}

          {status === 'used' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Icon icon="solar:check-circle-bold" className="text-emerald-400" width={24} />
              </div>
              <p className="text-sm text-white font-medium">Already connected</p>
              <p className="text-xs text-slate-400">This link has already been used to connect a calendar.</p>
            </div>
          )}

          {status === 'not_found' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center">
                <Icon icon="solar:danger-triangle-linear" className="text-slate-400" width={24} />
              </div>
              <p className="text-sm text-white font-medium">Link not found</p>
              <p className="text-xs text-slate-400">This connection link doesn't exist or is invalid.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
