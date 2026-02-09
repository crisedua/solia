import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function OAuthSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b101b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <Icon icon="solar:check-circle-bold" className="text-emerald-400" width={36} />
        </div>
        <h1 className="text-xl font-semibold text-white">Connected Successfully</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Your Google Calendar is now linked to VoiceFlow AI.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
