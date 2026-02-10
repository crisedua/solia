import { useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function OnboardSuccess() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

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

        <div className="rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
            <Icon icon="solar:check-circle-bold" className="text-emerald-400" width={36} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-white">You're All Set!</h1>
            {email && (
              <p className="text-sm text-slate-400 mt-2">
                Connected as <span className="text-emerald-400">{decodeURIComponent(email)}</span>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              <Icon icon="solar:check-circle-linear" width={18} />
              <span>Google Calendar connected</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              <Icon icon="solar:check-circle-linear" width={18} />
              <span>Gmail connected</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Your AI voice agent is now connected to your Google account. It can check your availability, 
            schedule appointments, and send email confirmations automatically.
          </p>

          <p className="text-xs text-slate-600">You can safely close this page.</p>
        </div>
      </div>
    </div>
  );
}
