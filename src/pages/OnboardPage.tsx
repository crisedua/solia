import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface ClientInfo {
  id: string;
  name: string;
  business: string;
  calendarConnected: boolean;
  connectedEmail: string | null;
}

type Step = 'loading' | 'not_found' | 'form' | 'connect_google' | 'done';

export default function OnboardPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [step, setStep] = useState<Step>('loading');
  const [client, setClient] = useState<ClientInfo | null>(null);

  // Form fields (only used if clientId === 'new')
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newClientId, setNewClientId] = useState('');

  useEffect(() => {
    if (!clientId) return;

    // "new" means self-registration
    if (clientId === 'new') {
      setStep('form');
      return;
    }

    // Existing client — check their status
    fetch(`/api/clients/${clientId}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setClient(data);
          setStep(data.calendarConnected ? 'done' : 'connect_google');
        } else {
          setStep('not_found');
        }
      })
      .catch(() => setStep('not_found'));
  }, [clientId]);

  const handleRegister = async () => {
    if (!name.trim() || !business.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/register-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, business, email, phone }),
      });
      const data = await res.json();
      if (data.client) {
        setClient(data.client);
        setNewClientId(data.client.id);
        setStep('connect_google');
        // Update URL without reload
        window.history.replaceState({}, '', `/onboard/${data.client.id}`);
      }
    } catch (err) {
      console.error('Registration failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConnect = () => {
    const id = newClientId || clientId;
    window.location.href = `/api/connect/${id}`;
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

          {/* LOADING */}
          {step === 'loading' && (
            <div className="p-12 flex flex-col items-center gap-3">
              <Icon icon="solar:refresh-linear" width={28} className="text-slate-400 animate-spin" />
            </div>
          )}

          {/* NOT FOUND */}
          {step === 'not_found' && (
            <div className="p-12 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <Icon icon="solar:danger-triangle-linear" className="text-red-400" width={28} />
              </div>
              <p className="text-base font-medium text-white">Invalid Link</p>
              <p className="text-sm text-slate-400">This link is not valid. Please contact us.</p>
            </div>
          )}

          {/* REGISTRATION FORM */}
          {step === 'form' && (
            <>
              <div className="p-6 border-b border-white/5">
                <h1 className="text-lg font-semibold text-white">Set Up Your AI Voice Agent</h1>
                <p className="text-sm text-slate-400 mt-1">Tell us about your business to get started.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name *</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. María García"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Business Name *</label>
                  <input
                    type="text" value={business} onChange={(e) => setBusiness(e.target.value)}
                    placeholder="Clínica Dental García"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="maria@clinicagarcia.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                  <input
                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <button
                  onClick={handleRegister}
                  disabled={!name.trim() || !business.trim() || submitting}
                  className="w-full py-3 rounded-xl bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {submitting ? (
                    <Icon icon="solar:refresh-linear" width={16} className="animate-spin" />
                  ) : (
                    <Icon icon="solar:arrow-right-linear" width={16} />
                  )}
                  {submitting ? 'Creating...' : 'Continue'}
                </button>
              </div>
            </>
          )}

          {/* CONNECT GOOGLE */}
          {step === 'connect_google' && (
            <>
              <div className="p-6 border-b border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{client?.business}</p>
                <h1 className="text-lg font-semibold text-white">Connect Your Google Account</h1>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-400 leading-relaxed">
                  To activate your AI voice agent, connect your Google account. This lets your agent:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 rounded-lg p-3">
                    <Icon icon="logos:google-calendar" width={20} />
                    <span>Check your availability & book appointments</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 rounded-lg p-3">
                    <Icon icon="logos:google-gmail" width={20} />
                    <span>Send confirmations & reminders</span>
                  </div>
                </div>
                <button
                  onClick={handleConnect}
                  className="w-full py-3.5 rounded-xl bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Icon icon="logos:google-icon" width={18} />
                  Connect with Google
                </button>
                <p className="text-[11px] text-slate-600 text-center">
                  We only request calendar and email access. Your data is encrypted and never shared.
                </p>
              </div>
            </>
          )}

          {/* DONE */}
          {step === 'done' && client && (
            <>
              <div className="p-6 border-b border-white/5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{client.business}</p>
                <h1 className="text-lg font-semibold text-white">{client.name}</h1>
              </div>
              <div className="p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:check-circle-bold" className="text-emerald-400" width={36} />
                </div>
                <p className="text-base font-medium text-white">Your Agent is Ready</p>
                <p className="text-sm text-slate-400">
                  Connected as <span className="text-emerald-400">{client.connectedEmail}</span>. 
                  Your AI voice agent can now manage your calendar and send emails.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
