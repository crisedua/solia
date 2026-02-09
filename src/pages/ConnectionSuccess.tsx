import { Icon } from '@iconify/react';

export default function ConnectionSuccess() {
  return (
    <div className="min-h-screen bg-[#0b101b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <Icon icon="solar:check-circle-bold" className="text-emerald-400" width={36} />
        </div>
        <h1 className="text-xl font-semibold text-white">Calendar Connected</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Your Google Calendar has been successfully connected to VoiceFlow AI. You can close this window now.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg py-2 px-3">
          <Icon icon="solar:shield-check-linear" width={14} />
          Secured with end-to-end encryption
        </div>
      </div>
    </div>
  );
}
