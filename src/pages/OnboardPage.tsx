import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface ClientInfo {
  id: string;
  name: string;
  business: string;
  calendarConnected: boolean;
  gmailConnected: boolean;
  connectedEmail: string | null;
}

type Status = 'loading' | 'ready' | 'connected' | 'not_found';

export default function OnboardPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [client, setClient] = useState<ClientInfo | null>(null);

  useEffect(() => {
    if (!clientId) return;
    fetch(`/api/clients/${clientId}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setClient(data);
          setStatus(data.calendarConnected ? 'connected' : 'ready');
        } else {
          setStatus('not_found');
        }
      })
      .catch(() => setStatus('not_found'));
  }, [clientId]);

  const handleConnect = () => {
    window.location.href = `/api/connect/${clientId}`;
  };

  return (
    <div className="min-h-screen bg-[#0b101b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Icon icon="solar:voice-scan-linear" width="22" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Sol-IA</span>
        </div>

        <div className="rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden">
          {status === 'loading' && (
            <div className="p-12 flex flex-col items-center gap-3">
              <Icon icon="solar:refresh-linear" width={28} className="text-slate-400 animate-spin" />
              <p className="text-sm text-slate-400">Loading...</p>
            </div>
          )}

          {status === 'not_found' && (
            <div className="p-12 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <Icon icon="solar:danger-triangle-linear" className="text-red-400" width={28} />
              </div>
              <p className="text-base font-medium text-white">Invalid Link</p>
              <p className="text-sm text-slate-400">This onboarding link is not valid. Please contact your account manager.</p>
            </div>
          )}

          {status === 'ready' && client && (
            <>
              <div className="p-6 border-b border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Welcome</p>
                <h1 className="text-xl font-semibold text-white">{client.name}</h1>
                <p className="text-sm text-slate-400 mt-1">{client.business}</p>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-400 leading-relaxed">
                  To activate your AI voice agent, we need access to your Google Calendar and Gmail. 
                  This allows your agent to check availability, schedule appointments, and send confirmations on your behalf.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 rounded-lg p-3">
                    <Icon icon="logos:google-calendar" width={20} />
                    <span>Google Calendar — check & book appointments</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 rounded-lg p-3">
                    <Icon icon="logos:google-gmail" width={20} />
                    <span>Gmail — send confirmations & reminders</span>
                  </div>
                </div>

                <button
                  onClick={handleConnect}
                  className="w-full py-3.5 rounded-xl bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon icon="logos:google-icon" width={18} />
                  Connect with Google
                </button>

                <p className="text-[11px] text-slate-600 text-center leading-relaxed">
                  We only request calendar and email access. Your data is encrypted and never shared.
                </p>
              </div>
            </>
          )}

          {status === 'connected' && client && (
            <>
              <div className="p-6 border-b border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{client.business}</p>
                <h1 className="text-xl font-semibold text-white">{client.name}</h1>
              </div>
              <div className="p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:check-circle-bold" className="text-emerald-400" width={36} />
                </div>
                <p className="text-base font-medium text-white">Already Connected</p>
                <p className="text-sm text-slate-400">
                  Your Google account ({client.connectedEmail}) is linked. Your AI voice agent is ready.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
