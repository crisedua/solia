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
  agentName?: string | null;
}

interface Agent {
  id: string;
  name: string;
  createdAt: string;
  model: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New client form
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formBusiness, setFormBusiness] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [creating, setCreating] = useState(false);

  // Assign agent
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('');

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const adminKey = sessionStorage.getItem('adminKey');

  useEffect(() => {
    if (!adminKey) { navigate('/admin/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [clientsRes, agentsRes] = await Promise.all([
        fetch('/api/clients?action=list', { headers: { 'x-admin-key': adminKey! } }),
        fetch('/api/agents?action=list', { headers: { 'x-admin-key': adminKey! } }),
      ]);

      if (clientsRes.status === 401) {
        sessionStorage.removeItem('adminKey');
        navigate('/admin/login');
        return;
      }

      const clientsData = await clientsRes.json();
      setClients(Array.isArray(clientsData) ? clientsData : []);

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        setAgents(Array.isArray(agentsData) ? agentsData : []);
      }
    } catch (err) {
      setError(`Error cargando datos: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formName.trim() || !formBusiness.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/clients?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey! },
        body: JSON.stringify({ name: formName, business: formBusiness, email: formEmail, phone: formPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormName(''); setFormBusiness(''); setFormEmail(''); setFormPhone('');
        setShowForm(false); setError('');
        fetchAll();
      } else {
        setError(`Error: ${data.error || res.statusText}`);
      }
    } catch (err) {
      setError(`Error creando cliente: ${err}`);
    } finally {
      setCreating(false);
    }
  };

  const handleAssign = async (clientId: string) => {
    if (!selectedAgent) return;
    try {
      const res = await fetch('/api/agents?action=assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey! },
        body: JSON.stringify({ clientId, agentId: selectedAgent }),
      });
      if (res.ok) {
        setAssigningId(null);
        setSelectedAgent('');
        fetchAll();
      } else {
        const data = await res.json();
        setError(`Error asignando agente: ${data.error}${data.detail ? ' — ' + data.detail : ''}`);
      }
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };

  const copyLink = (clientId: string) => {
    const url = `${window.location.origin}/onboard/${clientId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-300">
      <header className="border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Icon icon="solar:voice-scan-linear" width="16" />
            </div>
            <span className="text-sm font-semibold text-white">Sol-IA</span>
            <span className="text-xs text-slate-500 ml-2">Admin</span>
          </div>
          <button onClick={() => { sessionStorage.removeItem('adminKey'); navigate('/admin/login'); }}
            className="text-xs text-slate-400 hover:text-white transition-colors">Salir</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Clientes</p>
            <p className="text-2xl font-semibold text-white mt-1">{clients.length}</p>
          </div>
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Conectados</p>
            <p className="text-2xl font-semibold text-emerald-400 mt-1">{clients.filter(c => c.calendarConnected).length}</p>
          </div>
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Pendientes</p>
            <p className="text-2xl font-semibold text-amber-400 mt-1">{clients.filter(c => !c.calendarConnected).length}</p>
          </div>
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Agentes VAPI</p>
            <p className="text-2xl font-semibold text-blue-400 mt-1">{agents.length}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-6 flex items-center justify-between">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300"><Icon icon="solar:close-circle-linear" width={16} /></button>
          </div>
        )}

        {/* VAPI Agents Section */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Icon icon="solar:microphone-3-linear" width={18} className="text-blue-400" />
            Agentes VAPI
          </h2>
          {agents.length === 0 ? (
            <div className="rounded-xl bg-[#0f172a] border border-white/10 p-6 text-center">
              <p className="text-sm text-slate-400">No hay agentes en tu cuenta VAPI.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {agents.map(agent => {
                const assignedTo = clients.find(c => c.agentId === agent.id);
                return (
                  <div key={agent.id} className="rounded-xl bg-[#0f172a] border border-white/10 p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">{agent.id.slice(0, 16)}...</p>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">{agent.model}</span>
                    </div>
                    {assignedTo ? (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <Icon icon="solar:link-round-bold" width={12} />
                        Asignado a: {assignedTo.name}
                      </div>
                    ) : (
                      <div className="mt-3 text-[11px] text-slate-500">Sin asignar</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clients Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Icon icon="solar:users-group-rounded-linear" width={18} className="text-slate-400" />
            Clientes
          </h2>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors">
            <Icon icon={showForm ? 'solar:close-circle-linear' : 'solar:add-circle-linear'} width={16} />
            {showForm ? 'Cancelar' : 'Nuevo Cliente'}
          </button>
        </div>

        {/* New Client Form */}
        {showForm && (
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre *</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="Dr. María García"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Negocio *</label>
                <input type="text" value={formBusiness} onChange={(e) => setFormBusiness(e.target.value)}
                  placeholder="Clínica Dental García"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Correo</label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="maria@clinica.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Teléfono</label>
                <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>
            <button onClick={handleCreate}
              disabled={!formName.trim() || !formBusiness.trim() || creating}
              className="px-6 py-2.5 rounded-lg bg-white text-[#0f172a] text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-40 flex items-center gap-2">
              {creating && <Icon icon="solar:refresh-linear" width={14} className="animate-spin" />}
              {creating ? 'Creando...' : 'Crear Cliente'}
            </button>
          </div>
        )}

        {/* Client List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Icon icon="solar:refresh-linear" width={24} className="text-slate-400 animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl bg-[#0f172a] border border-white/10 p-12 text-center">
            <Icon icon="solar:users-group-rounded-linear" width={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No hay clientes. Crea el primero arriba.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div key={client.id} className="rounded-xl bg-[#0f172a] border border-white/10 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white">{client.name}</p>
                      {client.calendarConnected ? (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <Icon icon="solar:check-circle-bold" width={10} /> Google conectado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Icon icon="solar:clock-circle-linear" width={10} /> Pendiente
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{client.business}</p>
                    {client.connectedEmail && (
                      <p className="text-xs text-slate-400 mt-1">
                        <Icon icon="logos:google-icon" width={10} className="inline mr-1" />{client.connectedEmail}
                      </p>
                    )}
                    {client.agentId ? (
                      <p className="text-xs text-blue-400 mt-1">
                        <Icon icon="solar:microphone-3-linear" width={11} className="inline mr-1" />
                        Agente: {client.agentName || client.agentId.slice(0, 16) + '...'}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-600 mt-1">Sin agente asignado</p>
                    )}
                    <p className="text-[10px] text-slate-600 mt-1">Creado {new Date(client.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {/* Copy onboarding link */}
                    <button onClick={() => copyLink(client.id)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors">
                      <Icon icon={copiedId === client.id ? 'solar:check-read-linear' : 'solar:copy-linear'} width={14} />
                      {copiedId === client.id ? '¡Copiado!' : 'Copiar enlace Google'}
                    </button>

                    {/* Assign agent */}
                    {assigningId === client.id ? (
                      <div className="flex items-center gap-2">
                        <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/50 max-w-[160px]">
                          <option value="">Seleccionar agente</option>
                          {agents.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                        <button onClick={() => handleAssign(client.id)} disabled={!selectedAgent}
                          className="text-xs px-2 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-40">
                          <Icon icon="solar:check-read-linear" width={14} />
                        </button>
                        <button onClick={() => { setAssigningId(null); setSelectedAgent(''); }}
                          className="text-xs px-2 py-1.5 rounded-lg text-slate-400 hover:text-white">
                          <Icon icon="solar:close-circle-linear" width={14} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setAssigningId(client.id)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <Icon icon="solar:microphone-3-linear" width={14} />
                        {client.agentId ? 'Reasignar agente' : 'Asignar agente'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
