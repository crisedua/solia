import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function AdminLogin() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!secret.trim()) return;
    // Store admin key in sessionStorage (cleared when browser closes)
    sessionStorage.setItem('adminKey', secret);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#0b101b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Icon icon="solar:voice-scan-linear" width="22" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Sol-IA</span>
        </div>

        <div className="rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl p-6 space-y-5">
          <div>
            <h1 className="text-lg font-semibold text-white">Admin Access</h1>
            <p className="text-sm text-slate-400 mt-1">Enter your admin secret to continue.</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <input
            type="password"
            value={secret}
            onChange={(e) => { setSecret(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Admin secret"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
          />

          <button
            onClick={handleLogin}
            disabled={!secret.trim()}
            className="w-full py-3 rounded-xl bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-40"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
