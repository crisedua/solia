import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface Client {
  id: string;
  name: string;
  business: string;
  email: string;
  calendarConnected: boolean;
  connectedEmail: string | null;
  connectedAt: number | null;
  createdAt: number;
  agentId: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New client form
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formBusiness, setFormBusiness] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [creating, setCreating] = useState(false);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const adminKey = sessionStorage.getItem('adminKey');

  useEffect(() => {
    if (!adminKey) {
      navigate('/admin/login');
      return;
    }
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/list-clients', {
        headers: { 'x-admin-key': adminKey! },
      });
      if (res.status === 401) {
        sessionStorage.removeItem('adminKey');
        navigate('/admin/login');
        return;
      }
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formName.trim() || !formBusiness.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/create-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey!,
        },
        body: JSON.stringify({
          name: formName,
          business: formBusiness,
          email: formEmail,
          phone: formPhone,
        }),
      });
      if (res.ok) {
        setFormName('');
        setFormBusiness('');
        setFormEmail('');
        setFormPhone('');
        setShowForm(false);
        fetchClients();
      }
    } catch {
      setError('Failed to create client');
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (clientId: string) => {
    const url = `${window.location.origin}/onboard/${clientId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-300">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Icon icon="solar:voice-scan-linear" width="16" />
            </div>
            <span className="text-sm font-semibold text-white">Sol-IA</span>
            <span className="text-xs text-slate-500 ml-2">Admin</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Clients</p>
            <p className="text-2xl font-semibold text-white mt-1">{clients.length}</p>
          </div>
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Connected</p>
            <p className="text-2xl font-semibold text-emerald-400 mt-1">
              {clients.filter((c) => c.calendarConnected).length}
            </p>
          </div>
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-semibold text-amber-400 mt-1">
              {clients.filter((c) => !c.calendarConnected).length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Clients</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Icon icon={showForm ? 'solar:close-circle-linear' : 'solar:add-circle-linear'} width={16} />
            {showForm ? 'Cancel' : 'New Client'}
          </button>
        </div>

        {/* New Client Form */}
        {showForm && (
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
                <input
                  type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="Dr. María García"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Business *</label>
                <input
                  type="text" value={formBusiness} onChange={(e) => setFormBusiness(e.target.value)}
                  placeholder="Clínica Dental García"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <input
                  type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="maria@clinica.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                <input
                  type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={!formName.trim() || !formBusiness.trim() || creating}
              className="px-6 py-2.5 rounded-lg bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {creating && <Icon icon="solar:refresh-linear" width={14} className="animate-spin" />}
              {creating ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {/* Client List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Icon icon="solar:refresh-linear" width={24} className="text-slate-400 animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-12 text-center">
            <Icon icon="solar:users-group-rounded-linear" width={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No clients yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl bg-[#0f172a] border border-white/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{client.name}</p>
                    {client.calendarConnected ? (
                      <span className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Icon icon="solar:check-circle-bold" width={10} />
                        Connected
                      </span>
                    ) : (
                      <span className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Icon icon="solar:clock-circle-linear" width={10} />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{client.business}</p>
                  {client.connectedEmail && (
                    <p className="text-xs text-slate-400 mt-1">
                      <Icon icon="logos:google-icon" width={10} className="inline mr-1" />
                      {client.connectedEmail}
                    </p>
                  )}
                  {client.agentId && (
                    <p className="text-xs text-blue-400 mt-1">
                      <Icon icon="solar:microphone-linear" width={10} className="inline mr-1" />
                      Agent: {client.agentId}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-600 mt-1">
                    Created {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyLink(client.id)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                  >
                    <Icon icon={copiedId === client.id ? 'solar:check-read-linear' : 'solar:copy-linear'} width={14} />
                    {copiedId === client.id ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={`/onboard/${client.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Icon icon="solar:link-round-linear" width={14} />
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
